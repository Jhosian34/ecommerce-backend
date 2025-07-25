const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadAvatar } = require('../controllers/avatar.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/upload/:id', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;