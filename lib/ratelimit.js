const mem = new Map();
export function rateLimit(key, max=60, windowMs=60_000){
  const now = Date.now();
  const bucket = mem.get(key) || { c:0, t: now };
  if(now - bucket.t > windowMs){ bucket.c = 0; bucket.t = now; }
  bucket.c += 1; mem.set(key, bucket);
  return { ok: bucket.c <= max, remaining: Math.max(0, max - bucket.c) };
}
export function ipKey(req, extra=""){
  const xf = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(xf) ? xf[0] : xf)?.split(",")[0]?.trim()
    || req.socket?.remoteAddress || "unknown";
  return `${ip}:${extra}`;
}
