import { createHmac, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'eati_admin_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function createSignedToken(secret: string): string {
  const payload = JSON.stringify({
    t: Date.now(),
    r: randomBytes(16).toString('hex'),
  });
  const payloadB64 = Buffer.from(payload, 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payloadB64}.${sig}`;
}

function verifySignedToken(token: string, secret: string): boolean {
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
  } catch {
    return false;
  }
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex');
  if (expectedSig !== sig) return false;
  const data = JSON.parse(payload) as { t?: number };
  if (typeof data?.t !== 'number') return false;
  const maxAgeMs = COOKIE_MAX_AGE * 1000;
  return Date.now() - data.t <= maxAgeMs;
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = createSignedToken(adminPassword);

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!authCookie?.value) {
    return NextResponse.json({ authenticated: false });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ authenticated: false });
  }

  const authenticated = verifySignedToken(authCookie.value, adminPassword);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
