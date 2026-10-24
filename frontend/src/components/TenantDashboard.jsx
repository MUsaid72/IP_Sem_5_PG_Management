import React, { useState, useEffect } from 'react';
import { roomsApi, applicationsApi, complaintsApi, rentApi, tenantsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoomCard from './RoomCard';
import ApplyRoomModal from './ApplyRoomModal';
import PayRentModal from './PayRentModal';
import FileComplaintModal from './FileComplaintModal';
import {
  GraduationCap,
  DoorOpen,
  Building,
  Bed,
  Receipt,
  Headphones,
  CheckCircle,
  CreditCard,
  Plus,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function TenantDashboard({ onToast }) {
  const { user, syncTrigger } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');

  // Data states
  const [rooms, setRooms] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [tenantProfile, setTenantProfile] = useState(user);
  const [filter, setFilter] = useState('ALL');

  // Modal states
  const [selectedRoomForApply, setSelectedRoomForApply] = useState(null);
  const [isPayRentOpen, setIsPayRentOpen] = useState(false);
  const [isFileComplaintOpen, setIsFileComplaintOpen] = useState(false);

  const loadData = async () => {
    const tenantId = user?.id || 1;
    try {
      const [r, a, c, p, profile] = await Promise.all([
        roomsApi.getAll(),
        applicationsApi.getByTenant(tenantId),
        complaintsApi.getByTenant(tenantId),
        rentApi.getPaymentsByTenant(tenantId),
        tenantsApi.getById(tenantId),
      ]);
      setRooms(r || []);
      setMyApplications(a || []);
      setMyComplaints(c || []);
      setMyPayments(p || []);
      if (profile) setTenantProfile(profile);
    } catch (err) {
      console.error('Error fetching tenant data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [syncTrigger]);

  const filteredRooms =
    filter === 'AVAILABLE'
      ? rooms.filter((r) => r.status === 'AVAILABLE')
      : filter === 'OCCUPIED'
      ? rooms.filter((r) => r.status === 'OCCUPIED')
      : rooms;

  const rentAmount = tenantProfile?.monthlyRent || 7500;
  const rentStatus = tenantProfile?.rentStatus || 'DUE';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2 border border-emerald-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tenant Resident Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Welcome, {tenantProfile?.name || 'Student'}
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1">
              Browse available rooms, apply, pay monthly rent digitally, and submit maintenance tickets.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center space-x-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-lg">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-emerald-200 block font-medium">My Assigned Room</span>
              <span className="text-base font-bold text-white">
                {tenantProfile?.assignedRoomNumber ? `Room ${tenantProfile.assignedRoomNumber}` : 'Not Assigned Yet'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'rooms' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Available Room Listings</span>
        </button>

        <button
          onClick={() => setActiveTab('myroom')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'myroom' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>My Tenancy & Applications</span>
          {myApplications.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full font-bold">
              {myApplications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rent')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'rent' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Rent & Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'complaints' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>File / Track Complaints</span>
          {myComplaints.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-800 rounded-full font-bold">
              {myComplaints.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Available Rooms */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Hostel & PG Rooms Directory</h3>
              <p className="text-xs text-slate-500">
                Rooms marked "Available" can be applied for immediately. Booked rooms show as unavailable.
              </p>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl py-2 px-3 bg-white font-medium text-slate-700 outline-none w-fit"
            >
              <option value="ALL">Show All Rooms</option>
              <option value="AVAILABLE">Available Rooms Only</option>
              <option value="OCCUPIED">Occupied / Booked</option>
            </select>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <Bed className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No rooms found matching the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  role="TENANT"
                  onApply={(r) => setSelectedRoomForApply(r)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Tenancy */}
      {activeTab === 'myroom' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            {tenantProfile?.assignedRoomNumber ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ACTIVE LEASE
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Room {tenantProfile.assignedRoomNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Allocated to <b>{tenantProfile.name}</b> ({tenantProfile.collegeOrCompany || 'Resident'})
                  </p>
                  <div className="flex items-center space-x-4 pt-1 text-xs text-slate-600">
                    <span>Monthly Rent: <b>₹{Number(rentAmount).toLocaleString('en-IN')}</b></span>
                    <span>Status: <b className="uppercase">{rentStatus}</b></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-slate-700">Hostel Management Contact</p>
                  <p className="text-slate-500">Hostel: Shree Sai Royal PG & Hostels</p>
                  <p className="text-slate-500">Owner Helpline: +91 98765 43210</p>
                  <p className="text-slate-500">Emergency Desk: 24/7 Security</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Bed className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <h4 className="font-bold text-slate-800">No Room Allocated Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Browse the "Available Room Listings" tab to apply for a room. Once approved by the owner, your allocated room details will show here.
                </p>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Browse Available Rooms
                </button>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-800 mb-3">My Booking Applications</h4>
            {myApplications.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No applications submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => {
                  let badge = 'bg-amber-100 text-amber-800';
                  if (app.status === 'APPROVED') badge = 'bg-emerald-100 text-emerald-800';
                  else if (app.status === 'REJECTED') badge = 'bg-rose-100 text-rose-800';

                  return (
                    <div
                      key={app.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold px-2 py-0.5 rounded-full ${badge}`}>
                            {app.status}
                          </span>
                          <span className="font-bold text-slate-900">
                            Application for Room {app.roomNumber}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1 italic">"{app.message}"</p>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Applied on: {app.applicationDate}
                        </span>
                      </div>
                      <span className="font-bold text-slate-700 text-sm">
                        ₹{Number(app.rentAmount || 0).toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Rent & Payments */}
      {activeTab === 'rent' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Current Month Rent (October 2026)
              </span>
              <div className="flex items-baseline space-x-3 mt-1">
                <h3 className="text-3xl font-extrabold text-slate-900">
                  ₹{Number(rentAmount).toLocaleString('en-IN')}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Due date: 5th of each calendar month</p>
            </div>

            {rentStatus === 'PAID' ? (
              <button
                disabled
                className="py-3 px-6 bg-slate-100 text-slate-400 font-semibold rounded-xl text-sm border border-slate-200 flex items-center justify-center space-x-2 cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Rent Already Paid for This Month</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPayRentOpen(true)}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Rent Digitally</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm">Payment Receipts & History</h4>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="p-4">Txn ID</th>
                  <th className="p-4">Month</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {myPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No payment history yet.
                    </td>
                  </tr>
                ) : (
                  myPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono text-slate-500 font-semibold">{pay.transactionId}</td>
                      <td className="p-4 text-slate-700 font-medium">{pay.month}</td>
                      <td className="p-4 font-bold text-slate-900">
                        ₹{Number(pay.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                          {pay.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{pay.paymentDate}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Complaints */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">My Maintenance Tickets</h3>
              <p className="text-xs text-slate-500">
                Tickets are delivered instantly to the owner dashboard for maintenance resolution.
              </p>
            </div>
            <button
              onClick={() => setIsFileComplaintOpen(true)}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-md transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>File New Complaint</span>
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
              <p>No complaints submitted yet. Need maintenance? Click "File New Complaint".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myComplaints.map((comp) => {
                let statusBadge = 'bg-rose-100 text-rose-700';
                if (comp.status === 'IN_PROGRESS') statusBadge = 'bg-amber-100 text-amber-700';
                else if (comp.status === 'RESOLVED') statusBadge = 'bg-emerald-100 text-emerald-700';

                return (
                  <div
                    key={comp.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusBadge}`}>
                          {comp.status}
                        </span>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          {comp.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{comp.createdDate}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">{comp.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{comp.description}</p>
                    </div>

                    {comp.ownerNotes ? (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs">
                        <span className="text-blue-800 font-bold block mb-0.5">
                          Owner Resolution Notes:
                        </span>
                        <span className="text-blue-700">{comp.ownerNotes}</span>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-400 italic">
                        Sent to Owner Dashboard. Maintenance staff will review shortly.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ApplyRoomModal
        room={selectedRoomForApply}
        isOpen={Boolean(selectedRoomForApply)}
        onClose={() => setSelectedRoomForApply(null)}
        onSuccess={(msg) => {
          onToast(msg, 'success');
          setActiveTab('myroom');
        }}
      />

      <PayRentModal
        isOpen={isPayRentOpen}
        onClose={() => setIsPayRentOpen(false)}
        onSuccess={(msg) => onToast(msg, 'success')}
      />

      <FileComplaintModal
        isOpen={isFileComplaintOpen}
        onClose={() => setIsFileComplaintOpen(false)}
        onSuccess={(msg) => onToast(msg, 'success')}
      />
    </div>
  );
}
