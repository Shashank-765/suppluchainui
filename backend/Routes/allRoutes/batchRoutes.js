
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../../Models/userModel.js');
const BatchModel = require('../../Models/BatchModel.js');
const TrackingModel = require('../../Models/BatchProductModel.js');
const Role = require('../../Models/RolesModel.js');
const NotifyModel = require('../../Models/NotifictionModel.js')
const { authorize } = require('../../Auth/Authenticate.js');
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
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: 'images', maxCount: 15 },
  { name: 'inspectedImages', maxCount: 15 }
]);


router.post('/createBatch', authorize, async (req, res) => {
  try {
    const { farmerRegNo, farmerName, farmerAddress, farmInspectionName, harvesterName, processorName, exporterName, importerName, coffeeType } = req.body;
    if (!farmerRegNo || !farmerName || !farmerAddress || !farmInspectionName || !harvesterName || !processorName || !exporterName || !importerName || !coffeeType) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    let farmInspectionId = null;
    let harvesterId = null;
    let processorId = null;
    let exporterId = null;
    let importerId = null;
    let adminId = req.userData.id;

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
      const frontendBaseUrl = `https://lfgkx3p7-3000.inc1.devtunnels.ms/screening/${newBatch.batchId}`;
      const qrData = `${frontendBaseUrl}`;
      const qrCode = await QRCode.toDataURL(qrData);

      newBatch.qrCode = qrCode;
      await newBatch.save();
    }
    const readStatus = {
      [farmInspectionId?._id]: false,
      [harvesterId?._id]: false,
      [importerId?._id]: false,
      [exporterId?._id]: false,
      [processorId?._id]: false
    };

    const notification = new NotifyModel({
      batchId: newBatch?.batchId,
      farmInspection: farmInspectionId?._id,
      harvester: harvesterId?._id,
      importer: importerId?._id,
      exporter: exporterId?._id,
      processor: processorId?._id,
      createdBy: req.userData.id,
      readStatus
    });

    await notification.save();
    return res.status(200).json({ batch: newBatch, message: 'Batch created successfully' });

  } catch (error) {
    console.error('Error creating batch:', error);
    return res.status(500).json({ message: 'Server error while creating batch' });
  }
});

router.delete('/deletebatch', authorize, async (req, res) => {
  try {
    const { batchId } = req.query;

    if (!batchId) {
      return res.status(400).json({ message: 'batchId is required' });
    }

    const deleted = await BatchModel.findOneAndDelete({ batchId: batchId });
    const delted2 = await TrackingModel.findOneAndDelete({ batchId: batchId })

    if (!deleted && !delted2) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getBatch', authorize, async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { batchId: !isNaN(search) ? Number(search) : -1 },
        ]
      };
    }

    const totalBatches = await BatchModel.countDocuments(query);
    const currentPage = Math.max(parseInt(page), 1);
    const perPage = parseInt(limit);
    const totalPages = Math.ceil(totalBatches / perPage);
    const skip = (currentPage - 1) * perPage;

    const batches = await BatchModel.find(query).sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const batchIds = batches.map(batch => batch.batchId);

    const trackBatches = await TrackingModel.find({ batchId: { $in: batchIds } }).sort({ createdAt: -1 });

    const trackingMap = {};
    trackBatches.forEach(track => {
      trackingMap[track.batchId] = track;
    });

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

