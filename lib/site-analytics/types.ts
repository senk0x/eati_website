export type AnalyticsEventType =
  | 'page_view'
  | 'session_start'
  | 'time_on_site'
  | 'app_store_click'
  | 'hero_ab_assigned'
  | 'hero_ab_impression'
  | 'scroll_depth'
  | 'outbound_click';

export interface AnalyticsEvent {
  id: string;
  ts: number;
  type: AnalyticsEventType;
  sessionId: string;
  visitorId: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  props?: Record<string, string | number | boolean>;
}

export interface AnalyticsIngestPayload {
  events: AnalyticsEvent[];
}

export interface DailyMetric {
  date: string;
  pageViews: number;
  sessions: number;
  appStoreClicks: number;
  avgTimeOnSiteSeconds: number;
}

export interface HeroAbMetrics {
  variant: string;
  impressions: number;
  appStoreClicks: number;
  avgTimeOnSiteSeconds: number;
  clickRate: number;
}

export interface TopPageMetric {
  path: string;
  views: number;
  avgTimeOnSiteSeconds: number;
}

export interface AnalyticsDashboard {
  rangeDays: number;
  generatedAt: string;
  totals: {
    pageViews: number;
    uniqueSessions: number;
    uniqueVisitors: number;
    appStoreClicks: number;
    avgTimeOnSiteSeconds: number;
  };
  daily: DailyMetric[];
  heroAb: HeroAbMetrics[];
  topPages: TopPageMetric[];
  eventsByType: Record<string, number>;
  topAppStorePlacements: { placement: string; clicks: number }[];
}
