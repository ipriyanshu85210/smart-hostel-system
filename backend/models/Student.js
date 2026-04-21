const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  parentContact: {
    type: String,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
