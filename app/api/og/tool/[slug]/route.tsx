import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { OG_SIZE, ToolOpenGraphMarkup } from "@/lib/og/markup";
import {
  isToolOgSlug,
  TOOL_OG_TITLE,
  TOOL_OG_VISUAL,
  toolOgAlt,
} from "@/lib/og";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "edge";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  if (!isToolOgSlug(slug)) return new NextResponse(null, { status: 404 });

  const title = TOOL_OG_TITLE[slug];
  const subtitle = "Plan nutrition & fat loss with Eati — free calculator, no signup.";
  const imageAbsoluteUrl = absoluteUrl(TOOL_OG_VISUAL[slug]);

  return new ImageResponse(
    <ToolOpenGraphMarkup title={title} subtitle={subtitle} imageAbsoluteUrl={imageAbsoluteUrl} />,
    {
      ...OG_SIZE,
    }
  );
}
