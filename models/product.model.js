const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 1000,
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            enum:['electrodoméstico', 'iluminación', 'herramienta eléctrica', 'cableado' ,'componente eléctrico',]
        },
        createdAt:{
            type: Date,
            default: Date.now,
        }
    })

    const Products = mongoose.model("Products", productSchema)
    
    module.exports= Products