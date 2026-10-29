/**
 * Real, freely-licensed placeholder photography via Picsum Photos
 * (picsum.photos), a service built from Unsplash-contributed images
 * explicitly made available for use like this. Images are seeded so the
 * same slot always shows the same photo across reloads.
 *
 * IMPORTANT: these are generic stock photos, not pictures of actual MEUN
 * professionals — Picsum has no keyword search, so a "maid" seed does not
 * guarantee a photo of someone cleaning. Replace with real/licensed
 * photography of your own professionals before launch.
 */
export function stockPhoto(seed: string, width = 800, height = 1000): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}
