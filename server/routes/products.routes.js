import { Router } from "express";
import isEmail from "validator/lib/isEmail.js";
import { Product } from "../models/Product.js";
import { ProductReview } from "../models/ProductReview.js";
import { ProductMessage } from "../models/ProductMessage.js";
import { Shop } from "../models/Shop.js";
import { User } from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { productUpload } from "../middleware/upload.js";

const router = Router();
const productListCache = new Map();
const PRODUCT_LIST_CACHE_TTL_MS = 60 * 1000;

const normalizeProduct = (product) => ({
  _id: String(product._id),
  artisan: product.artisan || product.artisanId,
  artisanId: String(product.artisanId || product.artisan || ""),
  name: product.name || product.title,
  title: product.title || product.name,
  nameI18n: product.nameI18n,
  description: product.description,
  descriptionI18n: product.descriptionI18n,
  priceDh: Number(product.priceDh ?? product.price ?? 0),
  price: Number(product.price ?? product.priceDh ?? 0),
  imageUrl: product.imageUrl || product.images?.[0] || "",
  images: Array.isArray(product.images) ? product.images : product.imageUrl ? [product.imageUrl] : [],
  stock: product.stock || 0,
  category: product.category || "autre",
  views: product.views || 0,
  ratingAvg: product.ratingAvg || 0,
  ratingCount: product.ratingCount || 0,
  status: product.status,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const normalizeImageList = (images, imageUrl) => {
  const fromArray = Array.isArray(images) ? images : [];
  const fromArrayTrimmed = fromArray.map((value) => String(value || "").trim()).filter(Boolean);
  const fallback = String(imageUrl || "").trim();
  const all = [...fromArrayTrimmed, ...(fallback ? [fallback] : [])];
  return Array.from(new Set(all)).slice(0, 4);
};

router.post("/upload", requireAuth, requireRole("artisan", "admin"), (req, res, next) => {
  productUpload.array("images", 4)(req, res, (error) => {
    if (error) return next(error);
    const files = Array.isArray(req.files) ? req.files : [];
    const urls = files.map((file) => `/uploads/products/${file.filename}`);
    return res.status(201).json({ images: urls });
  });
});

router.get("/eshop", async (_req, res) => {
  const shops = await Shop.aggregate([
    {
      $lookup: {
        from: "products",
        let: { artisanId: "$artisanId" },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$artisanId", "$$artisanId"] }, { $eq: ["$status", "accepted"] }] } } },
          { $project: { _id: 1 } },
        ],
        as: "products",
      },
    },
    {
      $project: {
        artisanId: 1,
        shopName: 1,
        shopSlug: 1,
        shopDescription: 1,
        shopLogo: 1,
        city: 1,
        productCount: { $size: "$products" },
      },
    },
    { $sort: { productCount: -1, shopName: 1 } },
  ]);

  return res.json({ shops });
});

router.get("/shop/:artisanId", async (req, res) => {
  const artisanId = String(req.params.artisanId || "");
  const [shop, artisan, products] = await Promise.all([
    Shop.findOne({ artisanId }).lean(),
    User.findById(artisanId).select("firstName lastName shopName shopAddress").lean(),
    Product.find({ $and: [{ status: "accepted" }, { $or: [{ artisanId }, { artisan: artisanId }] }] }).sort({ createdAt: -1 }).lean(),
  ]);

  if (!shop && !artisan) {
    return res.status(404).json({ message: "Boutique introuvable." });
  }

  return res.json({
    shop: {
      artisanId,
      shopName: shop?.shopName || artisan?.shopName || "Boutique artisan",
      shopSlug: shop?.shopSlug || "",
      shopDescription: shop?.shopDescription || "",
      shopLogo: shop?.shopLogo || "",
      city: shop?.city || "Fes",
      artisanName: artisan ? `${artisan.firstName || ""} ${artisan.lastName || ""}`.trim() : "",
    },
    products: products.map(normalizeProduct),
  });
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
      .populate("artisanId", "firstName lastName shopName artisanCode recommended")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments({ status: "accepted" }),
  ]);

  const payload = {
    products: products.map(normalizeProduct),
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
  const filter = req.user.role === "admin" ? {} : { $or: [{ artisanId: req.user.id }, { artisan: req.user.id }] };
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

router.post("/", requireAuth, requireRole("artisan", "admin"), async (req, res) => {
  const { title, name, description, price, priceDh, images, imageUrl, stock, category } = req.body || {};
  const finalTitle = String(title || name || "").trim();
  const finalPrice = Number(price ?? priceDh);
  if (!finalTitle || !Number.isFinite(finalPrice)) {
    return res.status(400).json({ message: "Titre et prix valides requis." });
  }

  const normalizedImages = normalizeImageList(images, imageUrl);
  if (normalizedImages.length > 4) {
    return res.status(400).json({ message: "Maximum 4 images par produit." });
  }

  const product = await Product.create({
    artisan: req.user.id,
    artisanId: req.user.id,
    title: finalTitle,
    name: finalTitle,
    description: String(description || "").trim(),
    price: finalPrice,
    priceDh: finalPrice,
    images: normalizedImages,
    imageUrl: normalizedImages[0] || "",
    stock: Number(stock || 0),
    category: String(category || "autre").trim().toLowerCase(),
    views: 0,
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
  if (req.user.role !== "admin" && String(product.artisanId || product.artisan) !== req.user.id) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  if (req.body?.title !== undefined || req.body?.name !== undefined) {
    const nextTitle = String(req.body?.title ?? req.body?.name ?? "").trim();
    if (nextTitle) {
      product.title = nextTitle;
      product.name = nextTitle;
    }
  }
  if (req.body?.description !== undefined) product.description = String(req.body.description).trim();
  if (req.body?.price !== undefined || req.body?.priceDh !== undefined) {
    const nextPrice = Number(req.body?.price ?? req.body?.priceDh);
    if (Number.isFinite(nextPrice)) {
      product.price = nextPrice;
      product.priceDh = nextPrice;
    }
  }
  if (req.body?.images !== undefined || req.body?.imageUrl !== undefined) {
    const normalizedImages = normalizeImageList(req.body?.images, req.body?.imageUrl);
    if (normalizedImages.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images par produit." });
    }
    product.images = normalizedImages;
    product.imageUrl = normalizedImages[0] || "";
  }
  if (req.body?.stock !== undefined) product.stock = Number(req.body.stock || 0);
  if (req.body?.category !== undefined) product.category = String(req.body.category).trim().toLowerCase();
  if (req.user.role === "artisan") product.status = "pending";
  await product.save();

  productListCache.clear();
  return res.json({ product: normalizeProduct(product) });
});

router.delete("/:id", requireAuth, requireRole("artisan", "admin"), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }
  if (req.user.role !== "admin" && String(product.artisanId || product.artisan) !== req.user.id) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  await Promise.all([
    ProductMessage.deleteMany({ productId: product._id }),
    ProductReview.deleteMany({ product: product._id }),
    product.deleteOne(),
  ]);
  productListCache.clear();
  return res.json({ message: "Produit supprime." });
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

router.post("/:id/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Nom, email et message requis." });
  }
  if (!isEmail(String(email))) {
    return res.status(400).json({ message: "Email invalide." });
  }

  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  const saved = await ProductMessage.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    message: String(message).trim(),
    productId: product._id,
    artisanId: product.artisanId || product.artisan,
  });

  return res.status(201).json({ message: saved });
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

router.get("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate("artisanId", "firstName lastName shopName")
    .lean();
  if (!product || product.status !== "accepted") {
    return res.status(404).json({ message: "Produit introuvable." });
  }

  return res.json({ product: normalizeProduct(product), artisan: product.artisanId || null });
});

export default router;
