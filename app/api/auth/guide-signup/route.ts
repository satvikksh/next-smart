import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';

/**
 * POST /api/auth/signup
 *
 * Body expected:
 * {
 *   name, email, phone, password,
 *   aadhaar?, pan?, city?, state?, country?, languages?, specialty?, pricePerDay?, experienceYears?, bio?
 * }
 *
 * Behavior:
 * - Validates required fields
 * - Rejects if email or phone already exists
 * - Hashes password (bcryptjs) and stores `passwordHash` on the guide record
 * - Persists to MongoDB if MONGODB_URI provided; otherwise falls back to /tmp/guides.json
 * - Returns sanitized user (masked Aadhaar/PAN) and a simple dev token
 *
 * Security: This is meant as a developer-friendly starter. In production you must secure storage,
 * use HTTPS, send email verification, and never expose sensitive fields.
 */

const FILE_STORE_PATH = '/tmp/guides.json';

async function readFileStore(): Promise<any[]> {
  try {
    if (!fs.existsSync(FILE_STORE_PATH)) {
      await fs.promises.writeFile(FILE_STORE_PATH, JSON.stringify([]), 'utf8');
    }
    const raw = await fs.promises.readFile(FILE_STORE_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('readFileStore error', err);
    return [];
  }
}

async function writeFileStore(items: any[]) {
  try {
    await fs.promises.writeFile(FILE_STORE_PATH, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('writeFileStore error', err);
  }
}

async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  const globalWithMongo = globalThis as any;
  if (!globalWithMongo._mongoClientPromise) {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  return globalWithMongo._mongoClientPromise as Promise<any>;
}

function maskAadhaar(a?: string) {
  if (!a) return undefined;
  return '********' + String(a).slice(-4);
}
function maskPan(p?: string) {
  if (!p) return undefined;
  const s = String(p);
  if (s.length <= 4) return '****';
  return s.slice(0, 2) + '***' + s.slice(-1);
}

function sanitizeForClient(g: any) {
  const copy = { ...g };
  if (copy.aadhaar) copy.aadhaarMasked = maskAadhaar(copy.aadhaar);
  if (copy.pan) copy.panMasked = maskPan(copy.pan);
  delete copy.aadhaar;
  delete copy.pan;
  delete copy.passwordHash;
  delete copy._createdAt;
  delete copy.__v;
  return copy;
}

function makeToken(payload: { id: string; email?: string }) {
  const raw = `${payload.id}|${Date.now()}|${Math.random().toString(36).slice(2, 8)}`;
  return Buffer.from(raw).toString('base64');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim().toLowerCase();
    const phone = (body.phone || '').toString().trim();
    const password = (body.password || '').toString();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ ok: false, error: 'name, email, phone and password are required' }, { status: 400 });
    }

    // basic password rules for dev
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: 'password must be at least 6 characters' }, { status: 400 });
    }

    // prepare record
    const record: any = {
      name,
      email,
      phone,
      aadhaar: body.aadhaar ? String(body.aadhaar).trim() : null,
      pan: body.pan ? String(body.pan).toUpperCase().trim() : null,
      city: body.city ? String(body.city).trim() : '',
      state: body.state ? String(body.state).trim() : '',
      country: body.country ? String(body.country).trim() : 'India',
      languages: Array.isArray(body.languages) ? body.languages : (body.languages ? String(body.languages).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      specialty: Array.isArray(body.specialty) ? body.specialty : (body.specialty ? String(body.specialty).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      pricePerDay: Number(body.pricePerDay || 0),
      experienceYears: Number(body.experienceYears || 0),
      bio: body.bio ? String(body.bio).trim() : '',
      verified: Boolean(body.verified || false),
      rating: 0,
      _createdAt: new Date(),
    };

    // check duplicates
    const mongo = await connectToMongo();
    if (mongo) {
      const client = await mongo;
      const db = client.db();
      const col = db.collection('guides');
      const exists = await col.findOne({ $or: [{ email }, { phone }] });
      if (exists) return NextResponse.json({ ok: false, error: 'email_or_phone_already_registered' }, { status: 409 });
    } else {
      const items = await readFileStore();
      const exists = items.find((g: any) => String(g.email).toLowerCase() === email || String(g.phone) === phone);
      if (exists) return NextResponse.json({ ok: false, error: 'email_or_phone_already_registered' }, { status: 409 });
    }

    // hash password using bcryptjs
    let hash: string | null = null;
    try {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(password, salt);
    } catch (err) {
      console.warn('bcryptjs not available, storing unhashed passwordHash for dev only');
      hash = `dev:${password}`;
    }

    record.passwordHash = hash;

    // persist
    let inserted: any = null;
    if (mongo) {
      const client = await mongo;
      const db = client.db();
      const col = db.collection('guides');
      const r = await col.insertOne(record);
      inserted = await col.findOne({ _id: r.insertedId });
    } else {
      const items = await readFileStore();
      record.id = `g_${Date.now().toString(36)}`;
      items.unshift(record);
      await writeFileStore(items);
      inserted = record;
    }

    const user = sanitizeForClient(inserted);
    const token = makeToken({ id: inserted.id || inserted._id?.toString() || 'anon', email: user.email });

    return NextResponse.json({ ok: true, token, user }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/auth/signup error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
