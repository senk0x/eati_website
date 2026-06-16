import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'eati_admin_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

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
  return Date.now() - data.t <= COOKIE_MAX_AGE * 1000;
}

export async function verifyAdminAuth(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!authCookie?.value) return false;

  return verifySignedToken(authCookie.value, adminPassword);
}
