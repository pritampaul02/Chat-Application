// Audio synthesis and Web Push Notification utility

class NotificationService {
    constructor() {
        this.audioCtx = null;
        this.ringInterval = null;
    }

    getAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    // Gentle send sound
    playSendSound() {
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.debug("Audio playSendSound error:", e);
        }
    }

    // Clean incoming message chime
    playReceiveSound() {
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(523.25, now); // C5
            osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5

            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(1046.5, now + 0.08); // C6

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now + 0.08);
            osc1.stop(now + 0.35);
            osc2.stop(now + 0.35);
        } catch (e) {
            console.debug("Audio playReceiveSound error:", e);
        }
    }

    // Incoming Call Ringtone (looping pleasant bell tone)
    startRingtone() {
        if (this.ringInterval) return;
        const playRingPattern = () => {
            try {
                const ctx = this.getAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;

                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();

                osc1.type = "sine";
                osc1.frequency.setValueAtTime(440, now);
                osc1.frequency.setValueAtTime(480, now + 0.2);

                osc2.type = "sine";
                osc2.frequency.setValueAtTime(880, now);
                osc2.frequency.setValueAtTime(960, now + 0.2);

                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.8);
                osc2.stop(now + 0.8);
            } catch (e) {}
        };

        playRingPattern();
        this.ringInterval = setInterval(playRingPattern, 2000);
    }

    stopRingtone() {
        if (this.ringInterval) {
            clearInterval(this.ringInterval);
            this.ringInterval = null;
        }
    }

    // Convert VAPID base64 string to Uint8Array for PushManager
    urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Register Service Worker for push notifications
    async registerServiceWorker() {
        if ("serviceWorker" in navigator) {
            try {
                const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
                this.swRegistration = reg;
                return reg;
            } catch (err) {
                console.debug("ServiceWorker registration failed:", err);
            }
        }
        return null;
    }

    // Web Browser Notifications
    async requestPermission() {
        if (!("Notification" in window)) {
            console.warn("Notifications not supported in this browser");
            return false;
        }
        if (Notification.permission === "granted") {
            await this.registerServiceWorker();
            return true;
        }
        if (Notification.permission !== "denied") {
            const status = await Notification.requestPermission();
            if (status === "granted") {
                await this.registerServiceWorker();
                return true;
            }
        }
        return false;
    }

    // Subscribe to Web Push notifications using VAPID
    async subscribeUserToPush(apiClient) {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) return null;

            const reg = this.swRegistration || (await this.registerServiceWorker());
            if (!reg || !reg.pushManager) {
                console.debug("Push manager not available in this browser");
                return null;
            }

            // Check if already subscribed
            let subscription = await reg.pushManager.getSubscription();

            if (!subscription) {
                // Fetch public VAPID key from backend
                const res = await apiClient.get("/user/push/vapid-key");
                const vapidPublicKey = res.data?.data?.publicKey;

                if (!vapidPublicKey) {
                    console.debug("No VAPID public key returned from server");
                    return null;
                }

                const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
                subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey,
                });
            }

            if (subscription) {
                // Send subscription to server
                await apiClient.post("/user/push/subscribe", {
                    subscription: subscription.toJSON(),
                });
                console.log("✅ Successfully registered push notification subscription");
            }

            return subscription;
        } catch (err) {
            console.debug("Error subscribing to push notifications:", err);
            return null;
        }
    }

    // Show native incoming call notification with Accept and Reject buttons
    async showCallNotification({ callerName, callerAvatar, callType = "voice", from, onAccept, onReject }) {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) return;

        const title = `Incoming ${callType === "video" ? "Video" : "Voice"} Call`;
        const options = {
            body: `${callerName || "Friend"} is calling you...`,
            icon: callerAvatar || "/icon.png",
            badge: "/icon.png",
            tag: `call-${from || "incoming"}`,
            renotify: true,
            requireInteraction: true,
            vibrate: [300, 150, 300, 150, 500],
            actions: [
                { action: "accept", title: "📞 Accept" },
                { action: "reject", title: "❌ Decline" },
            ],
            data: {
                from,
                callerName,
                callerAvatar,
                callType,
                url: `/chat/${from}?acceptCall=true&type=${callType}`,
            },
        };

        const reg = this.swRegistration || (await this.registerServiceWorker());
        if (reg && reg.showNotification) {
            try {
                await reg.showNotification(title, options);
                return;
            } catch (e) {
                console.debug("reg.showNotification error, fallback to new Notification:", e);
            }
        }

        // Fallback for browsers without SW notifications
        try {
            const notif = new Notification(title, {
                body: options.body,
                icon: options.icon,
                badge: options.badge,
                tag: options.tag,
                requireInteraction: true,
            });
            notif.onclick = () => {
                window.focus();
                if (onAccept) onAccept();
            };
        } catch (e) {
            console.debug("Notification fallback error:", e);
        }
    }

    showNotification(title, options = {}) {
        if (!("Notification" in window)) return;
        if (Notification.permission === "granted") {
            try {
                const notification = new Notification(title, {
                    icon: options.icon || "/icon.png",
                    badge: "/icon.png",
                    silent: true, // We handle our own audio chime
                    ...options,
                });
                notification.onclick = () => {
                    window.focus();
                    if (options.onClick) options.onClick();
                };
            } catch (e) {
                console.debug("Notification error:", e);
            }
        }
    }
}

export const notificationService = new NotificationService();

