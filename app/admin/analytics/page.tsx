'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminNav from '@/components/AdminNav';
import type { AnalyticsDashboard } from '@/lib/site-analytics/types';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-eati-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}

function BarChart({ daily }: { daily: AnalyticsDashboard['daily'] }) {
  const maxViews = Math.max(...daily.map((d) => d.pageViews), 1);

  return (
    <div className="space-y-2">
      {daily.slice(-14).map((day) => (
        <div key={day.date} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 text-gray-500">{day.date.slice(5)}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#88B8FF]"
              style={{ width: `${Math.max((day.pageViews / maxViews) * 100, day.pageViews ? 4 : 0)}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right font-medium text-eati-ink">{day.pageViews}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      if (!res.ok) throw new Error('Failed to load analytics');
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <AdminNav />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-eati-ink">Site Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              First-party metrics: page views, time on site, App Store clicks, and hero A/B tests.
            </p>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#88B8FF]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : data ? (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Page views" value={data.totals.pageViews.toLocaleString()} />
              <StatCard label="Sessions" value={data.totals.uniqueSessions.toLocaleString()} />
              <StatCard
                label="Avg. time on site"
                value={formatDuration(data.totals.avgTimeOnSiteSeconds)}
              />
              <StatCard
                label="App Store clicks"
                value={data.totals.appStoreClicks.toLocaleString()}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-eati-ink">Daily page views</h2>
                {data.daily.length ? (
                  <BarChart daily={data.daily} />
                ) : (
                  <p className="text-sm text-gray-500">No data yet.</p>
                )}
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-eati-ink">Hero A/B test</h2>
                {data.heroAb.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500">
                          <th className="pb-2 pr-4 font-medium">Variant</th>
                          <th className="pb-2 pr-4 font-medium">Impressions</th>
                          <th className="pb-2 pr-4 font-medium">Clicks</th>
                          <th className="pb-2 pr-4 font-medium">CTR</th>
                          <th className="pb-2 font-medium">Avg. time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.heroAb.map((row) => (
                          <tr key={row.variant} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 pr-4 font-medium capitalize">{row.variant}</td>
                            <td className="py-2.5 pr-4">{row.impressions}</td>
                            <td className="py-2.5 pr-4">{row.appStoreClicks}</td>
                            <td className="py-2.5 pr-4">{row.clickRate}%</td>
                            <td className="py-2.5">{formatDuration(row.avgTimeOnSiteSeconds)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-3 text-xs text-gray-400">
                      <strong>interactive</strong> = chat input hero · <strong>visual</strong> = phone + Download CTA
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No A/B data yet.</p>
                )}
              </section>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-eati-ink">Top pages</h2>
                {data.topPages.length ? (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500">
                        <th className="pb-2 pr-4 font-medium">Path</th>
                        <th className="pb-2 pr-4 font-medium">Views</th>
                        <th className="pb-2 font-medium">Avg. time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPages.map((row) => (
                        <tr key={row.path} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{row.path}</td>
                          <td className="py-2 pr-4">{row.views}</td>
                          <td className="py-2">{formatDuration(row.avgTimeOnSiteSeconds)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No page data yet.</p>
                )}
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-eati-ink">App Store click sources</h2>
                {data.topAppStorePlacements.length ? (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500">
                        <th className="pb-2 pr-4 font-medium">Placement</th>
                        <th className="pb-2 font-medium">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topAppStorePlacements.map((row) => (
                        <tr key={row.placement} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{row.placement}</td>
                          <td className="py-2">{row.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No click data yet.</p>
                )}
              </section>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold text-eati-ink">Events by type</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.eventsByType).map(([type, count]) => (
                  <span
                    key={type}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Updated {new Date(data.generatedAt).toLocaleString()}
              </p>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
