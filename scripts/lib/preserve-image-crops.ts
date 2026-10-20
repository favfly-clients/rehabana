// === NOTE: === Prismic can store a zoomed crop as `edit.zoom: 1` while the
// image URL carries the real crop (`rect=`). The Migration API rebuilds the
// crop from `edit`, so such an image comes back wider than it was. These
// helpers set `edit.zoom` from the URL's rect so the crop survives a write.

type Json = Record<string, unknown>;
interface Size { width: number; height: number }

const originSizes = new Map<string, Promise<Size>>();

// imgix (images.prismic.io) answers `fm=json` with the original pixel size.
const fetchOriginSize = (url: string): Promise<Size> => {
  const base = url.split("?")[0];
  if (!originSizes.has(base)) {
    originSizes.set(base, (async () => {
      const response = await fetch(`${base}?fm=json`);
      if (!response.ok) throw new Error(`No size for ${base} (${response.status})`);
      const meta = await response.json();
      return { width: meta.PixelWidth, height: meta.PixelHeight };
    })());
  }
  return originSizes.get(base) as Promise<Size>;
};

const readRect = (url: string): number[] | null => {
  const rect = new URL(url).searchParams.get("rect");
  return rect ? rect.split(",").map(Number) : null;
};

const isCroppedImage = (value: Json): boolean =>
  typeof value.url === "string" &&
  value.url.startsWith("https://images.prismic.io/") &&
  Boolean(value.edit && value.dimensions) &&
  Boolean(readRect(value.url));

// Zoom 1 is the largest rect with the output's aspect ratio that fits the
// original; the real zoom is how much smaller the stored rect is than that.
const withRealZoom = async (image: Json): Promise<Json> => {
  const [x, y, rectWidth] = readRect(image.url as string) as number[];
  const origin = await fetchOriginSize(image.url as string);
  const { width, height } = image.dimensions as Size;
  const widestAtZoomOne = Math.min(origin.width, (origin.height * width) / height);
  const zoom = widestAtZoomOne / rectWidth;
  return { ...image, edit: { ...(image.edit as Json), x, y, zoom } };
};

/**
 * Returns a copy of Prismic document data where every cropped image's
 * `edit.zoom` matches the crop in its URL, so a Migration API write keeps it.
 * @param value - Document data (or any part of it) in Content API shape.
 * @returns The same data with corrected `edit` on cropped images.
 */
export const preserveImageCrops = async (value: unknown): Promise<unknown> => {
  if (Array.isArray(value)) return Promise.all(value.map(preserveImageCrops));
  if (!value || typeof value !== "object") return value;
  const record = value as Json;
  const entries = await Promise.all(
    Object.entries(record).map(async ([key, item]) => [key, await preserveImageCrops(item)]),
  );
  const copy = Object.fromEntries(entries);
  return isCroppedImage(copy) ? withRealZoom(copy) : copy;
};
