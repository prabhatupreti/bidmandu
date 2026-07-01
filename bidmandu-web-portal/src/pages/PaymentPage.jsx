import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function Dropzone({ onFile, label }) { /* same as above, but single file */ }

export default function PaymentPage() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/transactions/${id}/payment-details`)
      .then(res => setDetails(res.data))
      .catch(console.error);
  }, [id]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('proof', file);
    try {
      await api.post(`/transactions/${id}/proof`, formData);
      setMessage('Proof uploaded!');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Upload failed'));
    }
  };

  const handleConfirm = async () => {
    try {
      await api.post(`/transactions/${id}/confirm-receipt`);
      setMessage('Receipt confirmed!');
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  if (!details) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#C41E3A] fade-up visible">
      <h2 className="text-2xl font-bold text-[#2A2A2A] mb-4">Payment Details</h2>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p>Amount: <span className="font-bold text-[#C41E3A]">Rs. {details.amountDue}</span></p>
        <p className="text-sm mt-1">Reference: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{details.paymentRef}</span></p>
        <img src={details.staticQrUrl} alt="QR" className="mt-4 w-48 mx-auto" />
        <p className="text-xs text-gray-500 mt-2 text-center">{details.instructions}</p>
      </div>

      <div className="mb-4">
        <Dropzone onFile={setFile} label="Drop payment screenshot here" />
      </div>
      <button onClick={handleUpload} className="w-full bg-[#FDC02F] text-[#2A2A2A] py-2 rounded-lg font-bold mb-2 hover:bg-yellow-500 transition">Upload Proof</button>
      <button onClick={handleConfirm} className="w-full bg-[#C41E3A] text-white py-2 rounded-lg font-bold hover:bg-red-800 transition">Confirm Receipt</button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}