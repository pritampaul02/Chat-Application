import cors from "cors";

const corsConfig = cors({
    origin: [
        "http://localhost:5173",
        "https://chat-application-client-lime.vercel.app/",
        "https://chat-application-delta-nine.vercel.app/",
        "*/",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
});

export default corsConfig;
