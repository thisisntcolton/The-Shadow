import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const recaps = await sql`SELECT * FROM recaps ORDER BY session ASC`;
    return NextResponse.json(recaps, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Recaps lost in Moria" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const { title, summary, session } = await request.json();
    const id = Date.now().toString();
    const [recap] = await sql`
      INSERT INTO recaps (id, title, summary, session)
      VALUES (${id}, ${title}, ${summary}, ${session})
      RETURNING *
    `;
    return NextResponse.json(recap, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save recap" }, { status: 500, headers: getCorsHeaders(request) });
  }
}