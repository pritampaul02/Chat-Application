import cors from "cors";

const corsConfig = cors({
    origin: ["https://chat-application-delta-nine.vercel.app/", "*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
});

export default corsConfig;
