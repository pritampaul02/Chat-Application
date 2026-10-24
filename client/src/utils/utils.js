import moment from "moment";

/**
 * Format last seen timestamp into WhatsApp/Telegram style human-readable string
 * @param {Date|string|number} timestamp
 * @returns {string}
 */
export const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Offline";

    const date = moment(timestamp);
    if (!date.isValid()) return "Offline";

    const now = moment();
    const diffMinutes = now.diff(date, "minutes");

    if (diffMinutes < 1) {
        return "Last seen just now";
    }

    if (diffMinutes < 60) {
        return `Last seen ${diffMinutes}m ago`;
    }

    if (date.isSame(now, "day")) {
        return `Last seen today at ${date.format("h:mm A")}`;
    }

    const yesterday = moment().subtract(1, "day");
    if (date.isSame(yesterday, "day")) {
        return `Last seen yesterday at ${date.format("h:mm A")}`;
    }

    if (date.isSame(now, "year")) {
        return `Last seen ${date.format("MMM D")} at ${date.format("h:mm A")}`;
    }

    return `Last seen ${date.format("MMM D, YYYY")}`;
};
