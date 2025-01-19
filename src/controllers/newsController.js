
const userModel = require("../model/user")
require('dotenv').config(); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const newsModel = require("../model/news");


    const addNews = async (req, res) =>{
        const {title, description,author,publisher} = req.body;
        const newNews = new newsModel({
            title: title,
            description : description,
            author:author,
            publisher:publisher,
            userId : req.userId
        });
        try {
            await newNews.save();
    
       //     res.status(200).json({data: newNews});
            res.status(200).json({
                status: 'success',
                message: 'News Added successfully',
                data: [newNews],
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something went wrong"});
        }
    }

    module.exports = { addNews };