router.get('/getRoles',authorize, async (req, res) => {
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

router.get('/getBatchById', authorize, async (req, res) => {
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

router.get('/getBatchByUserId', authorize, async (req, res) => {
  try {
    const { id, search = '', page = 1, limit = 5 } = req.query;
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

    const trackingMap = {};
    trackBatches.forEach(track => {
      trackingMap[track.batchId] = track;
    });

    const mergedBatches = batches.map(batch => {
      const batchObj = batch.toObject();
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

router.post('/updateBatch', authorize, upload, async (req, res) => {
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
      inspectionStatus,

      harvesterId,
      harvesterName,
      cropSampling,
      temperatureLevel,
      humidity,
      harvestStatus,

      exporterId,
      exporterName,
      coordinationAddress,
      shipName,
      shipNo,
      departureDate,
      estimatedDate,
      exportedTo,
      exportStatus,

      importerId,
      importerName,
      quantityImported,
      shipStorage,
      arrivalDate,
      warehouseLocation,
      warehouseArrivalDate,
      importerAddress,
      importStatus,

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
      processingStatus,

      existingImages,
      existingInspectedImages
    } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: 'Batch ID is required' });
    }


    const updatedFields = {};

    const existingImagesArr = existingImages ? JSON.parse(existingImages) : [];
    const existingInspectedImagesArr = existingInspectedImages ? JSON.parse(existingInspectedImages) : [];

    if (farmInspectionId && farmInspectionName && certificateNo && certificateFrom && typeOfFertilizer && fertilizerUsed && productName && inspectionStatus) {
      const inspectedPaths = [...existingInspectedImagesArr];

      if (req.files?.inspectedImages) {
        inspectedPaths.push(...req.files.inspectedImages.map(file => `/uploads/${file.filename}`));
      }
      const isId = farmInspectionId?.split("_")[1];
      const farm = await User.findOne({ _id: isId })

      updatedFields.certificateNo = certificateNo;
      updatedFields.certificateFrom = certificateFrom;
      updatedFields.productName = productName;
      updatedFields.farmInspectionId = farmInspectionId;
      updatedFields.farmInspectionName = farmInspectionName;
      updatedFields.farmContact = farm?.contact;
      updatedFields.typeOfFertilizer = typeOfFertilizer;
      updatedFields.fertilizerUsed = fertilizerUsed;
      updatedFields.isInspexted = inspectionStatus === 'Completed';
      updatedFields.inspectionDate = new Date();
      updatedFields.inspectedImages = inspectedPaths;
      updatedFields.inspectionStatus = inspectionStatus;
    }

    if (harvesterId && harvesterName && cropSampling && temperatureLevel && humidity && harvestStatus) {
      const isId = harvesterId?.split("_")[1];
      const harvest = await User.findOne({ _id: isId })
      updatedFields.harvesterId = harvesterId;
      updatedFields.harvesterName = harvesterName;
      updatedFields.harvesterContact = harvest?.contact;
      updatedFields.cropSampling = cropSampling;
      updatedFields.temperatureLevel = temperatureLevel;
      updatedFields.humidity = humidity;
      updatedFields.isHarvested = harvestStatus === 'Completed';
      updatedFields.harvestDate = new Date();
      updatedFields.harvestStatus = harvestStatus;
    }

    if (exporterId && coordinationAddress && shipName && shipNo && departureDate && estimatedDate && exportedTo && exportStatus) {
      const isId = exporterId?.split("_")[1];

      const exporter = await User?.findOne({ _id: isId })
      updatedFields.exporterId = exporterId;
      updatedFields.exporterName = exporterName;
      updatedFields.exporterContact = exporter?.contact;
      updatedFields.coordinationAddress = coordinationAddress;
      updatedFields.shipName = shipName;
      updatedFields.shipNo = shipNo;
      updatedFields.departureDate = departureDate;
      updatedFields.estimatedDate = estimatedDate;
      updatedFields.exportedTo = exportedTo;
      updatedFields.isExported = exportStatus === 'Shipped';
      updatedFields.exportDate = new Date();
      updatedFields.exportStatus = exportStatus;
    }

    if (importerId && quantityImported && shipStorage && arrivalDate && warehouseLocation && warehouseArrivalDate && importerAddress && importStatus) {
      const isId = importerId?.split("_")[1];

      const imported = await User?.findOne({ _id: isId });

      updatedFields.importerId = importerId;
      updatedFields.importerName = importerName;
      updatedFields.importerContact = imported?.contact;
      updatedFields.quantityImported = quantityImported;
      updatedFields.shipStorage = shipStorage;
      updatedFields.arrivalDate = arrivalDate;
      updatedFields.warehouseLocation = warehouseLocation;
      updatedFields.warehouseArrivalDate = warehouseArrivalDate;
      updatedFields.importerAddress = importerAddress;
      updatedFields.isImported = importStatus === 'Received';
      updatedFields.importDate = new Date();
      updatedFields.importStatus = importStatus;
    }

    if (processorId && quantityProcessed && processingMethod && packaging && packagedDate && warehouse && warehouseAddress && destination && price && processingStatus) {
      const processedPaths = [...existingImagesArr];

      if (req.files?.images) {
        processedPaths.push(...req.files.images.map(file => `/uploads/${file.filename}`));
      }
      const isId = processorId?.split("_")[1];
      const process = await User?.findOne({ _id: isId })
      updatedFields.price = price;
      updatedFields.processorId = processorId;
      updatedFields.processorName = processorName;
      updatedFields.processorContact = process?.contact;
      updatedFields.quantityProcessed = quantityProcessed;
      updatedFields.processingMethod = processingMethod;
      updatedFields.packaging = packaging;
      updatedFields.packagedDate = packagedDate;
      updatedFields.warehouse = warehouse;
      updatedFields.warehouseAddress = warehouseAddress;
      updatedFields.destination = destination;
      updatedFields.isProcessed = processingStatus === 'Processed';
      updatedFields.processedDate = new Date();
      updatedFields.images = processedPaths;
      updatedFields.processingStatus = processingStatus;
    }

    updatedFields.batchId = batchId;

    const updatedBatch = await TrackingModel.findOneAndUpdate(
      { batchId },
      { $set: updatedFields },
      { new: true, upsert: true }
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