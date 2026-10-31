import cors from "cors";

const allowedOrigins = [
    "https://chat-application-delta-nine.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    "https://chat-application-client-lime.vercel.app",
    "https://chat-application-client-ajgw.onrender.com",
    process.env.FRONTEND_URI,
].filter(Boolean);

const corsConfig = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.endsWith(".onrender.com") ||
            origin.startsWith("http://localhost:")
        ) {
            return callback(null, true);
        }

        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Requested-With",
        "Accept",
        "x-access-token",
    ],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours to reduce latency
});

export default corsConfig;
