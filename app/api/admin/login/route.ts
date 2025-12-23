// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../../../src/lib/prisma';


// const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  return NextResponse.json({ ok: false, message: 'This endpoint accepts POST for login' });
}

export async function POST(request: Request) {
  const prisma = await getPrisma();
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing email or password' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    if (!admin.isActive) {
      return NextResponse.json({ ok: false, error: 'Account is deactivated' }, { status: 403 });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const res = NextResponse.json(
      { message: 'Login successful', admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } },
      { status: 200 }
    );

    res.cookies.set('admin_token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 86400, path: '/' });
    return res;
  } catch (err) {
    console.error('login route error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
