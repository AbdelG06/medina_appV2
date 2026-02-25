import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Authentification requise." });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return res.status(401).json({ message: "Session invalide." });
    }

    req.user = {
      id: String(user._id),
      role: user.role,
      status: user.status || "accepted",
      firstName: user.firstName,
      lastName: user.lastName,
      artisanCode: user.artisanCode || null,
    };

    if (req.user.role === "artisan" && req.user.status !== "accepted") {
      return res.status(403).json({ message: "Compte artisan non actif." });
    }
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalide." });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Acces refuse." });
  }
  return next();
};
