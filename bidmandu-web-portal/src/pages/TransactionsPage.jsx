import React, { useState, useEffect } from 'react';
import api from '../services/api';

const statusConfig = {
  AWAITING_PAYMENT: { color: 'bg-yellow-100 text-yellow-800', label: 'Awaiting Payment' },
  PROOF_SUBMITTED: { color: 'bg-blue-100 text-blue-800', label: 'Proof Submitted' },
  PAYMENT_VERIFIED: { color: 'bg-green-100 text-green-800', label: 'Payment Verified' },
  PROOF_REJECTED: { color: 'bg-red-100 text-red-800', label: 'Proof Rejected' },
  SHIPPED: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  CONFIRMED: { color: 'bg-indigo-100 text-indigo-800', label: 'Confirmed' },
  SETTLED: { color: 'bg-gray-100 text-gray-800', label: 'Settled' },
};

const milestoneOrder = ['AWAITING_PAYMENT','PROOF_SUBMITTED','PAYMENT_VERIFIED','SHIPPED','CONFIRMED','SETTLED'];

function MilestoneTracker({ currentStatus }) {
  const currentIdx = milestoneOrder.indexOf(currentStatus);
  return (
    <div className="flex items-center space-x-1 mt-4">
      {milestoneOrder.map((stage, idx) => {
        const done = idx <= currentIdx;
        return (
          <React.Fragment key={stage}>
            <div className={`h-3 w-3 rounded-full ${done ? 'bg-[#C41E3A]' : 'bg-gray-300'}`} />
            {idx < milestoneOrder.length - 1 && (
              <div className={`flex-1 h-0.5 ${done && idx < currentIdx ? 'bg-[#C41E3A]' : 'bg-gray-300'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TransactionCard({ txn }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[txn.status] || { color: 'bg-gray-100', label: txn.status };

  // Financial breakdown
  const amount = Number(txn.amount) || 0;
  const fee = Math.round(amount * 0.05 * 100) / 100;             // 5% platform fee
  const payout = txn.payout_amount != null ? Number(txn.payout_amount) : Math.round(amount * 0.95 * 100) / 100;
  const totalPaid = amount;                                     // total buyer paid

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${expanded ? 'shadow-md' : ''}`}>
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="text-2xl">🧾</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm text-gray-600">{txn.payment_ref_code}</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="font-semibold text-[#2A2A2A]">{txn.product?.title || 'Unknown Item'}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Seller: {txn.seller_alias} &middot; {new Date(txn.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right mx-4">
            <span className="text-2xl font-bold text-[#2A2A2A]">NRs. {amount.toLocaleString()}</span>
          </div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
          </div>
        </div>
        <div className="ml-4 text-gray-400">
          <svg className={`w-5 h-5 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-5 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Item Details */}
            <div>
              <h4 className="font-semibold text-[#2A2A2A] mb-2">Item Details</h4>
              {txn.product?.image_url && (
                <img src={txn.product.image_url} alt={txn.product.title} className="w-24 h-24 object-cover rounded-lg mb-2" />
              )}
              <p className="text-sm text-gray-600">Category: <span className="text-gray-800">{txn.product?.category || 'Not specified'}</span></p>
              <p className="text-sm text-gray-600">Seller ID: <span className="text-gray-800">{txn.seller_alias}</span></p>
              <p className="text-sm text-gray-600">Settled On: <span className="text-gray-800">{new Date(txn.buyer_confirmed_at || txn.admin_verified_at || txn.created_at).toLocaleDateString()}</span></p>
            </div>

            {/* Right: Payment Breakdown */}
            <div>
              <h4 className="font-semibold text-[#2A2A2A] mb-2">Payment Breakdown</h4>
              <p className="text-sm text-gray-600">Winning Bid: <span className="text-gray-800 font-semibold">NRs. {amount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600">Platform Fee (5%): <span className="text-gray-800">NRs. {fee.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600">Seller Payout: <span className="text-gray-800">NRs. {payout.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600 font-bold mt-1">Total Paid: <span className="text-[#C41E3A]">NRs. {totalPaid.toLocaleString()}</span></p>
            </div>
          </div>

          {/* Milestone Tracker */}
          <div className="mt-5">
            <h4 className="font-semibold text-[#2A2A2A] mb-2">Payment Progress</h4>
            <MilestoneTracker currentStatus={txn.status} />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">View Digital Receipt</button>
            <button className="text-sm px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">Open Dispute Ticket</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions/my')
      .then(res => setTxns(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 fade-up visible">
      <div className="flex items-center gap-3 mb-8">
        <img src="/logobid.png" alt="logo" className="h-10 w-10" />
        <h2 className="text-3xl font-bold text-[#2A2A2A]">My Transactions</h2>
      </div>
      <div className="space-y-4">
        {txns.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No transactions yet.</p>
        ) : (
          txns.map(txn => (
            <TransactionCard key={txn.id} txn={txn} />
          ))
        )}
      </div>
    </div>
  );
}