import React from 'react';
import { Link } from 'react-router-dom';

export default function MobileHeader({ onMenuTap }) {
  return (
    <header className="bg-[#2A2A2A] text-white flex items-center justify-between px-4 py-3 shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logobid.png" alt="Bidmandu" className="h-8 w-8" />
        <span className="text-lg font-bold">BIDMANDU</span>
      </Link>
      <button
        onClick={onMenuTap}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}