import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, Smartphone, Shirt, Home, Car, Trophy, BookOpen, ToyBrick,
} from 'lucide-react';

/* ================================================================
   CATEGORIES (icons from Lucide)
   ================================================================ */
const CATEGORIES = [
  { key: 'All', label: 'All', icon: ShoppingBag },
  { key: 'Electronics', label: 'Electronics', icon: Smartphone },
  { key: 'Fashion', label: 'Fashion', icon: Shirt },
  { key: 'Home & Garden', label: 'Home & Garden', icon: Home },
  { key: 'Vehicles', label: 'Vehicles', icon: Car },
  { key: 'Sports & Outdoors', label: 'Sports & Outdoors', icon: Trophy },
  { key: 'Books & Media', label: 'Books & Media', icon: BookOpen },
  { key: 'Toys & Kids', label: 'Toys & Kids', icon: ToyBrick },
];

const CONDITION_OPTIONS = ['Mint', 'Gently Used', 'Refurbished'];
const LOCATION_OPTIONS = ['Kathmandu Valley', 'Lalitpur', 'Pokhara', 'Bhaktapur'];
const STATUS_OPTIONS = [
  { key: 'activeOnly', label: 'Active Bids Only' },
  { key: 'endingSoon', label: 'Ending within 1 Hr' },
  { key: 'noReserve', label: 'No Reserve' },
  { key: 'newlyListed', label: 'Newly Listed (24h)' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'ending_soon', label: 'Ending Soonest' },
  { value: 'newest', label: 'Newly Listed' },
];

/* ================================================================
   HELPER COMPONENTS
   ================================================================ */

