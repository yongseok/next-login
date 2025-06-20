import path from 'path';
import fs from 'fs';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public/globe.svg');
  const file = fs.readFileSync(filePath, 'utf8');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return new Response(file, {
    headers: {
      'Content-Encoding': 'utf-8',
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    status: 200,
  });
}
