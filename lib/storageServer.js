import productsSeed from "../data/products.json";
import emailsSeed from "../data/emails.json";
import clicksSeed from "../data/clicks.json";
import heatSeed from "../data/heat.json";

const SEEDS = {
  "products.json": productsSeed,
  "emails.json": emailsSeed,
  "clicks.json": clicksSeed,
  "heat.json": heatSeed,
};

// Simple in-memory store (works on Cloudflare Workers). Not durable storage.
const STORE = (globalThis.__HC_STORE ||= new Map());

function clone(v) {
  try { return JSON.parse(JSON.stringify(v)); } catch { return v; }
}

export function readJSON(filename, fallback = {}) {
  if (STORE.has(filename)) return clone(STORE.get(filename));
  const seed = SEEDS[filename] ?? fallback;
  STORE.set(filename, seed);
  return clone(seed);
}

export function writeJSON(filename, value) {
  STORE.set(filename, value);
  return true;
}

export function appendJSONList(filename, key, item) {
  const doc = readJSON(filename, { [key]: [] });
  if (!Array.isArray(doc[key])) doc[key] = [];
  doc[key].push(item);
  writeJSON(filename, doc);
  return doc;
}
