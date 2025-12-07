import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.length === 0) {
  throw new Error("❌ MONGODB_URI is missing. Add it to your .env.local");
}

// Types for global cache
type MongooseGlobal = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// Use global object (prevents multiple connections in dev)
let cached: MongooseGlobal = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<Mongoose> {
  // If already connected → return immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== "production",
    };

    console.log("📡 Connecting to MongoDB…");

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("🟢 MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection FAILED:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn!;
}
