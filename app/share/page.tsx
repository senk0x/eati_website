import type { Metadata } from "next";
import { buildPageMetadata, eatiAppStoreUrl } from "@/lib/seo";
import {
  type SearchParamsInput,
  buildShareQuery,
  normalizeShareSummary,
  renderDateRange,
  resolveShareGradient,
} from "@/lib/sharePreview";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}): Promise<Metadata> {
  const params = await searchParams;
  const summary = normalizeShareSummary(params);
  const query = buildShareQuery(summary);
  const ogPath = query ? `/api/og/share?${query}` : "/api/og/share";

  return buildPageMetadata({
    title: "Shared Progress",
    description:
      "A shared Eati progress snapshot. See weekly results and continue with Eati.",
    path: "/share",
    ogImagePath: ogPath,
    ogImageAlt: "Shared Eati progress preview",
  });
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const summary = normalizeShareSummary(params);
  const query = buildShareQuery(summary);
  const appStoreUrl = eatiAppStoreUrl("shared_progress_page");
  const dateRange = renderDateRange(summary.startDate, summary.endDate);
  const [bgStart, bgEnd] = resolveShareGradient(summary.background);
  const previewImage = query ? `/api/og/share?${query}` : "/api/og/share";

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <div className="pt-24 sm:pt-28 md:pt-32" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 md:px-8">
        <section className="rounded-[34px] border border-[#EAF0F7] bg-white/95 p-4 shadow-[0_22px_70px_rgba(33,51,80,0.10)] backdrop-blur-sm sm:p-6 md:p-8">
          <div className="grid items-stretch gap-6 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_430px]">
            <div className="flex flex-col justify-between rounded-[26px] border border-[#EDF1F6] bg-white p-5 sm:p-6 md:p-8">
              <div>
                <p className="inline-flex rounded-full bg-[#EEF5FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4A7DCF]">
                  Shared Progress
                </p>
                <h1 className="mt-4 text-3xl font-semibold leading-tight text-eati-ink sm:text-4xl">
                  {summary.name}
                </h1>
                <p className="mt-4 text-base font-medium text-[#6B7685] sm:text-lg">
                  {dateRange}
                </p>

                <div className="mt-7 grid gap-3 text-[#364052] sm:grid-cols-2">
                  {(summary.startWeight || summary.endWeight) && (
                    <div className="rounded-2xl bg-[#F7F9FB] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A96A6]">
                        Weight
                      </p>
                      <p className="mt-1.5 text-base font-semibold">
                        {summary.startWeight || "—"} {"\u2192"} {summary.endWeight || "—"}
                      </p>
                    </div>
                  )}
                  {summary.deltaPercent && (
                    <div className="rounded-2xl bg-[#F7F9FB] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A96A6]">
                        Progress Change
                      </p>
                      <p className="mt-1.5 text-base font-semibold">{summary.deltaPercent}%</p>
                    </div>
                  )}
                  {summary.caloriesIn && (
                    <div className="rounded-2xl bg-[#F7F9FB] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A96A6]">
                        Calories Eaten
                      </p>
                      <p className="mt-1.5 text-base font-semibold">{summary.caloriesIn}</p>
                    </div>
                  )}
                  {summary.caloriesOut && (
                    <div className="rounded-2xl bg-[#F7F9FB] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A96A6]">
                        Calories Burned
                      </p>
                      <p className="mt-1.5 text-base font-semibold">{summary.caloriesOut}</p>
                    </div>
                  )}
                  {(summary.healthyDays || summary.totalDays) && (
                    <div className="rounded-2xl bg-[#F7F9FB] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A96A6]">
                        Healthy Days
                      </p>
                      <p className="mt-1.5 text-base font-semibold">
                        {summary.healthyDays || "0"}/{summary.totalDays || "0"}
                      </p>
                    </div>
                  )}
                  {summary.streak && (
                    <div className="rounded-2xl bg-[#F7F9FB] p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A96A6]">
                        Current Streak
                      </p>
                      <p className="mt-1.5 text-base font-semibold">{summary.streak} days</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-[#E9EDF3] bg-[#F7F9FB] p-4 sm:p-5">
                <p className="text-sm font-medium text-[#6B7685]">
                  Get Eati and build your own streak with AI-assisted nutrition tracking.
                </p>
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-eati-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2B3545]"
                >
                  Download on the App Store
                </a>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[24px] p-3 sm:p-4"
              style={{
                background:
                  bgStart === bgEnd
                    ? bgStart
                    : `linear-gradient(to bottom, ${bgStart}, ${bgEnd})`,
              }}
            >
              <div className="relative h-[460px] w-full sm:h-[520px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Shared progress preview card"
                  className="h-full w-full rounded-[16px] object-cover object-left"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
