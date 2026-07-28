const CACHE_NAME = "tf-tracker-v13";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./phases/manifest.json",
  "./phases/summer.json",
  "./phases/phase1.json",
  "./phases/phase2.json",
  "./phases/competition.json",
  "./circuits/manifest.json",
  "./circuits/gc1.json",
  "./circuits/gc2.json",
  "./circuits/gc3.json",
  "./circuits/gc4.json",
  "./circuits/running.json",
  "./circuits/vacation.json",
  "./circuits/dudley.json",
  "./circuits/mercury.json",
  "./circuits/venus.json",
  "./circuits/mars.json",
  "./circuits/boundingA.json",
  "./warmups/manifest.json",
  "./warmups/circuitA.json",
  "./warmups/circuitB.json",
  "./warmups/studly.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Network-first: always try to get the latest version when online.
  // Only fall back to the cache when there's no connection. This means
  // redeploying index.html or any phases/circuits/warmups JSON file
  // takes effect immediately next time the app is opened with signal —
  // no manual cache-busting needed.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
