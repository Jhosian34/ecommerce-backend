const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");
const upload = require('../middlewares/upload.middleware');

// Rutas públicas
router.post("/login", userController.loginUser);
router.post("/register", upload.single('avatar'), userController.registerUser);

// ✅ Rutas para recuperación de contraseña (3 pasos)
router.get("/verify-reset-token/:token", userController.verifyResetToken);
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

// Rutas protegidas
router.get('/me', auth, userController.getCurrentUser);

// Rutas generales
router.get("/", userController.getUsers);
router.post("/", userController.createUsers);

// Rutas dinámicas
router.get("/:id", userController.getUserById);
router.delete("/:id", [auth, isAdmin], userController.deleteUserById);
router.put("/:id", [auth], userController.updateUserById);

module.exports = router;