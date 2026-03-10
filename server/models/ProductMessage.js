import mongoose from "mongoose";

const productMessageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 120 },
    email: { type: String, trim: true, required: true, maxlength: 160, lowercase: true },
    message: { type: String, trim: true, required: true, maxlength: 3000 },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const ProductMessage = mongoose.model("ProductMessage", productMessageSchema);
