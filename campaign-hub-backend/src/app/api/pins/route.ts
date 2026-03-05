import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const pins = await sql`SELECT * FROM pins ORDER BY created_at ASC`;
    return NextResponse.json(pins, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not fetch pins" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const { title, notes, x, y, created_by } = await request.json();
    const id = Date.now().toString();
    const [pin] = await sql`
      INSERT INTO pins (id, title, notes, x, y, created_by)
      VALUES (${id}, ${title}, ${notes}, ${x}, ${y}, ${created_by})
      RETURNING *
    `;
    return NextResponse.json(pin, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not save pin" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM pins WHERE id = ${id}`;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete pin" }, { status: 500, headers: getCorsHeaders(request) });
  }
}