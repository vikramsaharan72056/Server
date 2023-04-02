const express = require("express")
const router = express.Router()
const {Postmodel,User} = require("../model/postSchema");

router.post("/addpost", async (req, resp) => {
    console.log(req.body)
    try {
        const data = new Postmodel(
            {
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                image: req.body.image
            }
        )
        const result = await data.save()
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
module.exports = router