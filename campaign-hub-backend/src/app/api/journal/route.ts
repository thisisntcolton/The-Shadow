import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getCorsHeaders } from '@/lib/cors';

const filePath = path.join(process.cwd(), 'data', 'journal.json');

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