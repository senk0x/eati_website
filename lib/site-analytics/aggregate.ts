import type {
  AnalyticsDashboard,
  AnalyticsEvent,
  DailyMetric,
  HeroAbMetrics,
  TopPageMetric,
} from './types';

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function aggregateAnalytics(events: AnalyticsEvent[], rangeDays: number): AnalyticsDashboard {
  const sessions = new Set<string>();
  const visitors = new Set<string>();
  const dailyMap = new Map<string, DailyMetric>();
  const pageTimeMap = new Map<string, number[]>();
  const heroImpressions = new Map<string, number>();
  const heroClicks = new Map<string, number>();
  const heroTimeMap = new Map<string, number[]>();
  const pageViews = new Map<string, number>();
  const eventsByType: Record<string, number> = {};
  const placementClicks = new Map<string, number>();
  const sessionTimeTotals = new Map<string, number>();

  let totalPageViews = 0;
  let totalAppStoreClicks = 0;

  for (const event of events) {
    eventsByType[event.type] = (eventsByType[event.type] ?? 0) + 1;
    sessions.add(event.sessionId);
    visitors.add(event.visitorId);

    const day = dayKey(event.ts);
    if (!dailyMap.has(day)) {
      dailyMap.set(day, {
        date: day,
        pageViews: 0,
        sessions: 0,
        appStoreClicks: 0,
        avgTimeOnSiteSeconds: 0,
      });
    }

    if (event.type === 'page_view') {
      totalPageViews += 1;
      dailyMap.get(day)!.pageViews += 1;
      pageViews.set(event.path, (pageViews.get(event.path) ?? 0) + 1);
    }

    if (event.type === 'app_store_click') {
      totalAppStoreClicks += 1;
      dailyMap.get(day)!.appStoreClicks += 1;
      const placement = String(event.props?.placement ?? 'unknown');
      placementClicks.set(placement, (placementClicks.get(placement) ?? 0) + 1);

      const heroVariant = event.props?.hero_variant;
      if (typeof heroVariant === 'string') {
        heroClicks.set(heroVariant, (heroClicks.get(heroVariant) ?? 0) + 1);
      }
    }

    if (event.type === 'time_on_site') {
      const seconds = Number(event.props?.seconds ?? 0);
      if (seconds > 0) {
        sessionTimeTotals.set(
          event.sessionId,
          (sessionTimeTotals.get(event.sessionId) ?? 0) + seconds
        );
        const times = pageTimeMap.get(event.path) ?? [];
        times.push(seconds);
        pageTimeMap.set(event.path, times);

        const heroVariant = event.props?.hero_variant;
        if (typeof heroVariant === 'string') {
          const heroTimes = heroTimeMap.get(heroVariant) ?? [];
          heroTimes.push(seconds);
          heroTimeMap.set(heroVariant, heroTimes);
        }
      }
    }

    if (event.type === 'hero_ab_impression') {
      const variant = String(event.props?.variant ?? 'unknown');
      heroImpressions.set(variant, (heroImpressions.get(variant) ?? 0) + 1);
    }
  }

  const sessionTimeValues = Array.from(sessionTimeTotals.values());
  const avgTimeOnSiteSeconds = avg(sessionTimeValues);

  for (const [day, metric] of dailyMap) {
    const daySessions = new Set(
      events.filter((e) => dayKey(e.ts) === day).map((e) => e.sessionId)
    );
    metric.sessions = daySessions.size;

    const daySessionTimes = events
      .filter((e) => e.type === 'time_on_site' && dayKey(e.ts) === day)
      .map((e) => Number(e.props?.seconds ?? 0))
      .filter((s) => s > 0);
    metric.avgTimeOnSiteSeconds = avg(daySessionTimes);
  }

  const heroVariants = new Set([...heroImpressions.keys(), ...heroClicks.keys()]);
  const heroAb: HeroAbMetrics[] = Array.from(heroVariants).map((variant) => {
    const impressions = heroImpressions.get(variant) ?? 0;
    const clicks = heroClicks.get(variant) ?? 0;
    return {
      variant,
      impressions,
      appStoreClicks: clicks,
      avgTimeOnSiteSeconds: avg(heroTimeMap.get(variant) ?? []),
      clickRate: impressions > 0 ? Math.round((clicks / impressions) * 1000) / 10 : 0,
    };
  });

  const topPages: TopPageMetric[] = Array.from(pageViews.entries())
    .map(([path, views]) => ({
      path,
      views,
      avgTimeOnSiteSeconds: avg(pageTimeMap.get(path) ?? []),
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  const topAppStorePlacements = Array.from(placementClicks.entries())
    .map(([placement, clicks]) => ({ placement, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 15);

  const daily = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    rangeDays,
    generatedAt: new Date().toISOString(),
    totals: {
      pageViews: totalPageViews,
      uniqueSessions: sessions.size,
      uniqueVisitors: visitors.size,
      appStoreClicks: totalAppStoreClicks,
      avgTimeOnSiteSeconds,
    },
    daily,
    heroAb,
    topPages,
    eventsByType,
    topAppStorePlacements,
  };
}
