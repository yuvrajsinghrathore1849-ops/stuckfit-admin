import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('adminAuth'));

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={setIsAuthenticated} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <AdminPanel onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
