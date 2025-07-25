const express = require("express")
const router = express.Router()
const productController = require("../controllers/product.controller")
const auth = require("../middlewares/auth.middleware")
const isAdmin = require("../middlewares/admin.middleware")
const upload = require("../middlewares/upload")


router.post("/", auth, isAdmin, upload, productController.createProduct);
router.get("/", productController.getProduct);
router.get("/:id", productController.getProductById);
router.put("/:id", auth, isAdmin, upload, productController.updateProductById);
router.delete("/:id", auth, isAdmin, productController.deleteProductById);

module.exports = router 