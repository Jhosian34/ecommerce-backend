const express = require("express");
const router =  express.Router();
const userController = require("../controllers/user.controller")
const auth = require("../middlewares/auth.middleware")
const isAdmin = require ("../middlewares/admin.middleware")


router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);
router.post("/", userController.createUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", [auth, isAdmin], userController.deleteUserById);
router.put("/:id", [auth], userController.updateUserById);


module.exports = router