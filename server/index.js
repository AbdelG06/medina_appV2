import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { assertEnv, env } from "./config/env.js";
import { ensureAdminUser } from "./seed-admin.js";

const start = async () => {
  assertEnv();
  await connectDatabase(env.mongoUri);
  await ensureAdminUser();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Server bootstrap error:", error);
  process.exit(1);
});
