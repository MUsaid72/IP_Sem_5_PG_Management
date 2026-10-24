import React from 'react';
import { Trash2, Lock, CheckCircle, Bed, UserCheck } from 'lucide-react';

export default function RoomCard({ room, role, onApply, onDelete }) {
  const isAvailable = room.status === 'AVAILABLE';

  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let statusText = 'AVAILABLE FOR BOOKING';
  if (room.status === 'OCCUPIED') {
    badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
    statusText = 'OCCUPIED (Unavailable)';
  } else if (room.status === 'UNDER_MAINTENANCE') {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    statusText = 'MAINTENANCE';
  }

  const amenitiesList = (room.amenities || 'Wi-Fi, Attached Bath')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="h-44 bg-slate-100 relative overflow-hidden">
          <img
            src={
              room.imageUrl ||
              'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'
            }
            alt={`Room ${room.roomNumber}`}
            className="w-full h-full object-cover"
          />
          <span
            className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeColor} backdrop-blur-md shadow-sm`}
          >
            {statusText}
          </span>
          <span className="absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-xl bg-black/60 text-white backdrop-blur-md">
            {room.roomType}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between mb-2">
            <h4 className="text-xl font-bold text-slate-900">Room {room.roomNumber}</h4>
            <span className="text-lg font-extrabold text-blue-700">
              ₹{Number(room.rentAmount || 0).toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
            {room.description || 'Furnished student room with study table, air ventilation, and high speed Wi-Fi.'}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {amenitiesList.map((a, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
              >
                {a}
              </span>
            ))}
          </div>

          {room.currentTenantName && (
            <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Current Tenant: <b>{room.currentTenantName}</b></span>
              </span>
            </div>
          )}

          <div className="text-[11px] text-slate-400">
            <span>Security Deposit: <b>₹{Number(room.securityDeposit || 0).toLocaleString('en-IN')}</b></span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        {role === 'TENANT' ? (
          isAvailable ? (
            <button
              onClick={() => onApply(room)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <Bed className="w-4 h-4" />
              <span>Apply & Book This Room</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 font-semibold rounded-xl text-xs cursor-not-allowed flex items-center justify-center space-x-2 border border-slate-200"
            >
              <Lock className="w-4 h-4" />
              <span>Currently Unavailable</span>
            </button>
          )
        ) : (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onDelete(room.id, room.roomNumber)}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Room</span>
            </button>
            <span className="text-xs text-slate-400">Owner ID: {room.ownerId || 1}</span>
          </div>
        )}
      </div>
    </div>
  );
}
