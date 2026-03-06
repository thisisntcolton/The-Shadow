import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const users = await sql`SELECT id, name, role FROM users`;
    return NextResponse.json(users, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "No travelers found in the Prancing Pony" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const { name, role, password, adminToken } = await request.json();
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'DM') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403, headers: getCorsHeaders(request) });
    }
    const id = Date.now().toString();
    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await sql`
      INSERT INTO users (id, name, role, password_hash)
      VALUES (${id}, ${name}, ${role}, ${password_hash})
      RETURNING id, name, role
    `;
    return NextResponse.json(user, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not add player" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, role, password, adminToken } = await request.json();
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'DM') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403, headers: getCorsHeaders(request) });
    }
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      await sql`UPDATE users SET password_hash = ${password_hash} WHERE id = ${id}`;
    }
    if (role) {
      await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
    }
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not update player" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, adminToken } = await request.json();
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'DM') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403, headers: getCorsHeaders(request) });
    }
    await sql`DELETE FROM users WHERE id = ${id}`;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not remove player" }, { status: 500, headers: getCorsHeaders(request) });
  }
}