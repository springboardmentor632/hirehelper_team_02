import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force .env from backend root
dotenv.config({
  path: path.join(__dirname, ".env"),
});

console.log("✅ ENV LOADED");
console.log("ETHEREAL_USER:", process.env.ETHEREAL_USER);
