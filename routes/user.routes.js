const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");
const upload = require('../middlewares/upload.middleware');

// Rutas específicas primero
router.post("/login", userController.loginUser);
router.get('/me', auth, userController.getCurrentUser);
router.post('/register', upload.single('avatar'), userController.registerUser);

// Luego las rutas generales
router.get("/", userController.getUsers);
router.post("/", userController.createUsers);

// Rutas dinámicas al final
router.get("/:id", userController.getUserById);
router.delete("/:id", [auth, isAdmin], userController.deleteUserById);
router.put("/:id", [auth], userController.updateUserById);

module.exports = router;