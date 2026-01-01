
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote, Gavel, LayoutDashboard, LogOut, User as UserIcon, BarChart3 } from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                ElectraBid
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/vote" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              <Vote size={18} /> Elections
            </Link>
            <Link to="/auctions" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              <Gavel size={18} /> Auctions
            </Link>
            <Link to="/results" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              <BarChart3 size={18} /> Results
            </Link>
            {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                <LayoutDashboard size={18} /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                  <UserIcon size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
