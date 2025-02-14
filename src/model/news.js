
const mongoose = require("mongoose");

const NewsSchema= mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    publisher:{
        type: String,
        required: true
    },
    categories:{
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
},{timestamp:true});

module.exports=mongoose.model("News",NewsSchema);