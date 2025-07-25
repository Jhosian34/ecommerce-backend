const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
    validator: function(valor) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor);
    },
    }
},

    password: { type: String, required: true, minlength: 6 },

    image: {type: String, required: false},

    role: { type: String,
            enum: ['user', 'admin','client'], 
    default: 'user'
    },
    avatar: { type: String, required: false },

    createdAt: { type: Date, default: Date.now },

    address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    },
})

module.exports = mongoose.model('User',userSchema)