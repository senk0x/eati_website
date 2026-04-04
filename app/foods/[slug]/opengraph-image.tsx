import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getFoodBySlug } from "@/lib/foods";
import { OG_SIZE, ToolOpenGraphMarkup } from "@/lib/og/markup";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "nodejs";

export const size = OG_SIZE;

export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await Promise.resolve(params);
  const food = getFoodBySlug(slug);
  const alt = food
    ? `${food.name} nutrition facts — calories & macros per 100g on Eati`
    : "Food nutrition on Eati";
  return [
    {
      id: "default",
      alt,
      size: OG_SIZE,
      contentType: "image/png" as const,
    },
  ];
}

export default async function FoodOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) notFound();

  const imageAbsoluteUrl = absoluteUrl("/images/feature-scan.png");
  const title = `${food.name} — nutrition per 100g`;
  const subtitle = `${food.caloriesPer100g} kcal · ${food.proteinPer100g}g protein · ${food.carbsPer100g}g carbs · ${food.fatPer100g}g fat · Eati`;

  return new ImageResponse(
    <ToolOpenGraphMarkup title={title} subtitle={subtitle} imageAbsoluteUrl={imageAbsoluteUrl} />,
    { ...OG_SIZE }
  );
}
