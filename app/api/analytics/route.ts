import { NextResponse } from 'next/server';
import type { AnalyticsEvent, AnalyticsIngestPayload } from '@/lib/site-analytics/types';
import { appendAnalyticsEvents } from '@/lib/site-analytics/storage';

const MAX_EVENTS_PER_REQUEST = 25;
const MAX_BODY_BYTES = 32_768;

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 120;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function sanitizeEvent(raw: unknown): AnalyticsEvent | null {
  if (!raw || typeof raw !== 'object') return null;
  const e = raw as Record<string, unknown>;
  if (typeof e.id !== 'string' || typeof e.ts !== 'number' || typeof e.type !== 'string') {
    return null;
  }
  if (typeof e.sessionId !== 'string' || typeof e.visitorId !== 'string') return null;
  if (typeof e.path !== 'string') return null;

  const props: Record<string, string | number | boolean> = {};
  if (e.props && typeof e.props === 'object') {
    for (const [key, value] of Object.entries(e.props as Record<string, unknown>)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        props[key] = value;
      }
    }
  }

  return {
    id: e.id.slice(0, 64),
    ts: Math.min(Math.max(e.ts, Date.now() - 86_400_000), Date.now() + 60_000),
    type: e.type as AnalyticsEvent['type'],
    sessionId: e.sessionId.slice(0, 64),
    visitorId: e.visitorId.slice(0, 64),
    path: e.path.slice(0, 256),
    referrer: typeof e.referrer === 'string' ? e.referrer.slice(0, 256) : undefined,
    props: Object.keys(props).length ? props : undefined,
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: true, dropped: true }, { status: 202 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let payload: AnalyticsIngestPayload;
  try {
    payload = (await request.json()) as AnalyticsIngestPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!Array.isArray(payload.events) || !payload.events.length) {
    return NextResponse.json({ ok: true, ingested: 0 });
  }

  const events = payload.events
    .slice(0, MAX_EVENTS_PER_REQUEST)
    .map(sanitizeEvent)
    .filter(Boolean) as AnalyticsEvent[];

  if (!events.length) {
    return NextResponse.json({ ok: true, ingested: 0 });
  }

  try {
    await appendAnalyticsEvents(events);
    return NextResponse.json({ ok: true, ingested: events.length });
  } catch (error) {
    console.error('Analytics ingest error:', error);
    return NextResponse.json({ error: 'Failed to store events' }, { status: 500 });
  }
}
