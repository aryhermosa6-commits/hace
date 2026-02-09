const CACHE = "phc-v3.1-cache";
const CORE = ["/", "/products", "/offline", "/manifest.json"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    try{
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200 && (req.destination === "document" || req.destination === "script" || req.destination === "style" || req.destination === "image")) {
        cache.put(req, fresh.clone());
      }
      return fresh;
    }catch(err){
      return cached || (req.destination === "document" ? cache.match("/offline") : Response.error());
    }
  })());
});
