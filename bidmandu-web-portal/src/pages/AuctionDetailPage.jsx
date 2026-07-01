import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function calculateTimeLeft(end) {
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { total: diff, days, hours, minutes, seconds };
}

function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(endTime)), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const isUrgent = timeLeft.total > 0 && timeLeft.total <= 300000;
  const isEnded = timeLeft.total <= 0;
  if (isEnded) return <span className="text-red-600 font-bold text-lg">Auction Ended</span>;

  const blocks = [];
  if (timeLeft.days > 0) blocks.push(
    <div key="days" className="flex flex-col items-center">
      <div className={`inline-block w-12 h-12 rounded text-xl font-mono font-bold flex items-center justify-center transition-colors duration-300 ${isUrgent ? 'countdown-urgent' : 'bg-[#2A2A2A] text-white'}`}>{String(timeLeft.days).padStart(2,'0')}</div>
      <span className="text-xs text-gray-500 mt-1">Days</span>
    </div>
  );
  blocks.push(
    <div key="hours" className="flex flex-col items-center">
      <div className={`inline-block w-12 h-12 rounded text-xl font-mono font-bold flex items-center justify-center transition-colors duration-300 ${isUrgent ? 'countdown-urgent' : 'bg-[#2A2A2A] text-white'}`}>{String(timeLeft.hours).padStart(2,'0')}</div>
      <span className="text-xs text-gray-500 mt-1">Hrs</span>
    </div>
  );
  blocks.push(
    <div key="minutes" className="flex flex-col items-center">
      <div className={`inline-block w-12 h-12 rounded text-xl font-mono font-bold flex items-center justify-center transition-colors duration-300 ${isUrgent ? 'countdown-urgent' : 'bg-[#2A2A2A] text-white'}`}>{String(timeLeft.minutes).padStart(2,'0')}</div>
      <span className="text-xs text-gray-500 mt-1">Min</span>
    </div>
  );
  blocks.push(
    <div key="seconds" className="flex flex-col items-center">
      <div className={`inline-block w-12 h-12 rounded text-xl font-mono font-bold flex items-center justify-center transition-colors duration-300 ${isUrgent ? 'countdown-urgent' : 'bg-[#2A2A2A] text-white'}`}>{String(timeLeft.seconds).padStart(2,'0')}</div>
      <span className="text-xs text-gray-500 mt-1">Sec</span>
    </div>
  );
  return <div className="flex items-center gap-1 text-2xl">{blocks}</div>;
}

const FallbackImage = () => (
  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full w-full flex items-center justify-center">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="12" fill="#C41E3A" fillOpacity="0.04" />
      <circle cx="40" cy="40" r="18" fill="#C41E3A" fillOpacity="0.3" />
      <path d="M30 70l14-14h12l14 14" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

export default function AuctionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [auctionState, setAuctionState] = useState(null);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [totalBids, setTotalBids] = useState(0);
  const [loading, setLoading] = useState(true);

  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);

  const isEnded = auctionState?.endTime && new Date(auctionState.endTime) < new Date();
  const isOwnProduct = user && product && product.seller_id === user.id;
  const hasBids = totalBids > 0;
  // Guarantee a sensible price: never show 0 unless the product truly has 0 starting price (shouldn't happen)
  const displayPrice = (hasBids && auctionState?.currentPrice) 
    ? auctionState.currentPrice 
    : product?.starting_price;

  // Fetch product details (one time)
  useEffect(() => {
    api.get('/auctions/list')
      .then(res => {
        const auctionData = res.data.find(a => a.id === id);
        if (auctionData) {
          setProduct(auctionData.product);
          setImages(auctionData.product?.image_urls || []);
          setTotalBids(auctionData.totalBids || 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Poll auction state – do not render until first response
  useEffect(() => {
    let etag = null;
    const fetchState = async () => {
      try {
        const res = await api.get(`/auctions/${id}/state`, {
          headers: etag ? { 'If-None-Match': `"${etag}"` } : {},
        });
        if (res.status === 304) return;
        etag = res.headers.etag;
        const price = parseFloat(res.data.currentPrice);
        setAuctionState({
          currentPrice: isNaN(price) ? null : price,
          winnerId: res.data.winnerId,
          endTime: res.data.endTime,
        });
      } catch (err) {
        if (err.response?.status !== 304) console.error(err);
      }
    };

    fetchState(); // immediate first fetch
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBid = async () => {
    if (!user) return alert('Please login');
    if (isOwnProduct) return;
    try {
      await api.post('/bids', { auctionId: id, amount: parseFloat(bidAmount) });
      setBidAmount('');
      setError('');
      setBidSuccess(true);
      setTotalBids(prev => prev + 1);
      setTimeout(() => setBidSuccess(false), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Bid failed');
    }
  };

  // Enforce loading until both data sources are ready
  if (loading || !product || !auctionState) {
    return (
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-1/3 mb-6 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 w-2/3" />
              <div className="h-10 bg-gray-200 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-16 fade-up visible">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#2A2A2A]">{product.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {product.category && <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{product.category}</span>}
          <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
            🔥 {totalBids} {totalBids === 1 ? 'Bid' : 'Bids'} Placed
          </span>
          {isEnded ? (
            <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold">Auction Ended</span>
          ) : (
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">Live</span>
          )}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] relative">
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : <FallbackImage />}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${idx === activeImage ? 'border-[#C41E3A] shadow-md' : 'border-gray-200 hover:border-gray-400'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className={`p-6 rounded-xl mb-6 transition-all duration-300 ${bidSuccess ? 'pulse-glow' : ''} bg-[#2A2A2A] text-white`}>
            <p className="text-sm text-gray-400">
              {isEnded ? 'Final Price' : hasBids ? 'Current Highest Bid' : 'Starting Price'}
            </p>
            <p className="text-5xl font-extrabold text-[#FDC02F] mt-2">
              NRs. {(displayPrice || 0).toLocaleString()}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Time Remaining</p>
            <Countdown endTime={auctionState.endTime} />
          </div>
          {user && !isOwnProduct && !isEnded && (
            <div className="flex gap-2 mt-8">
              <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                className="border-2 border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:border-[#C41E3A] transition font-mono text-lg" placeholder="Enter higher amount" />
              <button onClick={handleBid} className="bid-btn bg-[#C41E3A] text-white px-8 py-3 rounded-lg font-bold hover:bg-red-800 transition active:scale-95">Bid Now</button>
            </div>
          )}
          {isOwnProduct && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
              You cannot bid on your own product.
            </div>
          )}
          {error && <p className="mt-3 text-red-600">{error}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#2A2A2A] mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-500">Condition</span>
            <p className="font-semibold text-[#2A2A2A] mt-1">{product.condition || 'Not specified'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-500">Location</span>
            <p className="font-semibold text-[#2A2A2A] mt-1">Kathmandu Valley</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-500">Total Bids</span>
            <p className="font-semibold text-[#2A2A2A] mt-1">{totalBids} {totalBids === 1 ? 'Bid' : 'Bids'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}