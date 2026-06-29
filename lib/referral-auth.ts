import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export const REFERRAL_COOKIE_NAME = 'eati_referral_auth';
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export interface ReferralSession {
  promoCode: string;
  issuedAt: number;
}

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function createRandomReferralPassword(length = 14): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = randomBytes(length);
  let password = '';

  for (let i = 0; i < length; i += 1) {
    password += alphabet[bytes[i] % alphabet.length];
  }

  return password;
}

export function hashReferralPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const derived = scryptSync(password, salt, 64).toString('hex');
  return {
    salt,
    hash: derived,
  };
}

export function verifyReferralPassword(password: string, salt: string, expectedHash: string): boolean {
  const actual = scryptSync(password, salt, 64).toString('hex');
  const actualBuffer = Buffer.from(actual, 'hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function getReferralAuthSecret(): string {
  const secret = process.env.REFERRAL_AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('Referral auth secret is missing. Set REFERRAL_AUTH_SECRET or ADMIN_PASSWORD.');
  }

  return secret;
}

export function signReferralSession(session: ReferralSession, secret: string): string {
  const payload = JSON.stringify({
    p: normalizePromoCode(session.promoCode),
    t: session.issuedAt,
  });
  const payloadB64 = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payloadB64}.${signature}`;
}

export function readReferralSession(token: string, secret: string): ReferralSession | null {
  const dot = token.indexOf('.');
  if (dot <= 0) {
    return null;
  }

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  let payload = '';

  try {
    payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');
  if (expectedSignature !== signature) {
    return null;
  }

  let parsed: { p?: string; t?: number } | null = null;
  try {
    parsed = JSON.parse(payload) as { p?: string; t?: number };
  } catch {
    return null;
  }

  if (!parsed?.p || typeof parsed.t !== 'number') {
    return null;
  }

  if (Date.now() - parsed.t > REFERRAL_COOKIE_MAX_AGE * 1000) {
    return null;
  }

  return {
    promoCode: normalizePromoCode(parsed.p),
    issuedAt: parsed.t,
  };
}
