
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight, UserCheck, ShieldAlert } from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await api.login({ email, password });
      localStorage.setItem('token', token);
      const user: User = { id: 'self', name: email.split('@')[0], email, role: UserRole.VOTER };
      onLogin(user);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
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

          {/* Removed hardcoded demo credentials */}

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
