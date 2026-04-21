const Room = require('../models/Room');
const Student = require('../models/Student');
const Complaint = require('../models/Complaint');

const getDashboardStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const totalStudents = await Student.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });

    res.json({
      totalRooms,
      occupiedRooms,
      totalStudents,
      pendingComplaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRoomDetails = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id }).populate('room');
    
    if (!student) {
      // Auto-create student profile
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      student = await Student.create({
        user: user._id,
        name: user.email.split('@')[0],
        contactNumber: 'Not provided'
      });
      // Return empty room data since newly created student has no room
      return res.json({ room: null, roommates: [] });
    }

    if (!student.room) {
      return res.json({ room: null, roommates: [] });
    }

    let roommates = [];
    if (student.room.type === 'Shared') {
      roommates = await Student.find({
        room: student.room._id,
        _id: { $ne: student._id }
      }).select('name contactNumber parentContact');
    }

    res.json({
      room: student.room,
      roommates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getMyRoomDetails };
