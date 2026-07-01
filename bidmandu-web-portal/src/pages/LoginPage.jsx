import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] rounded-xl overflow-hidden shadow-2xl mt-4">
      {/* Left brand panel */}
      <div className="hidden md:flex w-1/2 bg-[#2A2A2A] text-white flex-col justify-center items-center p-12 relative">
        <img src="/logobid.png" alt="Bidmandu" className="h-24 w-24 mb-6" />
        <h1 className="text-4xl font-extrabold mb-4">Bidmandu</h1>
        <p className="text-xl text-gray-300 text-center mb-8">Nepal's Premier C2C Bidding Platform</p>
        <p className="text-sm text-gray-400 text-center">Zero gateway fees. Secure escrow. Local trust.</p>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full fade-up visible">
          <h2 className="text-3xl font-bold text-[#2A2A2A] mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="floating-label">
              <input type="text" id="identifier" placeholder=" " value={identifier}
                onChange={e => setIdentifier(e.target.value)} required />
              <label htmlFor="identifier">Email or phone</label>
            </div>
            <div className="floating-label">
              <input type="password" id="password" placeholder=" " value={password}
                onChange={e => setPassword(e.target.value)} required />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit"
              className="w-full bg-[#C41E3A] text-white py-3 rounded-lg font-bold hover:bg-red-800 transition">
              Sign In
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-500">
            Don't have an account? <Link to="/register" className="text-[#C41E3A] font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}