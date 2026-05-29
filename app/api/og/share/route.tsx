import { ImageResponse } from "next/og";
import { absoluteUrl } from "@/lib/seo";
import {
  normalizeShareSummary,
  readSearchParamsFromUrl,
  renderDateRange,
  resolveShareGradient,
  resolveShareImage,
} from "@/lib/sharePreview";

export const runtime = "edge";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const summary = normalizeShareSummary(readSearchParamsFromUrl(url));
  const [bgStart, bgEnd] = resolveShareGradient(summary.background);
  const dateRange = renderDateRange(summary.startDate, summary.endDate);
  const previewImage = absoluteUrl(resolveShareImage(summary.kind, summary.image));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F7F9FB",
          padding: 28,
          color: "#364052",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            borderRadius: 28,
            background: "white",
            border: "1px solid #EAF0F7",
            boxShadow: "0 20px 65px rgba(33, 51, 80, 0.12)",
            padding: 20,
            gap: 18,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRadius: 22,
              border: "1px solid #EDF1F6",
              background: "white",
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                borderRadius: 999,
                background: "#EEF5FF",
                color: "#4A7DCF",
                padding: "7px 12px",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Shared Progress
            </div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 48, fontWeight: 800 }}>
              {summary.name}
            </div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 26, color: "#6B7685", fontWeight: 600 }}>
              {dateRange}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {(summary.startWeight || summary.endWeight) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    borderRadius: 14,
                    background: "#F7F9FB",
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", fontSize: 12, letterSpacing: 1, color: "#8A96A6", fontWeight: 700 }}>
                    WEIGHT
                  </div>
                  <div style={{ display: "flex", marginTop: 6, fontSize: 22, fontWeight: 700 }}>
                    {summary.startWeight || "—"} → {summary.endWeight || "—"}
                  </div>
                </div>
              )}
              {summary.deltaPercent && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    borderRadius: 14,
                    background: "#F7F9FB",
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", fontSize: 12, letterSpacing: 1, color: "#8A96A6", fontWeight: 700 }}>
                    PROGRESS CHANGE
                  </div>
                  <div style={{ display: "flex", marginTop: 6, fontSize: 22, fontWeight: 700 }}>
                    {summary.deltaPercent}%
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              width: 390,
              borderRadius: 22,
              padding: 12,
              display: "flex",
              background: `linear-gradient(180deg, ${bgStart} 0%, ${bgEnd} 100%)`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 18,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt=""
                width={340}
                height={560}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}
