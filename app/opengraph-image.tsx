import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Eati — AI calorie tracker app: log meals, track macros, and plan nutrition";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #85BEFF 0%, #4A90E8 55%, #2F5176 100%)",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "white",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Eati
        </div>
        <div
          style={{
            fontSize: 38,
            color: "rgba(255,255,255,0.95)",
            marginTop: 28,
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.25,
            fontWeight: 600,
          }}
        >
          AI calorie tracker &amp; meal planner — text, photo, barcode, or voice
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.85)",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Fat loss, macro tracking, and free nutrition calculators
        </div>
      </div>
    ),
    { ...size }
  );
}
