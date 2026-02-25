import { Router } from "express";
import slugify from "slugify";
import { Monument } from "../models/Monument.js";
import { Review } from "../models/Review.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const monumentProjection = {
  name: 1,
  nameI18n: 1,
  slug: 1,
  category: 1,
  city: 1,
  location: 1,
  shortDescription: 1,
  shortDescriptionI18n: 1,
  history: 1,
  anecdote: 1,
  bestVisitTime: 1,
  recommendedDuration: 1,
  localAdvice: 1,
  photos: 1,
  views: 1,
};

router.get("/", async (_req, res) => {
  const monuments = await Monument.find({}, monumentProjection).sort({ createdAt: -1 }).lean();
  return res.json({ monuments });
});

router.get("/:slug", async (req, res) => {
  const monumentDoc = await Monument.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true, projection: monumentProjection },
  );
  const monument = monumentDoc?.toObject ? monumentDoc.toObject() : monumentDoc;
  if (!monument) {
    return res.status(404).json({ message: "Monument introuvable." });
  }

  const stats = await Review.aggregate([
    { $match: { monument: monument._id } },
    {
      $group: {
        _id: "$monument",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return res.json({
    monument,
    rating: stats[0]?.avgRating || 0,
    reviewCount: stats[0]?.totalReviews || 0,
  });
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const payload = req.body || {};
  if (!payload.name) {
    return res.status(400).json({ message: "Nom monument requis." });
  }

  const baseSlug = payload.slug
    ? String(payload.slug).trim()
    : slugify(String(payload.name), { lower: true, strict: true });
  const taken = await Monument.findOne({ slug: baseSlug }).lean();
  if (taken) {
    return res.status(409).json({ message: "Slug monument deja utilise." });
  }

  const monument = await Monument.create({
    name: String(payload.name).trim(),
    nameI18n: {
      fr: String(payload.nameI18n?.fr || "").trim(),
      ar: String(payload.nameI18n?.ar || "").trim(),
    },
    slug: baseSlug,
    category: String(payload.category || "General").trim(),
    city: String(payload.city || "Fes").trim(),
    location: {
      lat: Number(payload.location?.lat || 0),
      lng: Number(payload.location?.lng || 0),
      address: String(payload.location?.address || "").trim(),
    },
    shortDescription: String(payload.shortDescription || "").trim(),
    shortDescriptionI18n: {
      fr: String(payload.shortDescriptionI18n?.fr || "").trim(),
      ar: String(payload.shortDescriptionI18n?.ar || "").trim(),
    },
    history: String(payload.history || "").trim(),
    anecdote: String(payload.anecdote || "").trim(),
    bestVisitTime: String(payload.bestVisitTime || "").trim(),
    recommendedDuration: String(payload.recommendedDuration || "").trim(),
    localAdvice: String(payload.localAdvice || "").trim(),
    photos: Array.isArray(payload.photos) ? payload.photos.map((p) => String(p)) : [],
    views: Number(payload.views || 0),
  });

  return res.status(201).json({ monument });
});

router.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const update = req.body || {};
  const monument = await Monument.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!monument) {
    return res.status(404).json({ message: "Monument introuvable." });
  }
  return res.json({ monument });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const monument = await Monument.findByIdAndDelete(req.params.id);
  if (!monument) {
    return res.status(404).json({ message: "Monument introuvable." });
  }
  return res.json({ message: "Monument supprime." });
});

router.get("/:slug/reviews", async (req, res) => {
  const monument = await Monument.findOne({ slug: req.params.slug }).lean();
  if (!monument) {
    return res.status(404).json({ message: "Monument introuvable." });
  }

  const reviews = await Review.find({ monument: monument._id })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ reviews });
});

router.post("/:slug/reviews", requireAuth, async (req, res) => {
  const monument = await Monument.findOne({ slug: req.params.slug }).lean();
  if (!monument) {
    return res.status(404).json({ message: "Monument introuvable." });
  }

  const rating = Number(req.body?.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Note invalide." });
  }

  const comment = String(req.body?.comment || "").trim();
  const review = await Review.findOneAndUpdate(
    { monument: monument._id, user: req.user.id },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return res.status(201).json({ review });
});

router.patch("/:slug/reviews/:reviewId", requireAuth, async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return res.status(404).json({ message: "Avis introuvable." });
  }
  if (String(review.user) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Acces refuse." });
  }

  if (req.body?.rating !== undefined) {
    const rating = Number(req.body.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Note invalide." });
    }
    review.rating = rating;
  }
  if (req.body?.comment !== undefined) {
    review.comment = String(req.body.comment).trim();
  }
  await review.save();
  return res.json({ review });
});

router.delete("/:slug/reviews/:reviewId", requireAuth, async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return res.status(404).json({ message: "Avis introuvable." });
  }
  if (String(review.user) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Acces refuse." });
  }
  await review.deleteOne();
  return res.json({ message: "Avis supprime." });
});

export default router;
