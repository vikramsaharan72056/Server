const express = require("express")
const router = express.Router()
const authenticate = require("../authenticate");
const {Postmodel,User} = require("../model/postSchema");
const bcrypt = require("bcryptjs");

router.post("/addpost", async (req, resp) => {
    
    try {
        const data = await new Postmodel(
            {
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                image: req.body.image
            }
        )
        const result = await data.save();
        resp.json(result)
    }
    catch (err) {
        console.log(err)
    }
})
router.get("/allpost", async (req, resp) => {
    const data = await Postmodel.find()
    resp.send(data)
})


router.post("/register", async (req, res) => {
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
        res.status(422).json({ message: "fill all the details" })
    }
    try {
        const preuser = await User.findOne({ email: email })
        if (preuser) {
            res.status(422).json({ message: "this email already exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ message: "password and cpassword does not match" })
        } else {
            const finalUser = new User({
                name, email, password, cpassword
            });
            const storeData = await finalUser.save()
            res.status(201).json({ status: 201, storeData })


        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
const secretKey = "abcdefghijklmnopqrstuvwxyzabcdef";
router.post("/login",async (req,res) =>{
    const {email,password} = req.body;
    

    if(!email||!password){
        res.status(422).json({status:422, error:"fill all the details"})
    }
    try{
        const uservalid = await User.findOne({email:email});
        
        
        if(uservalid){
            let  isMatch = false;
            if(password === uservalid.password){

                isMatch = true;
            }
            
            
            if(!isMatch){
                res.status(403).json({ status:403,error:"password not matched"})
            }
            else{
                
                try{
                    const token =  await uservalid.generateAuthtoken();
                    
                    

                res.cookie("usercokie",token,{expires:new Date(Date.now()+9000000 ),httpOnly:true});
                const result = {uservalid,token}
                res.status(201).json({status:201,result})
                

                }catch(err){
                    res.json(err.message)
                }
            }
        }
    }catch(err){
      res.json(err.message);
    }

})



router.get("/validuser", authenticate,async (req,res) =>{
    try{
        const ValidUserOne = await User.findOne({_id:req.userId})
        res.status(201).json({status:201,ValidUserOne})

    }catch(err){
        res.status(401).json({status:401,err})
    }
    })
module.exports = router
