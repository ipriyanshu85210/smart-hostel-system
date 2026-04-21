import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MdMeetingRoom } from 'react-icons/md';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, role);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br from-primary to-accent" />
        
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg mb-4">
            <MdMeetingRoom className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Create Account</h2>
          <p className="text-sm text-text-muted mt-1">Join the Smart Hostel System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="student@hostel.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-light hover:text-primary font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
