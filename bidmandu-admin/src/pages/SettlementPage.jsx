import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function SettlementPage() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const fetchSettlements = () => {
    api.get('/admin/settlements/ready')
      .then(res => setSettlements(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSettlements(); }, []);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSettle = async () => {
    if (selected.length === 0) return;
    await api.post('/admin/settlements/batch', { transactionIds: selected });
    setSelected([]);
    fetchSettlements();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2A2A2A] mb-6">Settlements</h1>
      <div className="mb-4">
        <button
          onClick={handleSettle}
          disabled={selected.length === 0}
          className="bg-[#C41E3A] text-white px-5 py-2 rounded-lg font-bold disabled:opacity-50 hover:bg-red-800 transition"
        >
          Settle Selected ({selected.length})
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
            <tr>
              <th className="px-6 py-4 w-16">Select</th>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payout (95%)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {settlements.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No transactions ready.</td></tr>
            ) : (
              settlements.map(txn => (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selected.includes(txn.id)} onChange={() => toggleSelect(txn.id)} className="scale-125" />
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-700">{txn.payment_ref_code}</td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">NRs. {txn.amount}</td>
                  <td className="px-6 py-4 text-gray-700">NRs. {(txn.amount * 0.95).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">Confirmed</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}