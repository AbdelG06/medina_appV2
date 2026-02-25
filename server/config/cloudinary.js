import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { env } from "./env.js";

const cloudinaryEnabled =
  Boolean(env.cloudinaryCloudName) &&
  Boolean(env.cloudinaryApiKey) &&
  Boolean(env.cloudinaryApiSecret);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

export const upload = cloudinaryEnabled
  ? multer({
      storage: new CloudinaryStorage({
        cloudinary,
        params: async () => ({
          folder: "fes-medina-magic/souvenirs",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation: [{ width: 1600, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
        }),
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  : multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const isCloudinaryEnabled = () => cloudinaryEnabled;
