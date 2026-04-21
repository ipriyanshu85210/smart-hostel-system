import { useState, useEffect } from 'react';
import { MdPayment, MdAdd } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: 'bg-success/15 text-success border-success/30',
    Unpaid: 'bg-danger/15 text-danger border-danger/30',
    Partial: 'bg-warning/15 text-warning border-warning/30',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status] || 'bg-surface-hover text-text-muted border-border'}`}>
      {status}
    </span>
  );
};

const initialForm = { student: '', totalAmount: '', amountDue: '', status: 'Unpaid', dueDate: '' };

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (val) => val?.name || <span className="text-text-muted italic text-xs">N/A</span>,
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (val) => (
        <span className="font-semibold text-text-primary">₹{val?.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'amountDue',
      label: 'Amount Due',
      render: (val) => (
        <span className={`font-semibold ${val > 0 ? 'text-danger' : 'text-success'}`}>
          ₹{val?.toLocaleString('en-IN')}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (val) =>
        val ? (
          <span className="text-text-secondary text-xs">
            {new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        ) : (
          <span className="text-text-muted text-xs">—</span>
        ),
    },
  ];

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        API.get('/fees'),
        API.get('/students'),
      ]);
      setFees(feesRes.data);
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
    setEditingFee(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (fee) => {
    setEditingFee(fee);
    setForm({
      student: fee.student?._id || fee.student || '',
      totalAmount: fee.totalAmount,
      amountDue: fee.amountDue,
      status: fee.status,
      dueDate: fee.dueDate ? fee.dueDate.split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return;
    try {
      await API.delete(`/fees/${id}`);
      setFees((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error('Error deleting fee:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        totalAmount: Number(form.totalAmount),
        amountDue: Number(form.amountDue),
      };
      if (!payload.dueDate) delete payload.dueDate;

      if (editingFee) {
        await API.put(`/fees/${editingFee._id}`, payload);
        await fetchData();
      } else {
        await API.post('/fees', payload);
        await fetchData();
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving fee:', err);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-lg">
            <MdPayment className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Fees</h1>
            <p className="text-text-muted text-sm">Track fee payments and dues</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-success to-emerald-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-success/25 transition-all duration-300 cursor-pointer"
        >
          <MdAdd size={20} />
          Add Fee Record
        </button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={fees} onEdit={openEdit} onDelete={handleDelete} loading={loading} />

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingFee ? 'Edit Fee Record' : 'Add Fee Record'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Student</label>
            <select name="student" value={form.student} onChange={handleChange} className={inputClass} required>
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Total Amount (₹)</label>
              <input
                type="number"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 50000"
                min="0"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Amount Due (₹)</label>
              <input
                type="number"
                name="amountDue"
                value={form.amountDue}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 25000"
                min="0"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-success to-emerald-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-success/25 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editingFee ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
