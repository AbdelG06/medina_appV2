import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ContentItem } from "../models/ContentItem.js";
import { Monument } from "../models/Monument.js";
import { Product } from "../models/Product.js";
import { SouvenirPhoto } from "../models/SouvenirPhoto.js";
import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import { hashPassword } from "../utils/security.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/stats", async (_req, res) => {
  const [artisanCount, productCount, pendingProducts, monumentCount, pendingSouvenirs, userCount] =
    await Promise.all([
      User.countDocuments({ role: "artisan" }),
      Product.countDocuments({}),
      Product.countDocuments({ status: "pending" }),
      Monument.countDocuments({}),
      SouvenirPhoto.countDocuments({ isApproved: false }),
      User.countDocuments({}),
    ]);

  return res.json({
    stats: {
      artisanCount,
      productCount,
      pendingProducts,
      monumentCount,
      pendingSouvenirs,
      userCount,
    },
  });
});

router.get("/dashboard", async (_req, res) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    monumentCount,
    artisanCount,
    productCount,
    visitorCount,
    latestArtisans,
    latestProducts,
    productsByCategory,
    artisansByMonth,
    monumentViews,
    unreadMessages,
  ] = await Promise.all([
    Monument.countDocuments({}),
    User.countDocuments({ role: "artisan" }),
    Product.countDocuments({}),
    User.countDocuments({ role: { $in: ["user", "visitor"] } }),
    User.find({ role: "artisan" }).sort({ createdAt: -1 }).limit(6).select("firstName lastName email status createdAt").lean(),
    Product.find({}).sort({ createdAt: -1 }).limit(6).select("name category status priceDh createdAt").lean(),
    Product.aggregate([
      { $group: { _id: "$category", total: { $sum: 1 } } },
      { $project: { _id: 0, category: { $ifNull: ["$_id", "autre"] }, total: 1 } },
      { $sort: { total: -1 } },
    ]),
    User.aggregate([
      { $match: { role: "artisan", createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Monument.find({}).select("name views").sort({ views: -1 }).limit(8).lean(),
    Message.countDocuments({ readAt: null }),
  ]);

  const monthLabels = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aout",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const artisansByMonthFilled = monthLabels.map((label, index) => {
    const found = artisansByMonth.find((item) => item._id === index + 1);
    return { month: label, total: found?.total || 0 };
  });

  return res.json({
    cards: {
      monumentCount,
      artisanCount,
      productCount,
      visitorCount,
      unreadMessages,
    },
    latestArtisans,
    latestProducts,
    charts: {
      productsByCategory,
      artisansByMonth: artisansByMonthFilled,
      monumentViews: monumentViews.map((m) => ({ name: m.name, views: m.views || 0 })),
    },
  });
});

router.post("/artisan", async (req, res) => {
  const { firstName, lastName, cin, shopAddress, shopName, email, password } = req.body || {};
  if (!firstName || !lastName || !cin || !shopAddress || !shopName || !password) {
    return res.status(400).json({ message: "Informations artisan manquantes." });
  }

  const duplicateCin = await User.findOne({ cin: String(cin).trim() }).lean();
  if (duplicateCin) {
    return res.status(409).json({ message: "CIN deja utilise." });
  }

  const artisanCode = `ART-${Math.floor(100000 + Math.random() * 900000)}`;
  const user = await User.create({
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    cin: String(cin).trim(),
    shopAddress: String(shopAddress).trim(),
    shopName: String(shopName).trim(),
    email: email ? String(email).trim().toLowerCase() : undefined,
    passwordHash: await hashPassword(String(password)),
    artisanCode,
    role: "artisan",
    status: "accepted",
  });

  return res.status(201).json({
    artisan: {
      id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      cin: user.cin,
      shopAddress: user.shopAddress,
      shopName: user.shopName,
      artisanCode: user.artisanCode,
      status: user.status,
    },
  });
});

router.get("/artisans", async (_req, res) => {
  const artisans = await User.aggregate([
    { $match: { role: "artisan" } },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "artisan",
        as: "products",
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        cin: 1,
        shopName: 1,
        status: 1,
        recommended: 1,
        createdAt: 1,
        productCount: { $size: "$products" },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  return res.json({ artisans });
});

router.patch("/artisans/:id/status", async (req, res) => {
  const nextStatus = String(req.body?.status || "");
  if (!["accepted", "rejected", "suspended", "pending"].includes(nextStatus)) {
    return res.status(400).json({ message: "Statut artisan invalide." });
  }

  const artisan = await User.findOneAndUpdate(
    { _id: req.params.id, role: "artisan" },
    {
      status: nextStatus,
      suspendedReason: nextStatus === "suspended" ? String(req.body?.reason || "Suspendu par admin") : "",
    },
    { new: true },
  );

  if (!artisan) {
    return res.status(404).json({ message: "Artisan introuvable." });
  }

  return res.json({ artisan });
});

router.patch("/artisans/:id/recommended", async (req, res) => {
  const recommended = Boolean(req.body?.recommended);
  const artisan = await User.findOneAndUpdate(
    { _id: req.params.id, role: "artisan" },
    { recommended },
    { new: true },
  );

  if (!artisan) {
    return res.status(404).json({ message: "Artisan introuvable." });
  }

  return res.json({ artisan });
});

router.get("/users", async (req, res) => {
  const role = req.query.role ? String(req.query.role) : undefined;
  const filter = role ? { role } : {};
  const users = await User.find(filter)
    .select("firstName lastName email role status createdAt")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return res.json({ users });
});

router.get("/content", async (req, res) => {
  const type = req.query.type ? String(req.query.type) : undefined;
  const filter = type ? { type } : {};
  const items = await ContentItem.find(filter).sort({ createdAt: -1 }).lean();
  return res.json({ items });
});

router.post("/content", async (req, res) => {
  const { type, name, description, imageUrl } = req.body || {};
  if (!type || !name) {
    return res.status(400).json({ message: "Type et nom requis." });
  }
  const item = await ContentItem.create({
    type: String(type),
    name: String(name).trim(),
    description: String(description || "").trim(),
    imageUrl: String(imageUrl || "").trim(),
  });
  return res.status(201).json({ item });
});

router.patch("/content/:id", async (req, res) => {
  const update = req.body || {};
  const item = await ContentItem.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!item) {
    return res.status(404).json({ message: "Element introuvable." });
  }
  return res.json({ item });
});

router.delete("/content/:id", async (req, res) => {
  const deleted = await ContentItem.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Element introuvable." });
  }
  return res.json({ message: "Element supprime." });
});

export default router;
