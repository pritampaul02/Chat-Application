import webpush from "web-push";
import "dotenv/config";
import { Users } from "../model/user.model.js";
import { PushNotification } from "../model/pushNotification.model.js";
import { Notifications } from "../model/notification.model.js";

// Permanent VAPID keys from environment with fallback
const vapidPublicKey =
    process.env.VAPID_PUBLIC_KEY ||
    "BN0nncaN1c-Mkp5NAeJFrAdtNPymFrCpuvPWkvEfOIOOKwjwPbma0fxNmMqkHa4rgpHDmaM1YISjYpq70HBLP7A";
const vapidPrivateKey =
    process.env.VAPID_PRIVATE_KEY ||
    "uxdHNXA8yUjyQvdS_QPKix5sDWQN4HGcdyDSUdRnvNM";
const vapidEmail =
    process.env.VAPID_EMAIL || "mailto:adityamondal4567@gmail.com";

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

export const getVapidPublicKey = () => vapidPublicKey;

/**
 * Retrieve all active push subscriptions for a user across models
 */
const getUserSubscriptions = async (userId) => {
    if (!userId) return [];

    const [userDoc, modelSubs] = await Promise.all([
        Users.findById(userId).select("pushSubscriptions").lean(),
        PushNotification.find({ user: userId, isActive: true }).lean(),
    ]);

    const subscriptions = [];
    const seenEndpoints = new Set();

    // Add from PushNotification model
    if (Array.isArray(modelSubs)) {
        for (const sub of modelSubs) {
            if (sub?.endpoint && !seenEndpoints.has(sub.endpoint)) {
                seenEndpoints.add(sub.endpoint);
                subscriptions.push(sub);
            }
        }
    }

    // Add from User model
    if (Array.isArray(userDoc?.pushSubscriptions)) {
        for (const sub of userDoc.pushSubscriptions) {
            if (sub?.endpoint && !seenEndpoints.has(sub.endpoint)) {
                seenEndpoints.add(sub.endpoint);
                subscriptions.push(sub);
            }
        }
    }

    return subscriptions;
};

/**
 * Cleanup invalid or expired subscription
 */
const cleanupExpiredSubscription = async (userId, endpoint) => {
    try {
        await Promise.all([
            PushNotification.deleteOne({ endpoint }),
            Users.findByIdAndUpdate(userId, {
                $pull: { pushSubscriptions: { endpoint } },
            }),
        ]);
    } catch (err) {
        console.error("Error cleaning up expired push subscription:", err);
    }
};

/**
 * Send Web Push Notification for Incoming Calls
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

        const subscriptions = await getUserSubscriptions(calleeId);
        if (!subscriptions || subscriptions.length === 0) {
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

        // Store notification record
        try {
            await Notifications.create({
                user: calleeId,
                sender: callerId,
                title: `Incoming ${callType === "video" ? "Video" : "Voice"} Call`,
                body: `${callerName || "A friend"} is calling you...`,
                type: "call",
                icon: callerAvatar || "/icon.png",
                data: { callerId, callType },
            });
        } catch (dbErr) {
            // DB log failure is non-blocking
        }

        const sendPromises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub, payload);
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await cleanupExpiredSubscription(calleeId, sub.endpoint);
                }
                console.error("Push notification send error:", err.message);
            }
        });

        await Promise.allSettled(sendPromises);
        console.log(`✅ Sent call push notification to user ${calleeId}`);
    } catch (error) {
        console.error("sendCallPushNotification failed:", error);
    }
};

/**
 * Send Web Push Notification for New Chat Messages
 */
export const sendMessagePushNotification = async ({
    receiverId,
    senderId,
    senderName,
    senderAvatar,
    message,
    chatId,
    type = "message",
}) => {
    try {
        if (!receiverId) return;

        const subscriptions = await getUserSubscriptions(receiverId);
        if (!subscriptions || subscriptions.length === 0) {
            return;
        }

        const previewText = message
            ? message.length > 80
                ? `${message.slice(0, 80)}...`
                : message
            : "Sent a new message";

        const payload = JSON.stringify({
            title: senderName || "New Message",
            body: previewText,
            icon: senderAvatar || "/icon.png",
            badge: "/icon.png",
            tag: `chat-${senderId}`,
            data: {
                from: senderId,
                senderName,
                senderAvatar,
                url: `/chat/${senderId}`,
                chatId: chatId || senderId,
                type: "message",
            },
            actions: [
                { action: "open", title: "💬 Reply" },
            ],
        });

        // Store notification record
        try {
            await Notifications.create({
                user: receiverId,
                sender: senderId,
                title: senderName || "New Message",
                body: previewText,
                type: "message",
                icon: senderAvatar || "/icon.png",
                data: { senderId, chatId },
            });
        } catch (dbErr) {
            // Non-blocking
        }

        const sendPromises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub, payload);
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await cleanupExpiredSubscription(receiverId, sub.endpoint);
                }
                console.error("Message push notification send error:", err.message);
            }
        });

        await Promise.allSettled(sendPromises);
        console.log(`✅ Sent message push notification to user ${receiverId}`);
    } catch (error) {
        console.error("sendMessagePushNotification failed:", error);
    }
};

/**
 * Send Web Push Notification for Friend Requests
 */
export const sendFriendRequestPushNotification = async ({
    receiverId,
    senderId,
    senderName,
    senderAvatar,
    action = "request",
}) => {
    try {
        if (!receiverId) return;

        const subscriptions = await getUserSubscriptions(receiverId);
        if (!subscriptions || subscriptions.length === 0) return;

        const title =
            action === "accept"
                ? "Friend Request Accepted"
                : "New Friend Request";
        const body =
            action === "accept"
                ? `${senderName} accepted your friend request`
                : `${senderName} sent you a friend request`;

        const payload = JSON.stringify({
            title,
            body,
            icon: senderAvatar || "/icon.png",
            badge: "/icon.png",
            tag: `friend-${senderId}`,
            data: {
                from: senderId,
                url: `/friends/${senderId}`,
                type: "friend_request",
            },
        });

        const sendPromises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub, payload);
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await cleanupExpiredSubscription(receiverId, sub.endpoint);
                }
            }
        });

        await Promise.allSettled(sendPromises);
    } catch (error) {
        console.error("sendFriendRequestPushNotification failed:", error);
    }
};

export default {
    getVapidPublicKey,
    sendCallPushNotification,
    sendMessagePushNotification,
    sendFriendRequestPushNotification,
};
