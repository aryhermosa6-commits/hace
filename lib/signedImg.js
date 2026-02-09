export async function signImageURL(path) {
  // Build a signed URL for an image using our API. If anything goes wrong,
  // gracefully fall back to the original path so that the image still loads
  // from the public folder. Cloudflare Workers environments sometimes fail to
  // run the signing API or return a non‑JSON response, so we always guard
  // against errors here.
  if (!path) return path;
  // Skip signing entirely for assets that live under our public directories.
  // Paths beginning with one of these prefixes are already served as static
  // assets by Next.js/Cloudflare, so calling the signing API is unnecessary
  // and can break image loading if the API fails.
  if (
    typeof path === 'string' &&
    (path.startsWith('/images/') || path.startsWith('/lookbook/') || path.startsWith('/media/') || path.startsWith('/icons/'))
  ) {
    return path;
  }
  try {
    const res = await fetch(`/api/sign?path=${encodeURIComponent(path)}`);
    if (!res || !res.ok) {
      // If the API returns a non‑200 status, skip signing and just return the path.
      return path;
    }
    // Attempt to parse JSON; if it fails it will throw and be caught below.
    const j = await res.json();
    return j && j.ok && j.url ? j.url : path;
  } catch (err) {
    // On any error (network error, JSON parse error, etc.), fall back.
    return path;
  }
}
