import type sharp from "sharp";

type SharpFn = typeof sharp;

/**
 * Fetches an image and re-encodes for `next/og` (Satori), which does not support
 * WebP for remote `<img>`. Uses `sharp` lazily so a failed native load still allows
 * the route to render without a cover image.
 */
export async function encodeImageForOgDataUrl(
  imageUrl: string
): Promise<string | null> {
  let sharpFn: SharpFn;
  try {
    const mod = await import("sharp");
    sharpFn = ((mod as { default?: SharpFn }).default ?? mod) as SharpFn;
    if (typeof sharpFn !== "function") return null;
  } catch {
    return null;
  }

  try {
    const res = await fetch(imageUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await sharpFn(buf)
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    return `data:image/jpeg;base64,${out.toString("base64")}`;
  } catch {
    return null;
  }
}
