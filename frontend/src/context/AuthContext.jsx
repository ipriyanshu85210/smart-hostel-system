import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      return true;
    } catch (error) {
      console.error('Login failed', error);
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (email, password, role) => {
    try {
      const { data } = await API.post('/auth/register', { email, password, role });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
