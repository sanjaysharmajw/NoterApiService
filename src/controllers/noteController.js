const noteFuntion=require("../notes/notesFuntion")

module.exports = {
    createNote: noteFuntion.createNote,
    deleteNote:noteFuntion.deleteNote,
    updateNote:noteFuntion.updateNote,
    getNotes:noteFuntion.getNotes,
    getNotesById:noteFuntion.getNotesById
};