import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getCorsHeaders } from '@/lib/cors';

const filePath = path.join(process.cwd(), 'data', 'recaps.json');

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContent), { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Recaps lost in Moria" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const newRecap = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const recaps = JSON.parse(fileContent);

    const recapWithId = {
      ...newRecap,
      id: Date.now().toString(),
    };

    recaps.push(recapWithId);
    await fs.writeFile(filePath, JSON.stringify(recaps, null, 2));

    return NextResponse.json(recapWithId, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save recap" }, { status: 500, headers: getCorsHeaders(request) });
  }
}