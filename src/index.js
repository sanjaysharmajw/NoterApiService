const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoutes");

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const mongoose = require("mongoose");




app.use(express.json());
app.use(cors());

// app.use((req,res,next)=>{
//     try{
//         console.log("HTTP Method"+ req.method+ ", URL - "+ req.url);
//         next();
//     }catch(error){
//         console.log(error);
//     }
// });




app.use("/users",userRouter);
app.use("/note",noteRouter);

const PORT = process.env.PORT || 2000;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server Started on port "+PORT);
    });
}).catch((error)=>{
    console.log(error);
})

