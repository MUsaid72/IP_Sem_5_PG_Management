import React, { useState } from 'react';
import { X, Bed } from 'lucide-react';
import { applicationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ApplyRoomModal({ room, isOpen, onClose, onSuccess }) {
  const { user, notifyChange } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applicationsApi.apply({
        roomId: room.id,
        tenantId: user?.id || 1,
        message: message.trim() || `Application submitted for Room ${room.roomNumber}`,
      });

      notifyChange();
      onSuccess(`Room application submitted! Visible as PENDING under My Tenancy.`);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Apply & Book Room</h3>
            <p className="text-xs text-slate-500">Room {room.roomNumber} ({room.roomType})</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-700 font-semibold block">Monthly Rent</span>
              <span className="text-xl font-extrabold text-emerald-950">
                ₹{Number(room.rentAmount || 0).toLocaleString('en-IN')}/mo
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-700 font-semibold block">Sharing</span>
              <span className="text-sm font-bold text-emerald-900">{room.roomType}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Message for Hostel Owner *
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="State your college, year of study, planned move-in date..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
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
              <Bed className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
