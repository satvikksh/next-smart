// app/api/auth/guide-login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import crypto from 'crypto';

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

/**
 * If browser preflight or GET happens, respond gracefully to avoid 405 loops.
 */
export async function OPTIONS() {
  // Allow POST from browsers (CORS preflight not fully handled here — add headers if you need cross-origin)
  const res = NextResponse.json({ ok: true }, { status: 204 });
  res.headers.set('Allow', 'POST, OPTIONS');
  return res;
}

export async function GET() {
  const res = NextResponse.json({ ok: false, message: 'This endpoint expects POST' }, { status: 405 });
  res.headers.set('Allow', 'POST, OPTIONS');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
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

      if (found.passwordHash) {
        passwordOk = await bcrypt.compare(password, found.passwordHash);
      }

      if (!passwordOk) {
        try {
          const sha256 = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
          passwordOk = await bcrypt.compare(sha256, found.passwordHash);
        } catch (innerErr) {
          // ignore
        }
      }

      if (!passwordOk && found.passwordHash && String(found.passwordHash).startsWith('dev:')) {
        const marker = String(found.passwordHash).slice(4);
        if (password === marker) passwordOk = true;
        else {
          const sha256 = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
          if (sha256 === marker) passwordOk = true;
        }
      }
    } catch (err) {
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

    // LAZY import guide-session helper (avoid top-level import path issues)
    let guideSessionLib: any = null;
    try {
      // adjust relative path if your src is in a different location; this is a safe attempt
      guideSessionLib = await import('../../../src/lib/guide-session').then(m => m.default ?? m);
    } catch (err) {
      console.warn('guide-session lib import failed (will fallback to mock session).', err);
    }

    let sessionInfo: any;
    try {
      if (guideSessionLib && typeof guideSessionLib.createSession === 'function') {
        sessionInfo = await guideSessionLib.createSession(found._id || found.id || found._doc?._id, {
          ttlDays: 7,
          ip: req.headers.get('x-forwarded-for') || '',
          userAgent: req.headers.get('user-agent') || '',
        });
      } else {
        // fallback simple session token
        sessionInfo = { token: `mock-${Date.now().toString(36)}`, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) };
      }
    } catch (err) {
      console.error('createSession error', err);
      sessionInfo = { token: `mock-${Date.now().toString(36)}`, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) };
    }

    // prepare cookie
    const cookieName = 'guide_session';
    const token = sessionInfo.token;
    const maxAge = 7 * 24 * 60 * 60; // seconds
    const isSecure = process.env.NODE_ENV === 'production';
    const sameSite = 'Strict';
    const path = '/';

    // Build cookie string
    let cookie = `${cookieName}=${token}; Path=${path}; Max-Age=${maxAge}; HttpOnly; SameSite=${sameSite}`;
    if (isSecure) cookie += '; Secure';

    const user = sanitizeForClient(found);

    // Use NextResponse.cookies if available (Next 13+), otherwise set header manually
    const res = NextResponse.json({ ok: true, user }, { status: 200 });
    try {
      // prefer typed cookies API
      // @ts-ignore - NextResponse.cookies may be present depending on Next version
      if (res.cookies && typeof res.cookies.set === 'function') {
        // set secure cookie
        // @ts-ignore
        res.cookies.set({
          name: cookieName,
          value: token,
          httpOnly: true,
          maxAge,
          path,
          sameSite: 'strict',
          secure: isSecure,
        });
      } else {
        res.headers.set('Set-Cookie', cookie);
      }
    } catch (err) {
      // fallback: header
      res.headers.set('Set-Cookie', cookie);
    }

    return res;
  } catch (err: any) {
    console.error('POST /api/auth/guide-login error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
