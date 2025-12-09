import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';

/**
 * POST /api/auth/login
 *
 * Body: { identifier: string, password: string }
 * - identifier: email or phone
 * - password: plain string
 *
 * Behavior (dev-friendly):
 *  - Looks up a guide by email OR phone in MongoDB (if MONGODB_URI provided) under `guides` collection
 *    or falls back to a simple file-store: /tmp/guides.json
 *  - If a matching guide is found, performs a minimal password check:
 *      * If the guide record contains `passwordHash` (future), you should verify it server-side.
 *      * For now (because the sample signup stored no password), this route treats any provided
 *        password with length >= 4 as valid **if a guide exists**. This makes the dev flow work
 *        while you integrate a real auth system.
 *  - On success returns a JSON payload: { ok: true, token, user }
 *    where `user` is a sanitized guide object (Aadhaar/PAN masked and removed).
 *
 * Security notes:
 * - This is a development-friendly route. For production: store password hashes, use HTTPS,
 *   issue HttpOnly cookies or secure JWTs, rate-limit login attempts and implement account lockout.
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
  // remove internal fields
  delete copy._createdAt;
  delete copy.__v;
  return copy;
}

function makeToken(payload: { id: string; email?: string }) {
  // Simple token for dev: base64(id + ts + random). Not secure for production
  const raw = `${payload.id}|${Date.now()}|${Math.random().toString(36).slice(2, 8)}`;
  return Buffer.from(raw).toString('base64');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || '').toString().trim();
    const password = (body.password || '').toString();

    if (!identifier || !password) {
      return NextResponse.json({ ok: false, error: 'identifier and password are required' }, { status: 400 });
    }

    // find guide
    let found: any = null;
    const mongo = await connectToMongo();
    if (mongo) {
      const client = await mongo;
      const db = client.db();
      const col = db.collection('guides');
      // try to match by email or phone (case-insensitive for email)
      found = await col.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    } else {
      const items = await readFileStore();
      found = items.find((g: any) => String(g.email) === identifier || String(g.phone) === identifier);
    }

    if (!found) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    // AUTH CHECK (dev-friendly)
    // If you later store passwordHash on the guide, verify it here. For now, accept any length>=4
    if ((found.passwordHash && typeof found.passwordHash === 'string')) {
      // TODO: verify hash (bcrypt) — not implemented in this dev route
      // return 501 to indicate missing implementation
      return NextResponse.json({ ok: false, error: 'Server not configured for password verification' }, { status: 501 });
    }

    if (password.length < 4) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // success — create token and return sanitized user
    const user = sanitizeForClient(found);
    const token = makeToken({ id: found.id || found._id?.toString() || 'anon' });

    // Optionally set cookie (not HttpOnly here) — for dev we return token in JSON
    const resp = NextResponse.json({ ok: true, token, user }, { status: 200 });
    return resp;
  } catch (err: any) {
    console.error('POST /api/auth/login error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
