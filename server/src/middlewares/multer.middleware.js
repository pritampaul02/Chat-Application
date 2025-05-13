import multer from "multer";
import { unlink } from "fs/promises";
import cloudinary from "../config/cloudinary.config.js";
// import path from "path";

// Multer Storage Configurationimport multer from "multer";

const storage = multer.memoryStorage(); // Use memory storage in serverless

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/", "video/", "audio/"];
    if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter,
});

// Upload to Cloudinary
export const uploadToCloudinary = async (localFilePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder,
            transformation: [
                {
                    quality: "auto:good",
                    fetch_format: "auto",
                },
            ],
        });

        console.info(`
            🚀~~ multer.middleware.js --50\n✅ Image uploaded to Cloudinary: ${result.secure_url} & ${result.public_id}`);
        // console.log(Object.keys(result), Object.values(result));

        // Remove the local file after upload
        await unlink(localFilePath);

        return result;
    } catch (error) {
        console.error(
            "❌ Failed to upload image to Cloudinary:",
            error.message
        );

        // Attempt to clean up the local file in case of an error
        try {
            await unlink(localFilePath);
        } catch (unlinkError) {
            console.error(
                "❌ Failed to delete local file:",
                unlinkError.message
            );
        }

        throw new Error("Failed to upload image to Cloudinary.");
    }
};

export default upload;
