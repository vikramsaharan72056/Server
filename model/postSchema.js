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
const postmodel=mongoose.model("post",postschema)
module.exports=postmodel