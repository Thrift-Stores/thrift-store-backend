import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createProduct, getPresignedUrl, getProductbyId, getProducts, updateProduct } from "../controllers/product.controller";
import { isOwner } from "../middlewares/isOwner";

const router : Router = express.Router();

router.route('/')
    .post(isAuthenticated, createProduct)
    .get(getProducts);

router.route('/:id')
    .get(getProductbyId)
    .put(isAuthenticated, isOwner, updateProduct)

router.route('/pre-signed-urls').post(getPresignedUrl);

export default router;