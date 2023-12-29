const express = require("express");
const { uploadMethid } = require("../controllers/uploadController");
const uploadRouter = express.Router();


uploadRouter.post("/upload",uploadMethid);


module.exports=uploadRouter;