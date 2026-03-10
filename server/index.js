import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { assertEnv, env } from "./config/env.js";
import { ensureAdminUser } from "./seed-admin.js";
import { ensureSouvenirsDemoData } from "./seed-souvenirs.js";

const start = async () => {
  assertEnv();
  await connectDatabase(env.mongoUriDirect || env.mongoUri);
  const admin = await ensureAdminUser();
  await ensureSouvenirsDemoData(admin._id);

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API server running on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error("Server bootstrap error:", error);
  process.exit(1);
});
