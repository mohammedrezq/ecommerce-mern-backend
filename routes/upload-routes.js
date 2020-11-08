const express = require("express");

const multer = require("multer");
const { protect, adminstrator } = require("../middleware/authMiddleware");


const MIME_TYPE_MAP = {
    'image/png': "png",
    'image/jpg': "jpg",
    'image/jpg': "jpeg",
}

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, '../uploads')
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
    }}
)

// function checkFileType (file, type) {
//     const filetypes = /jpg|jpeg|png/
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); 
// }

const upload = multer({
    storage,
    limits: {
        fileSize: 3000000,
        files: 10,
    },
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid mime type!");
        cb(error, isValid);
    }
});
const router = express.Router();

router.post('/',  upload.array('Images'), (req, res) => {
    res.send(`${req.files.path}`)
})




module.exports = router;