import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.LOCAL_DATABASE_URL);
console.log("mongodb connected successfully....");