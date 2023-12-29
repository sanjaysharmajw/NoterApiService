const multer = require("multer");
const imageModel = require("../model/imageModel");




const uploadMethid = async (req, res) => {

    const storageDisk = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });

    const uploadingPhotos = multer({
        storage: storageDisk
    }).single("images")

    try {

        uploadingPhotos(req, res, (err) => {
            if (err) {
                console.log(err);
            } else {

                const newImage = new imageModel({
                    name: req.body.name,
                    image: {
                        data: req.file.filename,
                        contentType: "image/png"
                    }
                })
                newImage.save();
                res.status(200).json({ message: "Upload Successful" });
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

module.exports = {
    uploadMethid
}