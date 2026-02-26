import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'loot.json');

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  const allowed = ['http://localhost:8080', 'http://10.30.0.112:8080'];
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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
    return NextResponse.json({ error: "Vault not found" }, { status: 404, headers: getCorsHeaders(request) });
  }
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const lootData = JSON.parse(fileContent);

    const itemWithId = {
      ...newItem,
      id: newItem.id || Date.now().toString()
    };

    lootData.push(itemWithId);
    await fs.writeFile(filePath, JSON.stringify(lootData, null, 2));

    return NextResponse.json(itemWithId, { status: 201, headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item to the vault" }, { status: 500, headers: getCorsHeaders(request) });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, assignedTo } = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const lootData = JSON.parse(fileContent);

    const updated = lootData.map((item: any) =>
      item.id === id ? { ...item, assignedTo } : item
    );

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to assign item" }, { status: 500, headers: getCorsHeaders(request) });
  }
}


export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const fileContent = await fs.readFile(filePath, 'utf8');
    const lootData = JSON.parse(fileContent);

    const updated = lootData.filter((item: any) => item.id !== id);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500, headers: getCorsHeaders(request) });
  }
}