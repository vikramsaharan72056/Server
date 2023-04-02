const mongoose=require("mongoose")
const postschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})
const Postmodel=mongoose.model("post",postschema)




const validator = require("validator");
const bcrypt = require("bcrypt");


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not valid email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    cpassword:{
        type:String,
        required:true,
        minlength:6
    }
});


UserSchema.pre("save",async function (next) {
    this.password = await bcrypt.hash(this.password,12);
    this.cpassword = await bcrypt.hash(this.cpassword,12);
    next();
})

const User = mongoose.model("users",UserSchema);



module.exports={
    User:User,
    Postmodel:Postmodel
}