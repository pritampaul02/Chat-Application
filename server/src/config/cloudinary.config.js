import { v2 as cloudinary } from "cloudinary";

// Validate environment variables
if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_SECRET
) {
    console.error("❌ Missing Cloudinary environment variables");
    process.exit(1); // Exit the process if variables are not set
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("✅ Cloudinary configured successfully");

export default cloudinary;
