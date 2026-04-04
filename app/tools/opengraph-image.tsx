import { ImageResponse } from "next/og";
import { OG_SIZE, ToolOpenGraphMarkup } from "@/lib/og/markup";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "edge";

export const alt =
  "Eati free fitness calculators — TDEE, macros, BMI, body fat, calories, and more";

export const size = OG_SIZE;

export const contentType = "image/png";

/** /tools index — calculators hub preview. */
export default function ToolsOpenGraphImage() {
  const imageAbsoluteUrl = absoluteUrl("/images/feature-history.png");
  return new ImageResponse(
    <ToolOpenGraphMarkup
      title="Free fitness & weight loss calculators"
      subtitle="Calorie goals, TDEE, macros, protein, BMI, body fat, water intake, and more — all free."
      imageAbsoluteUrl={imageAbsoluteUrl}
    />,
    { ...OG_SIZE }
  );
}
