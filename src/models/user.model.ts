import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery"],
      default: "user",
    },
    college : {
      type: String,
      required: true,
      set: (value: string) => value.toLowerCase().trim(),
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
