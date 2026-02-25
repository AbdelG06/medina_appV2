import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import monumentsRoutes from "./routes/monuments.routes.js";
import productsRoutes from "./routes/products.routes.js";
import souvenirsRoutes from "./routes/souvenirs.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));

  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/monuments", monumentsRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/souvenirs", souvenirsRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/messages", messagesRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
