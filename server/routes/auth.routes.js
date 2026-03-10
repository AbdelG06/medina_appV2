import { Router } from "express";
import isEmail from "validator/lib/isEmail.js";
import slugify from "slugify";
import { User } from "../models/User.js";
import { Shop } from "../models/Shop.js";
import { hashPassword, signAccessToken, verifyPassword } from "../utils/security.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const publicUser = (user) => ({
  id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  status: user.status || "accepted",
  recommended: Boolean(user.recommended),
  shopName: user.shopName || "",
  shopAddress: user.shopAddress || "",
  cin: user.cin || "",
  artisanCode: user.artisanCode || "",
  email: user.email || "",
  bio: user.bio || "",
  avatarUrl: user.avatarUrl || "",
});

router.post("/register-user", async (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Informations manquantes." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!isEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Email invalide." });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: "Mot de passe trop court (minimum 6 caracteres)." });
  }

  const existing = await User.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    return res.status(409).json({ message: "Email deja utilise." });
  }

  const user = await User.create({
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(String(password)),
    role: "user",
    status: "accepted",
  });

  const token = signAccessToken(user);
  return res.status(201).json({ token, user: publicUser(user) });
});

router.post("/register-artisan", async (req, res) => {
  const { firstName, lastName, cin, shopAddress, shopName, email, password } = req.body || {};
  if (!firstName || !lastName || !cin || !shopAddress || !shopName || !password) {
    return res.status(400).json({ message: "Informations manquantes." });
  }

  if (email && !isEmail(String(email))) {
    return res.status(400).json({ message: "Email invalide." });
  }

  const duplicateCin = await User.findOne({ cin: String(cin).trim() }).lean();
  if (duplicateCin) {
    return res.status(409).json({ message: "CIN deja utilise." });
  }

  const artisanCode = `ART-${Math.floor(100000 + Math.random() * 900000)}`;
  const passwordHash = await hashPassword(String(password));

  const user = await User.create({
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    cin: String(cin).trim(),
    shopAddress: String(shopAddress).trim(),
    shopName: String(shopName).trim(),
    email: email ? String(email).trim().toLowerCase() : undefined,
    passwordHash,
    artisanCode,
    role: "artisan",
    status: "pending",
  });

  const baseSlug = slugify(String(shopName).trim(), { lower: true, strict: true }) || `shop-${String(user._id).slice(-6)}`;
  let shopSlug = baseSlug;
  let suffix = 1;
  // Ensure unique shop slug
  while (await Shop.findOne({ shopSlug }).lean()) {
    suffix += 1;
    shopSlug = `${baseSlug}-${suffix}`;
  }

  await Shop.create({
    artisanId: user._id,
    shopName: String(shopName).trim(),
    shopSlug,
    shopDescription: "",
    shopLogo: "",
    city: "Fes",
  });

  const token = signAccessToken(user);
  return res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { emailOrCode, email, identifier: loginIdentifier, cin, artisanCode, password } = req.body || {};
  const rawIdentifier = emailOrCode || email || loginIdentifier || cin || artisanCode;
  if (!rawIdentifier || !password) {
    return res.status(400).json({ message: "Identifiants requis." });
  }

  const identifier = String(rawIdentifier).trim();
  const emailIdentifier = identifier.toLowerCase();
  const safeIdentifier = escapeRegex(identifier);
  const user = await User.findOne({
    $or: [
      { email: emailIdentifier },
      { artisanCode: { $regex: `^${safeIdentifier}$`, $options: "i" } },
      { cin: { $regex: `^${safeIdentifier}$`, $options: "i" } },
    ],
  });
  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }
  if (!user.passwordHash) {
    return res.status(401).json({ message: "Compte sans mot de passe valide." });
  }

  const validPassword = await verifyPassword(String(password), user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  if (user.role === "artisan" && user.status !== "accepted") {
    const messageByStatus = {
      pending: "Compte artisan en attente de validation.",
      rejected: "Compte artisan refuse par l'administration.",
      suspended: "Compte artisan suspendu.",
    };
    return res.status(403).json({ message: messageByStatus[user.status] || "Compte artisan non actif." });
  }

  const token = signAccessToken(user);
  return res.json({ token, user: publicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }
  return res.json({ user: publicUser(user) });
});

export default router;
