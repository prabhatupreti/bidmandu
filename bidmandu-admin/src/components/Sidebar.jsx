import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UserCheck, PackageSearch, CreditCard, Landmark, AlertTriangle, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/kyc', label: 'KYC Queue', icon: UserCheck },
  { path: '/products', label: 'Product Queue', icon: PackageSearch },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/settlements', label: 'Settlements', icon: Landmark },
  { path: '/disputes', label: 'Disputes', icon: AlertTriangle },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNav = (path) => navigate(path);
  const handleLogout = () => { logout(); navigate('/login'); };

  const activeClass = 'flex items-center gap-4 px-4 py-3 mx-3 my-1 rounded-xl font-medium bg-[#C41E3A] text-white shadow-sm transition-all duration-200';
  const inactiveClass = 'flex items-center gap-4 px-4 py-3 mx-3 my-1 rounded-xl font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200';

  return (
    <aside className="w-64 shrink-0 bg-[#2A2A2A] h-full flex flex-col justify-between text-white overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img src="/logobid.png" alt="Bidmandu" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">BIDMANDU</span>
        </div>
        <nav className="px-1 py-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={isActive ? activeClass : inactiveClass}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="px-1 py-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3 mx-3 my-1 rounded-xl font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}