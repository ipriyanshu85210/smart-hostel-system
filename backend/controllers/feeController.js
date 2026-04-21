const Fee = require('../models/Fee');

const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student');
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json({ message: 'Fee record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFees, getFeeById, createFee, updateFee, deleteFee };
