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

router.get('/gettransactionhistory', authorize, async (req, res) => {
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
    console.log('api hitts');
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

            res.clearCookie('paymentIntentId', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });

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

                const seller = sellerId?.split('_')[1];
                product.purchaseHistory.push({
                    buyerId,
                    quantityBought: `${quantity} ${unit}`,
                    pricePaid: price,
                    sellerId,
                    purchaseDate: new Date(),
                });
                await product.save();
                const isBuyerEmail = await User.findById(buyerId);
                const isSellerEmail = await User.findById(seller);

                await TransactionModel.create({
                    batchId,
                    transactionId: session.payment_intent,
                    buyer: isBuyerEmail?.email,
                    seller: isSellerEmail?.email,
                    productId,
                    price,
                    quantity: `${quantity} ${unit}`,
                });
                res.cookie("paymentIntentId", session.payment_intent, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                console.log(session.payment_intent, 'this is payment id');

                if (event.type === 'charge.refunded') {
                    const charge = event.data.object;
                    const paymentIntentId = charge.payment_intent;

                    try {
                        await TransactionModel.findOneAndUpdate(
                            { transactionId: paymentIntentId },
                            {
                                $set: {
                                    isRefunded: true,
                                    refundId: charge.refunds.data[0]?.id
                                }
                            }
                        );
                        console.log('Transaction marked as refunded:', paymentIntentId);
                    } catch (err) {
                        console.error('Error updating refund status:', err);
                        return res.status(500).json({ message: 'Failed to update refund status' });
                    }
                }


            } catch (err) {
                console.error('Error processing webhook event:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    res.json({ received: true });
};

router.get('/transaction/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const transaction = await TransactionModel.findOne({
            transactionId: session.payment_intent
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (err) {
        console.error('Error fetching transaction:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/refund', async (req, res) => {
    const { transactionId, reason } = req.body;

    if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required' });
    }

    try {
        const refund = await stripe.refunds.create({
            payment_intent: transactionId,
            reason: reason || 'requested_by_customer', // optional: 'duplicate' | 'fraudulent' | 'requested_by_customer'
        });

        await TransactionModel.findOneAndUpdate(
            { transactionId },
            { $set: { isRefunded: true, refundId: refund.id } }
        );
        console.log('this apis ihitts')
        res.status(200).json({ message: 'Refund successful', refund });
    } catch (error) {
        console.error('Refund failed:', error);
        res.status(500).json({ message: 'Failed to process refund' });
    }
});

module.exports = {
    router,
    webhookHandler,
};
