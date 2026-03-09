import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  // PORT is required by most cloud providers (Render/Railway/Fly)
  port: Number(process.env.PORT || process.env.API_PORT || 3001),
  mongoUri: process.env.MONGODB_URI || "=mongodb+srv://fes_admin:Fesmedina@cluster0.imq1yqc.mongodb.net/?appName=Cluster0",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@medina-fes.ma",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  adminName: process.env.ADMIN_NAME || "Super Admin",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openrouterModel: process.env.OPENROUTER_MODEL || "google/gemma-3n-e2b-it:free",
};

export const assertEnv = () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI manquant.");
  }
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET manquant.");
  }
};
