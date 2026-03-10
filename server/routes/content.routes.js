import { Router } from "express";
import { ContentItem } from "../models/ContentItem.js";

const router = Router();

router.get("/", async (req, res) => {
  const rawTypes = req.query.type ? String(req.query.type) : "";
  const types = rawTypes
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const filter = types.length ? { type: { $in: types } } : {};
  const items = await ContentItem.find(filter).sort({ updatedAt: -1, createdAt: -1 }).lean();
  return res.json({ items });
});

export default router;
