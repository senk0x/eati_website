import { ImageResponse } from "next/og";
import { OG_SIZE, ToolOpenGraphMarkup } from "@/lib/og/markup";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "edge";

export const alt =
  "Eati food nutrition database — calories, protein, carbs, and fat per 100g for common foods";

export const size = OG_SIZE;

export const contentType = "image/png";

/** /foods index */
export default function FoodsIndexOpenGraphImage() {
  const imageAbsoluteUrl = absoluteUrl("/images/feature-scan.png");
  return new ImageResponse(
    <ToolOpenGraphMarkup
      title="Food calories & macros database"
      subtitle="Browse nutrition per 100g for 40+ foods — meal planning & macro tracking with Eati."
      imageAbsoluteUrl={imageAbsoluteUrl}
    />,
    { ...OG_SIZE }
  );
}
