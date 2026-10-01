import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safeName = path.basename(filename);

  const candidates = [
    path.join(process.cwd(), 'src', 'assets', 'images', 'images', safeName),
    path.join(process.cwd(), 'src', 'assets', 'images', safeName),
    path.join(process.cwd(), 'public', 'images', safeName),
  ];

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.size > 0) {
          const buffer = fs.readFileSync(filePath);
          const ext = path.extname(safeName).toLowerCase();
          const contentType =
            ext === '.png'
              ? 'image/png'
              : ext === '.webp'
              ? 'image/webp'
              : 'image/jpeg';

          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'no-store, must-revalidate',
            },
          });
        }
      }
    } catch {
      // try next candidate
    }
  }

  return new NextResponse('Image not found', { status: 404 });
}
