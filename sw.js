const CACHE_NAME = "tf-tracker-v19";
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
  "./circuits/ljtj.json",
  "./circuits/day4sequence.json",
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
  // { cache: "no-store" } is essential here — without it, fetch() can be
  // silently satisfied by the *browser's own* HTTP disk cache before it
  // even reaches the network, which defeats "network-first" even though
  // our JS logic looks correct. This is what caused the standalone
  // home-screen app to keep showing stale content while a plain Safari
  // tab on the same URL updated fine.
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
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
