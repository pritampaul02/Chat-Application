// Service Worker for Web Push Notifications & Incoming Call Alerts
self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Listen for incoming push notification
self.addEventListener("push", (event) => {
    let payload = {
        title: "Incoming Call",
        body: "A friend is calling you...",
        icon: "/icon.png",
        badge: "/icon.png",
        tag: "call-alert",
        actions: [
            { action: "accept", title: "📞 Accept" },
            { action: "reject", title: "❌ Decline" },
        ],
        data: {},
    };

    if (event.data) {
        try {
            const json = event.data.json();
            payload = { ...payload, ...json };
        } catch (err) {
            payload.body = event.data.text();
        }
    }

    const options = {
        body: payload.body,
        icon: payload.icon || "/icon.png",
        badge: payload.badge || "/icon.png",
        tag: payload.tag || "incoming-call",
        renotify: true,
        requireInteraction: true, // Keep notification on screen until user interacts
        vibrate: [300, 150, 300, 150, 500],
        actions: payload.actions || [
            { action: "accept", title: "📞 Accept" },
            { action: "reject", title: "❌ Decline" },
        ],
        data: payload.data || {},
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Handle notification interaction (Click or Action Buttons)
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const action = event.action;
    const data = event.notification.data || {};
    const callerId = data.from || "";
    const callType = data.callType || "voice";
    const targetUrl = data.url || `/chat/${callerId}?acceptCall=true&type=${callType}`;

    if (action === "reject") {
        // Broadcast reject event to any active tabs
        event.waitUntil(
            self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
                for (const client of clientList) {
                    client.postMessage({
                        type: "CALL_REJECTED_FROM_NOTIFICATION",
                        data,
                    });
                }
            })
        );
        return;
    }

    // Default click or "accept" action
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // If any window is already open, focus it and notify it
            for (const client of clientList) {
                if ("focus" in client) {
                    client.focus();
                    client.postMessage({
                        type: "CALL_ACCEPTED_FROM_NOTIFICATION",
                        data,
                    });
                    if ("navigate" in client && targetUrl) {
                        client.navigate(targetUrl);
                    }
                    return;
                }
            }
            // If no window is open, open a new one
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});
