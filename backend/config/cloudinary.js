import { v2 as cloudinary } from "cloudinary";

// Use CLOUDINARY_URL (avoids env timing issues)
cloudinary.config(process.env.CLOUDINARY_URL);

export default cloudinary;
