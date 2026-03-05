import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const users = await sql`SELECT * FROM users`;
    return NextResponse.json(users, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "No travelers found in the Prancing Pony" }, { status: 500, headers: getCorsHeaders(request) });
  }
}