const express=require("express")
const mongoose=require("mongoose")
const app=express()
const dotenv=require("dotenv")
const cors=require("cors")
app.use(express.json())
app.use(cors())
const DB = "mongodb+srv://root:root@cluster0.brmgqnv.mongodb.net/Instaclone?retryWrites=true&w=majority"
dotenv.config()
mongoose.connect(DB).then(() =>{
    console.log("connected to DB")
}).catch(err =>{
    console.log(err.message)
})


app.use(require("./routes/postRoute"))
app.listen(8080,()=>{
console.log("app runnning on port 8080")
})
