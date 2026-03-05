import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getCorsHeaders } from '@/lib/cors';

const sql = neon(process.env.DATABASE_URL!);

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const characters = await sql`SELECT * FROM characters`;
    return NextResponse.json(characters, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Characters not found" }, { status: 404, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    await sql`
      UPDATE characters
      SET
        hit_points_current = ${updates.hitPoints?.current ?? updates.hit_points_current},
        level = ${updates.level},
        armor_class = ${updates.armorClass ?? updates.armor_class}
      WHERE id = ${updates.id}
    `;
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update character" }, { status: 500, headers: getCorsHeaders(request) });
  }
}