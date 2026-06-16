'use client';

import type { AnalyticsEvent, AnalyticsEventType } from './types';

const VISITOR_KEY = 'eati_vid';
const SESSION_KEY = 'eati_sid';
const SESSION_TS_KEY = 'eati_sid_ts';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const FLUSH_INTERVAL_MS = 8000;
const HEARTBEAT_INTERVAL_MS = 30000;
const MAX_BATCH = 20;
const MAX_QUEUE = 100;

let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let scrollListenerAttached = false;
let initialized = false;
let heroVariant: string | undefined;
let pageVisibleSince = Date.now();
let accumulatedVisibleMs = 0;

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = randomId();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    const ts = Number(sessionStorage.getItem(SESSION_TS_KEY) ?? 0);
    if (existing && Date.now() - ts < SESSION_TIMEOUT_MS) {
      sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
      return existing;
    }
    const id = randomId();
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
    return id;
  } catch {
    return randomId();
  }
}

function buildEvent(
  type: AnalyticsEventType,
  props?: Record<string, string | number | boolean>,
  pathOverride?: string
): AnalyticsEvent {
  const baseProps = { ...props };
  if (heroVariant && !baseProps.hero_variant) {
    baseProps.hero_variant = heroVariant;
  }

  return {
    id: randomId(),
    ts: Date.now(),
    type,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    path: pathOverride ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    referrer: typeof document !== 'undefined' ? document.referrer.slice(0, 200) : undefined,
    props: Object.keys(baseProps).length ? baseProps : undefined,
  };
}

function enqueue(event: AnalyticsEvent): void {
  if (queue.length >= MAX_QUEUE) {
    queue.shift();
  }
  queue.push(event);
  scheduleFlush();
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushQueue(false);
  }, FLUSH_INTERVAL_MS);
}

async function flushQueue(useBeacon: boolean): Promise<void> {
  if (!queue.length) return;

  const batch = queue.splice(0, MAX_BATCH);
  const body = JSON.stringify({ events: batch });

  if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics', blob);
    return;
  }

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    queue.unshift(...batch);
  }
}

function recordVisibleTime(): void {
  if (document.visibilityState === 'visible') {
    pageVisibleSince = Date.now();
    return;
  }

  accumulatedVisibleMs += Date.now() - pageVisibleSince;
}

function sendTimeHeartbeat(): void {
  if (document.visibilityState !== 'visible') return;

  const elapsedSec = Math.round((accumulatedVisibleMs + (Date.now() - pageVisibleSince)) / 1000);
  if (elapsedSec < 5) return;

  enqueue(buildEvent('time_on_site', { seconds: elapsedSec }));
  accumulatedVisibleMs = 0;
  pageVisibleSince = Date.now();
}

export function setAnalyticsHeroVariant(variant: string): void {
  heroVariant = variant;
}

export function trackAnalyticsEvent(
  type: AnalyticsEventType,
  props?: Record<string, string | number | boolean>
): void {
  enqueue(buildEvent(type, props));
}

export function trackAppStoreClick(placement: string, extra?: Record<string, string | number | boolean>): void {
  trackAnalyticsEvent('app_store_click', { placement, ...extra });
}

export function initSiteAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  if (window.location.pathname.startsWith('/admin')) return;

  initialized = true;

  enqueue(buildEvent('session_start'));

  const onVisibility = () => {
    recordVisibleTime();
    if (document.visibilityState === 'hidden') {
      sendTimeHeartbeat();
      void flushQueue(true);
    }
  };

  const onPageHide = () => {
    sendTimeHeartbeat();
    void flushQueue(true);
  };

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);

  heartbeatTimer = setInterval(sendTimeHeartbeat, HEARTBEAT_INTERVAL_MS);

  if (!scrollListenerAttached) {
    scrollListenerAttached = true;
    const sentDepths = new Set<number>();
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        const pct = Math.round((scrollTop / maxScroll) * 100);
        for (const milestone of [25, 50, 75, 100]) {
          if (pct >= milestone && !sentDepths.has(milestone)) {
            sentDepths.add(milestone);
            trackAnalyticsEvent('scroll_depth', { depth: milestone });
          }
        }
      }, 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  document.addEventListener(
    'click',
    (e) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-eati-app-store]');
      if (!target) return;
      const placement = target.getAttribute('data-eati-app-store') ?? 'unknown';
      trackAppStoreClick(placement);
    },
    { capture: true }
  );
}

export function trackPageView(path: string): void {
  enqueue(buildEvent('page_view', undefined, path));
}

export function trackScrollDepth(depth: number): void {
  trackAnalyticsEvent('scroll_depth', { depth });
}
