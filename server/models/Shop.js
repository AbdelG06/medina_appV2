import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    shopName: { type: String, trim: true, required: true, maxlength: 150 },
    shopSlug: { type: String, trim: true, required: true, unique: true, index: true },
    shopDescription: { type: String, trim: true, maxlength: 2000, default: "" },
    shopLogo: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, maxlength: 120, default: "Fes" },
  },
  { timestamps: true },
);

export const Shop = mongoose.model("Shop", shopSchema);
