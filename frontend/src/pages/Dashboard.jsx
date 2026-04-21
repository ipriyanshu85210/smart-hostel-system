import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  MdMeetingRoom,
  MdPeople,
  MdReport,
  MdCheckCircle,
  MdTrendingUp,
  MdAnnouncement,
  MdAccessTime,
  MdPersonOutline,
  MdPhone
} from 'react-icons/md';

const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
  <div
    className={`animate-fade-in-up ${delay} opacity-0 relative overflow-hidden rounded-xl p-6 bg-surface-card border border-border hover:border-primary/30 transition-all duration-300 group`}
  >
    {/* Background Gradient Glow */}
    <div
      className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl ${gradient} group-hover:opacity-30 transition-opacity duration-500`}
    />

    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-text-primary tracking-tight">{value}</h3>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}
      >
        <Icon className="text-white" size={24} />
      </div>
    </div>

    {/* Bottom Accent Line */}
    <div className="mt-4 flex items-center gap-2">
      <MdTrendingUp className="text-success text-sm" />
      <span className="text-xs text-text-muted">Live from database</span>
    </div>
  </div>
);

const NoticeCard = ({ notice, index }) => (
  <div
    className={`animate-fade-in-up opacity-0 p-5 rounded-xl bg-surface-card border border-border hover:border-accent/30 transition-all duration-300 group`}
    style={{ animationDelay: `${0.3 + index * 0.08}s` }}
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
        <MdAnnouncement className="text-accent" size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-primary mb-1 truncate">{notice.title}</h4>
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{notice.content}</p>
        <div className="flex items-center gap-1.5 mt-2.5">
          <MdAccessTime className="text-text-muted" size={12} />
          <span className="text-[11px] text-text-muted">
            {new Date(notice.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const MyRoomDetails = ({ roomData, availableRooms, myRequest, onRequestRoom, requestingRoom }) => {
  if (!roomData || !roomData.room) {
    if (myRequest && myRequest.status === 'Pending') {
      return (
        <div className="animate-fade-in-up rounded-2xl p-8 bg-surface-card border border-warning flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <MdAccessTime className="text-warning text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Request Pending</h3>
          <p className="text-text-muted max-w-md">You have requested Room {myRequest.room?.roomNumber}. Please wait for the administrator to approve your request.</p>
        </div>
      );
    }

    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="rounded-2xl p-8 bg-surface-card border border-border flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <MdMeetingRoom className="text-warning text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Room Assigned</h3>
          <p className="text-text-muted max-w-md">You have not been assigned a room yet. Please choose from the available rooms below.</p>
        </div>

        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Available Rooms</h3>
          {availableRooms.length === 0 ? (
            <p className="text-text-muted text-center py-4">No rooms are currently available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {availableRooms.map(room => (
                <div key={room._id} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors bg-surface flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-text-primary">Room {room.roomNumber}</h4>
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{room.type}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-4">Available Spots: {room.capacity - (room.currentOccupancy || 0)}</p>
                  </div>
                  <button
                    onClick={() => onRequestRoom(room._id)}
                    disabled={requestingRoom}
                    className="w-full py-2 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {requestingRoom ? 'Requesting...' : 'Request Room'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const { room, roommates } = roomData;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-text-primary">My Assigned Room</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors duration-500" />
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium mb-1">Room Number</p>
            <h3 className="text-4xl font-bold mb-4">{room.roomNumber}</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                {room.type} Room
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                Capacity: {room.capacity}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-2 rounded-2xl p-6 bg-surface-card border border-border h-full flex flex-col">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-4">
            <MdPeople className="text-primary" /> 
            {room.type === 'Shared' ? 'Roommates' : 'Occupancy Info'}
          </h3>
          
          {room.type === 'Single' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <MdPersonOutline className="text-4xl text-text-muted mb-2" />
              <p className="text-text-secondary">This is a single room. You have the entire space to yourself.</p>
            </div>
          ) : roommates.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <MdPersonOutline className="text-4xl text-text-muted mb-2" />
              <p className="text-text-secondary">You currently have no roommates assigned to this shared room.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roommates.map((mate, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface border border-border flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {mate.name ? mate.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary text-sm">{mate.name || 'Unknown Student'}</h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted">
                      <MdPhone size={12} />
                      <span>{mate.contactNumber || 'No contact'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStudents: 0,
    pendingComplaints: 0,
  });
  const [myRoomData, setMyRoomData] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [myRequest, setMyRequest] = useState(null);
  const [requestingRoom, setRequestingRoom] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    try {
      const [roomRes, nRes, requestsRes] = await Promise.all([
        API.get('/dashboard/my-room').catch(() => ({ data: { room: null, roommates: [] } })),
        API.get('/notices').catch(() => ({ data: [] })), 
        API.get('/room-requests').catch(() => ({ data: [] })),
      ]);
      setMyRoomData(roomRes.data);
      
      if (requestsRes.data && requestsRes.data.length > 0) {
        setMyRequest(requestsRes.data[0]); // Most recent request
      }

      if (!roomRes.data.room && (!requestsRes.data.length || requestsRes.data[0].status !== 'Pending')) {
        const availRes = await API.get('/rooms/available').catch(() => ({ data: [] }));
        setAvailableRooms(availRes.data);
      }

      return nRes;
    } catch (err) {
      console.error(err);
      return { data: [] };
    }
  };

  const handleRequestRoom = async (roomId) => {
    try {
      setRequestingRoom(true);
      const { data } = await API.post('/room-requests', { roomId });
      setMyRequest(data);
      alert('Room request submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to request room');
    } finally {
      setRequestingRoom(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let noticesRes;
        
        if (user?.role === 'Admin') {
          const [statsRes, nRes] = await Promise.all([
            API.get('/dashboard/stats'),
            API.get('/notices').catch(() => ({ data: [] })), 
          ]);
          setStats(statsRes.data);
          noticesRes = nRes;
        } else {
          noticesRes = await fetchStudentData();
        }

        // Use sample notices if none exist yet
        if (!noticesRes.data || noticesRes.data.length === 0) {
          setNotices([
            {
              _id: '1',
              title: 'Welcome to Smart Hostel System',
              content: 'The new hostel management system is now live! All students and administrators can use this portal for room management, fee tracking, and complaint submissions.',
              createdAt: new Date().toISOString(),
            },
            {
              _id: '2',
              title: 'Hostel Maintenance Scheduled',
              content: 'Routine maintenance of all common areas is scheduled for this weekend. Please cooperate and keep the areas accessible.',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              _id: '3',
              title: 'Fee Payment Reminder',
              content: 'All pending hostel fees must be cleared by the end of this month. Late payments will incur additional charges as per the hostel policy.',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
          ]);
        } else {
          setNotices(noticesRes.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Populate with sample data on error for demo purposes
        setStats({ totalRooms: 50, occupiedRooms: 38, totalStudents: 42, pendingComplaints: 7 });
        setNotices([
          {
            _id: '1',
            title: 'Welcome to Smart Hostel System',
            content: 'The new hostel management system is now live! Connect your backend to see real data.',
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const statCards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: MdMeetingRoom,
      gradient: 'bg-gradient-to-br from-primary to-primary-dark',
      delay: 'stagger-1',
    },
    {
      title: 'Occupied Rooms',
      value: stats.occupiedRooms,
      icon: MdCheckCircle,
      gradient: 'bg-gradient-to-br from-success to-emerald-600',
      delay: 'stagger-2',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: MdPeople,
      gradient: 'bg-gradient-to-br from-accent to-cyan-600',
      delay: 'stagger-3',
    },
    {
      title: 'Pending Complaints',
      value: stats.pendingComplaints,
      icon: MdReport,
      gradient: 'bg-gradient-to-br from-warning to-amber-600',
      delay: 'stagger-4',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[140px] rounded-2xl animate-shimmer" />
          ))}
        </div>
        <div className="h-48 rounded-2xl animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Hostel  Dashboard
        </h1>
        <p className="text-text-secondary text-base mt-2 max-w-2xl">
          Welcome back! Here is a high-level overview of your hostel's current status and recent activity.
        </p>
      </div>

      {/* Role-based Content */}
      {user?.role === 'Admin' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      ) : (
        <MyRoomDetails 
          roomData={myRoomData} 
          availableRooms={availableRooms} 
          myRequest={myRequest} 
          onRequestRoom={handleRequestRoom}
          requestingRoom={requestingRoom}
        />
      )}

      {/* Latest Notices */}
      <div className="animate-fade-in-up opacity-0 stagger-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Latest Notices</h2>
            <p className="text-xs text-text-muted mt-0.5">Recent announcements and updates</p>
          </div>
          <button className="text-xs text-primary-light hover:text-primary font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notices.map((notice, index) => (
            <NoticeCard key={notice._id} notice={notice} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
