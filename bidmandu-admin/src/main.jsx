import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KycQueuePage from './pages/KycQueuePage';
import ProductQueuePage from './pages/ProductQueuePage';
import PaymentQueuePage from './pages/PaymentQueuePage';
import SettlementPage from './pages/SettlementPage';
import DisputePage from './pages/DisputePage';
import Layout from './components/Layout';
import './index.css';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="kyc" element={<KycQueuePage />} />
        <Route path="products" element={<ProductQueuePage />} />
        <Route path="payments" element={<PaymentQueuePage />} />
        <Route path="settlements" element={<SettlementPage />} />
        <Route path="disputes" element={<DisputePage />} />
      </Route>
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);