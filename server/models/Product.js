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
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, trim: true, required: true, maxlength: 150 },
    title: { type: String, trim: true, required: true, maxlength: 150, index: true },
    nameI18n: { type: localizedTextSchema, default: () => ({}) },
    description: { type: String, trim: true, maxlength: 1500, default: "" },
    descriptionI18n: { type: localizedTextSchema, default: () => ({}) },
    priceDh: { type: Number, min: 0, required: true },
    price: { type: Number, min: 0, required: true },
    imageUrl: { type: String, trim: true, default: "" },
    images: [{ type: String, trim: true }],
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
productSchema.index({ title: "text", name: "text", description: "text" });

productSchema.pre("validate", function syncLegacyFields() {
  if (!this.title && this.name) this.title = this.name;
  if (!this.name && this.title) this.name = this.title;
  if (this.price === undefined || this.price === null) this.price = this.priceDh;
  if (this.priceDh === undefined || this.priceDh === null) this.priceDh = this.price;
  if (!this.artisanId && this.artisan) this.artisanId = this.artisan;
  if (!this.artisan && this.artisanId) this.artisan = this.artisanId;

  if ((!this.images || !this.images.length) && this.imageUrl) {
    this.images = [this.imageUrl];
  }
  if ((!this.imageUrl || !this.imageUrl.trim()) && this.images?.length) {
    this.imageUrl = this.images[0];
  }
});

export const Product = mongoose.model("Product", productSchema);
