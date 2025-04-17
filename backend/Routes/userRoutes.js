const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../Models/userModel.js');
const Fruit = require('../Models/ProductModel.js');
const BatchModel = require('../Models/BatchModel.js');
const Role = require('../Models/RolesModel.js');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const { generateToken, generateWallet } = require('../Auth/Authenticate.js');



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
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).array('images', 15);


router.post('/register', async (req, res) => {

  try {
    console.log('req.body', req.body)

    const { name, email, password, contact, role } = req.body;
    if (!name || !email || !password || !role || !contact) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const wallet = await generateWallet();
    const user = new User({
      name,
      email,
      password,
      role,
      contact,
      walletAddress: wallet.address
    });
    await user.save();

    const jwtToken = generateToken(user._id);
    if (jwtToken) {
      user.token = jwtToken;
      await user.save();
    }


    console.log('User registered successfully:', user);
    return res.status(200).json({ user, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });

  }

})
router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    console.log(email)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong Password' });
    }

    const jwtToken = generateToken(user._id);
    if (jwtToken) {
      user.token = jwtToken;
      await user.save();
    }
    console.log('User logged in successfully:', user);
    return res.status(200).json({ user, message: 'User logged in successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
)
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
        return res.status(404).json({ message: 'No products found for this user' });
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
      const product = await Fruit.findOne({ _id: is_id });
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
router.get('/fetchalluser', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { walletAddress: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ],
    };

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});
router.post('/blockUser', async (req, res) => {
  try {
    const { id } = req.query;
    console.log('req.body', req.query)

    const updatedUser = await User.findOne({ _id: id });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    updatedUser.isBlocked = true;
    await updatedUser.save();
    return res.status(200).json({ user: updatedUser, message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    return res.status(500).json({ message: 'Server error while blocking user' });
  }
}
);
router.post('/unblockUser', async (req, res) => {
  try {
    const { id } = req.query;
    console.log('req.body', req.query)

    const updatedUser = await User.findOne({ _id: id });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    updatedUser.isBlocked = false;
    await updatedUser.save();
    return res.status(200).json({ user: updatedUser, message: 'User unblocked successfully' });
  } catch (error) {

    console.error('Error unblocking user:', error);
    return res.status(500).json({ message: 'Server error while unblocking user' });
  }
}
);
router.post('/createBatch', async (req, res) => {
  try {
    const { farmerRegNo, farmerName, farmerAddress, farmInspectionName, harvesterName, processorName, exporterName, importerName, coffeeType } = req.body;
    console.log('req.body', req.body)

    if (!farmerRegNo || !farmerName || !farmerAddress || !farmInspectionName || !harvesterName || !processorName || !exporterName || !importerName || !coffeeType) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Create a new batch without worrying about batchId
    const newBatch = new BatchModel({
      farmerRegNo,
      farmerName,
      farmerAddress,
      farmInspectionName,
      harvesterName,
      processorName,
      exporterName,
      importerName,
      coffeeType
    });

    await newBatch.save();

    if (newBatch) {
      const frontendBaseUrl = 'http://localhost:3000/'; 
      const qrData = `${frontendBaseUrl}scanresult/${newBatch.batchId}`;
      const qrCode = await QRCode.toDataURL(qrData);

      newBatch.qrCode = qrCode;
      await newBatch.save();
    }

    console.log('Batch created successfully:', newBatch);
    return res.status(200).json({ batch: newBatch, message: 'Batch created successfully' });

  } catch (error) {
    console.error('Error creating batch:', error);
    return res.status(500).json({ message: 'Server error while creating batch' });
  }
});
router.get('/getBatch', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { batchId: !isNaN(search) ? Number(search) : -1 },
          // { farmerRegNo: { $regex: search, $options: 'i' } },
          // { farmerName: { $regex: search, $options: 'i' } },
          // { harvesterName: { $regex: search, $options: 'i' } },
          // { processorName: { $regex: search, $options: 'i' } },
          // { exporterName: { $regex: search, $options: 'i' } },
          // { importerName: { $regex: search, $options: 'i' } },
          // { farmInspectionName: { $regex: search, $options: 'i' } },
        ]
      };
    }


    const totalBatches = await BatchModel.countDocuments(query);
    const batches = await BatchModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      batches,
      totalBatches,
      totalPages: Math.ceil(totalBatches / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server error while fetching batches' });
  }
});
router.post('/insertRoles', async (req, res) => {
  const roleMap = {
    FARM_INSPECTION: {
      name: 'Farm Inspection',
      className: 'label info',
    },
    HARVESTER: {
      name: 'Harvester',
      className: 'label success',
    },
    EXPORTER: {
      name: 'Exporter',
      className: 'label warning',
    },
    IMPORTER: {
      name: 'Importer',
      className: 'label danger',
    },
    PROCESSOR: {
      name: 'Processor',
      className: 'label primary',
    },
  };

  const roleDocs = Object.entries(roleMap).map(([key, value]) => ({
    key,
    name: value.name,
    className: value.className,
  }));

  try {
    await Role.insertMany(roleDocs, { ordered: false });
    res.status(201).json({ message: 'Roles inserted successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Some roles already exist.', error: err });
    } else {
      res.status(500).json({ message: 'Error inserting roles.', error: err });
    }
  }
});
router.get('/getRoles', async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json({ roles, message: 'Roles fetched successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch roles.', error: err });
  }
});
router.get('/getBatchById', async (req, res) => {
  try {
    const { id } = req.query;
    console.log('req.body', req.query)

    if (id) {
      const batch = await BatchModel.findOne({ batchId: id });
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
      return res.status(200).json({ batch, message: 'Batch fetched successfully' });
    }
  } catch (error) {
    console.error('Error fetching batch:', error);
    return res.status(500).json({ message: 'Server error while fetching batch' });
  }
}
);

module.exports = router;