import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const rules = await sql`SELECT * FROM table_rules ORDER BY category, created_at ASC`;
    return NextResponse.json(rules, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not fetch rules" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, category } = await request.json();
    const id = Date.now().toString();
    const [rule] = await sql`
      INSERT INTO table_rules (id, title, description, category)
      VALUES (${id}, ${title}, ${description}, ${category})
      RETURNING *
    `;
    return NextResponse.json(rule, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not save rule" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, title, description, category } = await request.json();
    await sql`
      UPDATE table_rules
      SET title = ${title}, description = ${description}, category = ${category}
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not update rule" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM table_rules WHERE id = ${id}`;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete rule" }, { status: 500, headers: getCorsHeaders(request) });
  }
}