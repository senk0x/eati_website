import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { aggregateAnalytics } from '@/lib/site-analytics/aggregate';
import { readAnalyticsEvents } from '@/lib/site-analytics/storage';

export async function GET(request: Request) {
  const authenticated = await verifyAdminAuth();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(Number(searchParams.get('days') ?? 30), 1), 90);

  try {
    const events = await readAnalyticsEvents(days);
    const dashboard = aggregateAnalytics(events, days);
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Analytics read error:', error);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
