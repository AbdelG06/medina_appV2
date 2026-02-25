import { User } from "./models/User.js";
import { env } from "./config/env.js";
import { hashPassword } from "./utils/security.js";

export const ensureAdminUser = async () => {
  const [firstName, ...rest] = env.adminName.split(" ");
  const lastName = rest.join(" ") || "Admin";
  const passwordHash = await hashPassword(env.adminPassword);

  const admin = await User.findOneAndUpdate(
    { email: env.adminEmail.toLowerCase() },
    {
      $set: {
        firstName,
        lastName,
        email: env.adminEmail.toLowerCase(),
        passwordHash,
        role: "admin",
        status: "accepted",
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  return admin;
};
