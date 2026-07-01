import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function calculateTimeLeft(end) {
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return { total: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total: diff,
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown({ endTime, compact }) {
  const [time, setTime] = useState(calculateTimeLeft(endTime));
  useEffect(() => {
    const timer = setInterval(() => setTime(calculateTimeLeft(endTime)), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (time.total <= 0) return <span className="text-red-600 font-bold">Ended</span>;
  const display = `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  return compact ? (
    <span className="text-sm font-mono text-gray-600">{display}</span>
  ) : (
    <div className="flex items-center space-x-1 font-mono font-bold text-lg">
      <span className="bg-[#2A2A2A] text-white px-2 py-0.5 rounded">{String(time.hours).padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-[#2A2A2A] text-white px-2 py-0.5 rounded">{String(time.minutes).padStart(2, '0')}</span>
      <span>:</span>
      <span className="bg-[#2A2A2A] text-white px-2 py-0.5 rounded">{String(time.seconds).padStart(2, '0')}</span>
    </div>
  );
}

function AcceptModal({ bid, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border-t-4 border-[#C41E3A] fade-up visible">
        <h3 className="text-xl font-bold text-[#2A2A2A] mb-4">Confirm Bid Acceptance</h3>
        <p className="text-gray-600 mb-2">Are you sure you want to finalize this auction?</p>
        <p className="mb-4">
          Accepting <strong className="text-[#C41E3A]">{bid.bidder_alias}</strong>'s offer of{' '}
          <strong className="text-[#FDC02F] text-xl">NRs. {bid.amount.toLocaleString()}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          This will immediately close the listing and initiate secure escrow settlement.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-[#C41E3A] text-white rounded-lg font-bold hover:bg-red-800 transition">
            Accept & Close Auction
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [modalBid, setModalBid] = useState(null);
  const [closed, setClosed] = useState(item.auction.status !== 'ACTIVE');
  const [localStatus, setLocalStatus] = useState(item.auction.status);

  const handleAccept = async (bid) => {
    try {
      await api.post(`/auctions/${item.auction.id}/accept-bid`, { bidId: bid.id });
      setLocalStatus('COMPLETED');
      setClosed(true);
      setModalBid(null);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Accept failed'));
    }
  };

  const handleDecline = (bidId) => {
    alert(`Bid ${bidId} declined (not implemented)`);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${closed ? 'opacity-80' : ''}`}>
      <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.product.image_urls?.[0] ? (
              <img src={item.product.image_urls[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
                <rect width="60" height="60" rx="8" fill="#C41E3A" fillOpacity="0.05" />
                <circle cx="30" cy="30" r="10" fill="#C41E3A" fillOpacity="0.3" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[#2A2A2A]">{item.product.title}</h3>
            <p className="text-xs text-gray-500">{item.totalBids} bids placed</p>
            <div className="flex items-center gap-2 mt-1">
              {closed ? (
                <span className="bg-[#FDC02F] text-[#2A2A2A] px-2 py-0.5 rounded-full text-xs font-bold">SOLD</span>
              ) : (
                <Countdown endTime={item.auction.end_time} compact />
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Current Bid</span>
          <p className="text-2xl font-bold text-[#FDC02F]">NRs. {item.auction.current_price.toLocaleString()}</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Bidder</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {item.bids.map((bid, idx) => (
                <tr key={bid.id} className="border-b border-gray-100" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <td className="py-2">
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {bid.bidder_alias}
                    </span>
                  </td>
                  <td className="py-2 font-semibold">NRs. {bid.amount.toLocaleString()}</td>
                  <td className="py-2">
                    {!closed ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setModalBid(bid); }}
                          className="px-3 py-1 text-xs font-semibold border border-[#C41E3A] text-[#C41E3A] rounded hover:bg-[#C41E3A] hover:text-white transition"
                        >
                          Accept Bid
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDecline(bid.id); }}
                          className="px-3 py-1 text-xs border border-gray-400 text-gray-600 rounded hover:bg-gray-100 transition"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalBid && (
        <AcceptModal
          bid={modalBid}
          onConfirm={() => handleAccept(modalBid)}
          onClose={() => setModalBid(null)}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img src="/empty-auction.svg" alt="No products" className="h-64 mb-8 opacity-70" />
      <h3 className="text-2xl font-bold text-[#2A2A2A] mb-2">No Listings Yet</h3>
      <p className="text-gray-500 mb-6">Start selling by listing your first item.</p>
      <Link to="/sell" className="bg-[#C41E3A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition">
        Create Your First Listing
      </Link>
    </div>
  );
}

export default function MyProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/my')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 fade-up visible">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="/logobid.png" alt="logo" className="h-10 w-10" />
          <h1 className="text-3xl font-bold text-[#2A2A2A]">My Products</h1>
        </div>
        <Link to="/sell" className="bg-[#C41E3A] text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-800 transition">
          + New Listing
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <ProductCard key={item.product.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}