const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../Models/userModel.js');
const Fruit = require('../Models/ProductModel.js');
const BatchModel = require('../Models/BatchModel.js');
const TrackingModel = require('../Models/BatchProductModel.js');
const Role = require('../Models/RolesModel.js');
const nodemailer = require("nodemailer")
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const { generateToken, generateWallet } = require('../Auth/Authenticate.js');


let transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: 'Businessbay',
    pass: '4RlUtFpREiCs5tn7',
  },
});

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


router.post('/register', async (req, res) => {

  try {
    console.log('req.body', req.body)
    const { name, email, password, contact, role, userType, address } = req.body;
    if (!name || !email || !password || !contact) {
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
      userType,
      contact,
      address,
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

router.post('/createuser', async (req, res) => {

  try {
    console.log('req.body', req.body)
    const { name, email, password, contact, role, userType, address } = req.body;
    if (!name || !email || !password || !contact) {
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
      userType,
      contact,
      address,
      walletAddress: wallet.address
    });
    await user.save();

    const jwtToken = generateToken(user._id);
    if (jwtToken) {
      user.token = jwtToken;
      await user.save();
    }

      const mailOptions = {
      from: 'arun@bastionex.net',
      to: email,
      subject: "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation</title>
            <style>
                .button {
                    background-color: #008CBA;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    display: inline-block;
                    margin-top: 10px;
                }

                .button:hover {
                    background-color: #005f7a;
                }

                table {
                    width: 600px;
                    margin: 0 auto;
                    border-collapse: collapse;
                }

                table td {
                    padding: 10px;
                }
            </style>
        </head>

        <body>
            <div style="margin:0;font-family: 'Lato', sans-serif;">
                <table style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                    <tbody>
                        <tr>
                            <td>
                                <p style="color:#000;text-align:center;font-size:16px;margin-bottom:20px;">
                                  Your login Id and password 
                                </p>
                                <p style="color:#000;text-align:center;font-size:16px;margin-bottom:20px;">
                                   Email ---  ${email}
                                   <br/>
                                   Password --- ${password}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>

      `,
    };    
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ user, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });

  }

})

router.post('/updateprofile', async (req, res) => {
  try {
    const { email, name, contact, address, userType } = req.body;
    console.log(req.body);

    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    isExist.name = name;
    isExist.contact = contact;
    isExist.address = address;
    isExist.userType = userType;

    await isExist.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        email: isExist.email,
        name: isExist.name,
        contact: isExist.contact,
        address: isExist.address,
        userType: isExist.userType
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
     if(user?.isBlocked){
         return res.status(400).json({message:'This user has been blocked'})
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
router.get('/fetchalluser', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;

    // Shared query to apply filters
    const query = {
      userType: 'user', // Only users with userType === "user"
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { walletAddress: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ],
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const allUsers = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const allUserwihtoutPagination = await User.find({});

    res.status(200).json({
      allUsers,
      allUserwihtoutPagination,
      totalUsers,
      totalPages,
      currentPage: parseInt(page)
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
    let farmInspectionId = null;
    let harvesterId = null;
    let processorId = null;
    let exporterId = null;
    let importerId = null;

    if (farmInspectionName) {
      farmInspectionId = await User.findOne({ name: farmInspectionName });
    }
    if (harvesterName) {
      harvesterId = await User.findOne({ name: harvesterName });
    }
    if (processorName) {
      processorId = await User.findOne({ name: processorName });
    }
    if (exporterName) {
      exporterId = await User.findOne({ name: exporterName });
    }
    if (importerName) {
      importerId = await User.findOne({ name: importerName });
    }
    const newBatch = new BatchModel({
      farmerRegNo,
      farmerName,
      farmerAddress,
      farmInspectionName,
      harvesterName,
      processorName,
      exporterName,
      importerName,
      coffeeType,
      farmInspectionId: farmInspectionId ? farmInspectionId._id : null,
      harvesterId: harvesterId ? harvesterId._id : null,
      processorId: processorId ? processorId._id : null,
      exporterId: exporterId ? exporterId._id : null,
      importerId: importerId ? importerId._id : null,
    });

    await newBatch.save();

    if (newBatch) {
      const frontendBaseUrl = 'https://lfgkx3p7-3000.inc1.devtunnels.ms/';
      const qrData = `${frontendBaseUrl}`;
      // scanresult/${newBatch.batchId}
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

router.delete('/deletebatch', async (req, res) => {
  try {
    const { batchId } = req.query;
    console.log(batchId, 'batch ids');

    if (!batchId) {
      return res.status(400).json({ message: 'batchId is required' });
    }

    // Delete the batch using the batchId field
    const deleted = await BatchModel.findOneAndDelete({ batchId: batchId });
    const delted2 = await TrackingModel.findOneAndDelete({batchId: batchId})

    if (!deleted && !delted2) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// router.post('/insertRoles', async (req, res) => {
//   const roleMap = {
//     FARM_INSPECTION: {
//       name: 'Farm Inspection',
//       className: 'label info',
//     },
//     HARVESTER: {
//       name: 'Harvester',
//       className: 'label success',
//     },
//     EXPORTER: {
//       name: 'Exporter',
//       className: 'label warning',
//     },
//     IMPORTER: {
//       name: 'Importer',
//       className: 'label danger',
//     },
//     PROCESSOR: {
//       name: 'Processor',
//       className: 'label primary',
//     },
//   };

//   const roleDocs = Object.entries(roleMap).map(([key, value]) => ({
//     key,
//     name: value.name,
//     className: value.className,
//   }));

//   try {
//     await Role.insertMany(roleDocs, { ordered: false });
//     res.status(201).json({ message: 'Roles inserted successfully.' });
//   } catch (err) {
//     if (err.code === 11000) {
//       res.status(409).json({ message: 'Some roles already exist.', error: err });
//     } else {
//       res.status(500).json({ message: 'Error inserting roles.', error: err });
//     }
//   }
// });
router.get('/getBatch', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { batchId: !isNaN(search) ? Number(search) : -1 },
          // { farmInspectionName: { $regex: search, $options: 'i' } },
          // { harvesterName: { $regex: search, $options: 'i' } },
          // { processorName: { $regex: search, $options: 'i' } },
          // { exporterName: { $regex: search, $options: 'i' } },
          // { importerName: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const totalBatches = await BatchModel.countDocuments(query);
    const currentPage = Math.max(parseInt(page), 1);
    const perPage = parseInt(limit);
    const totalPages = Math.ceil(totalBatches / perPage);
    const skip = (currentPage - 1) * perPage;

    const batches = await BatchModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const batchIds = batches.map(batch => batch.batchId);

    const trackBatches = await TrackingModel.find({ batchId: { $in: batchIds } });

    // Map tracking data by batchId
    const trackingMap = {};
    trackBatches.forEach(track => {
      trackingMap[track.batchId] = track;
    });

    // Merge tracking info into each batch
    const mergedBatches = batches.map(batch => {
      const batchObj = batch.toObject();
      batchObj.tracking = trackingMap[batch.batchId] || null;
      return batchObj;
    });

    res.status(200).json({
      batches: mergedBatches,
      totalBatches,
      totalPages,
      currentPage,
      message: 'All batches with tracking data fetched successfully.'
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Server error while fetching batches' });
  }
});
router.get('/getRoles', async (req, res) => {
  try {
    const roles = await Role.find({});
    const totalCount = await Role.countDocuments();

    res.status(200).json({
      roles,
      totalCount,
      message: 'Roles fetched successfully.'
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch roles.',
      error: err
    });
  }
});
router.get('/getBatchById', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Batch ID is required' });
    }

    const batch = await BatchModel.findOne({ batchId: id }).lean();

    if (!batch) {
      return res.status(404).json({ batch: null, message: 'Batch not found' });
    }

    const tracking = await TrackingModel.findOne({ batchId: id }).lean();
    batch.tracking = tracking || null;

    return res.status(200).json({ batch, message: 'Batch fetched successfully' });
  } catch (error) {
    console.error('Error fetching batch:', error);
    return res.status(500).json({ message: 'Server error while fetching batch' });
  }
});
router.get('/getBatchByUserId', async (req, res) => {
  try {
    const { id, search = '', page = 1, limit = 5 } = req.query;
    console.log('req.body', req.query)
    if (!id) {
      return res.status(400).json({ message: 'ID is required in query parameters.' });
    }

    const userMatch = {
      $or: [
        { farmInspectionId: id },
        { harvesterId: id },
        { processorId: id },
        { exporterId: id },
        { importerId: id }
      ]
    };

    let finalMatch = userMatch;
    if (search) {
      const searchQuery = {
        $or: [
          { batchId: !isNaN(search) ? Number(search) : -1 },
          // { farmInspectionName: { $regex: search, $options: 'i' } },
          // { harvesterName: { $regex: search, $options: 'i' } },
          // { processorName: { $regex: search, $options: 'i' } },
          // { exporterName: { $regex: search, $options: 'i' } },
          // { importerName: { $regex: search, $options: 'i' } }
        ]
      };
      finalMatch = { $and: [userMatch, searchQuery] };
    }

    const totalBatches = await BatchModel.countDocuments(finalMatch);
    const currentPage = Math.max(parseInt(page), 1);
    const perPage = parseInt(limit);
    const totalPages = Math.ceil(totalBatches / perPage);
    const skip = (currentPage - 1) * perPage;

    const batches = await BatchModel.find(finalMatch)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const batchIds = batches.map(batch => batch.batchId);

    const trackBatches = await TrackingModel.find({ batchId: { $in: batchIds } });

    // Create a map for faster lookup of tracking data
    const trackingMap = {};
    trackBatches.forEach(track => {
      trackingMap[track.batchId] = track;
    });

    // Merge tracking data into each batch
    const mergedBatches = batches.map(batch => {
      const batchObj = batch.toObject(); // Convert Mongoose doc to plain object
      batchObj.tracking = trackingMap[batch.batchId] || null;
      return batchObj;
    });

    return res.status(200).json({
      batches: mergedBatches,
      totalBatches,
      totalPages,
      currentPage,
      message: 'Batches and tracking data fetched successfully.'
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return res.status(500).json({ message: 'Server error while fetching batches.' });
  }
});
router.post('/updateBatch', upload, async (req, res) => {
  console.log('req.body', req.body)
  try {
    const {
      batchId,
      farmInspectionId,
      farmInspectionName,
      productName,
      certificateNo,
      certificateFrom,
      typeOfFertilizer,
      fertilizerUsed,

      harvesterId,
      harvesterName,
      cropSampling,
      temperatureLevel,
      humidity,

      exporterId,
      exporterName,
      coordinationAddress,
      shipName,
      shipNo,
      departureDate,
      estimatedDate,
      exportedTo,

      importerId,
      importerName,
      quantityImported,
      shipStorage,
      arrivalDate,
      warehouseLocation,
      warehouseArrivalDate,
      importerAddress,

      processorId,
      processorName,
      quantityProcessed,
      processingMethod,
      packaging,
      packagedDate,
      warehouse,
      warehouseAddress,
      destination,
      price,
      miniQuantity,
      maxiQuantity,
    } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: 'Batch ID is required' });
    }

    const existing = await TrackingModel.findOne({ batchId });

    const updatedFields = {};

    // FARM INSPECTION LOGIC
    if (farmInspectionId || farmInspectionName || certificateNo || certificateFrom || typeOfFertilizer || fertilizerUsed || productName) {
      const imagePaths = [];

      if (req.files) {
        if (req.files.images) {
          imagePaths.push(...req.files.images.map(file => `/uploads/${file.filename}`));
        }
        if (req.files.inspectedImages) {
          imagePaths.push(...req.files.inspectedImages.map(file => `/uploads/${file.filename}`));
        }
      }

      updatedFields.certificateNo = certificateNo;
      updatedFields.certificateFrom = certificateFrom;
      updatedFields.productName = productName;
      updatedFields.farmInspectionId = farmInspectionId;
      updatedFields.farmInspectionName = farmInspectionName;
      updatedFields.typeOfFertilizer = typeOfFertilizer;
      updatedFields.fertilizerUsed = fertilizerUsed;
      updatedFields.isInspexted = true;
      updatedFields.inspectionDate = new Date();
      updatedFields.inspectedImages = imagePaths;
    }

    // HARVESTER LOGIC
    if (harvesterId || harvesterName || cropSampling || temperatureLevel || humidity) {
      updatedFields.harvesterId = harvesterId;
      updatedFields.harvesterName = harvesterName;
      updatedFields.cropSampling = cropSampling;
      updatedFields.temperatureLevel = temperatureLevel;
      updatedFields.humidity = humidity;
      updatedFields.isHarvested = true;
      updatedFields.harvestDate = new Date();
    }

    // EXPORTER LOGIC
    if (exporterId || coordinationAddress || shipName || shipNo || departureDate || estimatedDate || exportedTo) {
      updatedFields.exporterId = exporterId;
      updatedFields.exporterName = exporterName;
      updatedFields.coordinationAddress = coordinationAddress;
      updatedFields.shipName = shipName;
      updatedFields.shipNo = shipNo;
      updatedFields.departureDate = departureDate;
      updatedFields.estimatedDate = estimatedDate;
      updatedFields.exportedTo = exportedTo;
      updatedFields.isExported = true;
      updatedFields.exportDate = new Date();
    }

    // IMPORTER LOGIC
    if (importerId || quantityImported || shipStorage || arrivalDate || warehouseLocation || warehouseArrivalDate || importerAddress) {
      updatedFields.importerId = importerId;
      updatedFields.importerName = importerName;
      updatedFields.quantityImported = quantityImported;
      updatedFields.shipStorage = shipStorage;
      updatedFields.arrivalDate = arrivalDate;
      updatedFields.warehouseLocation = warehouseLocation;
      updatedFields.warehouseArrivalDate = warehouseArrivalDate;
      updatedFields.importerAddress = importerAddress;
      updatedFields.isImported = true;
      updatedFields.importDate = new Date();
    }



    // PROCESSOR LOGIC
    if (processorId || quantityProcessed || processingMethod || packaging || packagedDate || warehouse || warehouseAddress || destination || miniQuantity || maxiQuantity || price) {

      const imagePaths = [];

      if (req.files) {
        if (req.files.images) {
          imagePaths.push(...req.files.images.map(file => `/uploads/${file.filename}`));
        }
        if (req.files.inspectedImages) {
          imagePaths.push(...req.files.inspectedImages.map(file => `/uploads/${file.filename}`));
        }
      }
      updatedFields.price = price;
      updatedFields.miniQuantity = miniQuantity;
      updatedFields.maxiQuantity = maxiQuantity;
      updatedFields.processorId = processorId;
      updatedFields.processorName = processorName;
      updatedFields.quantityProcessed = quantityProcessed;
      updatedFields.processingMethod = processingMethod;
      updatedFields.packaging = packaging;
      updatedFields.packagedDate = packagedDate;
      updatedFields.warehouse = warehouse;
      updatedFields.warehouseAddress = warehouseAddress;
      updatedFields.destination = destination;
      updatedFields.isProcessed = true;
      updatedFields.processedDate = new Date();
      updatedFields.images = imagePaths; // Save image paths in the database
    }

    // Always ensure batchId is in the update set (required for upsert)
    updatedFields.batchId = batchId;

    const updatedBatch = await TrackingModel.findOneAndUpdate(
      { batchId },
      { $set: updatedFields },
      { new: true, upsert: true } // Create new if not found
    );

    return res.status(200).json({
      message: 'Batch updated successfully',
      batch: updatedBatch
    });

  } catch (error) {
    console.error('Error updating batch:', error);
    return res.status(500).json({ message: 'Server error while updating batch' });
  }
});
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
router.get('/getimages', async (req, res) => {
  try {
    const trackingRecords = await TrackingModel.find({});

    // Collect all images from all records
    let allInspectedImages = [];
    let allImages = [];

    trackingRecords.forEach(record => {
      if (record.inspectedImages && record.inspectedImages.length > 0) {
        allInspectedImages.push(...record.inspectedImages);
      }
      if (record.images && record.images.length > 0) {
        allImages.push(...record.images);
      }
    });

    // Shuffle and pick up to 3 images from each list
    const randomInspectedImages = getRandomImages(allInspectedImages, 3);
    const randomImages = getRandomImages(allImages, 3);

    res.status(200).json({
      randomInspectedImages,
      randomImages,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});

function getRandomImages(arr, maxCount) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, maxCount);
}





module.exports = router;