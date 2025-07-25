const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");


router.post("/", auth, orderController.createOrder);

router.get("/", auth, isAdmin, orderController.getAllOrders);

router.get("/my-orders", auth, orderController.getOrdersByUser);

router.get("/:id", auth, orderController.getOrderById);

router.put("/:id", auth, isAdmin, orderController.updateOrderStatus);

module.exports = router;