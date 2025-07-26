const Order = require("../models/order");

exports.createOrder = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const { items, total, shippingAddress, paymentMethod } = req.body;

        const newOrder = new Order({
            user: req.user._id,
            items,
            total,
            shippingAddress,
            paymentMethod,
            status: "pending"
        });

        const saved = await newOrder.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Error al crear orden", error: err });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener órdenes", error: err });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener tus órdenes", error: err });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) return res.status(404).json({ message: "Orden no encontrada" });

        if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "No autorizado" });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener orden", error: err });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar estado", error: err });
    }
};
