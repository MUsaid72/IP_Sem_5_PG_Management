import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import OwnerDashboard from './components/OwnerDashboard';
import TenantDashboard from './components/TenantDashboard';
import Toast from './components/Toast';

export default function App() {
  const { user, role, loading } = useAuth();
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenAuth={() => {}} />
      <Toast toasts={toasts} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <AuthModal onToast={addToast} />
        ) : role === 'OWNER' ? (
          <OwnerDashboard onToast={addToast} />
        ) : (
          <TenantDashboard onToast={addToast} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 StayEase PG & Hostel Management System. React + Spring Boot REST API.</p>
          <p>Built for IP Java Semester 5 Hands-on Evaluations.</p>
        </div>
      </footer>
    </div>
  );
}
