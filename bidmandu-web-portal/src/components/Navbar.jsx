import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isKycVerified = user?.is_seller;

  return (
    <nav className="bg-[#2A2A2A] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logobid.png" alt="Bidmandu" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">Nepal's Premier C2C Bidding Platform</span>
        </Link>

        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-[#FDC02F] transition">Home</Link>
          {user && (
            <>
              <Link
                to="/sell"
                className={`px-4 py-1.5 rounded border transition ${
                  isKycVerified
                    ? 'border-[#C41E3A] text-white hover:bg-[#C41E3A]'
                    : 'border-[#FDC02F] text-[#FDC02F] hover:bg-[#FDC02F] hover:text-[#2A2A2A]'
                }`}
              >
                {isKycVerified ? 'List an Item' : 'Start Selling'}
              </Link>
              {isKycVerified && (
                <Link to="/dashboard/my-products" className="hover:text-[#FDC02F] transition">
                  My Products
                </Link>
              )}
              <Link to="/transactions" className="hover:text-[#FDC02F] transition">Purchases</Link>
            </>
          )}
          {!user ? (
            <>
              <Link to="/login" className="hover:text-[#FDC02F] transition">Login</Link>
              <Link to="/register" className="hover:text-[#FDC02F] transition">Register</Link>
            </>
          ) : (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="bg-[#C41E3A] px-4 py-1.5 rounded hover:bg-red-800 transition text-white font-semibold"
            >
              Logout
            </button>
          )}
          {user && <span className="text-gray-400 text-xs hidden lg:block ml-2">{user.email}</span>}
        </div>
      </div>
    </nav>
  );
}