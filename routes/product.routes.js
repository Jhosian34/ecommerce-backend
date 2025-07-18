const express = require("express")
const router = express.Router()
const productController = require("../controllers/product.controller")
// const auth = require("../middlewares/auth.middleware")
// const isAdmin = require("../middlewares/admin.middleware")


router.post("/products", productController.createProduct)
router.get("/products", productController.getProduct)
router.get("/products/:id", productController.getProductById)
router.put("/products/:id", productController.updateProductById)
router.delete("/products/:id", productController.deleteProductById)


module.exports = router