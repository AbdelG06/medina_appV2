import mongoose from "mongoose";

const contentItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["monument", "restaurant", "cafe", "riad", "gastronomie", "artisan", "product"],
      required: true,
      index: true,
    },
    name: { type: String, trim: true, required: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 3000, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export const ContentItem = mongoose.model("ContentItem", contentItemSchema);
