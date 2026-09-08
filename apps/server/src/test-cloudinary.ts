import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env") });

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Present" : "Missing");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  try {
    const ping = await cloudinary.api.ping();
    console.log("Cloudinary Ping Response:", ping);
    
    const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const uploadRes = await cloudinary.uploader.upload(dummyBase64, {
      folder: "paradise_community_test",
    });
    console.log("Cloudinary Test Upload Success:", uploadRes.secure_url);
  } catch (err: any) {
    console.error("Cloudinary Error:", err?.message || err);
    if (err?.error) console.error("Detailed error:", JSON.stringify(err.error));
    if (err?.http_code) console.error("HTTP Code:", err.http_code);
  }
}

main();
