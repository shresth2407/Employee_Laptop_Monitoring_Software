import cloudinary from "../config/cloudinary.js";

export const generateUploadUrl = async () => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = {
      timestamp,
      folder: "screenshots",
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      params: {
        ...params,
        api_key: process.env.CLOUDINARY_API_KEY,
        signature,
      },
    };
  } catch (error) {
    console.error("❌ Cloudinary URL error:", error);
    throw error;
  }
};