// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../src/lib/ConnectDB";
import User from "../../../src/models/users";
import { generateSignature } from "../../../src/utils/generateSignature";

function normalizeUsername(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .slice(0, 20);
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // parse body
    const body = await req.json().catch(() => ({}));

    // accept either `name` or `username` for compatibility
    const rawName = body?.name ?? body?.username ?? body?.fullName ?? null;
    const email = (body?.email || "").toLowerCase().trim();
    const password = body?.password;

    if (!rawName || !email || !password) {
      return NextResponse.json(
        { message: "name, email and password are required" },
        { status: 400 }
      );
    }

    // normalize username (must match your schema constraints)
    const username = normalizeUsername(rawName);

    // check existing email or username
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    }).lean();

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ message: "Email already registered" }, { status: 409 });
      }
      if (existing.username === username) {
        return NextResponse.json({ message: "Username already taken" }, { status: 409 });
      }
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user with unique signature - retry on very rare collisions
    let user = null;
    const maxAttempts = 6;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const signature = generateSignature();

      try {
        user = await User.create({
          name: rawName.trim(),
          username,
          email,
          password: hashed,
          signature,
        });
        break; // success
      } catch (err: any) {
        // duplicate key error
        if (err && err.code === 11000) {
          const keyVal = err.keyValue || {};
          // If signature collision - retry
          if (keyVal.signature) {
            console.warn(`Signature collision detected (attempt ${attempt}) — retrying`);
            if (attempt === maxAttempts) {
              return NextResponse.json({ message: "Could not generate unique signature, try again" }, { status: 500 });
            }
            continue; // try again with a new signature
          }
          // If email/username duplicate (race condition) return informative error
          if (keyVal.email) {
            return NextResponse.json({ message: "Email already registered" }, { status: 409 });
          }
          if (keyVal.username) {
            return NextResponse.json({ message: "Username already taken" }, { status: 409 });
          }
        }
        // other errors -> rethrow to outer catch
        throw err;
      }
    }

    if (!user) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    // remove sensitive fields before sending
    const userSafe = user.toObject ? user.toObject() : { ...user };
    delete (userSafe as any).password;
    delete (userSafe as any).signature;

    return NextResponse.json(
      { message: "User registered successfully", user: userSafe },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);

    // Mongoose validation error -> return details
    if (err?.name === "ValidationError" && err.errors) {
      const details: Record<string, string> = {};
      for (const k in err.errors) details[k] = err.errors[k].message;
      return NextResponse.json({ message: "Validation failed", details }, { status: 400 });
    }

    // duplicate key fallback
    if (err?.code === 11000) {
      const kv = err.keyValue || {};
      if (kv.email) return NextResponse.json({ message: "Email already registered" }, { status: 409 });
      if (kv.username) return NextResponse.json({ message: "Username already taken" }, { status: 409 });
      if (kv.signature) return NextResponse.json({ message: "Signature conflict, try again" }, { status: 500 });
    }

    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
