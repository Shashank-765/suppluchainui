const mongoose = require('mongoose');

const BatchNotificationSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  farmInspection: { type: String, required: true },
  harvester: { type: String, required: true },
  importer: { type: String, required: true },
  exporter: { type: String, required: true },
  processor: { type: String, required: true },
  createdBy: { type: String, required: true },
  message: { type: String, default: 'has been created' },
  readStatus: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, { timestamps: true });

const PurchaseNotificationSchema = new mongoose.Schema({
  batchId: { type: String },
  farmInspection: { type: String },
  harvester: { type: String },
  importer: { type: String },
  exporter: { type: String },
  processor: { type: String },
  createdBy: { type: String },
  quantity: { type: String },
  price: { type: String },
  buyerId: { type: String },
  sellerId: { type: String },
  message: { type: String, default: 'Product sold' },
  readStatus: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, { timestamps: true });

const NotifyModel = mongoose.model('notifications', BatchNotificationSchema);
const PurchaseNotifyModel = mongoose.model('purchaseNotifications', PurchaseNotificationSchema);

module.exports = {
  NotifyModel,
  PurchaseNotifyModel
};
