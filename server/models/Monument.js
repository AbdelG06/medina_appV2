import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
  {
    fr: { type: String, trim: true, default: "" },
    ar: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const monumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    nameI18n: { type: localizedTextSchema, default: () => ({}) },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    category: { type: String, trim: true, maxlength: 80, default: "General" },
    city: { type: String, trim: true, maxlength: 120, default: "Fes" },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      address: { type: String, trim: true, maxlength: 200, default: "" },
    },
    shortDescription: { type: String, trim: true, maxlength: 300, default: "" },
    shortDescriptionI18n: { type: localizedTextSchema, default: () => ({}) },
    history: { type: String, trim: true, maxlength: 4000, default: "" },
    anecdote: { type: String, trim: true, maxlength: 1000, default: "" },
    bestVisitTime: { type: String, trim: true, maxlength: 200, default: "" },
    recommendedDuration: { type: String, trim: true, maxlength: 200, default: "" },
    localAdvice: { type: String, trim: true, maxlength: 500, default: "" },
    photos: [{ type: String, trim: true }],
    views: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

monumentSchema.index({ category: 1, city: 1, slug: 1 });
monumentSchema.index({ name: "text", shortDescription: "text", history: "text" });

export const Monument = mongoose.model("Monument", monumentSchema);
