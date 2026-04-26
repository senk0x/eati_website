import sharp from "sharp";

/**
 * Fetches an image and re-encodes as PNG for `next/og` (Satori), which does not
 * support WebP (and may mis-detect type when the URL extension disagrees with
 * the response body).
 */
export async function encodeImageForOgDataUrl(
  imageUrl: string
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const png = await sharp(buf).rotate().png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}
