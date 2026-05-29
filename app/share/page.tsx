import type { Metadata } from "next";
import { buildPageMetadata, eatiAppStoreUrl } from "@/lib/seo";

type SearchParamsInput = Record<string, string | string[] | undefined>;

type SharedSummary = {
  name: string;
  startDate: string;
  endDate: string;
  startWeight: string;
  endWeight: string;
  deltaPercent: string;
  caloriesIn: string;
  caloriesOut: string;
  healthyDays: string;
  totalDays: string;
  streak: string;
  kind: string;
  image: string;
  background: string;
};

const DEFAULT_SUMMARY: SharedSummary = {
  name: "Eati User",
  startDate: "",
  endDate: "",
  startWeight: "",
  endWeight: "",
  deltaPercent: "",
  caloriesIn: "",
  caloriesOut: "",
  healthyDays: "",
  totalDays: "",
  streak: "",
  kind: "summary",
  image: "",
  background: "tier1",
};

export const metadata: Metadata = buildPageMetadata({
  title: "Shared Progress",
  description:
    "A shared Eati progress snapshot. See weekly results and continue with Eati.",
  path: "/share",
});

function pickFirst(
  value: string | string[] | undefined,
  fallback = ""
): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function normalize(params: SearchParamsInput): SharedSummary {
  const summary: SharedSummary = {
    name: pickFirst(params.n, DEFAULT_SUMMARY.name),
    startDate: pickFirst(params.sd),
    endDate: pickFirst(params.ed),
    startWeight: pickFirst(params.sw),
    endWeight: pickFirst(params.ew),
    deltaPercent: pickFirst(params.dp),
    caloriesIn: pickFirst(params.ci),
    caloriesOut: pickFirst(params.co),
    healthyDays: pickFirst(params.hd),
    totalDays: pickFirst(params.td),
    streak: pickFirst(params.st),
    kind: pickFirst(params.k, DEFAULT_SUMMARY.kind),
    image: pickFirst(params.img),
    background: pickFirst(params.bg, DEFAULT_SUMMARY.background),
  };

  return summary;
}

function renderDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "This week";
  if (startDate && endDate) return `${startDate} - ${endDate}`;
  return startDate || endDate;
}

function resolveShareImage(kind: string, imageParam: string): string {
  if (imageParam) {
    if (imageParam.startsWith("/images/")) return imageParam;
    if (imageParam.startsWith("https://") || imageParam.startsWith("http://")) {
      return imageParam;
    }
  }

  if (kind === "streak") return "/images/motivation.svg";
  if (kind === "weight") return "/images/log1.svg";
  return "/images/progress.svg";
}

function resolveBackgroundClass(background: string): string {
  if (background === "solid") return "bg-[#88B8FF]";
  if (background === "tier14") return "bg-gradient-to-b from-[#79F1CB] to-[#EDD36B]";
  if (background === "tier31") return "bg-gradient-to-b from-[#DBA1FF] to-[#94A6FF]";
  if (background === "monthly") return "bg-gradient-to-b from-[#F58D93] to-[#F0C56A]";
  return "bg-gradient-to-b from-[#F17979] to-[#EDD36B]";
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const summary = normalize(params);
  const appStoreUrl = eatiAppStoreUrl("shared_progress_page");
  const dateRange = renderDateRange(summary.startDate, summary.endDate);
  const previewImage = resolveShareImage(summary.kind, summary.image);
  const previewBackground = resolveBackgroundClass(summary.background);

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

            <div className={`relative overflow-hidden rounded-[24px] ${previewBackground} p-3 sm:p-4`}>
              <div className="relative h-[460px] w-full sm:h-[520px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Shared progress preview"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
