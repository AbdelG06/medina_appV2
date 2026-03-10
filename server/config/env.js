import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  // PORT is required by most cloud providers (Render/Railway/Fly)
  port: Number(process.env.PORT || process.env.API_PORT || 3001),
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://fes_admin:Fesmedina@cluster0.imq1yqc.mongodb.net/?appName=Cluster0",
  mongoUriDirect: process.env.MONGODB_URI_DIRECT || "",
  mongoDbName: process.env.MONGODB_DB_NAME || "fes_medina_magic",
  jwtSecret: process.env.JWT_SECRET || "482d9b3b3c2e3749382725ff2c9a8043f5ca3171f334d798db146b2df4cde3fd7c8c49abf9a79694594d6ee2b65c3c80d47c617ab2ce15e9f4b3dc09855f8273",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "fesmedina@eurisa.ma",
  adminPassword: process.env.ADMIN_PASSWORD || "FesMedina@eurisa",
  adminName: process.env.ADMIN_NAME || "Super Admin",
  demoUserEmail: process.env.DEMO_USER_EMAIL || "fan@medina-fes.ma",
  demoUserPassword: process.env.DEMO_USER_PASSWORD || "Fan123456",
  demoUserFirstName: process.env.DEMO_USER_FIRST_NAME || "Medina",
  demoUserLastName: process.env.DEMO_USER_LAST_NAME || "Fan",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

export const assertEnv = () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI manquant.");
  }
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET manquant.");
  }
};
