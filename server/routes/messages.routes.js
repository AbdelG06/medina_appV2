import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Message } from "../models/Message.js";
import { ProductMessage } from "../models/ProductMessage.js";
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
  const productFilter = req.user.role === "admin" ? {} : { artisanId: req.user.id };

  const [messages, productMessages] = await Promise.all([
    Message.find(filter)
      .populate("fromUser", "firstName lastName email")
      .populate("toArtisan", "firstName lastName shopName")
      .sort({ createdAt: -1 })
      .lean(),
    ProductMessage.find(productFilter)
      .populate("productId", "title name")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const normalizedProductMessages = productMessages.map((item) => ({
    _id: String(item._id),
    subject: `Contact produit - ${item.productId?.title || item.productId?.name || "Produit"}`,
    content: item.message,
    readAt: item.readAt,
    createdAt: item.createdAt,
    fromUser: { firstName: item.name, lastName: "", email: item.email },
    source: "product",
  }));

  const normalizedMessages = messages.map((item) => ({ ...item, source: "internal" }));
  const merged = [...normalizedMessages, ...normalizedProductMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return res.json({ messages: merged });
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

router.patch("/product/:id/read", requireAuth, requireRole("admin", "artisan"), async (req, res) => {
  const productMessage = await ProductMessage.findById(req.params.id);
  if (!productMessage) {
    return res.status(404).json({ message: "Message introuvable." });
  }

  if (req.user.role !== "admin" && String(productMessage.artisanId) !== req.user.id) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  productMessage.readAt = new Date();
  await productMessage.save();
  return res.json({ message: productMessage });
});

export default router;