// ---------- Fallback image ----------
const FallbackImage = () => (
  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full w-full flex items-center justify-center">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <rect width="60" height="60" rx="8" fill="#C41E3A" fillOpacity="0.04" />
      <path d="M20 20h20v20H20z" fill="#C41E3A" fillOpacity="0.15" />
      <circle cx="30" cy="30" r="8" fill="#C41E3A" fillOpacity="0.5" />
      <path d="M18 42l8-8h8l8 8" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// ---------- Auction Card (no verified badge, price label from totalBids) ----------
function AuctionCard({ auction, index }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageUrl = auction.product?.image_urls?.[0];
  const showFallback = !imageUrl || imgError;
  const isEnded = new Date(auction.end_time) < new Date();
  const totalBids = auction.totalBids || 0;
  const hasBids = totalBids > 0;
  const displayPrice = hasBids ? auction.current_price : auction.product?.starting_price;
  const priceLabel = hasBids ? 'Highest Bid' : 'Starting Price';

  return (
    <Link
      to={`/auction/${auction.id}`}
      className="fade-up bg-white rounded-2xl shadow-[0_4px_20px_rgba(42,42,42,0.04)] hover:shadow-[0_6px_24px_rgba(42,42,42,0.08)] transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full"
      style={{ transitionDelay: `${0.1 + index * 0.03}s` }}
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        {!imgLoaded && !showFallback && <div className="absolute inset-0 skeleton" />}
        {!showFallback ? (
          <img
            src={imageUrl}
            alt={auction.product?.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
          />
        ) : (
          <FallbackImage />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {!isEnded && (new Date(auction.end_time).getTime() - Date.now() < 3600000) && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">Ending Soon</span>
          )}
          {isEnded && (
            <span className="bg-gray-800 text-yellow-400 text-xs px-2 py-1 rounded-full font-bold">Ended</span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-[#2A2A2A] line-clamp-2 leading-snug">{auction.product?.title}</h3>
        <div className="mt-auto pt-2 flex justify-between items-baseline">
          <div>
            <span className={`text-xs font-medium ${hasBids ? 'text-green-600' : 'text-gray-500'}`}>
              {priceLabel}
            </span>
            <p className="text-xl font-bold text-[#2A2A2A]">NRs. {displayPrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
            {isEnded ? (
              <span className="text-xs text-[#FDC02F] font-semibold">Ended at {new Date(auction.end_time).toLocaleDateString()}</span>
            ) : (
              <span className={`text-xs ${new Date(auction.end_time).getTime() - Date.now() < 3600000 ? 'text-[#FDC02F] font-bold' : 'text-gray-500'}`}>
                Ends: {new Date(auction.end_time).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------- Range Slider ----------
function RangeSlider({ min, max, value, onChange }) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  const handleMinChange = (e) => {
    const v = Number(e.target.value);
    setLocalMin(v);
    if (v <= localMax) onChange([v, localMax]);
  };

  const handleMaxChange = (e) => {
    const v = Number(e.target.value);
    setLocalMax(v);
    if (v >= localMin) onChange([localMin, v]);
  };

  const handleMinInput = (e) => {
    const v = Number(e.target.value);
    if (!isNaN(v) && v >= min && v <= localMax) {
      setLocalMin(v);
      onChange([v, localMax]);
    }
  };

  const handleMaxInput = (e) => {
    const v = Number(e.target.value);
    if (!isNaN(v) && v <= max && v >= localMin) {
      setLocalMax(v);
      onChange([localMin, v]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={localMin} onChange={handleMinChange} className="w-full accent-[#C41E3A]" />
        <input type="range" min={min} max={max} value={localMax} onChange={handleMaxChange} className="w-full accent-[#C41E3A]" />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span>NRs.</span>
          <input type="number" className="w-20 border rounded px-1 text-xs" value={localMin} onChange={handleMinInput} />
        </div>
        <div className="flex items-center gap-1">
          <span>NRs.</span>
          <input type="number" className="w-20 border rounded px-1 text-xs" value={localMax} onChange={handleMaxInput} />
        </div>
      </div>
    </div>
  );
}

// ---------- Sidebar (desktop & mobile) ----------
function FilterSidebar({ filters, onFilterChange, onClearAll, priceRange, setPriceRange, priceBounds }) {
  const toggleFilter = (group, key) => {
    const current = filters[group] || [];
    const updated = current.includes(key)
      ? current.filter(k => k !== key)
      : [...current, key];
    onFilterChange({ ...filters, [group]: updated });
  };

  const activeCount = Object.values(filters).flat().length + (priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1] ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6 text-sm">
      {activeCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#2A2A2A]">Active Filters</h4>
            <button onClick={onClearAll} className="text-[#C41E3A] text-xs font-medium hover:underline">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRange[0] > priceBounds[0] && (
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                NRs. {priceRange[0]}-{priceRange[1]}
                <button onClick={() => setPriceRange(priceBounds)} className="text-gray-400 hover:text-red-500">&times;</button>
              </span>
            )}
            {Object.entries(filters).map(([group, keys]) =>
              keys.map(key => (
                <span key={`${group}-${key}`} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                  {key}
                  <button onClick={() => toggleFilter(group, key)} className="text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-[#2A2A2A] mb-2">Price Range</h4>
        <RangeSlider min={priceBounds[0]} max={priceBounds[1]} value={priceRange} onChange={setPriceRange} />
      </div>

      {/* Auction Status */}
      <div>
        <h4 className="font-semibold text-[#2A2A2A] mb-2">Auction Status</h4>
        <div className="space-y-1">
          {STATUS_OPTIONS.map(opt => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.status || []).includes(opt.key)}
                onChange={() => toggleFilter('status', opt.key)}
                className="accent-[#C41E3A]"
              />
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="font-semibold text-[#2A2A2A] mb-2">Condition</h4>
        <div className="space-y-1">
          {CONDITION_OPTIONS.map(cond => (
            <label key={cond} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.condition || []).includes(cond)}
                onChange={() => toggleFilter('condition', cond)}
                className="accent-[#C41E3A]"
              />
              <span className="text-gray-700">{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="font-semibold text-[#2A2A2A] mb-2">Location</h4>
        <div className="space-y-1">
          {LOCATION_OPTIONS.map(loc => (
            <label key={loc} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.location || []).includes(loc)}
                onChange={() => toggleFilter('location', loc)}
                className="accent-[#C41E3A]"
              />
              <span className="text-gray-700">{loc}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function HomePage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    condition: [],
    location: [],
  });
  const priceBounds = [0, 500000];
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('default');

  // Mobile filter drawer
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    api.get('/auctions/list')
      .then(res => {
        let data = res.data;
        if (user) {
          data = data.filter(a => a.product?.seller_id !== user.id);
        }
        setAuctions(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  // Derived filtered & sorted auctions
  const filteredAuctions = useMemo(() => {
    let result = auctions;

    if (selectedCategory !== 'All') {
      result = result.filter(a => a.product?.category === selectedCategory);
    }

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(a =>
        a.product?.title?.toLowerCase().includes(query) ||
        a.product?.description?.toLowerCase().includes(query)
      );
    }

    result = result.filter(a => {
      const price = Number(a.current_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (filters.status.includes('activeOnly')) {
      result = result.filter(a => new Date(a.end_time) >= new Date());
    }
    if (filters.status.includes('endingSoon')) {
      const oneHour = 60 * 60 * 1000;
      result = result.filter(a => {
        const rem = new Date(a.end_time).getTime() - Date.now();
        return rem > 0 && rem <= oneHour;
      });
    }
    if (filters.status.includes('newlyListed')) {
      const oneDay = 24 * 60 * 60 * 1000;
      result = result.filter(a => Date.now() - new Date(a.start_time).getTime() < oneDay);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.current_price - b.current_price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.current_price - a.current_price);
        break;
      case 'ending_soon':
        result = [...result].sort((a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime());
        break;
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [auctions, selectedCategory, searchQuery, priceRange, filters, sortBy]);

  const clearAllFilters = () => {
    setFilters({ status: [], condition: [], location: [] });
    setPriceRange(priceBounds);
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('default');
  };

  // Intersection observer for fade-up
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredAuctions]);

  return (
    <div className="bg-[#F8F9FA] -mx-4 -my-6 px-4 py-6 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#2A2A2A] via-[#2A2A2A] to-[#1a1a1a] rounded-3xl overflow-hidden mb-8 mt-2">
        <div className="absolute inset-0 bg-[#C41E3A] opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-12 md:py-16">
          <div className="md:w-1/2 text-white space-y-4 fade-up visible">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Bid on <span className="text-[#FDC02F]">Premium</span> Second‑Hand Goods
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Zero gateway fees, secure escrow, trusted by thousands.
            </p>
            <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden max-w-lg mt-4">
              <span className="pl-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search for verified items..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center fade-up visible" style={{ transitionDelay: '0.2s' }}>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
              alt="Premium items"
              className="rounded-2xl shadow-2xl max-w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Horizontal Category Quick‑Aisle */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 fade-up visible" style={{ transitionDelay: '0.3s' }}>
        {CATEGORIES.map(cat => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex flex-row items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-200 min-w-[130px] ${
                selectedCategory === cat.key
                  ? 'bg-[#C41E3A] text-white shadow-lg scale-105'
                  : 'bg-white text-[#2A2A2A] shadow-sm hover:shadow-md hover:scale-105 border border-gray-100'
              }`}
            >
              <IconComponent className={selectedCategory === cat.key ? 'text-white' : 'text-[#2A2A2A]'} size={20} />
              <span className="text-sm font-medium whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Split Workspace */}
      <div className="flex gap-6 mt-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={clearAllFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceBounds={priceBounds}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <p className="text-gray-600 text-sm">
              Showing <span className="font-bold text-[#2A2A2A]">{filteredAuctions.length}</span> Active Auctions
            </p>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#C41E3A]"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden bg-[#C41E3A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition"
              >
                Refine Search
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow overflow-hidden flex flex-col h-full">
                  <div className="aspect-[4/3] skeleton" />
                  <div className="p-4 space-y-3 flex-grow">
                    <div className="h-4 w-3/4 skeleton" />
                    <div className="h-6 w-1/3 skeleton mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No auctions match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAuctions.map((auction, idx) => (
                <AuctionCard key={auction.id} auction={auction} index={idx} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-80 max-w-full bg-white h-full overflow-y-auto p-5 ml-auto">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={clearAllFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceBounds={priceBounds}
            />
          </div>
        </div>
      )}
    </div>
  );
}