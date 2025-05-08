const mongoose = require('mongoose')

const BatchNotificationModel = new mongoose.Schema({
  batchId: { type: String, required: true },
  farmInspection: { type: String, required: true },
  harvester: { type: String, required: true },
  importer: { type: String, required: true },
  exporter: { type: String, required: true },
  processor: { type: String, required: true },
  createdBy: { type: String, required: true }, 
  message:{type:String,default:'has been created'},
  readStatus: {
    type: Map,
    of: Boolean, 
    default: {}
  }
}, { timestamps: true });

const NotifyModel = mongoose.model('notifications', BatchNotificationModel);
module.exports = NotifyModel;
