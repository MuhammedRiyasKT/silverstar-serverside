const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  lastOccupiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);