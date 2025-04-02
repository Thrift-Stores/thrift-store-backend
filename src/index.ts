import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDb from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

import authRouter from "./routes/auth.routes";
import productRouter from "./routes/product.routes";
import userRouter from "./routes/user.routes";

//db connection
connectToDb();

const PORT = process.env.PORT || 8080;

//cors
app.use(
  cors({
    origin: process.env.ALLOWED_CLIENTS?.split(",").map((origin) =>
      origin.trim()
    ) || ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Working");
});

//api's
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
