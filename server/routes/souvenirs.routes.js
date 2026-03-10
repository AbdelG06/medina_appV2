import { Router } from "express";
import fs from "fs";
import path from "path";
import { upload, isCloudinaryEnabled } from "../config/cloudinary.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { SouvenirPhoto } from "../models/SouvenirPhoto.js";
import { User } from "../models/User.js";

const router = Router();
const localSouvenirsDir = path.resolve(process.cwd(), "uploads", "souvenirs");
if (!fs.existsSync(localSouvenirsDir)) {
  fs.mkdirSync(localSouvenirsDir, { recursive: true });
}

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

router.get("/profile/me", requireAuth, async (req, res) => {
  const [profile, photos] = await Promise.all([
    User.findById(req.user.id).select("firstName lastName email role bio avatarUrl createdAt").lean(),
    SouvenirPhoto.find({ user: req.user.id })
      .populate("comments.user", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  if (!profile) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }

  const totalLikes = photos.reduce((sum, item) => sum + (Array.isArray(item.likes) ? item.likes.length : 0), 0);
  const approvedCount = photos.filter((item) => Boolean(item.isApproved)).length;
  return res.json({
    profile,
    stats: {
      postCount: photos.length,
      approvedCount,
      totalLikes,
    },
    photos,
  });
});

router.patch("/profile/me", requireAuth, async (req, res) => {
  const update = {
    ...(req.body?.firstName !== undefined ? { firstName: String(req.body.firstName).trim() } : {}),
    ...(req.body?.lastName !== undefined ? { lastName: String(req.body.lastName).trim() } : {}),
    ...(req.body?.bio !== undefined ? { bio: String(req.body.bio).trim().slice(0, 300) } : {}),
    ...(req.body?.avatarUrl !== undefined ? { avatarUrl: String(req.body.avatarUrl).trim() } : {}),
  };

  if (!Object.keys(update).length) {
    return res.status(400).json({ message: "Aucune modification detectee." });
  }

  const profile = await User.findByIdAndUpdate(req.user.id, update, { new: true })
    .select("firstName lastName email role bio avatarUrl createdAt")
    .lean();
  if (!profile) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }

  return res.json({ profile });
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
  if (!req.file) {
    return res.status(400).json({ message: "Fichier image invalide." });
  }

  if (isCloudinaryEnabled() && typeof req.file.path === "string" && req.file.path.trim()) {
    return res.status(201).json({ imageUrl: req.file.path });
  }

  if (!req.file.buffer) {
    return res.status(400).json({ message: "Upload local indisponible pour ce fichier." });
  }

  const extFromMime = String(req.file.mimetype || "").split("/")[1] || "jpg";
  const extFromName = path.extname(req.file.originalname || "").replace(".", "");
  const ext = (extFromName || extFromMime || "jpg").toLowerCase();
  const fileName = `souvenir-${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
  const destination = path.join(localSouvenirsDir, fileName);
  await fs.promises.writeFile(destination, req.file.buffer);
  return res.status(201).json({ imageUrl: `/uploads/souvenirs/${fileName}` });
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

router.delete("/:id", requireAuth, async (req, res) => {
  const photo = await SouvenirPhoto.findById(req.params.id);
  if (!photo) {
    return res.status(404).json({ message: "Photo introuvable." });
  }

  const isOwner = String(photo.user) === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  await photo.deleteOne();
  return res.json({ message: "Photo supprimee." });
});

export default router;
