import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config to avoid interactive prompt in CI.
// Add R2/KV caches later if you want persistence/ISR.
// https://opennext.js.org/cloudflare/get-started (docs)
export default defineCloudflareConfig({});
