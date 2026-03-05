import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const loot = await sql`SELECT * FROM loot`;
    return NextResponse.json(loot, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Vault not found" }, { status: 404, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const { name, type, rarity, quantity, description, value } = await request.json();
    const id = Date.now().toString();
    const [item] = await sql`
      INSERT INTO loot (id, name, type, rarity, quantity, description, value)
      VALUES (${id}, ${name}, ${type}, ${rarity}, ${quantity}, ${description}, ${value ?? null})
      RETURNING *
    `;
    return NextResponse.json(item, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item to the vault" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, assignedTo } = await request.json();
    await sql`
      UPDATE loot
      SET assigned_to = ${assignedTo}
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to assign item" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM loot WHERE id = ${id}`;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500, headers: getCorsHeaders(request) });
  }
}