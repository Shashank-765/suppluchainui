const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    fruitName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    taste: {
        type: String,
    },
    healthBenefits: {
        type: String,
    },
    sellerName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
      isBuy: {
        type: Boolean,
        default: false,
    },
    ownerId: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    price: {
        type: String,
    },
    quantity: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
}, { timestamps: true });

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
