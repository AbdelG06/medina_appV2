import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
  {
    fr: { type: String, trim: true, default: "" },
    ar: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, trim: true, required: true, maxlength: 150 },
    nameI18n: { type: localizedTextSchema, default: () => ({}) },
    description: { type: String, trim: true, maxlength: 1500, default: "" },
    descriptionI18n: { type: localizedTextSchema, default: () => ({}) },
    priceDh: { type: Number, min: 0, required: true },
    imageUrl: { type: String, trim: true, default: "" },
    stock: { type: Number, min: 0, default: 0 },
    category: { type: String, trim: true, maxlength: 80, default: "autre", index: true },
    views: { type: Number, default: 0, min: 0 },
    ratingAvg: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending", index: true },
  },
  { timestamps: true },
);

productSchema.index({ status: 1, category: 1, createdAt: -1 });
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
