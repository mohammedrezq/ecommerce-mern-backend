const express = require("express");
const path = require("path");
const multer = require("multer");
const { protect, adminstrator } = require("../middleware/authMiddleware");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': "png",
    'image/jpg': "jpg",
    'image/jpg': "jpeg",
}

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        // const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }}
)

function checkFileType (file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype) {
        return cb(null, true)
    } else {
        return cb("Images Only.. JPG/JPEG/PNG!");
    }

}


// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 12000000,
//     },
//     fileFilter: (req, file, cb) => {
//        checkFileType(file, cb)
//     }
// });

// router.post('/', upload.single('Images'), (req, res, next) => {
    // const file = req.file.path // Single Image
    // console.log(file)

    // console.log("THE FILES",files)
    // if(!files) {
    //     const error = new Error("Please choose image");
    //     error.httpStatusCode = 400;
    //     return next(error);
    // }
    // const paths = files.map(file => {
    //     console.log("ONE FILE", file)
    //     retrun (res.send(`/uploads/${file}`))} )
    // console.log("THE PATHS",paths)
    // console.log(paths)

//     const file = req.file;
//     file.path = file.path.replace(/\\/g, "/"); // make sure image link is OK slashed from: https://stackoverflow.com/questions/59393275/multer-req-files-path-not-editable

//     res.send(`/${file.path}`)
// })


// Korean
const theupload = multer({
    storage,
    limits: {
        fileSize: 120000000,
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single("file");

// Add protect and adminstrator (Korean)
router.post('/uploadImage' ,(req, res, next) => {

    theupload(req, res, err => {
        if(err) return res.json({success:false, err})
        const imagePath = res.req.file.path.replace(/\\/g, "/"); // make sure image link is OK slashed from: https://stackoverflow.com/questions/59393275/multer-req-files-path-not-editable
        return res.json({success: true, image: `http://localhost:5000/${imagePath}`, fileName: res.req.file.filename })
    })

})

module.exports = router;