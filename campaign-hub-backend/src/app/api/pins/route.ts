import { getCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
  return Response.json({ message: "Coming soon" }, { headers: getCorsHeaders(request) });
}