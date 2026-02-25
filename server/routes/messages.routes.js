import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

const router = Router();

router.post("/", requireAuth, requireRole("admin", "artisan", "user", "visitor"), async (req, res) => {
  const { toArtisanId, subject, content } = req.body || {};
  if (!toArtisanId || !content) {
    return res.status(400).json({ message: "Destinataire artisan et contenu requis." });
  }

  const artisan = await User.findById(toArtisanId).lean();
  if (!artisan || artisan.role !== "artisan") {
    return res.status(404).json({ message: "Artisan introuvable." });
  }

  const message = await Message.create({
    fromUser: req.user.id,
    toArtisan: toArtisanId,
    subject: String(subject || "").trim(),
    content: String(content).trim(),
  });

  return res.status(201).json({ message });
});

router.get("/inbox", requireAuth, requireRole("admin", "artisan"), async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { toArtisan: req.user.id };
  const messages = await Message.find(filter)
    .populate("fromUser", "firstName lastName email")
    .populate("toArtisan", "firstName lastName shopName")
    .sort({ createdAt: -1 })
    .lean();
  return res.json({ messages });
});

router.patch("/:id/read", requireAuth, requireRole("admin", "artisan"), async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ message: "Message introuvable." });
  }

  if (req.user.role !== "admin" && String(message.toArtisan) !== req.user.id) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  message.readAt = new Date();
  await message.save();
  return res.json({ message });
});

export default router;
