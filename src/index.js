const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoutes");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// const  multer= require("multer");
// const  imageModel=require("./model/imageModel");
const uploadRouter = require("./routes/uploadRoutes");

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/users",userRouter);
app.use("/note",noteRouter);
app.use("/image",uploadRouter);


// //storage
// const storageDisk = multer.diskStorage({
//     destination: 'uploads',
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname);
//     }

//   });

//   const uploadingPhotos = multer({
//         storage: storageDisk
//   }).single("images")

//   app.post("/upload",(req,res)=>{
//     uploadingPhotos(req,res,(err)=>{
//         if(err){
//             console.log(err);
//         }else{
//             const newImage = new imageModel({
//                 name:req.body.name,
//                 image:{
//                     data:req.file.filename,
//                     contentType: "image/png"
//                 }
//             })
//             newImage.save();
//             res.status(200).json({message: "Upload Successful"});
//         }
//     })
//   });
  

//debugging
app.use((req,res,next)=>{
    try{
        console.log("HTTP Method"+ req.method+ ", URL - "+ req.url);
        next();
    }catch(error){
        console.log(error);
    }
});

const PORT = process.env.PORT || 2000;
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server Started on port "+PORT);
    });
}).catch((error)=>{
    console.log(error);
})

