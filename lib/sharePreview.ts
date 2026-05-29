export type SearchParamsInput = Record<string, string | string[] | undefined>;

export type SharedSummary = {
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

function pickFirst(value: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export function normalizeShareSummary(params: SearchParamsInput): SharedSummary {
  return {
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
}

export function readSearchParamsFromUrl(url: URL): SearchParamsInput {
  const result: SearchParamsInput = {};
  for (const key of url.searchParams.keys()) {
    const values = url.searchParams.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  return result;
}

export function buildShareQuery(summary: SharedSummary): string {
  const params = new URLSearchParams();
  if (summary.name) params.set("n", summary.name);
  if (summary.startDate) params.set("sd", summary.startDate);
  if (summary.endDate) params.set("ed", summary.endDate);
  if (summary.startWeight) params.set("sw", summary.startWeight);
  if (summary.endWeight) params.set("ew", summary.endWeight);
  if (summary.deltaPercent) params.set("dp", summary.deltaPercent);
  if (summary.caloriesIn) params.set("ci", summary.caloriesIn);
  if (summary.caloriesOut) params.set("co", summary.caloriesOut);
  if (summary.healthyDays) params.set("hd", summary.healthyDays);
  if (summary.totalDays) params.set("td", summary.totalDays);
  if (summary.streak) params.set("st", summary.streak);
  if (summary.kind) params.set("k", summary.kind);
  if (summary.image) params.set("img", summary.image);
  if (summary.background) params.set("bg", summary.background);
  return params.toString();
}

export function renderDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "This week";
  if (startDate && endDate) return `${startDate} - ${endDate}`;
  return startDate || endDate;
}

export function resolveShareImage(kind: string, imageParam: string): string {
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

export function resolveShareGradient(background: string): [string, string] {
  if (background === "solid") return ["#88B8FF", "#88B8FF"];
  if (background === "tier14") return ["#79F1CB", "#EDD36B"];
  if (background === "tier31") return ["#DBA1FF", "#94A6FF"];
  if (background === "monthly") return ["#F58D93", "#F0C56A"];
  return ["#F17979", "#EDD36B"];
}
