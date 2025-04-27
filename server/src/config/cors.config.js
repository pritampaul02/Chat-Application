import cors from "cors";

const corsConfig = cors({
    origin: [process.env.FRONTEND_URI, "*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
});

export default corsConfig;
