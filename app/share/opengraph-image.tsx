import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/seo";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Eati shared progress preview";

type SearchParamsInput = Record<string, string | string[] | undefined>;

function pickFirst(
  value: string | string[] | undefined,
  fallback = ""
): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function ShareOpenGraphImage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const imageUrl = pickFirst(params.img);
  const name = pickFirst(params.n, "Eati User");
  const startDate = pickFirst(params.sd);
  const endDate = pickFirst(params.ed);

  const dateRange =
    startDate && endDate
      ? `${startDate} - ${endDate}`
      : startDate || endDate || "This week";

  // If we have an uploaded image URL, use it as the OG image
  if (imageUrl && (imageUrl.startsWith("https://") || imageUrl.startsWith("http://"))) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #F17979 0%, #EDD36B 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ),
      { ...size }
    );
  }

  // Fallback: Generate a styled OG image with text
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #F17979 0%, #EDD36B 100%)",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.25)",
              fontSize: 24,
              fontWeight: 700,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Shared Progress
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              textShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {dateRange}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 700,
              color: "white",
            }}
          >
            Eati
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            · {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
