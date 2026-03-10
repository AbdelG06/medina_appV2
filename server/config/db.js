import mongoose from "mongoose";
import { env } from "./env.js";

const isSrvDnsError = (error) =>
  Boolean(
    error &&
      typeof error === "object" &&
      ("code" in error ? error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.code === "ETIMEOUT" : false) &&
      ("hostname" in error ? String(error.hostname || "").includes("_mongodb._tcp.") : false),
  );

const connectWithOptionalDbName = async (uri) => {
  let dbName;
  try {
    const parsed = new URL(uri);
    const path = (parsed.pathname || "").replace(/^\//, "").trim();
    if (!path) {
      dbName = env.mongoDbName;
    }
  } catch {
    dbName = env.mongoDbName;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
    ...(dbName ? { dbName } : {}),
  });
};

export const connectDatabase = async (mongoUri) => {
  try {
    await connectWithOptionalDbName(mongoUri);
    return;
  } catch (error) {
    if (mongoUri.startsWith("mongodb+srv://") && isSrvDnsError(error)) {
      if (env.mongoUriDirect) {
        console.warn("MongoDB SRV DNS failed. Retrying with MONGODB_URI_DIRECT...");
        await connectWithOptionalDbName(env.mongoUriDirect);
        return;
      }

      throw new Error(
        "MongoDB SRV DNS echec. Configure MONGODB_URI_DIRECT (connection string standard Atlas) ou corrige DNS local (1.1.1.1/8.8.8.8).",
      );
    }
    throw error;
  }
};
