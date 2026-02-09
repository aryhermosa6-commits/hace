// Cloudflare Workers runtime does NOT have a real filesystem.
// This storage layer keeps things simple:
// - Reads defaults from bundled JSON under /data
// - Writes go to an in-memory store (resets on cold start / redeploy)
// If you want persistence later, swap this to KV/D1.

import productsJSON from "../data/products.json";
import emailsJSON from "../data/emails.json";
import clicksJSON from "../data/clicks.json";
import heatJSON from "../data/heat.json";

const STATIC_BY_KEY = {
  "products.json": productsJSON,
  "emails.json": emailsJSON,
  "clicks.json": clicksJSON,
  "heat.json": heatJSON,
};

function store() {
  if (!globalThis.__HC_STORE) globalThis.__HC_STORE = new Map();
  return globalThis.__HC_STORE;
}

export async function readJSON(file, fallback = null) {
  const s = store();
  if (s.has(file)) return s.get(file);
  if (Object.prototype.hasOwnProperty.call(STATIC_BY_KEY, file)) return STATIC_BY_KEY[file];
  return fallback;
}

export async function writeJSON(file, data) {
  store().set(file, data);
  return true;
}

export async function appendJSONList(file, item) {
  const cur = (await readJSON(file, [])) || [];
  const next = Array.isArray(cur) ? [...cur, item] : [item];
  await writeJSON(file, next);
  return next;
}
