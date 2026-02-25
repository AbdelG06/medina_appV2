import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    toArtisan: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, trim: true, maxlength: 160, default: "" },
    content: { type: String, trim: true, maxlength: 2000, required: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
