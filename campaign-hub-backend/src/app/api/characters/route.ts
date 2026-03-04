import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getCorsHeaders } from '@/lib/cors';

const filePath = path.join(process.cwd(), 'data', 'characters.json');

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContent), { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Characters not found" }, { status: 404, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const characters = JSON.parse(fileContent);

    const updated = characters.map((char: any) =>
      char.id === updates.id ? { ...char, ...updates } : char
    );

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update character" }, { status: 500, headers: getCorsHeaders(request) });
  }
}