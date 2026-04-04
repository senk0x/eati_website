import { ImageResponse } from "next/og";
import { OG_SIZE, ToolOpenGraphMarkup } from "@/lib/og/markup";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export const runtime = "edge";

export const alt =
  "Eati nutrition blog — calorie tracking, weight loss guides, high-protein recipes, and macro tips";

export const size = OG_SIZE;

export const contentType = "image/png";

/** /blog index */
export default function BlogIndexOpenGraphImage() {
  const imageAbsoluteUrl = absoluteUrl("/images/feature-chat.png");
  return new ImageResponse(
    <ToolOpenGraphMarkup
      title="Nutrition & weight loss blog"
      subtitle={`Guides, recipes, and science-backed tips · ${SITE_URL.replace(/^https?:\/\//, "")}`}
      imageAbsoluteUrl={imageAbsoluteUrl}
    />,
    { ...OG_SIZE }
  );
}
