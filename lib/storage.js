// Unified storage helpers that work in both:
// - Next.js build-time / server (Node)
// - Browser (client)
// - Cloudflare Workers (no Node fs)
//
// IMPORTANT: Do NOT use static imports for Node builtins (fs/path).
// If a client bundle accidentally imports this file, static imports would
// break the build. We gate Node-only requires behind a runtime check.

const isBrowser = () => typeof window !== "undefined";

function nodeRequire(mod) {
  if (isBrowser()) return null;
  try {
    // Avoid bundlers from trying to resolve Node builtins
    // eslint-disable-next-line no-eval
    return eval("require")(mod);
  } catch {
    return null;
  }
}

// Node-only deps (null on browser / workers)
const fs = nodeRequire("fs");
const path = nodeRequire("path");

function dataPath(file) {
  if (!path) return null;
  return path.join(process.cwd(), "data", file);
}

function safeReadJson(file, fallback) {
  try {
    if (!fs) return fallback;
    const p = dataPath(file);
    if (!p) return fallback;
    if (!fs.existsSync(p)) return fallback;
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWriteJson(file, value) {
  try {
    if (!fs) return false;
    const p = dataPath(file);
    if (!p) return false;
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(value, null, 2));
    return true;
  } catch {
    return false;
  }
}

// ----------------------
// Products (read-only)
// ----------------------

export function getProducts() {
  // Prefer static import elsewhere; fallback to reading bundled JSON on server.
  return safeReadJson("products.json", []);
}

// ----------------------
// Emails / analytics (best-effort)
// ----------------------

export function saveEmail(email) {
  const emails = safeReadJson("emails.json", []);
  emails.push({ email, ts: Date.now() });
  safeWriteJson("emails.json", emails);
}

export function logClick(payload) {
  const clicks = safeReadJson("clicks.json", []);
  clicks.push({ ...payload, ts: Date.now() });
  safeWriteJson("clicks.json", clicks);
}

export function logHeat(payload) {
  const heat = safeReadJson("heat.json", []);
  heat.push({ ...payload, ts: Date.now() });
  safeWriteJson("heat.json", heat);
}

// ----------------------
// Wishlist (client-only, localStorage)
// ----------------------

const WISHLIST_KEY = "hc:wishlist";

export function getWishlist() {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setWishlist(list) {
  if (!isBrowser()) return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.isArray(list) ? list : []));
}

export function addToWishlist(item) {
  if (!isBrowser()) return getWishlist();
  const list = getWishlist();
  const key = item?.slug ?? item?.id;
  if (!key) return list;
  const exists = list.some((x) => (x?.slug ?? x?.id) === key);
  if (!exists) list.push(item);
  setWishlist(list);
  return list;
}

export function removeFromWishlist(slugOrId) {
  if (!isBrowser()) return getWishlist();
  const list = getWishlist().filter((x) => (x?.slug ?? x?.id) !== slugOrId);
  setWishlist(list);
  return list;
}

export function toggleWishlist(item) {
  if (!isBrowser()) return { list: getWishlist(), added: false };
  const key = item?.slug ?? item?.id;
  if (!key) return { list: getWishlist(), added: false };
  const list = getWishlist();
  const idx = list.findIndex((x) => (x?.slug ?? x?.id) === key);
  let added = false;
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(item);
    added = true;
  }
  setWishlist(list);
  return { list, added };
}
