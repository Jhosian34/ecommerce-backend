const Product = require("../models/product.model");
const mongoose = require("mongoose");

async function createProduct(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { name, price, description, category } = req.body;

        const product = new Product({
            name,
            price,
            description,
            category,
        });

        if (req.file) {
            product.image = req.file.filename;
        } else {
            return res.status(400).send({
                message: "Debe enviar una imagen del producto",
            });
        }

        const productSaved = await product.save();

        return res.status(201).send({
            message: "Producto creado correctamente",
            product: productSaved,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res
                .status(400)
                .send({ message: "Los datos enviados no son correctos" });
        }
        console.log(error);
        return res
            .status(500)
            .send({ message: "El producto no se ha podido crear" });
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
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        
        const updateData = { ...req.body };


        if (updateData.createdAt) {
        updateData.createdAt = new Date(updateData.createdAt);
}

        if (req.file) {
            updateData.image = req.file.filename;
        } else {

            delete updateData.image;
        }

        console.log('Datos para actualizar:', updateData);

        const productUpdated = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
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
