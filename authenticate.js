const jwt = require("jsonwebtoken");
const userdb = require("./model/postSchema")
const secretKey = "abcdefghijklmnopqrstuvwxyzabcdef";


const authenticate = async(req,res,next) =>{
    try{
        const token =   req.headers.authorisation
        
        const verifytoken = jwt.verify(token,secretKey)
        const rootuser = await userdb.findOne({_id:verifytoken._id})
        if(!rootuser){
            throw new Error("user not found");
        }else{
            req.token = token
            req.rootuser = rootuser;
            req.userId = rootuser._id
            next();
        }

    }catch(err){
     res.status(401).json({status:401,message:"Unauthorised no token provided"});
    }
    
}


module.exports = authenticate;