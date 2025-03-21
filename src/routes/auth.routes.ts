import express, { Router } from "express";
import { login, register, verifyUser } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router : Router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/verify').get(isAuthenticated, verifyUser);

export default router;