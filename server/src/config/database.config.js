import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        const uri = process.env.DB_URI;
        if (!uri) {
            console.error("❌ DB_URI is missing in environment variables");
            return;
        }

        await mongoose.connect(uri, {
            maxPoolSize: 50,
            minPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            autoIndex: true,
        });

        console.info("✅ Database connected with high-performance connection pool");
    } catch (error) {
        console.error("❌ Database connection error => ", error);
    }
};
