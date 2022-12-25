const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "content")
    },
    fileName: (req, file, cb) => {
        cb(null,Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 100000 * 100},
    fileFilter: (req,file,cb) => {
        const fileTypes = /jpg|png|gif|mp4/;
        const mimeType = fileTypes.test(file.mimeType);
        const extname = fileTypes.test.apply(path.extname(file.originalname));

        if(mimeType && extname) {
            return cb(null, true);
        }

        cb("Only images supported");
    }
}).single("content");

module.exports = upload;