import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Store auth token (for real app) and update state
        localStorage.setItem('adminAuth', JSON.stringify(response.data.user));
        onLogin(true);
        navigate('/');
      }
    } catch (err) {
      console.warn('Backend API login failed, checking fallback credentials:', err);
      // Fallback for offline/demo/mobile testing
      if (email === 'admin@stuckfit.com' && password === 'admin') {
        const mockUser = {
          id: 'admin_1',
          name: 'Stuckfit Admin (Demo)',
          email: email,
          isAdmin: true
        };
        localStorage.setItem('adminAuth', JSON.stringify(mockUser));
        onLogin(true);
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to connect to server and invalid demo credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Stuckfit Logo" className="login-logo" />
          <h2>Admin Access</h2>
          <p>Sign in to manage your store</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@stuckfit.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Secure Dashboard Portal</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
