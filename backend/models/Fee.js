const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  amountDue: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid',
  },
  dueDate: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
