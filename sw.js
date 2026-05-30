const CACHE_NAME = "boomcheck-v1";
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// Ku-install Service Worker na kuhifadhi mafaili kwenye simu
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

// Kuiruhusu App ifanye kazi kwa haraka ikifunguliwa tena
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
