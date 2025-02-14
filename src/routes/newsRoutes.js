
const express = require("express");
const { addNews,getNews,getNewsByCategory,getCategories } = require("../controllers/newsController");
const auth = require("../middelwares/auth");
const newsRouter = express.Router();


 newsRouter.get("/getNews",auth,getNews);

newsRouter.post("/addNews",auth,addNews);

newsRouter.post('/categoryBy', getNewsByCategory); // Get news by category

newsRouter.post('/getAllCategories', getCategories); // Get all categories


module.exports=newsRouter;