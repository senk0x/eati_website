import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/** Node: blog articles are read from disk via `getArticleBySlug`. */
export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

function truncateTitle(title: string, max = 72): string {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1)}…`;
}

export default async function BlogOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  const title = truncateTitle(article.title);
  const cover = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : absoluteUrl(article.coverImage)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: "#1a2744",
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={article.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: cover
              ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, transparent 72%)"
              : "linear-gradient(145deg, #85BEFF 0%, #2F5176 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 48,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              textShadow: "0 2px 24px rgba(0,0,0,0.45)",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.9)",
              fontWeight: 600,
            }}
          >
            Eati Blog · {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
