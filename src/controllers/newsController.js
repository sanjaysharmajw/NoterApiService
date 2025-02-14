
const userModel = require("../model/user")
require('dotenv').config(); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const newsModel = require("../model/news");


    const addNews = async (req, res) =>{
        const {title, description,author,publisher,categories} = req.body;
        const newNews = new newsModel({
            title: title,
            description : description,
            author:author,
            publisher:publisher,
            categories: categories,
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

    const getNews = async (req, res) =>{
            try {
                    const news = await newsModel.find({ userId: req.userId });
                    if (!news.length) {
                        return res.status(200).json({
                            status: 'success',
                            message: 'Data not found',
                            data: news,
                        });
                    }
                    res.status(200).json({
                        status: 'success',
                        message: 'News fetched successfully',
                        data: news,
                    });
                } catch (error) {
                    res.status(500).json({
                        status: 'error',
                        message: 'Something went wrong',
                    });
                }
    }

    const getNewsByCategory = async (req, res) => {
        const { category } = req.params;
    
        try {
            const news = await newsModel.find({ category }); // Filter news by category
            res.status(200).json({
                status: 'success',
                data: news,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    };

    const getCategories = async (req, res) => {
        try {
            const categories = await newsModel.distinct('categories'); // Fetch unique categories
    
            // Transform categories into the desired format
            const formattedCategories = categories.map(category => ({
                categories: category,
            }));
    
            res.status(200).json({
                status: 'success',
                data: formattedCategories,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    };
    
    
    

    module.exports = { addNews,getNews,getNewsByCategory,getCategories };