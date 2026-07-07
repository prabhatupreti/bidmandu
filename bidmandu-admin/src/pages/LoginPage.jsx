import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#C41E3A] w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/logobid.png" alt="Bidmandu" className="h-16 w-16 mb-2" />
          <h1 className="text-2xl font-bold text-[#2A2A2A]">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Bidmandu Administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Email or phone"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C41E3A] transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C41E3A] transition"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#C41E3A] text-white py-3 rounded-lg font-bold hover:bg-red-800 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}