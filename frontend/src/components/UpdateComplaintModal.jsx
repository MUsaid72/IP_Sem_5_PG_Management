import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { complaintsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UpdateComplaintModal({ complaint, isOpen, onClose, onSuccess }) {
  const { notifyChange } = useAuth();
  const [status, setStatus] = useState('IN_PROGRESS');
  const [ownerNotes, setOwnerNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'IN_PROGRESS');
      setOwnerNotes(complaint.ownerNotes || '');
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await complaintsApi.updateStatus(complaint.id, status, ownerNotes.trim());
      notifyChange();
      onSuccess(`Complaint #${complaint.id} status updated to ${status}.`);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Update Complaint Status</h3>
            <p className="text-xs text-slate-500">Ticket #{complaint.id}: {complaint.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Complaint Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="IN_PROGRESS">IN_PROGRESS (Staff Assigned)</option>
              <option value="RESOLVED">RESOLVED (Issue Fixed)</option>
              <option value="OPEN">OPEN (Under Review)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Owner Resolution Notes
            </label>
            <textarea
              rows={3}
              value={ownerNotes}
              onChange={(e) => setOwnerNotes(e.target.value)}
              placeholder="e.g. Electrician visited and repaired the board."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-md disabled:opacity-50 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
