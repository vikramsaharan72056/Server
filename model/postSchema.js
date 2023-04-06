const mongoose=require("mongoose")
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "abcdefghijklmnopqrstuvwxyzabcdef";
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
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});


UserSchema.pre("save",async function (next) {
    this.password = await bcrypt.hash(this.password,12);
    this.cpassword = await bcrypt.hash(this.cpassword,12);
    next();
})


UserSchema.methods.generateAuthtoken = async function(){
    try{
        
        let token32 = jwt.sign({_id:this._id},secretKey,{expiresIn:"8h"})
        
        
        this.tokens = this.tokens.concat({token:token32})
        
        await this.save()
        return token32;
    }catch(err){
        res.status(422).json(err);
    }
}

const User = mongoose.model("users",UserSchema);



module.exports={
    User:User,
    Postmodel:Postmodel
}