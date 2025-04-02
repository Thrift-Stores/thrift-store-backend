import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { getUserProducts, updatePassword } from "../controllers/user.controller";

const router : Router = express.Router();

router.route('/product').get(isAuthenticated, getUserProducts);

router.route('/update-password').post(isAuthenticated, updatePassword);

export default router;