import { NextFunction, Request, Response } from 'express';
import { Product } from '../models/product.model';

export const isOwner = async(req:Request , res:Response, next:NextFunction)=>{
    try {

        const product = await Product.findById(req.params.id);

        if(!product){
            res.status(404).json({message:"Product not found"});
            return;
        }

        if(product?.owner.toString() != req.userId){
            res.status(401).json({
                message : "You are not the owner of this product",
                success : false
            });
            return;
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}