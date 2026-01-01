
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight, UserCheck, ShieldAlert } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- HARDCODED TESTING CREDENTIALS ---
    // Admin: Hamza Bin Islam
    if (email === 'hamza@gmail.com' && password === '12345') {
      onLogin({ 
        id: 'admin_hamza', 
        name: 'Hamza Bin Islam', 
        email: 'hamza@gmail.com', 
        role: UserRole.ADMIN 
      });
      navigate('/');
    } 
    // Voter: Fouzia Ahmed Reya
    else if (email === 'fouzia@gmail.com' && password === '12345') {
      onLogin({ 
        id: 'voter_fouzia', 
        name: 'Fouzia Ahmed Reya', 
        email: 'fouzia@gmail.com', 
        role: UserRole.VOTER 
      });
      navigate('/');
    } else {
      setError('Invalid credentials. Please use the test accounts provided below.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Platform Login</h2>
            <p className="text-slate-500">Access the ElectraBid Voting & Auction Engine</p>
          </div>

          {/* Test Credentials Helper Box */}
          <div className="mb-8 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
              <UserCheck size={16} /> Test Credentials (Authorized)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-600 font-semibold flex items-center gap-1"><ShieldAlert size={12}/> Admin:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-indigo-100">hamza@gmail.com / 12345</code>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-600 font-semibold flex items-center gap-1"><UserCheck size={12}/> Voter:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-indigo-100">fouzia@gmail.com / 12345</code>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              Enter Platform <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Need a public account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
