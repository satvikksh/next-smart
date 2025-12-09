// /app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import crypto from 'crypto';

// Import bcrypt or fallback to dev behavior if not available (as before)
async function readFileStore(path = '/tmp/guides.json') {
  try {
    if (!fs.existsSync(path)) await fs.promises.writeFile(path, JSON.stringify([]), 'utf8');
    const raw = await fs.promises.readFile(path, 'utf8');
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

// IMPORTANT: adjust this import path if your file is located elsewhere
import guideSessionLib from '../../../src/lib/guide-session'; // createSession, verifySessionToken...
// If that path does not match, use relative path like: '../../src/lib/guide-session'

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
  delete copy.aadhaarHash;
  delete copy.panHash;
  return copy;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || '').toString().trim();
    const password = (body.password || '').toString();

    if (!identifier || !password) {
      return NextResponse.json({ ok: false, error: 'identifier and password required' }, { status: 400 });
    }

    // find user (Mongo if configured, otherwise file store)
    let found: any = null;
    const mongo = await connectToMongo();
    if (mongo) {
      const client = await mongo;
      const db = client.db();
      const col = db.collection('guides');
      // try to match by email or phone
      found = await col.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    } else {
      const items = await readFileStore();
      found = items.find((g: any) => String(g.email) === identifier || String(g.phone) === identifier);
    }

    if (!found) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    // verify password using bcrypt (or dev marker)
    let passwordOk = false;
try {
  const bcrypt = await import('bcryptjs');

  // 1) direct bcrypt compare with raw password (normal)
  if (found.passwordHash) {
    passwordOk = await bcrypt.compare(password, found.passwordHash);
  }

  // 2) try double-hash scenario: server stored bcrypt(clientSHA256(password))
  if (!passwordOk) {
    try {
      const sha256 = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
      passwordOk = await bcrypt.compare(sha256, found.passwordHash);
    } catch (innerErr) {
      // ignore - keep trying other checks
    }
  }

  // 3) dev marker fallback: stored values like "dev:plain" (in earlier dev flows)
  if (!passwordOk && found.passwordHash && String(found.passwordHash).startsWith('dev:')) {
    const marker = String(found.passwordHash).slice(4);
    // marker might be raw password used at signup, or client-side sha
    if (password === marker) passwordOk = true;
    else {
      // compare sha too
      const sha256 = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
      if (sha256 === marker) passwordOk = true;
    }
  }
} catch (err) {
  // bcrypt import failed — try dev-marker only
  console.warn('bcrypt unavailable, trying dev marker match');
  if (found.passwordHash && String(found.passwordHash).startsWith('dev:')) {
    if (found.passwordHash === `dev:${password}`) passwordOk = true;
    const sha256 = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
    if (found.passwordHash === `dev:${sha256}`) passwordOk = true;
  }
}

if (!passwordOk) {
  return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
}

    // create session record in DB using guide-session helper
    // This will return { token, refreshToken, expiresAt, sessionId }
    let sessionInfo;
    try {
      // ensure the lib connects to DB internally (it does)
      sessionInfo = await guideSessionLib.createSession(found._id || found.id || found._doc?._id, {
        ttlDays: 7,
        ip: req.headers.get('x-forwarded-for') || req.ip || '',
        userAgent: req.headers.get('user-agent') || '',
      });
    } catch (err) {
      console.error('createSession error', err);
      // fallback: create a simple token if session creation fails (still allow login but warn)
      sessionInfo = { token: `mock-${Date.now().toString(36)}`, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) };
    }

    // prepare cookie
    const cookieName = 'guide_session';
    const token = sessionInfo.token;
    const maxAge = 7 * 24 * 60 * 60; // seconds
    const isSecure = process.env.NODE_ENV === 'production';
    const sameSite = 'Strict';
    const path = '/';

    // set cookie flags (HttpOnly, SameSite=strict, Secure conditional)
    let cookie = `${cookieName}=${token}; Path=${path}; Max-Age=${maxAge}; HttpOnly; SameSite=${sameSite}`;
    if (isSecure) cookie += '; Secure';

    // sanitize user object to avoid returning PII
    const user = sanitizeForClient(found);

    // Return response with cookie header set
    const res = NextResponse.json({ ok: true, user }, {
      status: 200,
      headers: { 'Set-Cookie': cookie }
    });

    return res;
  } catch (err: any) {
    console.error('POST /api/auth/login error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
