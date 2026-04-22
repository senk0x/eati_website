import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

function contentTypeForExtension(ext: string): string {
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const ext = filename.split('.').pop() || '';
  const candidates = [
    // New runtime upload location
    path.join(process.cwd(), '.uploads', 'blog', filename),
    // Legacy location used by previous uploader
    path.join(process.cwd(), 'public', 'images', 'blog', filename),
  ];

  for (const filePath of candidates) {
    try {
      const bytes = await readFile(filePath);
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          'Content-Type': contentTypeForExtension(ext),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      // try next
    }
  }

  return new NextResponse('Not found', { status: 404 });
}

