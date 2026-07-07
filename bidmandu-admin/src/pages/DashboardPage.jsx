import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Store, Package, Gavel, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Sellers', value: stats.totalSellers, icon: Store, color: 'bg-green-500' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-500' },
    { label: 'Active Auctions', value: stats.activeAuctions, icon: Gavel, color: 'bg-orange-500' },
    { label: 'Settled TXNs', value: stats.completedTransactions, icon: DollarSign, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2A2A2A] mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${card.color} bg-opacity-20 flex items-center justify-center text-white mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-[#2A2A2A]">{card.value}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-[#2A2A2A] mb-2">Total Revenue</h2>
        <p className="text-3xl font-bold text-[#C41E3A]">NRs. {(stats.totalRevenue || 0).toLocaleString()}</p>
      </div>
    </div>
  );
}