// app/api/test-session/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "../../src/lib/ConnectDB";
import User from "../../src/models/users";
import { createSession } from "../../src/lib/session";

export async function GET() {
  try {
    await dbConnect();
    const user = await User.findOne().lean();
    if (!user) return NextResponse.json({ ok: false, message: "no user in DB" }, { status: 400 });

    const s = await createSession({ userId: String(user._id), ua: "test", ip: "127.0.0.1" });
    const sessions = await (await import("../../src/models/session")).default.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean();
    return NextResponse.json({ ok: true, createdSid: s.sid, sessions }, { status: 200 });
  } catch (err: any) {
    console.error("test-session error", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
