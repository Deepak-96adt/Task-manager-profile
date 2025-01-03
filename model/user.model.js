import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
    _id:Number,
    name:{
        type:String,
        required:[true,"name is required"],
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:5,
        maxLength:10,
        trim:true
    },
    mobile:{
        type:String,
        required:[true,"mobile is required"],
        minLength:10,
        maxLength:10,
        trim:true
    },
    gender:{
        type:String,
        required:[true,"gender is required"],
    },
    created_at:String
});

userSchema.plugin(uniqueValidator);
const userSchemaModel = mongoose.model("task-manager-user-data",userSchema);
export default userSchemaModel;