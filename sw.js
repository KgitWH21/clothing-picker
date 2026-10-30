// Bump this version whenever a cached file changes. An update takes over after
// existing app windows close, keeping each open app on one consistent version.
const CACHE_PREFIX='wardrobe-picker:'+self.registration.scope+':';
const CACHE_NAME=CACHE_PREFIX+'v9';
const APP_FILES=[
  './', './index.html', './style.css', './conditions.js', './data.js',
  './weapons.js', './weapon-conditions.js', './engine.js', './prefill.js', './app.js', './pwa.js', './manifest.webmanifest',
  './icons/wardrobe.svg', './icons/apple-touch-icon.png', './icons/icon-192.png',
  './icons/icon-512.png', './icons/icon-maskable-512.png'
].map(path=>new URL(path,self.registration.scope).href);
const INDEX_URL=new URL('./index.html',self.registration.scope).href;

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const name of await caches.keys()) {
      if(name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  url.search='';
  if(!APP_FILES.includes(url.href)) return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(request.mode==='navigate'?INDEX_URL:url.href);
    return cached||fetch(request);
  })());
});
