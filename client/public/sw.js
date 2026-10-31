// Service Worker for Web Push Notifications (Messages, Incoming Calls & Alerts)
self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Listen for incoming push notification
self.addEventListener("push", (event) => {
    let payload = {
        title: "New Notification",
        body: "You have a new update",
        icon: "/icon.png",
        badge: "/icon.png",
        tag: "general-notification",
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

    const notifData = payload.data || {};
    const isCall =
        notifData.callType ||
        payload.type === "call" ||
        notifData.type === "call" ||
        (payload.tag && payload.tag.startsWith("call-"));

    const defaultCallActions = [
        { action: "accept", title: "📞 Accept" },
        { action: "reject", title: "❌ Decline" },
    ];

    const options = {
        body: payload.body,
        icon: payload.icon || "/icon.png",
        badge: payload.badge || "/icon.png",
        tag: payload.tag || (isCall ? "incoming-call" : `msg-${Date.now()}`),
        renotify: true,
        requireInteraction: Boolean(isCall), // Keep call notifications on screen until interaction
        vibrate: isCall ? [300, 150, 300, 150, 500] : [200, 100, 200],
        actions: Array.isArray(payload.actions)
            ? payload.actions
            : isCall
            ? defaultCallActions
            : [],
        data: notifData,
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Handle notification interaction (Click or Action Buttons)
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const action = event.action;
    const data = event.notification.data || {};
    const callerId = data.from || data.senderId || "";
    const callType = data.callType || "voice";
    const isCall = Boolean(data.callType) || data.type === "call";

    // Build the target destination URL
    let targetUrl = data.url;
    if (!targetUrl) {
        if (isCall && callerId) {
            targetUrl = `/chat/${callerId}?acceptCall=true&type=${callType}`;
        } else if (data.chatId || callerId) {
            targetUrl = `/chat/${data.chatId || callerId}`;
        } else {
            targetUrl = "/";
        }
    }

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

    // Default click or "accept" / "open" action
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // If any window is already open, focus it and notify it
            for (const client of clientList) {
                if ("focus" in client) {
                    client.focus();
                    if (isCall) {
                        client.postMessage({
                            type: "CALL_ACCEPTED_FROM_NOTIFICATION",
                            data,
                        });
                    }
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
