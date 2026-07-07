import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ViewModal from '../components/ViewModal';
import ImageViewer from '../components/ImageViewer';

export default function KycQueuePage() {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const fetchKycs = () => {
    api.get('/admin/kyc/queue')
      .then(res => setKycs(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchKycs(); }, []);

  const handleApprove = async (id) => {
    await api.patch(`/admin/kyc/${id}/approve`, { decision: 'APPROVED', admin_notes: 'Approved' });
    fetchKycs();
  };

  const handleReject = async (id) => {
    const notes = prompt('Rejection reason:');
    if (!notes) return;
    await api.patch(`/admin/kyc/${id}/reject`, { decision: 'REJECTED', admin_notes: notes });
    fetchKycs();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2A2A2A] mb-6">KYC Verification Queue</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">PAN Number</th>
              <th className="px-6 py-4">Documents</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycs.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No pending verifications.</td></tr>
            ) : (
              kycs.map(kyc => (
                <tr key={kyc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">{kyc.user_email}</td>
                  <td className="px-6 py-4 text-gray-700">{kyc.pan_number}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setViewItem(kyc)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">View</button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">Pending</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleApprove(kyc.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Approve</button>
                    <button onClick={() => handleReject(kyc.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg">Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {viewItem && (
        <ViewModal title="KYC Verification Documents" onClose={() => setViewItem(null)}>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">PAN Card</h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">PAN Number</p>
                    <p className="text-lg font-bold text-[#2A2A2A]">{viewItem.pan_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">User Email</p>
                    <p className="text-base text-gray-700">{viewItem.user_email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-64">
                <ImageViewer src={viewItem.pan_image_url} alt="PAN Document" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Live Selfie</h3>
              <div className="h-64">
                <ImageViewer src={viewItem.live_selfie_url} alt="Live Selfie" />
              </div>
            </div>
            {viewItem.address_proof_url && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Address Proof</h3>
                <div className="h-64">
                  <ImageViewer src={viewItem.address_proof_url} alt="Address Proof" />
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { handleApprove(viewItem.id); setViewItem(null); }}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition">Approve KYC</button>
              <button onClick={() => { handleReject(viewItem.id); setViewItem(null); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition">Reject KYC</button>
            </div>
          </div>
        </ViewModal>
      )}
    </div>
  );
}