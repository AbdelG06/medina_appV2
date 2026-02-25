import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const hashPassword = async (password) => bcrypt.hash(password, 12);
export const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);

export const signAccessToken = (user) =>
  jwt.sign(
    {
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
    },
    env.jwtSecret,
    {
      subject: String(user._id),
      expiresIn: env.jwtExpiresIn,
    },
  );
