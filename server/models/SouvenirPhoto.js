import mongoose from "mongoose";

const souvenirCommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 500, required: true },
  },
  { timestamps: true },
);

const souvenirPhotoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caption: { type: String, trim: true, maxlength: 180, default: "" },
    imageUrl: { type: String, trim: true, required: true },
    isApproved: { type: Boolean, default: false, index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [souvenirCommentSchema],
  },
  { timestamps: true },
);

export const SouvenirPhoto = mongoose.model("SouvenirPhoto", souvenirPhotoSchema);
