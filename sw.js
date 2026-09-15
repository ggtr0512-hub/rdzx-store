const CACHE_NAME = "rdzx-store-cache-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./imagens/fundo-rdzx.jpg"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ARQUIVOS).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event){
  event.respondWith(
    caches.match(event.request).then(function(resposta){
      return resposta || fetch(event.request).then(function(rede){
        const copia=rede.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request,copia);
        });
        return rede;
      }).catch(function(){
        return caches.match("./index.html");
      });
    })
  );
});
