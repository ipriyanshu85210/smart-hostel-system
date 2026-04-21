import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Complaints from './pages/Complaints';
import Notices from './pages/Notices';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomRequests from './pages/RoomRequests';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/notices" element={<Notices />} />
              
              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/students" element={<Students />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/room-requests" element={<RoomRequests />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
