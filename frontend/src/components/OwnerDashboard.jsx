import React, { useState, useEffect } from 'react';
import { roomsApi, applicationsApi, complaintsApi, rentApi, tenantsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoomCard from './RoomCard';
import AddRoomModal from './AddRoomModal';
import UpdateComplaintModal from './UpdateComplaintModal';
import {
  DoorClosed,
  DoorOpen,
  Users,
  AlertTriangle,
  IndianRupee,
  Plus,
  Bed,
  MailOpen,
  MessageSquare,
  Receipt,
  IdCard,
  Check,
  X,
  Edit3
} from 'lucide-react';

export default function OwnerDashboard({ onToast }) {
  const { user, syncTrigger, notifyChange } = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');

  // Data states
  const [rooms, setRooms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [tenants, setTenants] = useState([]);
  const [roomFilter, setRoomFilter] = useState('ALL');

  // Modal states
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadData = async () => {
    try {
      const [r, a, c, p, s, t] = await Promise.all([
        roomsApi.getAll(),
        applicationsApi.getAll(),
        complaintsApi.getAll(),
        rentApi.getPayments(),
        rentApi.getStats(),
        tenantsApi.getAll(),
      ]);
      setRooms(r || []);
      setApplications(a || []);
      setComplaints(c || []);
      setPayments(p || []);
      setStats(s || {});
      setTenants(t || []);
    } catch (err) {
      console.error('Error fetching owner data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [syncTrigger]);

  const handleDeleteRoom = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) return;
    try {
      await roomsApi.delete(id);
      notifyChange();
      onToast(`Room ${roomNumber} deleted.`, 'info');
    } catch (err) {
      onToast(err.message || 'Failed to delete room', 'error');
    }
  };

  const handleApproveApp = async (id) => {
    try {
      const app = await applicationsApi.approve(id);
      notifyChange();
      onToast(`Application approved! Room ${app.roomNumber} is now OCCUPIED & unavailable in tenant listings.`, 'success');
    } catch (err) {
      onToast(err.message || 'Approval failed', 'error');
    }
  };

  const handleRejectApp = async (id) => {
    try {
      await applicationsApi.reject(id);
      notifyChange();
      onToast('Application rejected.', 'info');
    } catch (err) {
      onToast(err.message || 'Rejection failed', 'error');
    }
  };

  const filteredRooms = roomFilter === 'ALL' ? rooms : rooms.filter((r) => r.status === roomFilter);

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length;
  const openComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const pendingApps = applications.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-2 border border-blue-400/30">
              <DoorClosed className="w-3.5 h-3.5" />
              <span>Hostel Owner Control Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {user?.hostelName || 'Shree Sai Royal PG & Hostels'}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Welcome back, {user?.name || 'Owner'}. Monitor rooms, applications, digital rent & complaints in real-time.
            </p>
          </div>
          <button
            onClick={() => setIsAddRoomOpen(true)}
            className="py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Room</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DoorClosed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Rooms</p>
            <h4 className="text-xl font-bold text-slate-800">{totalRooms}</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DoorOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Available</p>
            <h4 className="text-xl font-bold text-emerald-600">{availableRooms}</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Occupied</p>
            <h4 className="text-xl font-bold text-indigo-600">{occupiedRooms}</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Complaints</p>
            <h4 className="text-xl font-bold text-amber-600">{openComplaints}</h4>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Rent Collected</p>
            <h4 className="text-xl font-bold text-violet-600">
              ₹{Number(stats.totalCollected || 0).toLocaleString('en-IN')}
            </h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'rooms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Room Inventory & Occupancy</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MailOpen className="w-4 h-4" />
          <span>Tenant Applications</span>
          {pendingApps > 0 && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-bold">
              {pendingApps}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'complaints' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Complaint Desk</span>
          {openComplaints > 0 && (
            <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-700 rounded-full font-bold">
              {openComplaints}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rent')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'rent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Rent Records</span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`py-3 px-1 border-b-2 flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'tenants' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>Tenants Directory</span>
        </button>
      </div>

      {/* Tab 1: Rooms */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">All Rooms in Hostel</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Filter:</span>
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl py-1.5 px-3 bg-white font-medium text-slate-700 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available Only</option>
                <option value="OCCUPIED">Occupied Only</option>
                <option value="UNDER_MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <Bed className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No rooms found for this filter. Click "Add New Room" above to list one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  role="OWNER"
                  onDelete={handleDeleteRoom}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tenant Booking Applications</h3>
              <p className="text-xs text-slate-500">
                Approving automatically assigns the room to the tenant and marks the room OCCUPIED.
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              <MailOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p>No tenant applications received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                let badgeClass = 'bg-amber-100 text-amber-800';
                if (app.status === 'APPROVED') badgeClass = 'bg-emerald-100 text-emerald-800';
                else if (app.status === 'REJECTED') badgeClass = 'bg-rose-100 text-rose-800';

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                          {app.status}
                        </span>
                        <h4 className="font-bold text-slate-900">{app.tenantName}</h4>
                        <span className="text-xs text-slate-400">
                          • Applied for Room <b>{app.roomNumber}</b> (₹{Number(app.rentAmount || 0).toLocaleString('en-IN')}/mo)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{app.message}"
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-3 pt-1">
                        <span>Email: {app.tenantEmail}</span>
                        <span>Phone: {app.tenantPhone}</span>
                        <span>Date: {app.applicationDate}</span>
                      </div>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveApp(app.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Assign</span>
                        </button>
                        <button
                          onClick={() => handleRejectApp(app.id)}
                          className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Complaints */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Digital Complaint Ticketing Desk</h3>
              <p className="text-xs text-slate-500">
                Tenant grievances lodged from the tenant dashboard appear here for resolution.
              </p>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              <p>No complaints filed. All systems running smooth!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((comp) => {
                let statusBadge = 'bg-rose-100 text-rose-700';
                if (comp.status === 'IN_PROGRESS') statusBadge = 'bg-amber-100 text-amber-700';
                else if (comp.status === 'RESOLVED') statusBadge = 'bg-emerald-100 text-emerald-700';

                return (
                  <div
                    key={comp.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusBadge}`}>
                          {comp.status}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {comp.priority}
                        </span>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {comp.category}
                        </span>
                        <span className="text-xs text-slate-400">• Room {comp.roomNumber}</span>
                      </div>
                      <span className="text-xs text-slate-400">{comp.createdDate}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">{comp.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{comp.description}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Tenant: <b className="text-slate-700">{comp.tenantName}</b>
                        </span>
                        {comp.ownerNotes ? (
                          <span className="text-slate-600 mt-0.5 block">
                            Owner Notes: <i>"{comp.ownerNotes}"</i>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No owner notes added yet.</span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedComplaint(comp)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition whitespace-nowrap flex items-center space-x-1 w-fit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Status / Notes</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Rent Records */}
      {activeTab === 'rent' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Monthly Rent Tracking & Records</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="p-4">Txn ID</th>
                  <th className="p-4">Tenant</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Month</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No rent payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono text-xs text-slate-500 font-semibold">{pay.transactionId}</td>
                      <td className="p-4 font-medium text-slate-800">{pay.tenantName}</td>
                      <td className="p-4 text-slate-600">Room {pay.roomNumber}</td>
                      <td className="p-4 text-slate-600">{pay.month}</td>
                      <td className="p-4 font-bold text-slate-900">₹{Number(pay.amount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 font-medium">
                          {pay.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">{pay.paymentDate}</td>
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

      {/* Tab 5: Tenants Directory */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Registered Tenants Directory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenants.map((t) => {
              let rentBadge = 'bg-emerald-100 text-emerald-800';
              if (t.rentStatus === 'DUE') rentBadge = 'bg-amber-100 text-amber-800';
              else if (t.rentStatus === 'OVERDUE') rentBadge = 'bg-rose-100 text-rose-800';

              return (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{t.name}</h4>
                      <p className="text-xs text-slate-500">{t.collegeOrCompany || 'Resident Student'}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${rentBadge}`}>
                      Rent: {t.rentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Assigned Room:</span>
                      <span className="font-bold text-slate-800">
                        {t.assignedRoomNumber ? `Room ${t.assignedRoomNumber}` : <span className="text-amber-600 font-normal">None Assigned</span>}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Monthly Rent:</span>
                      <span className="font-bold text-blue-700">₹{Number(t.monthlyRent || 0).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Email: {t.email}</span>
                    <span>Phone: {t.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddRoomModal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onSuccess={(msg) => onToast(msg, 'success')}
      />

      <UpdateComplaintModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        onSuccess={(msg) => onToast(msg, 'success')}
      />
    </div>
  );
}
