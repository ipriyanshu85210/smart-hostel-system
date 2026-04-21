const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Single', 'Shared'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['Occupied', 'Unoccupied'],
    default: 'Unoccupied',
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
