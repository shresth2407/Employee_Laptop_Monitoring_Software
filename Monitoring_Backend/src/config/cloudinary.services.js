import cloudinary from "./cloudinary.js";

/**
 * Upload image from buffer (multer)
 */
export const uploadImage = (fileBuffer, folder = "general") => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return resolve({ url: null, publicId: null });

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    console.log("Buffer size:", fileBuffer?.length);

    stream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Cloudinary Delete Error:", error);
    throw error;
  }
};