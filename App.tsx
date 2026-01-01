
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vote from './pages/Vote';
import AuctionPage from './pages/AuctionPage';
import AdminDashboard from './pages/AdminDashboard';
import Results from './pages/Results';
import { User, UserRole } from './types';
import { mockBackend } from './services/mockBackend';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session simulation
    const savedUser = localStorage.getItem('electra_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('electra_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('electra_user');
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/vote" element={user ? <Vote user={user} /> : <Navigate to="/login" />} />
            <Route path="/auctions" element={user ? <AuctionPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/results" element={<Results />} />
            <Route 
              path="/admin" 
              element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400">© 2024 ElectraBid Anonymous Polling & Auctions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
