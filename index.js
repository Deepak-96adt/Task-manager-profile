import userRoute from "./route/user.route.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

var app=express();

//configuration to fetch req body content : body parser middleware
//used to fetch req data from methods like : POST , PUT , PATCH , DELETE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//for accept file data
app.use(fileUpload())

// for cross origin
app.use(cors());

//route level middleware to load specific task
app.use("/user",userRoute);

app.listen(3001);
console.log("server connected successfully on port http://localhost:3001");