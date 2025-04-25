const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../Models/userModel.js');
const Fruit = require('../Models/ProductModel.js');

const TrackingModel = require('../Models/BatchProductModel.js');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});



const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'images', maxCount: 15 },
  { name: 'inspectedImages', maxCount: 15 }
]);

router.get('/getproducttomarkiting', async (req, res) => {
  try {
    const trackingDetails = await TrackingModel.find({ isProcessed: true })
    if (!trackingDetails) {
      return res.status(404).json({ message: 'Tracking details not found' });
    }

    return res.status(200).json({ trackingDetails, message: 'Tracking details fetched successfully' });
  } catch (error) {
    console.error('Error fetching tracking details:', error);
    return res.status(500).json({ message: 'Server error while fetching tracking details' });
  }
}
);

router.post('/addProduct', upload, async (req, res) => {
  try {
    console.log('req.body', req.body)
    const { fruitName, description, taste, healthBenefits, sellerName, address, pin, price, quantity, ownerId } = req.body;

    if (!fruitName || !description || !sellerName || !address || !pin) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Process uploaded image files
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Create a new product entry in the database
    const newProduct = new Fruit({
      fruitName,
      description,
      taste,
      healthBenefits,
      sellerName,
      address,
      pin,
      price,
      quantity,
      ownerId,
      images: imagePaths,  // Save image paths in the database
    });

    await newProduct.save();

    return res.status(200).json({ product: newProduct, message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Server error while adding product' });
  }
});
router.post('/soldproduct', async (req, res) => {
  try {
    const { id, price } = req.body;
    console.log('req.body', req.body)

    const updatedProduct = await Fruit.findOne({ _id: id });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (price) {
      updatedProduct.price = price;
      updatedProduct.isAvailable = true;
    }
    await updatedProduct.save();
    return res.status(200).json({ product: updatedProduct, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Server error while updating product' });
  }
}
);
router.post('/buyProduct', async (req, res) => {
  try {
    const { id, quantity, buyerId } = req.body;
    console.log('req.body', req.body)

    const updatedProduct = await Fruit.findOne({ _id: id });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    else {
      updatedProduct.quantity = quantity;
      updatedProduct.isBuy = true;
      updatedProduct.isAvailable = false;
      updatedProduct.ownerId = buyerId;
    }
    await updatedProduct.save();
    return res.status(200).json({ product: updatedProduct, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Server error while updating product' });
  }
}
);
router.get('/getProducts', async (req, res) => {
  try {
    console.log('req.query', req.query)
    const is_id = req.query.id
    if (is_id) {
      const userProducts = await User.findOne({ _id: is_id });
      if (!userProducts) {
        return res.status(404).json({ message: 'User not found' });
      }
      const products = await Fruit.find({ ownerId: userProducts._id });
      if (products.length === 0) {
        return res.status(201).json({ products: [], message: 'No products found for this user' });
      }
      return res.status(200).json({ products, message: 'Products fetched successfully' });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error while fetching products' });
  }
}
);
router.get('/getProductById', async (req, res) => {
  try {
    console.log('req.query', req.query)
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
router.get('/getAllProducts', async (req, res) => {
  try {
    const products = await Fruit.find({ isAvailable: true });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this user' });
    }
    return res.status(200).json({ products, message: 'Products fetched successfully' });
  }
  catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error while fetching products' });
  }
}
);



module.exports = router;