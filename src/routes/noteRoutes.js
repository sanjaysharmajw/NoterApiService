const express = require("express");
const { getNotes, createNote, deleteNote, updateNote,getNotesById } = require("../controllers/noteController");
const auth = require("../middelwares/auth");
const noteRouter = express.Router();


noteRouter.get("/",auth,getNotes);

noteRouter.post("/",auth,createNote);

noteRouter.post("/deleteNote",auth,deleteNote);

// noteRouter.put("/:id",auth,updateNote);

noteRouter.post("/updateNote",auth,updateNote);

noteRouter.post("/getNotesById",auth,getNotesById);

module.exports=noteRouter;