const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true

    },
    password: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        pincode: String
    }

}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)
