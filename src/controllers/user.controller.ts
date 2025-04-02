import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const getUserProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
        const userId = req.userId;

        const products = await Product.find({
            owner : userId
        });

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
  }

  export const updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { newPassword, password } = req.body;
  
      if (!password || !newPassword) {
        res.status(400).json({ message: "Both old and new passwords are required", success: false });
        return;
      }
  
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized request", success: false });
        return;
      }
  
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found", success: false });
        return;
      }
  
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        res.status(401).json({ message: "Invalid password", success: false });
        return;
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ message: "Password changed successfully.", success: true });
    } catch (error) {
      next(error);
    }
  };
  