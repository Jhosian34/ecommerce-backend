const express = require("express")
const router = express.Router()
const Order = require("../models/order")
const Product = require('../models/product.model')

router.post("/", async (req, res) => {
    try {
        const { user, items } = req.body;

        const populatedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId || item._id);
                if (!product) throw new Error("Producto no encontrado");

                return {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: item.quantity
                };
            })
        );

        const total = populatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const newOrder = new Order({
            user, 
            items: populatedItems,
            total
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;

