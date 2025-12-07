import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../src/lib/ConnectDB";
import User from "../../../src/models/users";
import { SignJWT } from "jose";

// Get cookie secret
const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!COOKIE_SECRET) {
  throw new Error("❌ COOKIE_SECRET missing in .env.local");
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email })
      .select("+password +signature")
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Prepare token payload
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    // Generate JWT session token
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(COOKIE_SECRET));

    // Create secure cookie
    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );

    res.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
