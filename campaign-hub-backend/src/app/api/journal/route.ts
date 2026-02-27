import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'journal.json');

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  const allowed = ['http://localhost:8080', 'http://10.30.0.112:8080'];
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
    return NextResponse.json({ error: "Could not read the journal" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const newEntry = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(fileContent);

    const entryWithId = {
      ...newEntry,
      id: Date.now().toString(),
    };

    entries.push(entryWithId);
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2));

    return NextResponse.json(entryWithId, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not save journal entry" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const entries = JSON.parse(fileContent);

    const updated = entries.filter((entry: any) => entry.id !== id);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete journal entry" }, { status: 500, headers: getCorsHeaders(request) });
  }
}