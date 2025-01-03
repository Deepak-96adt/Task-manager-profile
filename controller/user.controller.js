import "../model/connection.js";
import jwt from "jsonwebtoken";
import randomString from "randomstring";
import userSchemaModel from "../model/user.model.js";

export var register = async(req,res,next)=>{
    var userList = await userSchemaModel.find();
    var size = userList.length;
    var _id = (size==0)?1:userList[size-1]._id+1;
    var userDetails = {...req.body,"_id":_id,"created_at":Date()};
    try{
        var user = await userSchemaModel.create(userDetails);
        res.status(201).json({"status":"user registered successfully....."});
    }
    catch(error){
        res.status(400).json({"status":error.message});
    }
}


export var login = async(req,res,next)=>{
    var condition_obj = {...req.body};
    var userDetails = await userSchemaModel.findOne(condition_obj);
    if(userDetails){
        var payload = {"subject":userDetails.email};
        var key = randomString.generate();
        var token = jwt.sign(payload,key);
        res.status(200).json({"token":token,"userDetails":userDetails});
    }
    else
        res.status(400).json({"status":"invalid details.....!"});
}

export var fetch = async(req,res,next)=>{
    // var condition_obj = (req.query.condition_obj);
    var condition_obj = (JSON.parse(req.query.condition_obj));
    var userDetails = await userSchemaModel.find(condition_obj);
    if(userDetails.length>0)
        res.status(200).json({userDetails});
    else
        res.status(404).json({"response":"Requested resource not found...."});
}

export var update = async(req,res,next)=>{
    var condition_obj = (JSON.parse(req.body.condition_obj));
    var content_obj = (JSON.parse(req.body.content_obj));
    var userDetails = await userSchemaModel.find(condition_obj);
    if(userDetails.length>0){
        var user = await userSchemaModel.updateMany(condition_obj,{$set:content_obj});
        if (user.modifiedCount>0) 
            res.status(200).json({"response":"User updated successfully"});
        else
            res.status(500).json({"response": "Server Error"}); 
    }
    else
        res.status(404).json({"response":"Requested resource not found...."});  
    
}

export var deleteUser = async(req,res,next)=>{
    var condition_obj = (JSON.parse(req.body.condition_obj));
    var userDetails = await userSchemaModel.find(condition_obj);
    if (userDetails.length>0) {
        var user = await userSchemaModel.deleteMany(condition_obj);
        if (user.deletedCount>0)
            res.status(200).json({"response":"User deleted successfully"});
        else
            res.status(500).json({"response":"server error"});
    }
    else{
        res.status(404).json({"response":"Requested resource not found...."});
    }
}