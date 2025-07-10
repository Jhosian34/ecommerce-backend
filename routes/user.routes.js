const express = require("express");
const router =  express.Router();
const userController = require("../controllers/user.controller")

router.get("/users", userController.getUsers)

router.post("/users", userController.createUsers)

router.get("/users/:id", userController.getUserById)

router.delete("/users/:id", userController.deleteUserById)

router.put("/users/:id", userController.updateUserById)

router.post("/login", userController.loginUser)

module.exports = router