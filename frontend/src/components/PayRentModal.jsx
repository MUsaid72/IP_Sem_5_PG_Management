import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, ShieldCheck } from 'lucide-react';
import { rentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PayRentModal({ isOpen, onClose, onSuccess }) {
  const { user, notifyChange } = useAuth();
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const rentAmount = user?.monthlyRent || 7500;
  const roomNumber = user?.assignedRoomNumber || 'B-201';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await rentApi.pay({
        tenantId: user?.id || 1,
        amount: rentAmount,
        month: 'October 2026',
        paymentMethod: method,
      });

      notifyChange();
      onSuccess(`Rent Paid Successfully! Transaction ID: ${res.transactionId}`);
      onClose();
    } catch (err) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-lg font-bold text-slate-900">Digital Rent Payment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
            <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider block">
              October 2026 Monthly Rent
            </span>
            <h2 className="text-3xl font-extrabold text-emerald-950 mt-1">
              ₹{Number(rentAmount).toLocaleString('en-IN')}
            </h2>
            <span className="text-xs text-emerald-700 mt-0.5 block font-medium">
              Assigned: Room {roomNumber}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Select Digital Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  method === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Net Banking')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  method === 'Net Banking'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Card')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  method === 'Card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Debit/Card</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-white shadow-md disabled:opacity-50 flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Pay Digitally</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
