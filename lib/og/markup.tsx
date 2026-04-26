import React from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ToolOpenGraphMarkup({
  title,
  subtitle,
  imageAbsoluteUrl,
}: {
  title: string;
  subtitle: string;
  imageAbsoluteUrl: string;
}) {
  const { width: ogW, height: ogH } = OG_SIZE;
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
      {[
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key="bg"
          src={imageAbsoluteUrl}
          alt=""
          width={ogW}
          height={ogH}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        />,
        <div
          key="overlay"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, rgba(47,81,118,0.92) 0%, rgba(26,39,68,0.88) 55%, rgba(133,190,255,0.5) 100%)",
          }}
        />,
        <div
          key="content"
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
          {[
            <div
              key="kicker"
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: 1,
              }}
            >
              {"EATI · FREE TOOL"}
            </div>,
            <div
              key="title"
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                maxWidth: 900,
              }}
            >
              {title}
            </div>,
            <div
              key="sub"
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                maxWidth: 820,
              }}
            >
              {subtitle}
            </div>,
          ]}
        </div>,
      ]}
    </div>
  );
}
