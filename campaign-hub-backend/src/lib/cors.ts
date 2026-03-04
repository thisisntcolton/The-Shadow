const allowedOrigins = [
  'http://localhost:8080',
  'http://10.30.0.112:8080',
  'https://the-shadow-frontend.vercel.app',
];

export function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, PATCH, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}