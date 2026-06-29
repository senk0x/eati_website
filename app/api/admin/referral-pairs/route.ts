import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { createReferralPair, listReferralPairs } from '@/lib/referral-data';
import { isSupabaseServerConfigured } from '@/lib/supabase-server';

const MAX_PROMO_CODE_LENGTH = 40;

function cleanPromoCode(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_PROMO_CODE_LENGTH) : '';
}

function configurationErrorResponse() {
  return NextResponse.json(
    {
      error: 'Referral backend is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment.',
      configured: false,
    },
    { status: 503 }
  );
}

export async function GET() {
  const authenticated = await verifyAdminAuth();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseServerConfigured()) {
    return configurationErrorResponse();
  }

  try {
    const pairs = await listReferralPairs();
    return NextResponse.json({ pairs, configured: true });
  } catch (error) {
    console.error('Admin referral pair list error:', error);
    return NextResponse.json({ error: 'Failed to load referral pairs.', configured: true }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authenticated = await verifyAdminAuth();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseServerConfigured()) {
    return configurationErrorResponse();
  }

  try {
    const body = await request.json();
    const promoCode = cleanPromoCode((body as { promoCode?: unknown })?.promoCode);
    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code is required.' }, { status: 400 });
    }

    const pair = await createReferralPair(promoCode);
    return NextResponse.json({ ...pair, configured: true });
  } catch (error) {
    console.error('Admin referral pair create error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create referral pair.';
    const isDuplicate = message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique');
    return NextResponse.json(
      { error: isDuplicate ? 'This promo code already has a partner password.' : 'Failed to create referral pair.' },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
