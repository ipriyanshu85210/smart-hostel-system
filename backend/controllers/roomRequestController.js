const RoomRequest = require('../models/RoomRequest');
const Room = require('../models/Room');
const Student = require('../models/Student');

const createRequest = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id });
    if (!student) {
      // Auto-create student profile if it doesn't exist
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      student = await Student.create({
        user: user._id,
        name: user.email.split('@')[0],
        contactNumber: 'Not provided'
      });
    }

    if (student.room) return res.status(400).json({ message: 'You already have an assigned room' });

    const existingRequest = await RoomRequest.findOne({ student: student._id, status: 'Pending' });
    if (existingRequest) return res.status(400).json({ message: 'You already have a pending room request' });

    const room = await Room.findById(req.body.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const request = await RoomRequest.create({
      student: student._id,
      room: room._id,
      status: 'Pending'
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const requests = await RoomRequest.find().populate('student').populate('room').sort({ createdAt: -1 });
      res.json(requests);
    } else {
      let student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.json([]);
      }
      const requests = await RoomRequest.find({ student: student._id }).populate('room').sort({ createdAt: -1 });
      res.json(requests);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await RoomRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (status === 'Approved') {
      // Check room availability again
      const currentOccupancy = await Student.countDocuments({ room: request.room });
      const room = await Room.findById(request.room);
      
      if (currentOccupancy >= room.capacity) {
        return res.status(400).json({ message: 'Room is already at full capacity' });
      }

      // Assign room to student
      await Student.findByIdAndUpdate(request.student, { room: request.room });
      
      // Check if room is now full
      if (currentOccupancy + 1 >= room.capacity) {
        await Room.findByIdAndUpdate(request.room, { status: 'Occupied' });
      }
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getRequests, updateRequestStatus };
