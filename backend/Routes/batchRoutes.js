
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
const QRCode = require('qrcode');



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



module.exports = router;