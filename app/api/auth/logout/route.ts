// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { dbConnect } from "../../../src/lib/ConnectDB";
import Session from "../../../src/models/session";

const COOKIE_NAME_SESSION = "session_token"; // change if your cookie is named differently
const COOKIE_NAME_JWT = "auth_token"; // optional auth JWT

// helper: try to extract sid from token (if token is a signed JWT with { sid })
async function extractSidFromCookieValue(value?: string | null) {
  if (!value) return null;
  // if looks like a JWT (contains two dots) try to verify as cookie-signed JWT
  if (value.split?.(".").length === 3) {
    try {
      const secret = new TextEncoder().encode(process.env.COOKIE_SECRET || "");
      const { payload } = await jwtVerify(value, secret);
      // payload can contain sid or uid etc
      if ((payload as any).sid) return String((payload as any).sid);
      // fallback: maybe token contains userId only — then we cannot infer sid
      return null;
    } catch (err) {
      // not a valid signed token or verification failed
      return null;
    }
  }
  // otherwise treat cookie value directly as a raw sid
  return value;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // read cookies
    const cookieHeader = req.headers.get("cookie") || "";
    // parse cookie header quickly
    const cookies: Record<string, string> = {};
    cookieHeader.split(";").forEach((c) => {
      const [k, ...v] = c.split("=");
      if (!k) return;
      cookies[k.trim()] = (v || []).join("=").trim();
    });

    // Try session_token first
    const rawSession = cookies[COOKIE_NAME_SESSION] ?? null;
    const sidFromSession = await extractSidFromCookieValue(rawSession);

    // If we couldn't get sid, try a different cookie (like session_id or session)
    const fallbackRaw = cookies["session_id"] ?? cookies["session"] ?? null;
    const sidFromFallback = sidFromSession ? sidFromSession : await extractSidFromCookieValue(fallbackRaw);

    // If still no sid, optionally try JWT auth cookie which might encode sid
    const authJwt = cookies[COOKIE_NAME_JWT] ?? null;
    const sidFromAuth = sidFromFallback ? sidFromFallback : await extractSidFromCookieValue(authJwt);

    // Gather sid candidates
    const sid = sidFromSession || sidFromFallback || sidFromAuth || null;

    if (sid) {
      try {
        // Delete session(s) matching this sid
        await Session.deleteOne({ sid });
      } catch (err) {
        // best-effort: log but continue to clear cookies
        console.error("LOGOUT: failed to delete session", err);
      }
    } else {
      // If we couldn't find sid, but want to be safe we can try to delete sessions by user cookie (if auth jwt has uid)
      try {
        if (authJwt && authJwt.split(".").length === 3) {
          try {
            const secret = new TextEncoder().encode(process.env.COOKIE_SECRET || "");
            const { payload } = await jwtVerify(authJwt, secret);
            const uid = (payload as any).uid || (payload as any).userId || (payload as any).id;
            if (uid) {
              // delete all sessions for that user (optional)
              await Session.deleteMany({ user: uid });
            }
          } catch (e) {
            // ignore
          }
        }
      } catch {}
    }

    // Create response and clear cookies (set cookies to empty with maxAge 0)
    const res = NextResponse.json({ ok: true, message: "Logged out" }, { status: 200 });

    // clear the common cookie names you use
    const cookieClear = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 0,
    };

    res.cookies.set({
      name: COOKIE_NAME_SESSION,
      value: "",
      ...cookieClear,
    });

    // clear fallback names too
    res.cookies.set({ name: "session_id", value: "", ...cookieClear });
    res.cookies.set({ name: "session", value: "", ...cookieClear });
    // clear auth token cookie if present
    res.cookies.set({ name: COOKIE_NAME_JWT, value: "", ...cookieClear });

    return res;
  } catch (err: any) {
    console.error("LOGOUT ERROR:", err);
    const res = NextResponse.json({ ok: false, message: "Logout failed" }, { status: 500 });
    // still attempt to clear cookies client-side
    res.cookies.set({ name: "session_token", value: "", path: "/", maxAge: 0 });
    res.cookies.set({ name: "auth_token", value: "", path: "/", maxAge: 0 });
    return res;
  }
}
