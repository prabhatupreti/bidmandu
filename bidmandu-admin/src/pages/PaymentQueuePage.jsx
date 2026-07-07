import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ViewModal from '../components/ViewModal';
import ImageViewer from '../components/ImageViewer';

export default function PaymentQueuePage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPayment, setViewPayment] = useState(null);

  const fetchPayments = () => {
    api.get('/admin/queue/payments')
      .then(res => setPayments(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleVerify = async (id, amountMatched, referenceMatched) => {
    await api.patch(`/admin/queue/transactions/${id}/verify`, {
      amountMatched,
      referenceMatched,
      adminNotes: amountMatched && referenceMatched ? 'All good' : 'Mismatch',
    });
    fetchPayments();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2A2A2A] mb-6">Payment Verification</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Buyer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Proof</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">No payments to verify.</td></tr>
            ) : (
              payments.map(pmt => (
                <tr key={pmt.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-700">{pmt.payment_ref_code}</td>
                  <td className="px-6 py-4 text-gray-700 truncate max-w-[200px]">{pmt.buyerName}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">NRs. {pmt.amount}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setViewPayment(pmt)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">
                      View Proof
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">Proof Submitted</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleVerify(pmt.id, true, true)} className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Verify</button>
                    <button onClick={() => handleVerify(pmt.id, false, false)} className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg">Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {viewPayment && (
        <ViewModal title="Payment Verification" onClose={() => setViewPayment(null)}>
          <div className="space-y-6">
            {/* Fixed metadata grid – no overlap, truncation, proper gaps */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1">Reference</p>
                <p className="font-mono font-semibold text-[#2A2A2A] truncate">{viewPayment.payment_ref_code}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1">Buyer</p>
                <p className="font-semibold text-[#2A2A2A] truncate" title={viewPayment.buyerName}>{viewPayment.buyerName}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                <p className="font-semibold text-[#C41E3A] truncate">NRs. {viewPayment.amount?.toLocaleString()}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 whitespace-nowrap">Proof Submitted</span>
              </div>
            </div>
            {/* Proof image */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Uploaded Proof</h3>
              <div className="h-96">
                <ImageViewer src={viewPayment.proof_thumb_url || viewPayment.proof_image_url} alt="Payment proof" />
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { handleVerify(viewPayment.id, true, true); setViewPayment(null); }}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition">Verify Payment</button>
              <button onClick={() => { handleVerify(viewPayment.id, false, false); setViewPayment(null); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition">Reject Payment</button>
            </div>
          </div>
        </ViewModal>
      )}
    </div>
  );
}