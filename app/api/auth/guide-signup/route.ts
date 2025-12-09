import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';

/**
 * POST /api/auth/guide-signup
 *
 * Accepts either raw password (password) OR a client-side SHA-256 passwordHash (passwordHash).
 * Accepts either raw Aadhaar/PAN (aadhaar, pan) OR their client-side hashes (aadhaarHash, panHash).
 *
 * Server behavior (developer-friendly):
 *  - Requires: name, email, phone, and either password or passwordHash.
 *  - If raw password provided: bcrypt-hash it and store as passwordHash.
 *  - If client-sent passwordHash provided: bcrypt-hash that value (double-hash) and store.
 *  - Stores raw aadhaar/pan only if provided; alternatively stores aadhaarHash/panHash.
 *  - Persists to MongoDB if MONGODB_URI provided; otherwise falls back to /tmp/guides.json
 *  - Returns sanitized user (no raw aadhaar/pan, passwordHash removed) and a dev token
 *
 * Security: This is a development starter. In production: use HTTPS, proper KMS/encryption for PII,
 * store password hashes securely, set HttpOnly cookies, rate-limit and add email verification.
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
  // only reveal masked values if raw values exist in the stored record
  if (copy.aadhaar) copy.aadhaarMasked = maskAadhaar(copy.aadhaar);
  if (copy.pan) copy.panMasked = maskPan(copy.pan);
  // never return raw PII or password hashes
  delete copy.aadhaar;
  delete copy.pan;
  delete copy.passwordHash;
  delete copy.aadhaarHash;
  delete copy.panHash;
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
    const rawPassword = body.password ? String(body.password) : null;
    const clientPasswordHash = body.passwordHash ? String(body.passwordHash) : null;

    // require name,email,phone and either password or passwordHash
    if (!name || !email || !phone || (!rawPassword && !clientPasswordHash)) {
      return NextResponse.json({ ok: false, error: 'name, email, phone and password (or passwordHash) are required' }, { status: 400 });
    }

    // basic password rules for dev: ensure at least one representation meets minimum
    if (rawPassword && rawPassword.length < 6) {
      return NextResponse.json({ ok: false, error: 'password must be at least 6 characters' }, { status: 400 });
    }
    if (!rawPassword && clientPasswordHash && clientPasswordHash.length < 8) {
      // client hash should be long; this is a loose check
      return NextResponse.json({ ok: false, error: 'passwordHash seems invalid' }, { status: 400 });
    }

    // prepare record — we will store either raw aadhaar/pan (if provided) OR hashes
    const record: any = {
      name,
      email,
      phone,
      // raw aadhaar/pan will only be stored if client provided them explicitly
      aadhaar: body.aadhaar ? String(body.aadhaar).trim() : null,
      pan: body.pan ? String(body.pan).toUpperCase().trim() : null,
      // hashes provided by client (if any)
      aadhaarHash: body.aadhaarHash ? String(body.aadhaarHash) : null,
      panHash: body.panHash ? String(body.panHash) : null,
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

    // check duplicates by email/phone
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

    // derive server-side password hash (bcrypt) from either rawPassword or clientPasswordHash
    let passwordHashToStore: string | null = null;
    try {
      const bcrypt = await import('bcryptjs');
      if (rawPassword) {
        passwordHashToStore = await bcrypt.hash(rawPassword, 10);
      } else {
        // double-hash: bcrypt(clientPasswordHash)
        passwordHashToStore = await bcrypt.hash(clientPasswordHash as string, 10);
      }
    } catch (err) {
      console.warn('bcryptjs not available, storing unhashed marker for dev only');
      passwordHashToStore = rawPassword ? `dev:${rawPassword}` : `dev:${clientPasswordHash}`;
    }

    record.passwordHash = passwordHashToStore;

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
    console.error('POST /api/auth/guide-signup error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
