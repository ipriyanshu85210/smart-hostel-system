import { useState, useEffect } from 'react';
import API from '../api/axios';
import { MdMeetingRoom, MdCheck, MdClose, MdAccessTime } from 'react-icons/md';

const RoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/room-requests');
      setRequests(data);
    } catch (err) {
      console.error('Error fetching room requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setProcessingId(id);
      await API.put(`/room-requests/${id}/status`, { status });
      // Update local state
      setRequests(prev => prev.map(req => req._id === id ? { ...req, status } : req));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-warning/15 text-warning border-warning/30',
      Approved: 'bg-success/15 text-success border-success/30',
      Rejected: 'bg-danger/15 text-danger border-danger/30',
    };
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
          <MdAccessTime className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Room Requests</h1>
          <p className="text-text-muted text-sm">Review and manage student room assignments</p>
        </div>
      </div>

      <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted animate-pulse">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No room requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-text-secondary text-sm">
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Room Requested</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {requests.map((request) => (
                  <tr key={request._id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-text-primary">{request.student?.name || 'Unknown'}</p>
                      <p className="text-xs text-text-muted">{request.student?.contactNumber || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MdMeetingRoom className="text-primary" />
                        <span className="font-medium text-text-primary">{request.room?.roomNumber || 'N/A'}</span>
                        <span className="text-xs text-text-muted">({request.room?.type})</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(request._id, 'Approved')}
                            disabled={processingId === request._id}
                            className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                            title="Approve"
                          >
                            <MdCheck size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                            disabled={processingId === request._id}
                            className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                            title="Reject"
                          >
                            <MdClose size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomRequests;
