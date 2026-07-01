import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center bg-white p-10 rounded-lg shadow border-t-4 border-brand-red">
      <h1 className="text-4xl font-bold text-brand-dark">404</h1>
      <p className="mt-4 text-gray-600">Page not found.</p>
      <Link to="/" className="mt-6 inline-block bg-brand-red text-white px-6 py-2 rounded hover:bg-red-800 transition">Go Home</Link>
    </div>
  );
}