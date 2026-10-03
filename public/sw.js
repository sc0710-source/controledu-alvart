// Defino el nombre y versión de mi memoria caché para la PWA
const CACHE_NAME = 'controledu-pwa-v4';

// Lista de archivos estáticos esenciales que guardo en caché para que la app cargue de inmediato
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/app_icon.png',
  '/assets/logo.png',
  '/assets/lion_alvart_v2.png',
  '/assets/campus_real.jpg',
  '/assets/profile.png'
];

// Evento de instalación: aquí descargo y guardo en caché los archivos principales
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

// Evento de activación: limpio versiones viejas de caché para mantener la app actualizada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Aquí controlo lo que pasa cuando el usuario hace clic en una notificación del celular
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si la ventana ya está abierta, la traigo al frente y le doy foco
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Si estaba cerrada, abro la aplicación desde la raíz
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Aquí recibo y proceso el evento Push que llega desde los servidores de Apple o Google
self.addEventListener('push', (event) => {
  let data = { title: 'ControlEDU Alvart', body: 'Tienes una nueva actualización escolar.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  // Configuro cómo quiero que se vea la notificación nativa en la pantalla de bloqueo
  const options = {
    body: data.body || data.descripcion,
    icon: '/assets/app_icon.png',
    badge: '/assets/app_icon.png',
    vibrate: [200, 100, 200],
    data: data,
    tag: data.tag || 'alvart-push-' + Date.now(),
    requireInteraction: true
  };

  // Le ordeno al sistema operativo del celular mostrar la tarjeta de notificación
  event.waitUntil(
    self.registration.showNotification(data.title || data.titulo || 'ControlEDU Alvart', options)
  );
});

// Estrategia de red: busco primero en internet y si no hay conexión uso mi copia en caché
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Nunca guardo en caché las llamadas a mi API para garantizar que las tareas y notas siempre sean reales
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
