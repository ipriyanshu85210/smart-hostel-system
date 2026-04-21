import { useState, useEffect } from 'react';
import { MdMeetingRoom, MdAdd } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const StatusBadge = ({ status }) => {
  const styles = {
    Occupied: 'bg-success/15 text-success border-success/30',
    Unoccupied: 'bg-warning/15 text-warning border-warning/30',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status] || 'bg-surface-hover text-text-muted border-border'}`}>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const styles = {
    Single: 'bg-primary/15 text-primary-light border-primary/30',
    Shared: 'bg-accent/15 text-accent-light border-accent/30',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[type] || 'bg-surface-hover text-text-muted border-border'}`}>
      {type}
    </span>
  );
};

const initialForm = { roomNumber: '', type: 'Single', capacity: 1, status: 'Unoccupied' };

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'roomNumber', label: 'Room No.' },
    { key: 'type', label: 'Type', render: (val) => <TypeBadge type={val} /> },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  ];

  const fetchRooms = async () => {
    try {
      const { data } = await API.get('/rooms');
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAdd = () => {
    setEditingRoom(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      status: room.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await API.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRoom) {
        const { data } = await API.put(`/rooms/${editingRoom._id}`, form);
        setRooms((prev) => prev.map((r) => (r._id === data._id ? data : r)));
      } else {
        const { data } = await API.post('/rooms', form);
        setRooms((prev) => [...prev, data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving room:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all';
  const labelClass = 'block text-sm font-medium text-text-secondary mb-1.5';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
            <MdMeetingRoom className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Rooms</h1>
            <p className="text-text-muted text-sm">Manage hostel room allocations</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
        >
          <MdAdd size={20} />
          Add Room
        </button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={rooms} onEdit={openEdit} onDelete={handleDelete} loading={loading} />

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingRoom ? 'Edit Room' : 'Add New Room'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 101"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option value="Single">Single</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className={inputClass}
                min="1"
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="Unoccupied">Unoccupied</option>
              <option value="Occupied">Occupied</option>
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Rooms;
