const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
if (req.pathname === '/products'){
    cb(null, 'uploads/products/');
}
else {
    cb(null, 'uploads/users/');
    }
    }
})

const upload = multer({ storage });

module.exports = upload;