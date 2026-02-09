import { hmacHex } from "../../lib/crypto";

/**
 * Image proxy endpoint. Rather than reading files from disk (which is not
 * possible in a Cloudflare Worker), this API simply validates the HMAC
 * signature and expiration timestamp and then issues a 307 redirect to the
 * underlying static asset in the public folder. Cloudflare/Next.js will serve
 * the asset from the `public` directory. If the signature or expiry is
 * invalid, a 403 response is returned. Only images under `/images`,
 * `/lookbook`, `/media` and `/icons` are allowed.
 */
export default function handler(req, res) {
  const pth = String(req.query.path || "");
  const exp = Number(req.query.exp || 0);
  const sig = String(req.query.sig || "");
  // Reject if path doesn't start with `/`
  if (!pth.startsWith("/")) return res.status(400).send("bad path");
  // Expired token
  if (!exp || exp < Math.floor(Date.now() / 1000)) {
    return res.status(403).send("expired");
  }
  const secret = process.env.IMG_SECRET || "img-secret-change-me";
  const base = `${pth}|${exp}`;
  const expect = hmacHex(secret, base);
  if (expect !== sig) return res.status(403).send("bad sig");
  // Only allow certain directories to prevent path traversal
  if (
    !(pth.startsWith("/images/") ||
      pth.startsWith("/lookbook/") ||
      pth.startsWith("/media/") ||
      pth.startsWith("/icons/"))
  ) {
    return res.status(403).send("forbidden");
  }
  // Redirect to static asset. Use 307 to preserve method and indicate temporary
  // redirect. The client will fetch the asset from the public directory.
  res.setHeader("Cache-Control", "private, max-age=600");
  res.writeHead(307, { Location: pth });
  res.end();
}