const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authorize } = require('../../Auth/Authenticate.js')


const TrackingModel = require('../../Models/BatchProductModel.js');


router.get('/getproducttomarkiting', authorize, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const totalCount = await TrackingModel.countDocuments({ isProcessed: true });
    const totalPages = Math.ceil(totalCount / limit);

    const trackingDetails = await TrackingModel.find({ isProcessed: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      trackingDetails,
      totalPages,
      message: 'Tracking details fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching tracking details:', error);
    return res.status(500).json({ message: 'Server error while fetching tracking details' });
  }
});

router.post('/buyProduct',authorize, async (req, res) => {
  try {
    const { ownerId, batchId, quantity, price, buyerId, unit } = req.body;

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
      return res.status(400).json({ message: 'Not enough quantity available for purchase' });
    }

    availableQuantity -= purchaseQuantityQuintal;
    product.quantityProcessed = availableQuantity.toFixed(2);


    if (availableQuantity <= 0) {
      product.isAvailable = false;
    }

    product.purchaseHistory = product.purchaseHistory || [];
    product.purchaseHistory.push({
      buyerId: buyerId,
      quantityBought: `${quantity} ${unit}`,
      pricePaid: price,
      ownerId: ownerId,
      purchaseDate: new Date(),
    });

    await product.save();

    return res.status(200).json({ product, message: 'Product bought and updated successfully' });
  } catch (error) {
    console.error('Error in /buyProduct:', error);
    return res.status(500).json({ message: 'Server error while buying product' });
  }
});

router.get('/getmyproducts',authorize, async (req, res) => {
  try {
    const is_id = req.query.id;

    if (!is_id) {
      return res.status(400).json({ message: 'User ID missing in request' });
    }

    const objectId = new mongoose.Types.ObjectId(is_id); 

    const products = await TrackingModel.aggregate([
      {
        $match: { 'purchaseHistory.buyerId': objectId }
      },
      {
        $project: {
          productName: 1,
          images: 1,
          price: 1,
          quantityProcessed: 1,
          purchaseHistory: {
            $filter: {
              input: "$purchaseHistory",
              as: "history",
              cond: { $eq: ["$$history.buyerId", objectId] }
            }
          }
        }
      }
    ]);

    if (products.length === 0) {
      return res.status(201).json({ products: [], message: 'No products found for this user' });
    }

    return res.status(200).json({ products, message: 'Products fetched successfully' });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error while fetching products' });
  }
});

router.get('/getProductById',authorize, async (req, res) => {
  try {
    const is_id = req.query.id
    if (is_id) {
      const product = await TrackingModel.findOne({ _id: is_id });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ product, message: 'Product fetched successfully' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Server error while fetching product' });
  }
}
);




module.exports = router;