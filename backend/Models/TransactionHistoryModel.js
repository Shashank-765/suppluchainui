const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    batchId: { type: Number, required: true },
    transactionId: { type: String, required: true },
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    productId: { type: String, required: true }
}, { timestamps: true });


const TransactionModel = mongoose.model('TransactionHistory', TransactionSchema);
module.exports = TransactionModel;
