import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const testFile = path.join(UPLOADS_DIR, "test.txt");
fs.writeFileSync(testFile, "hello from uploads");
console.log("Uploads dir:", UPLOADS_DIR);
console.log("Static root resolve:", path.resolve(__dirname, ".."));
