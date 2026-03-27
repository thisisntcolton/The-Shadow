import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const entries = await sql`SELECT * FROM journal ORDER BY id DESC`;
    return NextResponse.json(entries, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not read the journal" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const { title, date, location, content, author } = await request.json();
    const id = Date.now().toString();
    const [entry] = await sql`
      INSERT INTO journal (id, title, date, location, content, author)
      VALUES (${id}, ${title}, ${date}, ${location}, ${content}, ${author})
      RETURNING *
    `;
    return NextResponse.json(entry, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not save journal entry" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, title, date, location, content } = await request.json();
    await sql`
      UPDATE journal
      SET title = ${title}, date = ${date}, location = ${location}, content = ${content}
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM journal WHERE id = ${id}`;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete journal entry" }, { status: 500, headers: getCorsHeaders(request) });
  }
}