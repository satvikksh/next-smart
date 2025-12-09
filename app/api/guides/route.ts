import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server Route: /app/api/guides/route.ts
 *
 * Supports:
 *  - GET  -> list public guides (Aadhaar / PAN masked or not returned)
 *  - POST -> create a new guide (validates required fields)
 *
 * Behavior:
 *  - If MONGODB_URI is provided in environment, data is persisted to MongoDB (recommended).
 *  - Otherwise falls back to a simple file-store at /tmp/guides.json (useful for local dev).
 *
 * Security note: Aadhaar and PAN are sensitive identifiers. This route stores them only if provided,
 * but the GET response *masks* them and does not return raw values. In production you should
 * implement proper encryption, access controls, and never expose full identifiers to clients.
 */

type GuideInput = {
  name: string;
  email: string;
  phone: string;
  aadhaar?: string; // 12 digits
  pan?: string; // 5 letters 4 digits 1 letter
  city?: string;
  state?: string;
  country?: string;
  languages?: string[];
  specialty?: string[];
  pricePerDay: number;
  experienceYears?: number;
  bio?: string;
  verified?: boolean;
};

const AADHAAR_REGEX = /^[0-9]{12}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

// --- MongoDB helper (lazy connect + reuse) ---
async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  // Use (global as any) to cache client in dev to avoid connection explosion
  const globalWithMongo = globalThis as any;
  if (!globalWithMongo._mongoClientPromise) {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  return globalWithMongo._mongoClientPromise as Promise<any>;
}

// --- simple file fallback storage (local dev) ---
import fs from 'fs';
import path from 'path';
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

// --- helpers ---
function maskAadhaar(a?: string) {
  if (!a) return undefined;
  // show only last 4 digits
  return '********' + a.slice(-4);
}
function maskPan(p?: string) {
  if (!p) return undefined;
  // show first 3 and last 1 letter (e.g. AB***1234F -> AB***F) but simpler: show first 2 + *** + last 1
  return p.slice(0, 2) + '***' + p.slice(-1);
}
function sanitizeGuideForPublic(g: any) {
  // remove or mask sensitive fields
  const copy = { ...g };
  if (copy.aadhaar) copy.aadhaarMasked = maskAadhaar(String(copy.aadhaar));
  if (copy.pan) copy.panMasked = maskPan(String(copy.pan));
  delete copy.aadhaar;
  delete copy.pan;
  return copy;
}

export async function GET(req: NextRequest) {
  try {
    const mongo = await connectToMongo();
    let items: any[] = [];

    if (mongo) {
      const client = await mongo;
      const db = client.db();
      const col = db.collection('guides');
      items = await col.find({}).sort({ _createdAt: -1 }).limit(1000).toArray();
    } else {
      items = await readFileStore();
    }

    // sanitize for public consumption
    const publicItems = items.map(sanitizeGuideForPublic);

    return NextResponse.json({ ok: true, guides: publicItems }, { status: 200 });
  } catch (err: any) {
    console.error('GET /api/guides error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload: GuideInput = {
      name: String(body.name || '').trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone || '').trim(),
      aadhaar: body.aadhaar ? String(body.aadhaar).trim() : undefined,
      pan: body.pan ? String(body.pan).toUpperCase().trim() : undefined,
      city: body.city ? String(body.city).trim() : '',
      state: body.state ? String(body.state).trim() : '',
      country: body.country ? String(body.country).trim() : 'India',
      languages: Array.isArray(body.languages) ? body.languages : (body.languages ? String(body.languages).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      specialty: Array.isArray(body.specialty) ? body.specialty : (body.specialty ? String(body.specialty).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      pricePerDay: Number(body.pricePerDay || 0),
      experienceYears: Number(body.experienceYears || 0),
      bio: body.bio ? String(body.bio).trim() : '',
      verified: Boolean(body.verified || false),
    };

    // basic validation
    const errors: string[] = [];
    if (!payload.name) errors.push('name is required');
    if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) errors.push('valid email is required');
    if (!payload.phone) errors.push('phone is required');
    if (!payload.pricePerDay || payload.pricePerDay <= 0) errors.push('pricePerDay must be a positive number');

    if (payload.aadhaar && !AADHAAR_REGEX.test(payload.aadhaar)) errors.push('aadhaar must be 12 digits');
    if (payload.pan && !PAN_REGEX.test(payload.pan)) errors.push('pan must match format (ABCDE1234F)');

    if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 400 });

    // prepare record
    const record: any = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      aadhaar: payload.aadhaar || null, // stored but not returned
      pan: payload.pan || null, // stored but not returned
      city: payload.city || '',
      state: payload.state || '',
      country: payload.country || 'India',
      languages: payload.languages || [],
      specialty: payload.specialty || [],
      pricePerDay: payload.pricePerDay,
      experienceYears: payload.experienceYears || 0,
      bio: payload.bio || '',
      verified: Boolean(payload.verified || false),
      rating: 0,
      _createdAt: new Date(),
    };

    const mongo = await connectToMongo();
    let inserted: any = null;

    if (mongo) {
      const client = await mongo;
      const db = client.db();
      const col = db.collection('guides');
      const r = await col.insertOne(record);
      inserted = await col.findOne({ _id: r.insertedId });
    } else {
      // file fallback
      const items = await readFileStore();
      // create a simple id
      record.id = `g_${Date.now().toString(36)}`;
      items.unshift(record);
      await writeFileStore(items);
      inserted = record;
    }

    const publicVersion = sanitizeGuideForPublic(inserted);
    return NextResponse.json({ ok: true, guide: publicVersion }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/guides error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
