import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, ShoppingBag, PlusCircle, Package, Receipt, LogIn, UserPlus, Search, LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isKycVerified = user?.is_seller;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path ? 'bg-[#C41E3A] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside className="w-64 shrink-0 bg-[#2A2A2A] h-full flex flex-col justify-between text-white overflow-y-auto">
      {/* Top zone */}
      <div>
        {/* Branding */}
        <Link to="/" className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img src="/logobid.png" alt="Bidmandu" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">BIDMANDU</span>
        </Link>

        {/* Navigation links */}
        <nav className="px-3 py-4 space-y-1">
          <Link to="/" className={linkClass('/')}>
            <Home size={20} />
            <span>Home</span>
          </Link>

          {user && (
            <>
              <Link to="/sell" className={linkClass('/sell')}>
                <PlusCircle size={20} />
                <span>{isKycVerified ? 'List an Item' : 'Start Selling'}</span>
              </Link>
              {isKycVerified && (
                <Link to="/dashboard/my-products" className={linkClass('/dashboard/my-products')}>
                  <Package size={20} />
                  <span>My Products</span>
                </Link>
              )}
              <Link to="/transactions" className={linkClass('/transactions')}>
                <Receipt size={20} />
                <span>Purchases</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Bottom zone */}
      <div className="px-3 py-4 border-t border-white/10">
        {user ? (
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <div className="space-y-1">
            <Link to="/login" className={linkClass('/login')}>
              <LogIn size={20} />
              <span>Login</span>
            </Link>
            <Link to="/register" className={linkClass('/register')}>
              <UserPlus size={20} />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}