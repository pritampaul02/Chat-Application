// import { v2 as cloudinary } from 'cloudinary';

import { unlink } from "fs/promises";
import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";

export const fileUploader = async (file) => {
    try {
        const data = await cloudinary.uploader.upload(file, {
            folder,
            transformation: [
                {
                    quality: "auto:good",
                    fetch_format: "auto",
                },
            ],
        });
        await unlink(localFilePath);
        return { url: data.secure_url, public_id: data.public_id, error: null };
    } catch (error) {
        console.error(error);

        return { url: null, public_id: null, error };
    }
};

export const cloudinaryFileUploader = (
    buffer,
    mimetype,
    folder = "uploads"
) => {
    const resource_type = mimetype.startsWith("image")
        ? "image"
        : mimetype.startsWith("video") || mimetype.startsWith("audio")
        ? "video"
        : "raw";

    console.log("🚀 ~ resource_type:", resource_type);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type },
            (error, result) => {
                if (error) {
                    return reject({ url: null, public_id: null, error });
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    error: null,
                });
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const fileDestroy = async (public_id) => {
    if (public_id) {
        try {
            const data = await cloudinary.uploader.destroy(public_id);
            // console.log(data);
            return { success: true, data, error: null };
        } catch (error) {
            console.error(error);

            return { success: false, data: null, error };
        }
    }

    return { success: true, error: null, data: null };
};
