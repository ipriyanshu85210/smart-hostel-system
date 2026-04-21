import { useState, useEffect } from 'react';
import { MdPeople, MdAdd } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const initialForm = { name: '', contactNumber: '', parentContact: '', room: '' };

const Students = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'parentContact', label: 'Parent Contact' },
    {
      key: 'room',
      label: 'Room',
      render: (val) =>
        val ? (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-accent/15 text-accent-light border-accent/30">
            {val.roomNumber}
          </span>
        ) : (
          <span className="text-xs text-text-muted italic">Unassigned</span>
        ),
    },
  ];

  const fetchData = async () => {
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        API.get('/students'),
        API.get('/rooms'),
      ]);
      setStudents(studentsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditingStudent(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      contactNumber: student.contactNumber,
      parentContact: student.parentContact || '',
      room: student.room?._id || student.room || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await API.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.room) delete payload.room;

      if (editingStudent) {
        const { data } = await API.put(`/students/${editingStudent._id}`, payload);
        // Re-fetch to get populated data
        await fetchData();
      } else {
        await API.post('/students', payload);
        await fetchData();
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving student:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all';
  const labelClass = 'block text-sm font-medium text-text-secondary mb-1.5';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-cyan-600 flex items-center justify-center shadow-lg">
            <MdPeople className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Students</h1>
            <p className="text-text-muted text-sm">Manage student records</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-cyan-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 cursor-pointer"
        >
          <MdAdd size={20} />
          Add Student
        </button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={students} onEdit={openEdit} onDelete={handleDelete} loading={loading} />

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingStudent ? 'Edit Student' : 'Add New Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter student name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 9876543210"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Parent Contact</label>
              <input
                type="text"
                name="parentContact"
                value={form.parentContact}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 9876543211"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Assigned Room</label>
            <select name="room" value={form.room} onChange={handleChange} className={inputClass}>
              <option value="">-- No Room Assigned --</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} ({room.type} — {room.status})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-cyan-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
