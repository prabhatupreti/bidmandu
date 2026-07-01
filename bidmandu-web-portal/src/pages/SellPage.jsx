import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ---------- Dropzone Component ----------
function Dropzone({ onFilesAccepted, label = "Drag & drop images here, or click to select", accept = "image/*", multiple = true }) {
  const [active, setActive] = useState(false);
  const inputRef = useRef();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);
    const files = [...e.dataTransfer.files];
    if (files.length) onFilesAccepted(files);
  };

  const handleChange = (e) => {
    const files = [...e.target.files];
    if (files.length) onFilesAccepted(files);
  };

  return (
    <div
      className={`dropzone ${active ? 'active' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3">
          <path d="M24 8v24M16 20h16" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="24" r="18" stroke="#C41E3A" strokeWidth="2" />
        </svg>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
}

// ---------- KYC Form ----------
function KycForm({ onSuccess }) {
  const [pan, setPan] = useState('');
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!files.pan || !files.selfie) {
      setMsg('PAN image and selfie are required.');
      return;
    }
    const formData = new FormData();
    formData.append('pan_number', pan);
    formData.append('pan_image', files.pan[0] || files.pan);
    formData.append('live_selfie', files.selfie[0] || files.selfie);
    if (files.address) formData.append('address_proof', files.address[0] || files.address);
    try {
      await api.post('/kyc/apply', formData);
      setMsg('KYC submitted! You can now list products.');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || 'Submission failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="floating-label">
        <input type="text" id="pan" placeholder=" " value={pan}
          onChange={e => setPan(e.target.value)} required />
        <label htmlFor="pan">PAN Number</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Image *</label>
        <Dropzone onFilesAccepted={files => setFiles(prev => ({ ...prev, pan: files }))} label="Drop PAN card image here" />
        {files.pan && <p className="text-xs text-green-600 mt-1">1 file selected</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Live Selfie *</label>
        <Dropzone onFilesAccepted={files => setFiles(prev => ({ ...prev, selfie: files }))} label="Drop your selfie here" />
        {files.selfie && <p className="text-xs text-green-600 mt-1">1 file selected</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address Proof (optional)</label>
        <Dropzone onFilesAccepted={files => setFiles(prev => ({ ...prev, address: files }))} label="Drop address proof" />
        {files.address && <p className="text-xs text-green-600 mt-1">1 file selected</p>}
      </div>
      <button type="submit" className="w-full bg-[#FDC02F] text-[#2A2A2A] font-bold py-3 rounded-lg hover:bg-yellow-500 transition">
        Submit KYC
      </button>
      {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
    </form>
  );
}

// ---------- Product Form with Category & Condition ----------
const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Vehicles',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Kids',
  'Other',
];

const CONDITION_OPTIONS = [
  'Mint',
  'Gently Used',
  'Well Used',
  'Refurbished',
  'For Parts / Not Working',
];

function ProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITION_OPTIONS[0]);
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('starting_price', price);
    images.forEach(file => formData.append('images', file));
    try {
      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await api.patch(`/products/${res.data.id}/submit`);
      setMessage('Product created and submitted for approval!');
      setTitle(''); setDescription(''); setCategory(CATEGORIES[0]); setCondition(CONDITION_OPTIONS[0]); setPrice(''); setImages([]);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Submission failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="floating-label">
        <input type="text" id="title" placeholder=" " value={title}
          onChange={e => setTitle(e.target.value)} required />
        <label htmlFor="title">Title</label>
      </div>
      <div className="floating-label">
        <textarea id="desc" placeholder=" " rows="4" value={description}
          onChange={e => setDescription(e.target.value)} required />
        <label htmlFor="desc">Description</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C41E3A] bg-white">
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
        <select value={condition} onChange={e => setCondition(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C41E3A] bg-white">
          {CONDITION_OPTIONS.map(cond => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>
      </div>
      <div className="floating-label">
        <input type="number" id="price" placeholder=" " value={price}
          onChange={e => setPrice(e.target.value)} required />
        <label htmlFor="price">Starting Price (Rs.)</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (up to 5)</label>
        <Dropzone onFilesAccepted={newFiles => setImages(prev => [...prev, ...newFiles])} label="Drop product images here" />
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((file, idx) => (
              <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                {file.name}
                <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="text-red-500">&times;</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <button type="submit" className="w-full bg-[#C41E3A] text-white py-3 rounded-lg font-bold hover:bg-red-800 transition">
        Submit for Approval
      </button>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </form>
  );
}

// ---------- Main SellPage ----------
export default function SellPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const isKycVerified = user.is_seller;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border-t-4 fade-up visible"
         style={{ borderColor: isKycVerified ? '#C41E3A' : '#FDC02F' }}>
      <div className="flex items-center gap-3 mb-6">
        <img src="/logobid.png" alt="logo" className="h-10 w-10" />
        <h2 className="text-2xl font-bold text-[#2A2A2A]">
          {isKycVerified ? 'List an Item' : 'Seller Verification Required'}
        </h2>
      </div>

      {isKycVerified ? (
        <ProductForm />
      ) : (
        <>
          <p className="text-gray-600 mb-6">Complete KYC to unlock selling.</p>
          <KycForm onSuccess={() => window.location.reload()} />
        </>
      )}
    </div>
  );
}