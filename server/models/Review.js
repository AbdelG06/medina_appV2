import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    monument: { type: mongoose.Schema.Types.ObjectId, ref: "Monument", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true },
);

reviewSchema.index({ monument: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
