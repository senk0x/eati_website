import React from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export function HomeOpenGraphMarkup({ heroAbsoluteUrl }: { heroAbsoluteUrl: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: "linear-gradient(135deg, #85BEFF 0%, #4A90E8 45%, #2F5176 100%)",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 40px 48px 56px",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          Eati
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "rgba(255,255,255,0.96)",
            lineHeight: 1.2,
            maxWidth: 560,
          }}
        >
          AI calorie tracker — log meals in seconds
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.88)", maxWidth: 520, lineHeight: 1.35 }}>
          Text, photo, barcode, or voice. Free calculators on the web — track on iOS.
        </div>
      </div>
      <div
        style={{
          width: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 48px 32px 0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og ImageResponse remote img */}
        <img
          src={heroAbsoluteUrl}
          alt=""
          width={400}
          height={600}
          style={{
            height: "auto",
            width: "100%",
            maxWidth: 420,
            maxHeight: 560,
            objectFit: "contain",
            filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.25))",
          }}
        />
      </div>
    </div>
  );
}

export function ToolOpenGraphMarkup({
  title,
  subtitle,
  imageAbsoluteUrl,
}: {
  title: string;
  subtitle: string;
  imageAbsoluteUrl: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#1a2744",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageAbsoluteUrl}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(47,81,118,0.92) 0%, rgba(26,39,68,0.88) 55%, rgba(133,190,255,0.5) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 56,
          gap: 16,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 1 }}>
          EATI · FREE TOOL
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: "white", lineHeight: 1.1, maxWidth: 900 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.9)", maxWidth: 820 }}>{subtitle}</div>
      </div>
    </div>
  );
}
