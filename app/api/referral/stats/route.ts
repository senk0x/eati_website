import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getReferralPerformanceForCode } from '@/lib/referral-data';
import { getReferralAuthSecret, readReferralSession, REFERRAL_COOKIE_NAME } from '@/lib/referral-auth';
import { isSupabaseServerConfigured } from '@/lib/supabase-server';

export async function GET() {
  try {
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = getReferralAuthSecret();
    const session = readReferralSession(token, secret);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await getReferralPerformanceForCode(session.promoCode);
    return NextResponse.json({
      promoCode: session.promoCode,
      rows,
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json({ error: 'Failed to load referral data.' }, { status: 500 });
  }
}
