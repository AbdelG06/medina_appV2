import { Router } from "express";
import { upload, isCloudinaryEnabled } from "../config/cloudinary.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { SouvenirPhoto } from "../models/SouvenirPhoto.js";

const router = Router();

router.get("/", async (_req, res) => {
  const photos = await SouvenirPhoto.find({ isApproved: true })
    .populate("user", "firstName lastName")
    .populate("comments.user", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ photos });
});

router.get("/admin/all", requireAuth, requireRole("admin"), async (_req, res) => {
  const photos = await SouvenirPhoto.find({})
    .populate("user", "firstName lastName")
    .populate("comments.user", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ photos });
});

router.get("/mine", requireAuth, async (req, res) => {
  const photos = await SouvenirPhoto.find({ user: req.user.id })
    .populate("user", "firstName lastName")
    .populate("comments.user", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ photos });
});

router.post("/", requireAuth, async (req, res) => {
  const { caption, imageUrl } = req.body || {};
  if (!imageUrl) {
    return res.status(400).json({ message: "imageUrl requis." });
  }
  const photo = await SouvenirPhoto.create({
    user: req.user.id,
    caption: String(caption || "").trim(),
    imageUrl: String(imageUrl).trim(),
    isApproved: req.user.role === "admin",
  });
  return res.status(201).json({ photo });
});

router.post("/upload", requireAuth, upload.single("image"), async (req, res) => {
  if (!isCloudinaryEnabled()) {
    return res.status(400).json({ message: "Cloudinary non configure." });
  }
  if (!req.file || typeof req.file.path !== "string") {
    return res.status(400).json({ message: "Fichier image invalide." });
  }
  return res.status(201).json({ imageUrl: req.file.path });
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const photo = await SouvenirPhoto.findById(req.params.id);
  if (!photo || !photo.isApproved) {
    return res.status(404).json({ message: "Photo introuvable." });
  }

  const userId = req.user.id;
  const alreadyLiked = photo.likes.some((id) => String(id) === userId);
  if (alreadyLiked) {
    photo.likes = photo.likes.filter((id) => String(id) !== userId);
  } else {
    photo.likes.push(userId);
  }
  await photo.save();
  return res.json({ likes: photo.likes.length, liked: !alreadyLiked });
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const text = String(req.body?.text || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Commentaire requis." });
  }
  const photo = await SouvenirPhoto.findById(req.params.id);
  if (!photo || !photo.isApproved) {
    return res.status(404).json({ message: "Photo introuvable." });
  }
  photo.comments.push({ user: req.user.id, text });
  await photo.save();
  return res.status(201).json({ comments: photo.comments });
});

router.patch("/:id/comments/:commentId", requireAuth, async (req, res) => {
  const text = String(req.body?.text || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Commentaire requis." });
  }
  const photo = await SouvenirPhoto.findById(req.params.id);
  if (!photo) {
    return res.status(404).json({ message: "Photo introuvable." });
  }
  const comment = photo.comments.id(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ message: "Commentaire introuvable." });
  }
  if (String(comment.user) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Acces refuse." });
  }
  comment.text = text;
  await photo.save();
  return res.json({ comments: photo.comments });
});

router.patch("/:id/moderation", requireAuth, requireRole("admin"), async (req, res) => {
  const isApproved = Boolean(req.body?.isApproved);
  const photo = await SouvenirPhoto.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
  if (!photo) {
    return res.status(404).json({ message: "Photo introuvable." });
  }
  return res.json({ photo });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const deleted = await SouvenirPhoto.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Photo introuvable." });
  }
  return res.json({ message: "Photo supprimee." });
});

export default router;
