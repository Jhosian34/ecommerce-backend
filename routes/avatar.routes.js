const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadAvatar } = require('../controllers/avatar.controller');
const auth = require('../middlewares/auth.middleware');

router.put('/:id', auth, upload.single('image'), uploadAvatar);

module.exports = router;