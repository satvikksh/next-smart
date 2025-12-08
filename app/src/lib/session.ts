// src/lib/session.ts
import SessionModel from "../models/session";
import { dbConnect } from "./ConnectDB";
import mongoose from "mongoose";

export function generateSid(): string {
  try {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID();
    }
  } catch {}
  return "s-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36);
}

/**
 * createSession: creates a session, forces a save, and immediately verifies the document
 * Logs lots of context so we can be 100% sure *which* DB and collection is being written.
 */
export async function createSession({
  userId,
  deviceKey,
  ua,
  ip,
  maxAgeSec = 60 * 60 * 24,
  meta,
}: {
  userId: string;
  deviceKey?: string | null;
  ua?: string;
  ip?: string;
  maxAgeSec?: number;
  meta?: Record<string, any>;
}) {
  // 1) ensure DB connected (logs DB name)
  const conn = await dbConnect();
  try {
    console.info("createSession: mongoose connection name:", (conn as any).connection?.name);
    console.info("createSession: mongoose connection host:", (conn as any).connection?.host);
  } catch (e) {
    console.warn("createSession: unable to read connection info", e);
  }

  // 2) inspect Session model runtime info
  try {
    console.info("createSession: Session model db name:", (SessionModel.db as any)?.name);
    console.info("createSession: Session collection name:", SessionModel.collection?.collectionName);
  } catch (e) {
    console.warn("createSession: unable to read SessionModel info", e);
  }

  const sid = generateSid();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + maxAgeSec * 1000);

  try {
    // 3) construct doc explicitly and call .save() to ensure persistence path is hit
    const sessionDoc = new SessionModel({
      sid,
      user: new mongoose.Types.ObjectId(userId),
      deviceKey: deviceKey ?? null,
      ua: ua ?? "",
      ip: ip ?? "",
      createdAt: now,
      expiresAt,
      meta: meta || {},
    });

    // debug: show the toObject before save
    console.info("createSession: saving doc (pre-save):", { sid: sessionDoc.sid, user: sessionDoc.user?.toString?.() });

    // 4) save and await the promise
    const saved = await sessionDoc.save();
    console.info("createSession: saved doc:", { sid: saved.sid, _id: saved._id });

    // 5) immediate read-back (same model + connection)
    const found = await SessionModel.findOne({ sid }).lean();
    console.info("createSession: read-back:", found ? { sid: found.sid, _id: found._id } : null);

    // 6) return saved doc (hydrated)
    return saved;
  } catch (err: any) {
    console.error("createSession: ERROR creating/saving session:", {
      message: err?.message,
      name: err?.name,
      code: err?.code,
      keyValue: err?.keyValue ?? null,
      errors: err?.errors ?? null,
      stack: err?.stack?.split("\n").slice(0, 6).join("\n"),
    });
    throw err;
  }
}
