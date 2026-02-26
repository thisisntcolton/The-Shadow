import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'journal.json');
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const journalData = JSON.parse(fileContent);

    return NextResponse.json(journalData, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Could not read the journal" }, { status: 500 });
  }
}