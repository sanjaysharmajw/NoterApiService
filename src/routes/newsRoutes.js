
const express = require("express");
const { addNews } = require("../controllers/newsController");
const auth = require("../middelwares/auth");
const newsRouter = express.Router();


/// newsRouter.get("/getNews",auth,getNotes);

newsRouter.post("/addNews",auth,addNews);

module.exports=newsRouter;