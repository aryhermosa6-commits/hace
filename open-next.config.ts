import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config. You can customize caching (KV/R2), ISR, and other behavior
// later here. Keeping this file present makes OpenNext/Cloudflare setup
// deterministic across local preview and CI/CD.
export default defineCloudflareConfig();
