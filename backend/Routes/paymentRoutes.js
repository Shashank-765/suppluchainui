const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const TrackingModel = require('../Models/BatchProductModel.js');
const TransactionModel = require('../Models/TransactionHistoryModel.js');
const User = require('../Models/userModel.js');


const router = express.Router();
router.post('/create-checkout-session', async (req, res) => {
    const { price, batchId, quantity, buyerId, sellerId, unit, productId } = req.body;

    if (!price || isNaN(price)) {
        return res.status(400).json({ error: 'Invalid price' });
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Supply Chain Management',
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: 'http://localhost:3000/invoice',
            cancel_url: 'https://www.metaspace.com',
            metadata: {
                batchId,
                quantity,
                price,
                buyerId,
                sellerId,
                productId,
                unit
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe session creation failed:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

router.get('/gettransactionhistory', async (req, res) => {
    try {
        const { productId } = req.query;       
        const Data = await TransactionModel.find({ productId });
         if(!Data){
            return res.status(400).json({message:'invalid product id'})
         }
         else return res.status(200).json({ Data, message: 'transaction fetched sucessfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
})

const webhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.WEB_HOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(event?.data?.object.payment_intent, 'information about transaction');

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.payment_status === 'paid') {
            const { batchId, quantity, price, buyerId, sellerId, unit, productId } = session.metadata;

            try {
                const product = await TrackingModel.findOne({ batchId });
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                let availableQuantity = parseFloat(product.quantityProcessed);
                let purchaseQuantityQuintal = parseFloat(quantity);

                if (unit === 'kg') {
                    purchaseQuantityQuintal = purchaseQuantityQuintal / 100;
                }

                if (purchaseQuantityQuintal > availableQuantity) {
                    return res.status(400).json({ message: 'Not enough quantity available' });
                }

                availableQuantity -= purchaseQuantityQuintal;
                product.quantityProcessed = availableQuantity.toFixed(2);

                if (availableQuantity <= 0) {
                    product.isAvailable = false;
                }

                product.purchaseHistory = product.purchaseHistory || [];
                product.purchaseHistory.push({
                    buyerId,
                    quantityBought: `${quantity} ${unit}`,
                    pricePaid: price,
                    sellerId,
                    purchaseDate: new Date(),
                });

                await product.save();

                const isBuyerEmail = await User.findById(buyerId);
                const isSellerEmail = await User.findById(sellerId);

                await TransactionModel.create({
                    batchId,
                    transactionId: session.payment_intent,
                    buyer: isBuyerEmail?.email,
                    seller: isSellerEmail?.email,
                    productId,
                    price,
                    quantity: `${quantity} ${unit}`,
                });

                console.log('✅ Product purchase saved successfully.');
            } catch (err) {
                console.error('Error processing webhook event:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    res.json({ received: true });
};


module.exports = {
    router,
    webhookHandler,
};
