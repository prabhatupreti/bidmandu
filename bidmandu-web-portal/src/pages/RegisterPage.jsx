import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, phone, password });
      alert('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex min-h-[80vh] rounded-xl overflow-hidden shadow-2xl mt-4">
      <div className="hidden md:flex w-1/2 bg-[#2A2A2A] text-white flex-col justify-center items-center p-12">
        <img src="/logobid.png" alt="Bidmandu" className="h-24 w-24 mb-6" />
        <h1 className="text-4xl font-extrabold mb-4">Bidmandu</h1>
        <p className="text-xl text-gray-300 text-center mb-8">Nepal's Premier C2C Bidding Platform</p>
        <p className="text-sm text-gray-400 text-center">Secure escrow, zero gateway fees.</p>
      </div>

      <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full fade-up visible">
          <h2 className="text-3xl font-bold text-[#2A2A2A] mb-2">Create an account</h2>
          <p className="text-gray-500 mb-8">Join Bidmandu today</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="floating-label">
              <input type="email" id="email" placeholder=" " value={email}
                onChange={e => setEmail(e.target.value)} required />
              <label htmlFor="email">Email</label>
            </div>
            <div className="floating-label">
              <input type="text" id="phone" placeholder=" " value={phone}
                onChange={e => setPhone(e.target.value)} />
              <label htmlFor="phone">Phone (optional)</label>
            </div>
            <div className="floating-label">
              <input type="password" id="reg-password" placeholder=" " value={password}
                onChange={e => setPassword(e.target.value)} required />
              <label htmlFor="reg-password">Password</label>
            </div>
            <button type="submit"
              className="w-full bg-[#FDC02F] text-[#2A2A2A] py-3 rounded-lg font-bold hover:bg-yellow-500 transition">
              Register
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account? <Link to="/login" className="text-[#C41E3A] font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}