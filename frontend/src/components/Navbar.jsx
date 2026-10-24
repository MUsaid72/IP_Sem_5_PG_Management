import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, role, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              StayEase
            </span>
            <span className="text-xs text-slate-400 font-medium block -mt-1">
              Hostel & PG Digital System (React)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 bg-slate-100 py-1.5 px-3.5 rounded-full text-sm">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  role === 'OWNER'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {role === 'OWNER' ? 'Owner' : 'Tenant'}
              </span>
              <span className="font-medium text-slate-700">{user.name}</span>
              <button
                onClick={logout}
                title="Logout"
                className="text-slate-400 hover:text-rose-600 transition p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition shadow-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
