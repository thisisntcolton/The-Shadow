import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'characters.json');

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  const allowed = ['http://localhost:8080', 'http://10.30.0.112:8080'];
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

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