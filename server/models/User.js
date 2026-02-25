import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true, maxlength: 80 },
    lastName: { type: String, trim: true, required: true, maxlength: 80 },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    cin: { type: String, trim: true, index: true },
    shopAddress: { type: String, trim: true, maxlength: 200 },
    shopName: { type: String, trim: true, maxlength: 120 },
    artisanCode: { type: String, trim: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "artisan", "user", "visitor"], default: "user", index: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "suspended"],
      default: "accepted",
      index: true,
    },
    recommended: { type: Boolean, default: false, index: true },
    suspendedReason: { type: String, trim: true, maxlength: 200, default: "" },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
