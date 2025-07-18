const Product = require("../models/product.model");
const mongoose = require("mongoose");

async function createProduct(req, res) {
    try {
        const product = new Product(req.body);
        const productSaved = await product.save();

        return res
            .status(201)
            .send({
                message: "Producto creado correctamente",
                product: productSaved,
            });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res
                .status(400)
                .send({ message: "Los datos enviados no son correctos" });
        }
        return res
            .status(500)
            .send({ message: "EL producto no se ha podido crear" });
    }
}
async function getProduct(req, res) {
    try {
        const products = await Product.find().select({ __v: 0 });
        return res.status(200).send({ message: "Productos obtenidos correctamente", products });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Error al obtener los productos" });
    }
}

async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id).select({ __v: 0 });
        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }
        return res.status(200).send({ message: "Producto obtenido correctamente", product });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error al obtener el producto" });
    }
}

async function updateProductById(req, res) {
    try {
        const productUpdated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select({ __v: 0 });

        if (!productUpdated) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        return res.status(200).send({ message: "Producto actualizado correctamente", product: productUpdated });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ message: "Los datos enviados no son correctos" });
        }
        return res.status(500).send({ message: "Error al actualizar el producto" });
    }
}
async function deleteProductById(req, res) {
    try {
        const productDeleted = await Product.findByIdAndDelete(req.params.id);
        if (!productDeleted) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }
        return res.status(200).send({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error al eliminar el producto" });
    }
}

module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProductById,
    deleteProductById,
};
