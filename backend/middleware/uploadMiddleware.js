import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  return multer({ storage });
};

export default uploadToCloudinary;
