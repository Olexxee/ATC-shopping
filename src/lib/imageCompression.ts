// src/lib/imageCompression.ts
import imageCompression from "browser-image-compression";

/**
 * Shared image compression options.
 *
 * - `maxSizeMB: 0.5`  — target ~500 KB. Storefronts rarely need more.
 * - `maxWidthOrHeight: 1600` — 1600px is enough for a full-bleed hero at
 *   2x on most screens; larger originals are wasted bytes.
 * - `useWebWorker: true` — runs off the main thread so the admin UI
 *   doesn't freeze during a multi-file upload.
 * - `fileType: "image/jpeg"` — normalises everything to JPEG. Matches what
 *   Cloudinary already stores and sidesteps HEIC/WebP compat issues.
 * - `initialQuality: 0.82` — starting point before the size cap. Above
 *   this, artifacts are visible on product photography.
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/jpeg",
  initialQuality: 0.82,
} as const;

/**
 * Formats we deliberately skip.
 *   - GIF: compression destroys the animation.
 *   - SVG: vector; re-encoding it as JPEG is nonsense.
 * Anything that isn't an image is also skipped, defensively.
 */
const SKIP_TYPES = new Set(["image/gif", "image/svg+xml"]);

export const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/") || SKIP_TYPES.has(file.type)) {
    return file;
  }

  try {
    return await imageCompression(file, COMPRESSION_OPTIONS);
  } catch (err) {
    // Fail open — an oversized image is better than a failed upload.
    console.warn(
      `[imageCompression] compression failed for "${file.name}", using original`,
      err,
    );
    return file;
  }
};

export const compressImages = (files: File[]): Promise<File[]> =>
  Promise.all(files.map(compressImage));
