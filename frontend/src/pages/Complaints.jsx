import { useState, useEffect } from 'react';
import { MdReport, MdAdd } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const initialForm = { student: '', title: '', description: '', status: 'Pending' };

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (val) => val?.name || <span className="text-text-muted italic">Unknown</span>,
    },
    { key: 'title', label: 'Title' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            val === 'Resolved'
              ? 'bg-success/15 text-success-light border-success/30'
              : val === 'In Progress'
              ? 'bg-warning/15 text-warning-light border-warning/30'
              : 'bg-danger/15 text-danger-light border-danger/30'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
        key: 'createdAt',
        label: 'Date',
        render: (val) => new Date(val).toLocaleDateString()
    }
  ];

  const fetchData = async () => {
    try {
      const [complaintsRes, studentsRes] = await Promise.all([
        API.get('/complaints'),
        API.get('/students'),
      ]);
      setComplaints(complaintsRes.data);
      setStudents(studentsRes.data);
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
    setEditingComplaint(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (complaint) => {
    setEditingComplaint(complaint);
    setForm({
      student: complaint.student?._id || complaint.student || '',
      title: complaint.title,
      description: complaint.description,
      status: complaint.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Error deleting complaint:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingComplaint) {
        await API.put(`/complaints/${editingComplaint._id}`, form);
      } else {
        await API.post('/complaints', form);
      }
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving complaint:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-warning/50 focus:border-warning transition-all';
  const labelClass = 'block text-sm font-medium text-text-secondary mb-1.5';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-amber-600 flex items-center justify-center shadow-lg">
            <MdReport className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Complaints</h1>
            <p className="text-text-muted text-sm">Manage student issue submissions</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-warning to-amber-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-warning/25 transition-all duration-300 cursor-pointer"
        >
          <MdAdd size={20} />
          Add Complaint
        </button>
      </div>

      <DataTable columns={columns} data={complaints} onEdit={openEdit} onDelete={handleDelete} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingComplaint ? 'Edit Complaint' : 'Record New Complaint'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Student</label>
            <select name="student" value={form.student} onChange={handleChange} className={inputClass} required disabled={!!editingComplaint}>
              <option value="">-- Select Student --</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.room?.roomNumber ? `Room ${student.room.roomNumber}` : 'No Room'})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Title / Issue Subject</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Fan not working"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Detailed Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[100px] resize-none`}
              placeholder="Describe the issue in detail..."
              required
            />
          </div>
          {editingComplaint && (
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          )}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-warning to-amber-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-warning/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editingComplaint ? 'Update Complaint' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;
