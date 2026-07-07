import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
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

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Desktop Sidebar – visible on md screens and above (Tailwind md = 768px) */}
      <div className="hidden md:block shrink-0">
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Mobile Sidebar Overlay – only on small screens */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          {/* Drawer */}
          <div className="relative w-64 h-full bg-[#2A2A2A] shadow-lg animate-slide-in-left">
            <Sidebar onClose={closeSidebar} isMobile />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-grow overflow-hidden w-full md:w-auto">
        {/* Mobile header – visible only on small screens */}
        <div className="md:hidden">
          <MobileHeader onMenuTap={toggleSidebar} />
        </div>

        {/* Scrollable page content */}
        <main className="flex-grow overflow-y-auto px-4 py-4 md:px-6 md:py-6 w-full">
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);