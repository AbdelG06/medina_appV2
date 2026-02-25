import { Router } from "express";
import { Product } from "../models/Product.js";
import { ProductReview } from "../models/ProductReview.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const productListCache = new Map();
const PRODUCT_LIST_CACHE_TTL_MS = 60 * 1000;

const normalizeProduct = (product) => ({
  _id: String(product._id),
  artisan: product.artisan,
  name: product.name,
  nameI18n: product.nameI18n,
  description: product.description,
  descriptionI18n: product.descriptionI18n,
  priceDh: product.priceDh,
  imageUrl: product.imageUrl,
  stock: product.stock || 0,
  category: product.category || "autre",
  views: product.views || 0,
  ratingAvg: product.ratingAvg || 0,
  ratingCount: product.ratingCount || 0,
  status: product.status,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

router.get("/", async (_req, res) => {
  const page = Math.max(Number(_req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(_req.query.limit || 12), 1), 50);
  const skip = (page - 1) * limit;
  const cacheKey = `${page}:${limit}`;
  const now = Date.now();
  const cached = productListCache.get(cacheKey);

  if (cached && now - cached.createdAt < PRODUCT_LIST_CACHE_TTL_MS) {
    return res.json(cached.payload);
  }

  const [products, total] = await Promise.all([
    Product.find({ status: "accepted" })
    .populate("artisan", "firstName lastName shopName artisanCode recommended")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(),
    Product.countDocuments({ status: "accepted" }),
  ]);

  const payload = {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };

  productListCache.set(cacheKey, { createdAt: now, payload });
  return res.json(payload);
});

router.get("/mine", requireAuth, requireRole("artisan", "admin"), async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { artisan: req.user.id };
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return res.json({
    products: products.map(normalizeProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

router.get("/all-unlimited", requireAuth, requireRole("admin"), async (_req, res) => {
  const products = await Product.find({})
    .populate("artisan", "firstName lastName shopName artisanCode recommended")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ products });
});

router.post("/", requireAuth, requireRole("artisan", "admin"), async (req, res) => {
  const { name, nameI18n, description, descriptionI18n, priceDh, imageUrl, stock, category } = req.body || {};
  if (!name || priceDh === undefined) {
    return res.status(400).json({ message: "Nom et prix requis." });
  }
  const product = await Product.create({
    artisan: req.user.id,
    name: String(name).trim(),
    nameI18n: {
      fr: String(nameI18n?.fr || "").trim(),
      ar: String(nameI18n?.ar || "").trim(),
    },
    description: String(description || "").trim(),
    descriptionI18n: {
      fr: String(descriptionI18n?.fr || "").trim(),
      ar: String(descriptionI18n?.ar || "").trim(),
    },
    priceDh: Number(priceDh),
    imageUrl: String(imageUrl || "").trim(),
    stock: Number(stock || 0),
    category: String(category || "autre").trim().toLowerCase(),
    status: req.user.role === "admin" ? "accepted" : "pending",
  });
  productListCache.clear();
  return res.status(201).json({ product: normalizeProduct(product) });
});

router.patch("/:id", requireAuth, requireRole("artisan", "admin"), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }
  if (req.user.role !== "admin" && String(product.artisan) !== req.user.id) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  if (req.body?.name !== undefined) product.name = String(req.body.name).trim();
  if (req.body?.nameI18n !== undefined) {
    product.nameI18n = {
      fr: String(req.body.nameI18n?.fr || "").trim(),
      ar: String(req.body.nameI18n?.ar || "").trim(),
    };
  }
  if (req.body?.description !== undefined) product.description = String(req.body.description).trim();
  if (req.body?.descriptionI18n !== undefined) {
    product.descriptionI18n = {
      fr: String(req.body.descriptionI18n?.fr || "").trim(),
      ar: String(req.body.descriptionI18n?.ar || "").trim(),
    };
  }
  if (req.body?.priceDh !== undefined) product.priceDh = Number(req.body.priceDh);
  if (req.body?.imageUrl !== undefined) product.imageUrl = String(req.body.imageUrl).trim();
  if (req.body?.stock !== undefined) product.stock = Number(req.body.stock);
  if (req.body?.category !== undefined) product.category = String(req.body.category).trim().toLowerCase();
  if (req.user.role === "artisan") product.status = "pending";
  await product.save();
  productListCache.clear();

  return res.json({ product: normalizeProduct(product) });
});

router.patch("/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  const nextStatus = String(req.body?.status || "");
  if (!["accepted", "rejected", "pending"].includes(nextStatus)) {
    return res.status(400).json({ message: "Statut invalide." });
  }
  const product = await Product.findByIdAndUpdate(req.params.id, { status: nextStatus }, { new: true });
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }
  productListCache.clear();
  return res.json({ product: normalizeProduct(product) });
});

router.post("/:id/view", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }
  return res.json({ views: product.views || 0 });
});

router.get("/:id/reviews", async (req, res) => {
  const reviews = await ProductReview.find({ product: req.params.id })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ reviews });
});

router.post("/:id/reviews", requireAuth, async (req, res) => {
  const rating = Number(req.body?.rating);
  const comment = String(req.body?.comment || "").trim();
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Note invalide." });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  const review = await ProductReview.findOneAndUpdate(
    { product: req.params.id, user: req.user.id },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const agg = await ProductReview.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  product.ratingAvg = Number(agg[0]?.avgRating || 0);
  product.ratingCount = Number(agg[0]?.count || 0);
  await product.save();

  return res.status(201).json({ review, ratingAvg: product.ratingAvg, ratingCount: product.ratingCount });
});

export default router;
