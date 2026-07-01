import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import SellPage from './pages/SellPage';
import PaymentPage from './pages/PaymentPage';
import TransactionsPage from './pages/TransactionsPage';
import MyProductsPage from './pages/MyProductsPage';
import NotFound from './pages/NotFound';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
          <Sidebar />
          <main className="flex-grow overflow-y-auto px-4 py-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/auction/:id" element={<AuctionDetailPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/dashboard/my-products" element={<MyProductsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);