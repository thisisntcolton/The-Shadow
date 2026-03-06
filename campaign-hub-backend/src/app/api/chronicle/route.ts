import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getCorsHeaders } from '@/lib/cors';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const { journalEntries, recaps, characters, lootItems } = await request.json();

    const characterSummary = characters.map((c: any) =>
      `${c.name} (Level ${c.level} ${c.race} ${c.class}, assigned to ${c.assigned_to})`
    ).join(", ");

    const journalSummary = journalEntries.map((e: any) =>
      `[${e.author} - ${e.date} at ${e.location}]: ${e.content}`
    ).join("\n\n");

    const recapSummary = recaps.map((r: any) =>
      `[Session ${r.session} - ${r.title}]: ${r.summary}`
    ).join("\n\n");

    const lootSummary = lootItems.map((l: any) =>
      `${l.name} (${l.rarity} ${l.type})`
    ).join(", ");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `You are a master storyteller writing in the style of J.R.R. Tolkien. 
Based on the following campaign notes, write a beautiful storybook-style chronicle of the Fellowship's journey. 
Write it as if it were a chapter from a great fantasy novel — rich with atmosphere, character, and wonder.
Keep it to 4-6 paragraphs.

CHARACTERS: ${characterSummary}

PLAYER JOURNAL ENTRIES:
${journalSummary}

DM RECAPS:
${recapSummary}

NOTABLE ITEMS FOUND: ${lootSummary}

Write the chronicle now:`
      }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ story: text }, { headers: getCorsHeaders(request) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not generate chronicle" }, { status: 500, headers: getCorsHeaders(request) });
  }
}