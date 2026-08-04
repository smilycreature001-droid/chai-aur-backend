import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // file uploaded successfully — remove local temp file
        fs.unlinkSync(localFilePath);

        console.log("File uploaded to Cloudinary:", response.url);
        return response;
    } catch (error) {
        // remove local temp file if upload failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log("Cloudinary upload error:", error);
        return null;
    }
};

export { uploadOnCloudinary };
