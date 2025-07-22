const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = '';

        const baseRoute = req.originalUrl.split('/')[1];

        if (baseRoute === 'products') {
            dir = 'uploads/products/';
        } else if (baseRoute === 'users') {
            dir = 'uploads/users/';
        }

        if (!dir) {
            return cb(new Error('Ruta inválida para guardar archivos'), false);
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

    filename: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes'), false);
        }
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage }).single('file');

module.exports = upload;