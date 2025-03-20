import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  category: "books" | "electronics" | "cycles" | "hostel essentials" | "projects" | "other";
  condition: "like new" | "good" | "fair" | "poor";
  saletype: "fixed price" | "auction" | "open to offers";
  price?: number;
  images?: string[];
  contactMethod: "phone" | "email" | "both";
  phone?: string;
  email?: string;
  owner: mongoose.Schema.Types.ObjectId;
  meetingLocation: string;
  createdAt: Date;
}

// Define Product Schema
const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["books", "electronics", "cycles", "hostel essentials", "projects", "other"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["like new", "good", "fair", "poor"],
    },
    saletype: {
      type: String,
      required: true,
      enum: ["fixed price", "auction", "open to offers"],
    },
    price: {
      type: Number,
      required: function (this: IProduct) {
        return this.saletype === "fixed price";
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (this: IProduct, val: string[]) {
          return val.length <= 5;
        },
        message: "Max 5 images allowed",
      },
    },
    contactMethod: {
      type: String,
      required: true,
      enum: ["phone", "email", "both"],
    },
    phone: {
      type: String,
      required: function (this: IProduct) {
        return this.contactMethod !== "email";
      },
    },
    email: {
      type: String,
      required: function (this: IProduct) {
        return this.contactMethod !== "phone";
      },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    meetingLocation: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Export Product Model
export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
