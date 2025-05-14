const mongoose = require('mongoose');
const Counter = require('./counterModel'); 

const FarmerRecordSchema = new mongoose.Schema({
  batchId: { type: Number, unique: true },
  farmerRegNo: { type: String, required: true },
  farmerName: { type: String, required: true },
  farmerAddress: { type: String, required: true },
  farmInspectionName: { type: String, required: true },
  harvesterName: { type: String, required: true },
  processorName: { type: String, required: true },
  exporterName: { type: String, required: true },
  importerName: { type: String, required: true },
  coffeeType: { type: String, required: true },
  qrCode: { type: String},
  farmInspectionId: { type: String, },
  harvesterId: { type: String, },
  processorId: { type: String, },
  exporterId: { type: String, },
  importerId: { type: String, },
}, { timestamps: true });

FarmerRecordSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'batchId' },
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
      );

      this.batchId = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const BatchModel = mongoose.model('FarmerRecord', FarmerRecordSchema);
module.exports = BatchModel
