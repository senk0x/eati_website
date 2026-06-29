import { NextResponse } from 'next/server';
import { isEmailDeliveryConfigured, sendEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { saveReferralApplication } from '@/lib/referral-data';
import { isSupabaseServerConfigured } from '@/lib/supabase-server';

const MAX_EMAIL_LENGTH = 320;
const MAX_NETWORKS = 8;
const MAX_USERNAME_LENGTH = 80;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

interface NetworkInput {
  network: string;
  username: string;
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`referral-apply:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const email = cleanText((body as { email?: unknown }).email, MAX_EMAIL_LENGTH);
    const networksInput = Array.isArray((body as { networks?: unknown }).networks)
      ? ((body as { networks: NetworkInput[] }).networks as NetworkInput[])
      : [];

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const networks = networksInput
      .slice(0, MAX_NETWORKS)
      .map((item) => ({
        network: cleanText(item?.network, 40),
        username: cleanText(item?.username, MAX_USERNAME_LENGTH),
      }))
      .filter((item) => item.network && item.username);

    if (!networks.length) {
      return NextResponse.json({ error: 'Add at least one social profile.' }, { status: 400 });
    }

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: 'Referral program is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    await saveReferralApplication({ email, networks });

    const recipient = process.env.REFERRAL_INBOX_EMAIL || 'team@eatiapp.com';
    const emailBody = [
      'New influencer referral application:',
      '',
      `Email: ${email}`,
      '',
      'Social profiles:',
      ...networks.map((item, index) => `${index + 1}. ${item.network}: ${item.username}`),
    ].join('\n');

    let emailDelivered = false;

    if (isEmailDeliveryConfigured()) {
      try {
        const result = await sendEmail({
          to: recipient,
          subject: `Eati referral application from ${email}`,
          replyTo: email,
          text: emailBody,
        });
        emailDelivered = true;
        if (result.sandboxForwarded) {
          console.info(
            `Referral application email forwarded to ${result.deliveredTo} (Resend sandbox; intended: ${recipient}). Verify your domain in Resend to deliver directly to ${recipient}.`
          );
        }
      } catch (emailError) {
        console.error('Referral application email error:', emailError);
      }
    } else {
      console.warn('Referral application saved without email delivery. Configure RESEND_API_KEY or SMTP_* env vars.');
    }

    return NextResponse.json({ ok: true, emailDelivered });
  } catch (error) {
    console.error('Referral application error:', error);
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}
