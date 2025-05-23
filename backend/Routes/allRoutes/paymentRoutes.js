const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const TrackingModel = require('../../Models/BatchProductModel.js');
const TransactionModel = require('../../Models/TransactionHistoryModel.js');
const User = require('../../Models/userModel.js');
const { authorize } = require('../../Auth/Authenticate.js')
const router = express.Router();


router.post('/create-checkout-session', async (req, res) => {
    const { price, batchId, quantity, buyerId, sellerId, unit, productId } = req.body;

    if (!price || isNaN(price)) {
        return res.status(400).json({ message: 'Invalid price' });
    }
    if (price < 50) {
        return res.status(400).json({ message: 'Minimum payment amount is ₹50' });
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

router.get('/gettransactionhistory',authorize, async (req, res) => {
    try {
        const { productId, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        const total = await TransactionModel.countDocuments({ productId });
        
        const Data = await TransactionModel.find({ productId })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
            
        if (!Data) {
            return res.status(400).json({ message: 'invalid product id' })
        }
        
        return res.status(200).json({ 
            Data, 
            pagination: {
                total,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
                hasNextPage: (page * limit) < total,
                hasPrevPage: page > 1
            },
            message: 'transaction fetched successfully' 
        });
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
