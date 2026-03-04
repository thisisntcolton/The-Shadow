import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getCorsHeaders } from '@/lib/cors';

const filePath = path.join(process.cwd(), 'data', 'loot.json');

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