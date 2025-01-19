const noteModel = require("../model/note");

class NoteFuntions {

    static createNote = async (req, res) =>{
        const {title, description} = req.body;
        const newNote = new noteModel({
            title: title,
            description : description,
            userId : req.userId
        });
        try {
            await newNote.save();
            res.status(200).json({data: newNote});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something went wrong"});
        }
    }
    
    static deleteNote = async (req, res) =>{
        //const id = req.params.id;
        const {id} = req.body; 
        try {
            const note = await noteModel.findByIdAndRemove(id);
            res.status(200).json({data: note});
    
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something went wrong"});
        }
    }
    
    static updateNote = async (req, res) => {
        const { id, title, description } = req.body; // Get `id` from the request body
        if (!id || !title || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'ID, Title, and Description are required',
            });
        }
        try {
            const existingNote = await noteModel.findById(id); // Fetch the note using `id`
            if (!existingNote) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Note not found',
                });
            }
            if (existingNote.userId.toString() !== req.userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You are not authorized to update this note',
                });
            }
            const updatedNote = await noteModel.findByIdAndUpdate(id,{ title, description },{ new: true });
            res.status(200).json({
                status: 'success',
                message: 'Note updated successfully',
                data: updatedNote,
            });
        } catch (error) {
            console.error('Error updating note:', error.message);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong while updating the note',
            });
        }
    };
    
    /// Get All Notes
    static getNotes = async (req, res) => {
        try {
            const notes = await noteModel.find({ userId: req.userId });
            if (!notes.length) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Data not found',
                    data: notes,
                });
            }
            res.status(200).json({
                status: 'success',
                message: 'Notes fetched successfully',
                data: notes,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong',
            });
        }
    };

       /// Get Notes by id

    static getNotesById = async (req, res) => {
        try {
            // Validate the userId
            if (!req.userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User ID is required',
                });
            }
    
            // Fetch notes for the user
            const notes = await noteModel.find({ userId: req.userId });
    
            // Check if notes exist
            if (!notes.length) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No notes found for the user',
                });
            }
    
            // Return the notes
            res.status(200).json({
                status: 'success',
                message: 'Notes fetched successfully',
                data: notes,
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            });
        }
    };
    

}

module.exports = NoteFuntions;