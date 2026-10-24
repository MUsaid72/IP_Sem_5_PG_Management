import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, Lock, ArrowRight, Briefcase, GraduationCap, Building, Phone, User } from 'lucide-react';

export default function AuthModal({ onToast }) {
  const { login, registerTenant, registerOwner } = useAuth();
  const [role, setRole] = useState('OWNER');
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeOrCompany, setCollegeOrCompany] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (role === 'TENANT') {
          const res = await registerTenant({ name, email, phone, password, collegeOrCompany });
          if (res.success) {
            onToast(res.message, 'success');
          } else {
            onToast(res.message, 'error');
          }
        } else {
          const res = await registerOwner({ name, email, phone, password, hostelName, address });
          if (res.success) {
            onToast(res.message, 'success');
          } else {
            onToast(res.message, 'error');
          }
        }
      } else {
        const res = await login(email, password, role);
        if (res.success) {
          onToast(res.message, 'success');
        } else {
          onToast(res.message, 'error');
        }
      }
    } catch (err) {
      onToast(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setRole(demoRole);
    setLoading(true);
    const demoEmail = demoRole === 'OWNER' ? 'owner@hostel.com' : 'tenant@college.edu';
    const res = await login(demoEmail, 'password123', demoRole);
    setLoading(false);
    if (res.success) {
      onToast(`Logged in as ${demoRole} Demo`, 'success');
    } else {
      onToast(res.message, 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isRegister
              ? 'Sign up to access hostel rooms & management'
              : 'Sign in to access your digital hostel dashboard'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6 p-1 bg-slate-100 rounded-2xl flex">
          <button
            type="button"
            onClick={() => setRole('OWNER')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 ${
              role === 'OWNER' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Hostel Owner</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('TENANT')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 ${
              role === 'TENANT' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Tenant / Student</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98888 77777"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
                  />
                </div>
              </div>

              {role === 'TENANT' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    College / Course
                  </label>
                  <input
                    type="text"
                    value={collegeOrCompany}
                    onChange={(e) => setCollegeOrCompany(e.target.value)}
                    placeholder="e.g. Computer Science Sem 5"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Hostel / PG Name *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={hostelName}
                        onChange={(e) => setHostelName(e.target.value)}
                        placeholder="e.g. Greenfield Luxury PG"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Knowledge Park III, Greater Noida"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'OWNER' ? 'owner@hostel.com' : 'tenant@college.edu'}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isRegister ? 'Complete Registration' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {!isRegister && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-center font-semibold text-slate-400 uppercase tracking-wider mb-3">
              One-Click Quick Evaluation Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('OWNER')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 text-left transition group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 group-hover:text-blue-600">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  <span>Owner Demo</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">owner@hostel.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('TENANT')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/40 text-left transition group"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 group-hover:text-emerald-600">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tenant Demo</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">tenant@college.edu</p>
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : 'New user? Create a free account'}
          </button>
        </div>
      </div>
    </div>
  );
}
