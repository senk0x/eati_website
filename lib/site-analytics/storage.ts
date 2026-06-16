import fs from 'fs';
import path from 'path';
import type { AnalyticsEvent } from './types';

const BLOB_PREFIX = 'analytics/events/';
const LOCAL_EVENTS_DIR = path.join(process.cwd(), 'content', 'analytics', 'events');

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function localPathForDay(day: string): string {
  return path.join(LOCAL_EVENTS_DIR, `${day}.jsonl`);
}

function ensureLocalDir(): void {
  if (!fs.existsSync(LOCAL_EVENTS_DIR)) {
    fs.mkdirSync(LOCAL_EVENTS_DIR, { recursive: true });
  }
}

async function readBlobDay(day: string): Promise<string> {
  try {
    const { list } = await import('@vercel/blob');
    const key = `${BLOB_PREFIX}${day}.jsonl`;
    const { blobs } = await list({ prefix: key });
    if (!blobs.length) return '';
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return res.ok ? await res.text() : '';
  } catch {
    return '';
  }
}

async function writeBlobDay(day: string, content: string): Promise<void> {
  const { put } = await import('@vercel/blob');
  await put(`${BLOB_PREFIX}${day}.jsonl`, content, {
    access: 'public',
    contentType: 'text/plain',
    addRandomSuffix: false,
  });
}

async function appendLocalDay(day: string, lines: string): Promise<void> {
  ensureLocalDir();
  fs.appendFileSync(localPathForDay(day), lines, 'utf8');
}

async function appendBlobDay(day: string, lines: string): Promise<void> {
  const existing = await readBlobDay(day);
  await writeBlobDay(day, existing + lines);
}

export async function appendAnalyticsEvents(events: AnalyticsEvent[]): Promise<void> {
  if (!events.length) return;

  const byDay = new Map<string, AnalyticsEvent[]>();
  for (const event of events) {
    const day = dayKey(event.ts);
    const bucket = byDay.get(day) ?? [];
    bucket.push(event);
    byDay.set(day, bucket);
  }

  for (const [day, dayEvents] of byDay) {
    const lines = dayEvents.map((e) => JSON.stringify(e)).join('\n') + '\n';

    if (blobConfigured()) {
      await appendBlobDay(day, lines);
    } else if (process.env.VERCEL) {
      console.warn('Analytics: BLOB_READ_WRITE_TOKEN not set; events dropped on Vercel.');
    } else {
      await appendLocalDay(day, lines);
    }
  }
}

function listLocalDays(): string[] {
  ensureLocalDir();
  return fs
    .readdirSync(LOCAL_EVENTS_DIR)
    .filter((f) => f.endsWith('.jsonl'))
    .map((f) => f.replace('.jsonl', ''))
    .sort();
}

async function listBlobDays(): Promise<string[]> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    return blobs
      .map((b) => b.pathname?.replace(BLOB_PREFIX, '').replace('.jsonl', '') ?? '')
      .filter(Boolean)
      .sort();
  } catch {
    return [];
  }
}

async function readDayEvents(day: string): Promise<AnalyticsEvent[]> {
  let raw = '';
  if (blobConfigured()) {
    raw = await readBlobDay(day);
  } else {
    const filePath = localPathForDay(day);
    if (fs.existsSync(filePath)) {
      raw = fs.readFileSync(filePath, 'utf8');
    }
  }

  if (!raw.trim()) return [];

  return raw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as AnalyticsEvent;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as AnalyticsEvent[];
}

export async function readAnalyticsEvents(days: number): Promise<AnalyticsEvent[]> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - days + 1);
  const cutoffKey = cutoff.toISOString().slice(0, 10);

  const dayKeys = blobConfigured() ? await listBlobDays() : listLocalDays();
  const relevantDays = dayKeys.filter((d) => d >= cutoffKey);

  const chunks = await Promise.all(relevantDays.map(readDayEvents));
  return chunks.flat().sort((a, b) => a.ts - b.ts);
}
