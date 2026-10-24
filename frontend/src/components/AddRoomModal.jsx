import React, { useState } from 'react';
import { X } from 'lucide-react';
import { roomsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AddRoomModal({ isOpen, onClose, onSuccess }) {
  const { user, notifyChange } = useAuth();
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Double Sharing');
  const [rentAmount, setRentAmount] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [amenities, setAmenities] = useState('AC, Attached Bath, Wi-Fi, Balcony');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        roomNumber: roomNumber.trim(),
        roomType,
        rentAmount: parseFloat(rentAmount),
        securityDeposit: parseFloat(securityDeposit) || 0,
        status,
        amenities: amenities.trim(),
        description: description.trim() || 'Cozy modern hostel room with power backup and daily maintenance.',
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
        ownerId: user?.id || 1,
      };

      await roomsApi.create(payload);
      notifyChange();
      onSuccess(`Room ${roomNumber} added successfully! Visible in tenant listings.`);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-lg font-bold text-slate-900">Add New Hostel Room</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Room Number *</label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. A-105"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sharing Type *</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Single Sharing">Single Sharing</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Four Sharing">Four Sharing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Rent (₹) *</label>
              <input
                type="number"
                required
                min="500"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                placeholder="e.g. 7500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                min="0"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="e.g. 8000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Occupancy Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="AVAILABLE">AVAILABLE (Open for Booking)</option>
              <option value="OCCUPIED">OCCUPIED (Unavailable)</option>
              <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Amenities</label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="e.g. AC, Attached Bath, Wi-Fi, Balcony, Geyser"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about the room ambiance, floor, orientation..."
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-md disabled:opacity-50"
            >
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
