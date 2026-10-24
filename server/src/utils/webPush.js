import webpush from "web-push";
import "dotenv/config";
import { Users } from "../model/user.model.js";

// Generate or use existing VAPID keys
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
    const keys = webpush.generateVAPIDKeys();
    vapidPublicKey = keys.publicKey;
    vapidPrivateKey = keys.privateKey;
    console.log("⚡ Auto-generated VAPID Keys for Web Push Notifications:");
    console.log("VAPID_PUBLIC_KEY:", vapidPublicKey);
}

const vapidEmail = process.env.VAPID_EMAIL || "mailto:admin@chatapp.local";

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

export const getVapidPublicKey = () => vapidPublicKey;

/**
 * Send Web Push Notification to a user across all their registered subscriptions
 */
export const sendCallPushNotification = async ({
    calleeId,
    callerId,
    callerName,
    callerAvatar,
    callType = "voice",
}) => {
    try {
        if (!calleeId) return;

        const callee = await Users.findById(calleeId).select("pushSubscriptions name");
        if (!callee || !callee.pushSubscriptions || callee.pushSubscriptions.length === 0) {
            console.log(`ℹ️ User ${calleeId} has no registered push subscriptions`);
            return;
        }

        const payload = JSON.stringify({
            title: `Incoming ${callType === "video" ? "Video" : "Voice"} Call`,
            body: `${callerName || "A friend"} is calling you...`,
            icon: callerAvatar || "/icon.png",
            badge: "/icon.png",
            tag: `call-${callerId}`,
            data: {
                from: callerId,
                callerName,
                callerAvatar,
                callType,
                url: `/chat/${callerId}?acceptCall=true&type=${callType}`,
            },
            actions: [
                { action: "accept", title: "📞 Accept" },
                { action: "reject", title: "❌ Decline" },
            ],
        });

        const sendPromises = callee.pushSubscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub, payload);
            } catch (err) {
                // If subscription expired or unsubscribed (410 or 404), remove it
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await Users.findByIdAndUpdate(calleeId, {
                        $pull: { pushSubscriptions: { endpoint: sub.endpoint } },
                    });
                }
                console.error("Push notification send error:", err.message);
            }
        });

        await Promise.allSettled(sendPromises);
        console.log(`✅ Sent call push notification to offline user ${calleeId}`);
    } catch (error) {
        console.error("sendCallPushNotification failed:", error);
    }
};

export default {
    getVapidPublicKey,
    sendCallPushNotification,
};
