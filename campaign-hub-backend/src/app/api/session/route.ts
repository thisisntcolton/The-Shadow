import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const [session] = await sql`SELECT * FROM session_info LIMIT 1`;
    return NextResponse.json(session, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not read session data" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { nextSession } = await request.json();
    await sql`
      UPDATE session_info
      SET next_session = ${nextSession}
      WHERE id = 1
    `;
    return NextResponse.json({ nextSession }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not update session" }, { status: 500, headers: getCorsHeaders(request) });
  }
}