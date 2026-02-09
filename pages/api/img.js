import { hmacHex } from "../../lib/crypto";

// Signed asset gate.
// Workers runtime has no filesystem, so we validate the signature then redirect
// to the real public asset path (e.g. /images/logo.png).

export default function handler(req, res) {
  try {
    const rawPath = String(req.query.path || "");
    const exp = Number(req.query.exp || 0);
    const sig = String(req.query.sig || "");

    if (!rawPath || !rawPath.startsWith("/") || rawPath.includes("..")) {
      res.status(400).json({ error: "bad path" });
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (!exp || exp < now) {
      res.status(403).json({ error: "expired" });
      return;
    }

    const secret = process.env.IMG_SECRET || "";
    if (!secret) {
      res.status(500).json({ error: "IMG_SECRET not set" });
      return;
    }

    const expected = hmacHex(secret, `${rawPath}|${exp}`);
    if (expected !== sig) {
      res.status(403).json({ error: "bad sig" });
      return;
    }

    // Avoid caching redirects (signature is time-based)
    res.setHeader("Cache-Control", "no-store");
    res.status(302).setHeader("Location", rawPath).end();
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
}
