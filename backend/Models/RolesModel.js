const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
