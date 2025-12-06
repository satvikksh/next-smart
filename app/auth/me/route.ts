// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "../../src/lib/ConnectDB";
import User from "../../src/models/users";
import {
  getSessionBySignedToken,
  destroySession,
} from "../../src/lib/session";

export async function GET() {
  try {
    await dbConnect();

    // Read signed session JWT ("session_id")
    const cookieStore = await cookies();
    const signedSession = cookieStore.get("session_id")?.value;

    if (!signedSession) {
      return NextResponse.json({
        user: null,
        error: "NO_SESSION"
      }, { status: 401 });
    }

    // Verify session cookie JWT → get session document
    const session = await getSessionBySignedToken(signedSession);

    if (!session) {
      // remove corrupted/expired cookies
      const res = NextResponse.json({
        user: null,
        error: "INVALID_SESSION"
      }, { status: 401 });

      res.cookies.set("session_id", "", { path: "/", httpOnly: true, maxAge: 0 });
      res.cookies.set("auth_token", "", { path: "/", httpOnly: true, maxAge: 0 });
      return res;
    }

    // Fetch user from DB
    const user = await User.findById(session.user._id).lean();

    if (!user) {
      await destroySession(session.sid);

      const res = NextResponse.json({
        user: null,
        error: "USER_NOT_FOUND"
      }, { status: 401 });

      res.cookies.set("session_id", "", { path: "/", httpOnly: true, maxAge: 0 });
      res.cookies.set("auth_token", "", { path: "/", httpOnly: true, maxAge: 0 });
      return res;
    }

    // Remove sensitive fields before sending to client
    delete (user as any).password;
    delete (user as any).signature;

    return NextResponse.json({ user }, { status: 200 });

  } catch (err) {
    console.error("ME route error:", err);

    return NextResponse.json({
      user: null,
      error: "SERVER_ERROR"
    }, { status: 500 });
  }
}
