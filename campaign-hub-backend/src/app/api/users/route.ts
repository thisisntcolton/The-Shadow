import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getCorsHeaders } from '@/lib/cors';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContent), { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "No travelers found in the Prancing Pony" }, { status: 500, headers: getCorsHeaders(request) });
  }
}