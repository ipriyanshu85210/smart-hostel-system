import { useState, useEffect } from 'react';
import { MdAnnouncement, MdAdd } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const initialForm = { title: '', content: '' };

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'content', 
      label: 'Content',
      render: (val) => val.length > 50 ? val.substring(0, 50) + '...' : val
    },
    {
      key: 'createdAt',
      label: 'Posted On',
      render: (val) => new Date(val).toLocaleDateString() + ' ' + new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const fetchData = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditingNotice(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      content: notice.content,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingNotice) {
        await API.put(`/notices/${editingNotice._id}`, form);
      } else {
        await API.post('/notices', form);
      }
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving notice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-danger/50 focus:border-danger transition-all';
  const labelClass = 'block text-sm font-medium text-text-secondary mb-1.5';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-danger to-red-600 flex items-center justify-center shadow-lg">
            <MdAnnouncement className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Notices</h1>
            <p className="text-text-muted text-sm">View and manage announcements</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-danger to-red-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-danger/25 transition-all duration-300 cursor-pointer"
        >
          <MdAdd size={20} />
          Add Notice
        </button>
      </div>

      <DataTable columns={columns} data={notices} onEdit={openEdit} onDelete={handleDelete} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingNotice ? 'Edit Notice' : 'Post New Notice'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Notice Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Holiday Announcement"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Notice Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className={`${inputClass} min-h-[150px] resize-none`}
              placeholder="Enter the details of the notice..."
              required
            />
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-danger to-red-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-danger/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editingNotice ? 'Update Notice' : 'Post Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notices;
