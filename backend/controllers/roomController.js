const Room = require('../models/Room');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'room',
          as: 'occupants'
        }
      },
      {
        $addFields: {
          currentOccupancy: { $size: '$occupants' }
        }
      },
      {
        $match: {
          $expr: { $lt: ['$currentOccupancy', '$capacity'] }
        }
      },
      {
        $project: {
          occupants: 0 // Exclude the potentially large occupants array
        }
      }
    ]);
    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAvailableRooms };
