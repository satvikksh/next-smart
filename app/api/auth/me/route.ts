import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import User from "../../../src/models/users";
import { dbConnect } from "../../../src/lib/ConnectDB";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("session_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.COOKIE_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("ME ROUTE ERROR:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
