import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function DisputePage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = () => {
    api.get('/admin/disputes')
      .then(res => setDisputes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDisputes(); }, []);

  const handleForceConfirm = async (id) => {
    await api.patch(`/admin/disputes/${id}/force-confirm`);
    fetchDisputes();
  };

  const handleResetProof = async (id) => {
    await api.patch(`/admin/disputes/${id}/reset-proof`);
    fetchDisputes();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2A2A2A] mb-6">Disputes</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Buyer</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">No disputes.</td></tr>
            ) : (
              disputes.map(d => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-700">{d.payment_ref_code}</td>
                  <td className="px-6 py-4 text-gray-700">{d.buyer?.email}</td>
                  <td className="px-6 py-4 text-gray-700">{d.seller?.email}</td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">NRs. {d.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700">{d.status}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {d.status === 'SHIPPED' && (
                      <button onClick={() => handleForceConfirm(d.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Force Confirm</button>
                    )}
                    {d.status === 'PROOF_REJECTED' && (
                      <button onClick={() => handleResetProof(d.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Reset Proof</button>
                    )}
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