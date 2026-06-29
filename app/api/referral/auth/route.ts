import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findPromoCodeByPassword } from '@/lib/referral-data';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import {
  getReferralAuthSecret,
  readReferralSession,
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_COOKIE_NAME,
  signReferralSession,
} from '@/lib/referral-auth';
import { isSupabaseServerConfigured } from '@/lib/supabase-server';

const MAX_PASSWORD_LENGTH = 120;
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`referral-auth:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
  }

  try {
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: 'Partner login is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const password = typeof body?.password === 'string' ? body.password.trim() : '';
    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json({ error: 'Password is too long.' }, { status: 400 });
    }

    const promoCode = await findPromoCodeByPassword(password);
    if (!promoCode) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const secret = getReferralAuthSecret();
    const token = signReferralSession({ promoCode, issuedAt: Date.now() }, secret);
    const cookieStore = await cookies();

    cookieStore.set(REFERRAL_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: REFERRAL_COOKIE_MAX_AGE,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Referral auth error:', error);
    return NextResponse.json({ error: 'Failed to verify password.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const secret = getReferralAuthSecret();
    const session = readReferralSession(token, secret);
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
    });
  } catch (error) {
    console.error('Referral session error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(REFERRAL_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
