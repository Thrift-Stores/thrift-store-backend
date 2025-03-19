import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDb from "./config/db";
import cookieParser from "cookie-parser";

const app = express();

import authRouter from "./routes/auth.routes";

//db connection
connectToDb();

const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Working");
});

//api's
app.use("/api/auth", authRouter);

app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
