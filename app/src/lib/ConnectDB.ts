// src/lib/ConnectDB.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("Please set MONGODB_URI in .env.local");

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; };
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) {
    console.info("dbConnect: using cached connection to DB:", (cached.conn as any).connection?.name);
    return cached.conn;
  }
  if (!cached.promise) {
    console.info("dbConnect: connecting to:", MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => {
      console.info("dbConnect: connected to DB:", m.connection.name, "host:", m.connection.host);
      return m;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
