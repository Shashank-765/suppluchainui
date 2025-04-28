const mongoose = require('mongoose');

const trackingDetailsSchema = new mongoose.Schema({
    // Farm Inspection fields
    farmInspectionId: { type: String },
    farmInspectionName: { type: String },
    productName: { type: String },
    certificateNo: { type: String },
    certificateFrom: { type: String },
    typeOfFertilizer: { type: String },
    fertilizerUsed: { type: String },
    isInspexted: { type: Boolean, default: false },
    inspectionDate: { type: Date },
    inspectedImages: [{ type: String }],
    inspectionStatus: { type: String },


    // Harvester fields
    harvesterId: { type: String },
    harvesterName: { type: String },
    cropSampling: { type: String },
    temperatureLevel: { type: String },
    humidity: { type: String },
    isHarvested: { type: Boolean, default: false },
    harvestDate: { type: Date },
    harvestStatus: { type: String },

    // Exporter fields
    exporterId: { type: String },
    exporterName: { type: String },
    coordinationAddress: { type: String },
    shipName: { type: String },
    shipNo: { type: String },
    departureDate: { type: Date },
    estimatedDate: { type: Date },
    exportedTo: { type: String },
    isExported: { type: Boolean, default: false },
    exportDate: { type: Date, },
    exportStatus: { type: String },

    // Importer fields
    importerId: { type: String },
    importerName: { type: String },
    quantityImported: { type: String },
    shipStorage: { type: String },
    arrivalDate: { type: Date },
    warehouseLocation: { type: String },
    warehouseArrivalDate: { type: Date },
    importerAddress: { type: String },
    isImported: { type: Boolean, default: false },
    importDate: { type: Date },
    importStatus: { type: String },

    // Processor fields
    processorId: { type: String },
    processorName: { type: String },
    quantityProcessed: { type: String },
    processingMethod: { type: String },
    packaging: { type: String },
    packagedDate: { type: Date },
    warehouse: { type: String },
    warehouseAddress: { type: String },
    destination: { type: String },
    isProcessed: { type: Boolean, default: false },
    processedDate: { type: Date },
    images: [{ type: String, },],
    price: { type: String, },
    processingStatus: { type: String },
    purchaseHistory: [
        {
            buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
            ownerId:{type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            quantityBought: { type: String }, 
            pricePaid: { type: Number },     
            purchaseDate: { type: Date, default: Date.now }, 
        }
    ],

    
    // Common fields
    batchId: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const TrackingModel = mongoose.model('TrackingDetails', trackingDetailsSchema);

module.exports = TrackingModel;
