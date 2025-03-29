import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model";
import { productSchema } from "../validation/productValidations";
import bucket from "../config/firebase";


export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const parsedData = productSchema.safeParse(req.body);

      if (!parsedData.success) {
        const errors = parsedData.error.errors.map(err => err.message);
        res.status(400).json({ message: errors[0] }); // Send one error at a time
        return;
      }
      const userId = req.userId;
      
      const product = new Product({
        ...parsedData.data,
        owner : userId
      });

      await product.save();
      
      res.status(200).json({
        success : true,
        message : "Product created successfully"
      })
        
    } catch (error) {
        next(error)
    }
  }

  export const getPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { filenames } = req.body;
      console.log(filenames);
      
  
      if (!Array.isArray(filenames) || filenames.length === 0) {
        res.status(400).json({ error: "Invalid filenames array" });
        return;
      }
  
      const signedUrls = await Promise.all(
        filenames.map(async (filename) => {
          const filePath = `uploads/${filename.name}`; // ✅ Define filePath
          const file = bucket.file(filePath);
  
          // ✅ Generate Signed URL (for Upload)
          const [url] = await file.getSignedUrl({
            action: "write", 
            expires: Date.now() + 15 * 60 * 1000, // 15 mins expiry
            contentType: filename.type, 
          });
  
          // ✅ Generate Public URL (for Viewing)
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
  
          return { filename, uploadUrl: url, publicUrl }; // ✅ Return both
        })
      );
  
      res.json({ signedUrls });
    } catch (error) {
      next(error);
    }
  };
  
  
  export const getProducts = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
      try {
          const page = Math.abs(Number(req.query.page) || 1);
          const limit = Math.abs(Number(req.query.limit) || 10);
          const skip = (page - 1) * limit;
  
          // Fetch paginated products
          const products = await Product.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
  
          // Get total product count
          const totalProducts = await Product.countDocuments();
  
          res.status(200).json({
              success: true,
              totalPages: Math.ceil(totalProducts / limit),
              currentPage: page,
              data: products,
          });
      } catch (error) {
          next(error);
      }
  };
  
  export const getProductbyId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId).populate("owner", "username email");

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = productSchema.safeParse(req.body);

    if (!parsedData.success) {
      const errors = parsedData.error.errors.map(err => err.message);
      res.status(400).json({ message: errors[0] }); // Send one error at a time
      return;
    }

    const id = req.params.id;
    
    await Product.findByIdAndUpdate(id, parsedData.data, { new: true , runValidators : true});
    
    res.status(200).json({
      success : true,
      message : "Product updated successfully"
    });

  } catch (error) {
    next(error);
  }
}