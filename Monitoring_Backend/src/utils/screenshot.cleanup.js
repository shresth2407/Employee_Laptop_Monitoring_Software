import cron from "node-cron";
import Screenshot from "../modules/screenshots/screenshot.model.js";
import cloudinary from "../config/cloudinary.js";

/**
 * 🔥 Robust public_id extractor (Cloudinary URL → public_id)
 */
const extractPublicId = (url) => {
  try {
    if (!url) return null;

    // Example:
    // https://res.cloudinary.com/demo/image/upload/v1710000000/screenshots/abc.png

    const parts = url.split("/upload/");

    if (parts.length < 2) return null;

    let path = parts[1]; 
    // v1710000000/screenshots/abc.png

    // remove version (v123...)
    path = path.replace(/^v\d+\//, "");

    // remove extension
    path = path.replace(/\.[^/.]+$/, "");

    // result: screenshots/abc
    return path;
  } catch (err) {
    console.error("❌ extractPublicId error:", err.message);
    return null;
  }
};

/**
 * 🧹 CLEANUP JOB
 */
export const startScreenshotCleanupJob = () => {
  // 🧹 Runs once daily at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🧹 Cleanup started...");

      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      console.log("🕒 2 days ago:", twoDaysAgo);

      const oldScreenshots = await Screenshot.find({
        capturedAt: { $lt: twoDaysAgo },
      });

      console.log(`📦 Found: ${oldScreenshots.length}`);

      for (const shot of oldScreenshots) {
        console.log("👉 Checking:", shot.filePath);

        const publicId = extractPublicId(shot.filePath);
        console.log("🧩 Extracted publicId:", publicId);

        if (publicId) {
          const res = await cloudinary.uploader.destroy(publicId);
          console.log("☁️ Cloudinary:", res);
        }
      }

      const result = await Screenshot.deleteMany({
        capturedAt: { $lt: twoDaysAgo },
      });

      console.log("🗑️ DB deleted:", result.deletedCount);
      console.log("✅ Done\n");

    } catch (err) {
      console.error("❌ Error:", err);
    }
  });
};