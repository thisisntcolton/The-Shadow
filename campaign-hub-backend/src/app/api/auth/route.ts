import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET!;

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

// Login
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const [user] = await sql`SELECT * FROM users WHERE name = ${username}`;

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: getCorsHeaders(request) });
    }

    if (!user.password_hash) {
      return NextResponse.json({ error: "Account not set up yet" }, { status: 401, headers: getCorsHeaders(request) });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: getCorsHeaders(request) });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, role: user.role }
    }, { headers: getCorsHeaders(request) });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

// Set password (DM only)
export async function PATCH(request: Request) {
  try {
    const { userId, password, adminToken } = await request.json();

    // Verify the requester is the DM
    const decoded = jwt.verify(adminToken, JWT_SECRET) as any;
    if (decoded.role !== 'DM') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403, headers: getCorsHeaders(request) });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await sql`UPDATE users SET password_hash = ${password_hash} WHERE id = ${userId}`;

    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to set password" }, { status: 500, headers: getCorsHeaders(request) });
  }
}