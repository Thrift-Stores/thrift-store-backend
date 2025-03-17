import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDb from "./config/db";
const app = express();


//db connection
connectToDb();

const PORT = process.env.PORT || 8080;

app.get('/', async (req:Request, res:Response)=>{
    res.send('Working');
})

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`);
    
})