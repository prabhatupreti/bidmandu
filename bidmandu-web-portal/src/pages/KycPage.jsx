import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function KycPage() {
  const { user } = useAuth();
  const [pan, setPan] = useState('');
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState('');

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Please login to apply for KYC.</div>;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!files.pan || !files.selfie) {
      setMsg('PAN image and selfie are required.');
      return;
    }
    const formData = new FormData();
    formData.append('pan_number', pan);
    formData.append('pan_image', files.pan);
    formData.append('live_selfie', files.selfie);
    if (files.address) formData.append('address_proof', files.address);

    try {
      await api.post('/kyc/apply', formData);
      setMsg('KYC submitted! We will review shortly.');
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || 'Submission failed'));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border-t-4 border-brand-yellow">
      <div className="flex items-center gap-3 mb-6">
        <img src="/logobid.png" alt="logo" className="h-10 w-10" />
        <h2 className="text-2xl font-bold text-brand-dark">Seller KYC Verification</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" placeholder="PAN Number" value={pan}
          onChange={e => setPan(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-yellow" required />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Image *</label>
          <input type="file" accept="image/*" onChange={e => setFiles({...files, pan: e.target.files[0]})}
            className="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Live Selfie *</label>
          <input type="file" accept="image/*" onChange={e => setFiles({...files, selfie: e.target.files[0]})}
            className="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Proof (optional)</label>
          <input type="file" accept="image/*" onChange={e => setFiles({...files, address: e.target.files[0]})}
            className="w-full p-2 border border-gray-300 rounded" />
        </div>
        
        <button type="submit"
          className="w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded hover:bg-yellow-500 transition">
          Submit KYC
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-sm text-brand-dark">{msg}</p>}
    </div>
  );
}