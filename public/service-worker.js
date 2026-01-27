const CACHE_NAME = 'daily-record-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
];

// 安裝 Service Worker - 使用 skipWaiting 立即激活新版本
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 立即激活新版本，不等待舊版本關閉
        return self.skipWaiting();
      })
  );
});

// 攔截請求並返回快取的內容
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // JavaScript 和 CSS 文件使用網絡優先策略，確保更新及時
  if (url.pathname.includes('/assets/') && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 如果網絡請求成功，更新緩存
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // 網絡失敗時，嘗試從緩存獲取
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // HTML 文件使用網絡優先策略
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request) || caches.match('/index.html');
        })
    );
    return;
  }
  
  // 其他資源使用緩存優先策略
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果有快取則返回，否則從網路獲取
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // 檢查是否為有效回應
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆回應
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // 如果網路失敗，返回離線頁面（如果有）
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// 更新 Service Worker - 清理舊緩存並控制所有客戶端
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有客戶端，確保新版本生效
      return self.clients.claim();
    })
  );
});

// 監聽來自主線程的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


