/* 세겹줄 알림 서비스 워커: 폰 푸시를 받아 알림으로 보여 주고, 누르면 앱을 엶 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try {
    const j = e.data ? e.data.json() : {};
    d = j.data || (j.notification ? { title: j.notification.title, body: j.notification.body } : j);
  } catch (err) {
    d = { body: e.data ? e.data.text() : '' };
  }
  const title = d.title || '세겹줄';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    tag: d.tag || 'segyeopjul',
    renotify: true,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: d.url || '/' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) {
      if ('focus' in c) { c.postMessage({ open: url }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
