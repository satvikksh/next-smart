import mongoose from 'mongoose';
import crypto from 'crypto';
import GuideSessionModel from '../models/guide-session';
import {IGuideSession} from '../models/guide-session';

// Simple MongoDB connect helper (reused across server files)
async function connectToDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not configured');

  const globalAny = globalThis as any;
  if (!globalAny._mongoose) {
    globalAny._mongoose = { conn: null, promise: null };
  }

  if (globalAny._mongoose.conn) return globalAny._mongoose.conn;
  if (!globalAny._mongoose.promise) {
    globalAny._mongoose.promise = mongoose.connect(uri, { dbName: undefined }).then((m) => m.connection);
  }
  globalAny._mongoose.conn = await globalAny._mongoose.promise;
  return globalAny._mongoose.conn;
}

function makeRandomToken(size = 32) {
  return crypto.randomBytes(size).toString('hex');
}

export type CreateSessionOptions = {
  ttlDays?: number; // session lifetime in days (default 7)
  ip?: string;
  userAgent?: string;
  refreshToken?: string | null;
};

export async function createSession(guideId: string | mongoose.Types.ObjectId, opts: CreateSessionOptions = {}) {
  await connectToDb();
  const ttlDays = opts.ttlDays ?? 7;
  const token = makeRandomToken(32);
  const refreshToken = opts.refreshToken ?? makeRandomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);

  const doc = await GuideSessionModel.create({
    guide: guideId,
    token,
    refreshToken,
    ip: opts.ip || '',
    userAgent: opts.userAgent || '',
    expiresAt,
  });

  return { token, refreshToken, expiresAt, sessionId: doc._id };
}

export async function verifySessionToken(token: string) {
  if (!token) return null;
  await connectToDb();
  const session = await GuideSessionModel.findOne({ token, revoked: false }).populate('guide');
  if (!session) return null;
  if (session.expiresAt && session.expiresAt < new Date()) return null;
  return session as IGuideSession;
}

export async function revokeSession(token: string) {
  if (!token) return false;
  await connectToDb();
  const r = await GuideSessionModel.findOneAndUpdate({ token }, { revoked: true }, { new: true });
  return !!r;
}

export async function revokeAllSessionsForGuide(guideId: string | mongoose.Types.ObjectId) {
  await connectToDb();
  const r = await GuideSessionModel.updateMany({ guide: guideId, revoked: false }, { revoked: true });
  return r.modifiedCount || r.nModified || 0;
}

export async function rotateRefreshToken(oldRefreshToken: string) {
  if (!oldRefreshToken) return null;
  await connectToDb();
  const session = await GuideSessionModel.findOne({ refreshToken: oldRefreshToken, revoked: false });
  if (!session) return null;
  const newRefresh = makeRandomToken(32);
  session.refreshToken = newRefresh;
  await session.save();
  return { newRefreshToken: newRefresh, sessionId: session._id };
}

export async function cleanupExpiredSessions() {
  await connectToDb();
  const r = await GuideSessionModel.deleteMany({ expiresAt: { $lte: new Date() } });
  return r.deletedCount || 0;
}

export default {
  connectToDb,
  createSession,
  verifySessionToken,
  revokeSession,
  revokeAllSessionsForGuide,
  rotateRefreshToken,
  cleanupExpiredSessions,
};
