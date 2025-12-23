// app/api/book/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return NextResponse.json({ ok: true, message: 'GET /api/book' });
}

export async function POST(req: Request) {
  const body = await req.json();
  // handle create book...
  return NextResponse.json({ ok: true, body });
}
