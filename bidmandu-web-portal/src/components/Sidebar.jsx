import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, ShoppingBag, PlusCircle, Package, Receipt, LogIn, UserPlus, LogOut,
} from 'lucide-react';

export default function Sidebar({ onClose, isMobile = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isKycVerified = user?.is_seller;

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  // Modern link styles – full width, consistent padding, rounded corners
  const activeClass =
    'flex items-center gap-4 px-4 py-3 mx-3 my-1 rounded-xl font-medium transition-all duration-200 bg-[#C41E3A] text-white shadow-sm';
  const inactiveClass =
    'flex items-center gap-4 px-4 py-3 mx-3 my-1 rounded-xl font-medium transition-all duration-200 text-gray-300 hover:bg-white/10 hover:text-white';

  return (
    <aside className="w-64 shrink-0 bg-[#2A2A2A] h-full flex flex-col justify-between text-white overflow-y-auto">
      {/* Top zone */}
      <div>
        {/* Branding */}
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-5 border-b border-white/10"
          onClick={() => { if (onClose) onClose(); }}
        >
          <img src="/logobid.png" alt="Bidmandu" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">BIDMANDU</span>
        </Link>

        {/* Navigation links */}
        <nav className="px-1 py-4">
          <button
            onClick={() => handleNav('/')}
            className={location.pathname === '/' ? activeClass : inactiveClass}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          {user && (
            <>
              <button
                onClick={() => handleNav('/sell')}
                className={location.pathname === '/sell' ? activeClass : inactiveClass}
              >
                <PlusCircle size={20} />
                <span>{isKycVerified ? 'List an Item' : 'Start Selling'}</span>
              </button>
              {isKycVerified && (
                <button
                  onClick={() => handleNav('/dashboard/my-products')}
                  className={
                    location.pathname === '/dashboard/my-products'
                      ? activeClass
                      : inactiveClass
                  }
                >
                  <Package size={20} />
                  <span>My Products</span>
                </button>
              )}
              <button
                onClick={() => handleNav('/transactions')}
                className={
                  location.pathname === '/transactions' ? activeClass : inactiveClass
                }
              >
                <Receipt size={20} />
                <span>Purchases</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom zone */}
      <div className="px-1 py-4 border-t border-white/10">
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 mx-3 my-1 rounded-xl font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNav('/login')}
              className={
                location.pathname === '/login' ? activeClass : inactiveClass
              }
            >
              <LogIn size={20} />
              <span>Login</span>
            </button>
            <button
              onClick={() => handleNav('/register')}
              className={
                location.pathname === '/register' ? activeClass : inactiveClass
              }
            >
              <UserPlus size={20} />
              <span>Register</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}