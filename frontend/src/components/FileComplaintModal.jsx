import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { complaintsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FileComplaintModal({ isOpen, onClose, onSuccess }) {
  const { user, notifyChange } = useAuth();
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await complaintsApi.file({
        tenantId: user?.id || 1,
        category,
        priority,
        title: title.trim(),
        description: description.trim(),
      });

      notifyChange();
      onSuccess('Complaint ticket logged! Instantly visible on Owner Complaint Desk.');
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to file complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-lg font-bold text-slate-900">File a Maintenance Complaint</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="Plumbing">Plumbing / Washroom</option>
                <option value="Electrical">Electrical / Lighting / AC</option>
                <option value="Wi-Fi">Wi-Fi & Internet</option>
                <option value="Cleanliness">Room & Corridor Cleanliness</option>
                <option value="Food/Mess">Mess & Dining Quality</option>
                <option value="Noise">Noise & Discipline</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Brief Subject *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Washroom tap leaking, Wi-Fi router reboot"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem clearly so maintenance staff can bring correct replacement parts..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none"
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
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold text-white shadow-md disabled:opacity-50 flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
