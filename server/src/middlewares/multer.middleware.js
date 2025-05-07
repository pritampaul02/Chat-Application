import multer from "multer";
import { unlink } from "fs/promises";
import cloudinary from "../config/cloudinary.config.js";
// import path from "path";

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/\s+/g, "_");
        cb(
            null,
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}-${sanitizedFilename}`
        );
    },
});

// File Filter for Images
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed."), false);
    }
    cb(null, true);
};

// Multer Middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1 * 1024 * 1024, // 1 MB file size limit
    },
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
