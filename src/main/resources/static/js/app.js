/**
 * StayEase PG & Hostel Management System
 * Frontend SPA Application Logic
 * Supports Multi-Tab Independent Sessions & Real-Time Cross-Tab Synchronization
 */

const API_BASE = '/api';

// Global State
let authState = {
    role: 'OWNER', // Selected role on auth form: 'OWNER' or 'TENANT'
    currentUser: null,
    currentRole: null
};

let currentOwnerTab = 'rooms';
let currentTenantTab = 'rooms';

let appData = {
    rooms: [],
    applications: [],
    complaints: [],
    payments: [],
    tenants: [],
    rentStats: {}
};

// ==========================================
// Cross-Tab Real-Time Synchronization
// ==========================================
let syncChannel = null;
try {
    syncChannel = new BroadcastChannel('stayease_cross_tab_sync');
    syncChannel.onmessage = (event) => {
        if (event && event.data && event.data.type === 'DATA_UPDATED') {
            handleCrossTabSync();
        }
    };
} catch (e) {
    console.warn('BroadcastChannel not supported in this browser environment', e);
}

function notifyDataUpdated() {
    if (syncChannel) {
        try {
            syncChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
        } catch (e) {
            console.warn('Sync post error', e);
        }
    }
}

async function handleCrossTabSync() {
    if (!authState.currentUser) return;
    if (authState.currentRole === 'OWNER') {
        await loadOwnerData(true);
    } else if (authState.currentRole === 'TENANT') {
        await loadTenantData(true);
    }
}

// Background Heartbeat Polling every 2.5 seconds
setInterval(() => {
    handleCrossTabSync();
}, 2500);

// Auto-refresh when tab gains focus
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        handleCrossTabSync();
    }
});

// ==========================================
// Initialization & Tab-Isolated Session
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check sessionStorage FIRST so each browser tab has its OWN independent session
    let savedRole = sessionStorage.getItem('stayease_role');
    let savedUser = sessionStorage.getItem('stayease_user');

    // Fallback to localStorage only if sessionStorage is empty on fresh initial tab
    if (!savedRole || !savedUser) {
        savedRole = localStorage.getItem('stayease_role');
        savedUser = localStorage.getItem('stayease_user');
        if (savedRole && savedUser) {
            sessionStorage.setItem('stayease_role', savedRole);
            sessionStorage.setItem('stayease_user', savedUser);
        }
    }

    if (savedRole && savedUser) {
        try {
            authState.currentRole = savedRole;
            authState.currentUser = JSON.parse(savedUser);
            setupLoggedInUI();
        } catch (e) {
            console.error('Session load error', e);
            showAuthView();
        }
    } else {
        showAuthView();
    }
});

function handleLogoClick() {
    if (authState.currentUser) {
        if (authState.currentRole === 'OWNER') {
            showOwnerDashboard();
        } else {
            showTenantDashboard();
        }
    } else {
        showAuthView();
    }
}

// ==========================================
// Auth & View Management
// ==========================================
function setAuthRole(role) {
    authState.role = role;
    const btnOwner = document.getElementById('role-btn-owner');
    const btnTenant = document.getElementById('role-btn-tenant');
    const emailInput = document.getElementById('login-email');

    if (role === 'OWNER') {
        btnOwner.className = "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition duration-150 flex items-center justify-center space-x-2 bg-white text-blue-600 shadow-sm";
        btnTenant.className = "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition duration-150 flex items-center justify-center space-x-2 text-slate-600 hover:text-slate-900";
        emailInput.placeholder = "e.g. owner@hostel.com";
    } else {
        btnTenant.className = "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition duration-150 flex items-center justify-center space-x-2 bg-white text-emerald-600 shadow-sm";
        btnOwner.className = "flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition duration-150 flex items-center justify-center space-x-2 text-slate-600 hover:text-slate-900";
        emailInput.placeholder = "e.g. tenant@college.edu";
    }
}

function showAuthView() {
    document.getElementById('view-auth').classList.remove('hidden');
    document.getElementById('view-owner').classList.add('hidden');
    document.getElementById('view-tenant').classList.add('hidden');

    document.getElementById('header-user-info').classList.add('hidden');
    document.getElementById('header-auth-buttons').classList.remove('hidden');
}

function setupLoggedInUI() {
    document.getElementById('view-auth').classList.add('hidden');
    document.getElementById('header-auth-buttons').classList.add('hidden');

    const headerUserInfo = document.getElementById('header-user-info');
    const headerUserName = document.getElementById('header-user-name');
    const headerRoleBadge = document.getElementById('header-role-badge');

    headerUserInfo.classList.remove('hidden');
    headerUserName.textContent = authState.currentUser.name || 'User';

    if (authState.currentRole === 'OWNER') {
        headerRoleBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700';
        headerRoleBadge.textContent = 'Owner';
        showOwnerDashboard();
    } else {
        headerRoleBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700';
        headerRoleBadge.textContent = 'Tenant';
        showTenantDashboard();
    }
}

async function handleLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: authState.role })
        });
        const data = await res.json();

        if (data.success) {
            authState.currentRole = data.role;
            authState.currentUser = data.user;

            // Save in sessionStorage so THIS specific tab retains its logged-in identity without affecting other tabs
            sessionStorage.setItem('stayease_role', data.role);
            sessionStorage.setItem('stayease_user', JSON.stringify(data.user));

            showToast(data.message, 'success');
            setupLoggedInUI();
        } else {
            showToast(data.message || 'Login failed. Invalid credentials.', 'error');
        }
    } catch (err) {
        showToast('Server connection error. Please ensure backend is running.', 'error');
        console.error(err);
    }
}

function demoLogin(role) {
    setAuthRole(role);
    if (role === 'OWNER') {
        document.getElementById('login-email').value = 'owner@hostel.com';
        document.getElementById('login-password').value = 'password123';
    } else {
        document.getElementById('login-email').value = 'tenant@college.edu';
        document.getElementById('login-password').value = 'password123';
    }
    handleLogin();
}

function logout() {
    authState.currentUser = null;
    authState.currentRole = null;
    sessionStorage.removeItem('stayease_role');
    sessionStorage.removeItem('stayease_user');
    localStorage.removeItem('stayease_role');
    localStorage.removeItem('stayease_user');
    showToast('Logged out successfully.', 'info');
    showAuthView();
}

// Register Modal Logic
function toggleRegisterModal(show) {
    const modal = document.getElementById('modal-register');
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

function toggleRegFields() {
    const role = document.getElementById('reg-role').value;
    if (role === 'OWNER') {
        document.getElementById('reg-owner-fields').classList.remove('hidden');
        document.getElementById('reg-tenant-fields').classList.add('hidden');
    } else {
        document.getElementById('reg-owner-fields').classList.add('hidden');
        document.getElementById('reg-tenant-fields').classList.remove('hidden');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const role = document.getElementById('reg-role').value;
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    const endpoint = role === 'OWNER' ? `${API_BASE}/auth/register/owner` : `${API_BASE}/auth/register/tenant`;
    const payload = { name, email, phone, password };

    if (role === 'OWNER') {
        payload.hostelName = document.getElementById('reg-hostel').value.trim() || 'My PG & Hostel';
    } else {
        payload.collegeOrCompany = document.getElementById('reg-college').value.trim() || 'College Student';
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            showToast(`Account created! Welcome, ${name}`, 'success');
            toggleRegisterModal(false);

            // Automatically log in newly registered user into their own dashboard
            authState.currentRole = data.role;
            authState.currentUser = data.user;
            sessionStorage.setItem('stayease_role', data.role);
            sessionStorage.setItem('stayease_user', JSON.stringify(data.user));

            notifyDataUpdated();
            setupLoggedInUI();
        } else {
            showToast(data.message || 'Registration failed.', 'error');
        }
    } catch (err) {
        showToast('Registration network error.', 'error');
    }
}

// ==========================================
// OWNER DASHBOARD LOGIC
// ==========================================
async function showOwnerDashboard() {
    document.getElementById('view-owner').classList.remove('hidden');
    document.getElementById('view-tenant').classList.add('hidden');

    if (authState.currentUser && authState.currentUser.hostelName) {
        document.getElementById('owner-banner-hostel').textContent = authState.currentUser.hostelName;
    }

    await loadOwnerData(false);
    setOwnerTab(currentOwnerTab);
}

async function loadOwnerData(silent = false) {
    try {
        const [roomsRes, appsRes, compRes, rentRes, statsRes, tenantsRes] = await Promise.all([
            fetch(`${API_BASE}/rooms`),
            fetch(`${API_BASE}/applications`),
            fetch(`${API_BASE}/complaints`),
            fetch(`${API_BASE}/rent/payments`),
            fetch(`${API_BASE}/rent/stats`),
            fetch(`${API_BASE}/tenants`)
        ]);

        appData.rooms = await roomsRes.json();
        appData.applications = await appsRes.json();
        appData.complaints = await compRes.json();
        appData.payments = await rentRes.json();
        appData.rentStats = await statsRes.json();
        appData.tenants = await tenantsRes.json();

        updateOwnerStats();
        renderOwnerRooms();
        renderOwnerApplications();
        renderOwnerComplaints();
        renderOwnerRentTable();
        renderOwnerTenants();

        if (!silent) {
            setOwnerTab(currentOwnerTab);
        }
    } catch (err) {
        console.error('Error fetching owner data:', err);
    }
}

function updateOwnerStats() {
    const totalRooms = appData.rooms.length;
    const availableRooms = appData.rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupiedRooms = appData.rooms.filter(r => r.status === 'OCCUPIED').length;
    const openComplaints = appData.complaints.filter(c => c.status !== 'RESOLVED').length;
    const totalRent = appData.rentStats.totalCollected || 0;

    document.getElementById('stat-total-rooms').textContent = totalRooms;
    document.getElementById('stat-available-rooms').textContent = availableRooms;
    document.getElementById('stat-occupied-rooms').textContent = occupiedRooms;
    document.getElementById('stat-open-complaints').textContent = openComplaints;
    document.getElementById('stat-total-rent').textContent = `₹${totalRent.toLocaleString('en-IN')}`;

    // Update badges
    const pendingApps = appData.applications.filter(a => a.status === 'PENDING').length;
    const badgeApps = document.getElementById('badge-pending-apps');
    if (pendingApps > 0) {
        badgeApps.textContent = pendingApps;
        badgeApps.classList.remove('hidden');
    } else {
        badgeApps.classList.add('hidden');
    }

    const badgeComp = document.getElementById('badge-open-complaints');
    if (openComplaints > 0) {
        badgeComp.textContent = openComplaints;
        badgeComp.classList.remove('hidden');
    } else {
        badgeComp.classList.add('hidden');
    }
}

function setOwnerTab(tab) {
    currentOwnerTab = tab;
    const tabs = ['rooms', 'applications', 'complaints', 'rent', 'tenants'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-owner-${t}`);
        const content = document.getElementById(`owner-content-${t}`);
        if (t === tab) {
            btn.className = "py-3 px-1 border-b-2 border-blue-600 text-blue-600 flex items-center space-x-2 whitespace-nowrap font-semibold";
            content.classList.remove('hidden');
        } else {
            btn.className = "py-3 px-1 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center space-x-2 whitespace-nowrap font-semibold";
            content.classList.add('hidden');
        }
    });
}

function renderOwnerRooms() {
    const container = document.getElementById('owner-rooms-grid');
    const filter = document.getElementById('filter-room-status').value;

    let filtered = appData.rooms;
    if (filter !== 'ALL') {
        filtered = appData.rooms.filter(r => r.status === filter);
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400">
            <i class="fa-solid fa-hotel text-4xl mb-2 text-slate-300"></i>
            <p>No rooms found for this filter. Click "Add New Room" above to add one.</p>
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(room => {
        let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        let statusText = 'AVAILABLE';
        if (room.status === 'OCCUPIED') {
            badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
            statusText = 'OCCUPIED (Unavailable)';
        } else if (room.status === 'UNDER_MAINTENANCE') {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
            statusText = 'MAINTENANCE';
        }

        const tenantInfo = room.currentTenantName ? `
            <div class="mt-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-600 flex items-center justify-between">
                <span><i class="fa-solid fa-user-check text-blue-500 mr-1"></i> Tenant: <b>${escapeHTML(room.currentTenantName)}</b></span>
            </div>` : '';

        return `
            <div class="room-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div class="h-44 bg-slate-100 relative overflow-hidden">
                    <img src="${room.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'}"
                         alt="Room ${room.roomNumber}"
                         class="w-full h-full object-cover">
                    <span class="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${badgeColor} backdrop-blur-md shadow-sm">
                        ${statusText}
                    </span>
                    <span class="absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md">
                        ${escapeHTML(room.roomType)}
                    </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-baseline justify-between mb-2">
                            <h4 class="text-xl font-bold text-slate-900">Room ${escapeHTML(room.roomNumber)}</h4>
                            <span class="text-lg font-extrabold text-blue-700">₹${room.rentAmount.toLocaleString('en-IN')}<span class="text-xs font-normal text-slate-400">/mo</span></span>
                        </div>
                        <p class="text-xs text-slate-500 mb-3 line-clamp-2">${escapeHTML(room.description || 'Modern furnished hostel room with premium amenities.')}</p>
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${(room.amenities || 'Wi-Fi, Attached Bath').split(',').map(a => `<span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">${escapeHTML(a.trim())}</span>`).join('')}
                        </div>
                        ${tenantInfo}
                    </div>
                    <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                        <button onclick="handleDeleteRoom(${room.id}, '${room.roomNumber}')" class="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center space-x-1">
                            <i class="fa-solid fa-trash-can"></i>
                            <span>Delete</span>
                        </button>
                        <span class="text-xs text-slate-400">Deposit: ₹${(room.securityDeposit || 0).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderOwnerApplications() {
    const container = document.getElementById('owner-applications-list');
    if (appData.applications.length === 0) {
        container.innerHTML = `<div class="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            <i class="fa-solid fa-envelope-open text-3xl mb-2 text-slate-300"></i>
            <p>No tenant applications received yet.</p>
        </div>`;
        return;
    }

    container.innerHTML = appData.applications.map(app => {
        let badgeClass = 'bg-amber-100 text-amber-800';
        let actionButtons = '';

        if (app.status === 'PENDING') {
            actionButtons = `
                <div class="flex items-center space-x-2">
                    <button onclick="handleApproveApplication(${app.id})" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition">
                        <i class="fa-solid fa-check mr-1"></i> Approve & Assign Room
                    </button>
                    <button onclick="handleRejectApplication(${app.id})" class="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition">
                        <i class="fa-solid fa-xmark mr-1"></i> Reject
                    </button>
                </div>
            `;
        } else if (app.status === 'APPROVED') {
            badgeClass = 'bg-emerald-100 text-emerald-800';
        } else {
            badgeClass = 'bg-rose-100 text-rose-800';
        }

        return `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1">
                    <div class="flex items-center space-x-3">
                        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}">${app.status}</span>
                        <h4 class="font-bold text-slate-900">${escapeHTML(app.tenantName)}</h4>
                        <span class="text-xs text-slate-400">• Applied for Room <b>${escapeHTML(app.roomNumber)}</b> (₹${app.rentAmount.toLocaleString('en-IN')}/mo)</span>
                    </div>
                    <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">"${escapeHTML(app.message)}"</p>
                    <div class="text-[11px] text-slate-400 flex items-center space-x-3 pt-1">
                        <span><i class="fa-solid fa-envelope mr-1"></i> ${escapeHTML(app.tenantEmail)}</span>
                        <span><i class="fa-solid fa-phone mr-1"></i> ${escapeHTML(app.tenantPhone)}</span>
                        <span><i class="fa-solid fa-calendar mr-1"></i> ${escapeHTML(app.applicationDate)}</span>
                    </div>
                </div>
                ${actionButtons}
            </div>
        `;
    }).join('');
}

function renderOwnerComplaints() {
    const container = document.getElementById('owner-complaints-list');
    if (appData.complaints.length === 0) {
        container.innerHTML = `<div class="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            <i class="fa-solid fa-check-double text-3xl mb-2 text-emerald-400"></i>
            <p>No complaints filed. All systems running smooth!</p>
        </div>`;
        return;
    }

    container.innerHTML = appData.complaints.map(comp => {
        let statusBadge = 'bg-rose-100 text-rose-700';
        if (comp.status === 'IN_PROGRESS') statusBadge = 'bg-amber-100 text-amber-700';
        else if (comp.status === 'RESOLVED') statusBadge = 'bg-emerald-100 text-emerald-700';

        let prioBadge = 'bg-slate-100 text-slate-700';
        if (comp.priority === 'HIGH' || comp.priority === 'URGENT') prioBadge = 'bg-rose-50 text-rose-600 border border-rose-200';

        return `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${statusBadge}">${comp.status}</span>
                        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${prioBadge}">${comp.priority}</span>
                        <span class="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">${comp.category}</span>
                        <span class="text-xs text-slate-400">• Room ${escapeHTML(comp.roomNumber)}</span>
                    </div>
                    <span class="text-xs text-slate-400">${escapeHTML(comp.createdDate)}</span>
                </div>
                <div>
                    <h4 class="text-base font-bold text-slate-900">${escapeHTML(comp.title)}</h4>
                    <p class="text-xs text-slate-600 mt-1">${escapeHTML(comp.description)}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                        <span class="text-slate-400 block font-medium">Tenant: <b class="text-slate-700">${escapeHTML(comp.tenantName)}</b></span>
                        ${comp.ownerNotes ? `<span class="text-slate-600 mt-0.5 block">Owner Notes: <i>"${escapeHTML(comp.ownerNotes)}"</i></span>` : '<span class="text-slate-400 italic">No owner notes added yet.</span>'}
                    </div>
                    <button onclick="openResolveComplaintModal(${comp.id}, '${comp.status}', '${escapeHTML(comp.ownerNotes || '')}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow transition whitespace-nowrap">
                        <i class="fa-solid fa-pen-to-square mr-1"></i> Update Status / Notes
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderOwnerRentTable() {
    const tbody = document.getElementById('owner-rent-table-body');
    if (appData.payments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-slate-400">No rent payment records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = appData.payments.map(pay => `
        <tr class="hover:bg-slate-50/80 transition">
            <td class="p-4 font-mono text-xs text-slate-500 font-semibold">${escapeHTML(pay.transactionId)}</td>
            <td class="p-4 font-medium text-slate-800">${escapeHTML(pay.tenantName)}</td>
            <td class="p-4 text-slate-600">Room ${escapeHTML(pay.roomNumber)}</td>
            <td class="p-4 text-slate-600">${escapeHTML(pay.month)}</td>
            <td class="p-4 font-bold text-slate-900">₹${pay.amount.toLocaleString('en-IN')}</td>
            <td class="p-4"><span class="px-2 py-0.5 rounded text-xs bg-slate-100 font-medium">${escapeHTML(pay.paymentMethod)}</span></td>
            <td class="p-4 text-slate-400 text-xs">${escapeHTML(pay.paymentDate)}</td>
            <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">${pay.status}</span></td>
        </tr>
    `).join('');
}

function renderOwnerTenants() {
    const container = document.getElementById('owner-tenants-list');
    if (appData.tenants.length === 0) {
        container.innerHTML = `<div class="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 col-span-full">No registered tenants.</div>`;
        return;
    }

    container.innerHTML = appData.tenants.map(t => {
        let rentBadge = 'bg-emerald-100 text-emerald-800';
        if (t.rentStatus === 'DUE') rentBadge = 'bg-amber-100 text-amber-800';
        else if (t.rentStatus === 'OVERDUE') rentBadge = 'bg-rose-100 text-rose-800';

        return `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-slate-900 text-base">${escapeHTML(t.name)}</h4>
                        <p class="text-xs text-slate-500">${escapeHTML(t.collegeOrCompany || 'Resident')}</p>
                    </div>
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${rentBadge}">Rent: ${t.rentStatus}</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                        <span class="text-slate-400 block">Assigned Room:</span>
                        <span class="font-bold text-slate-800">${t.assignedRoomNumber ? 'Room ' + escapeHTML(t.assignedRoomNumber) : '<span class="text-amber-600 font-normal">None Assigned</span>'}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 block">Monthly Rent:</span>
                        <span class="font-bold text-blue-700">₹${(t.monthlyRent || 0).toLocaleString('en-IN')}/mo</span>
                    </div>
                </div>
                <div class="text-[11px] text-slate-400 flex items-center justify-between">
                    <span><i class="fa-solid fa-envelope mr-1"></i> ${escapeHTML(t.email)}</span>
                    <span><i class="fa-solid fa-phone mr-1"></i> ${escapeHTML(t.phone)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Owner Action Handlers
function openAddRoomModal() {
    document.getElementById('modal-add-room').classList.remove('hidden');
}

async function handleCreateRoom(e) {
    e.preventDefault();
    const payload = {
        roomNumber: document.getElementById('add-room-num').value.trim(),
        roomType: document.getElementById('add-room-type').value,
        rentAmount: parseFloat(document.getElementById('add-room-rent').value),
        securityDeposit: parseFloat(document.getElementById('add-room-deposit').value) || 0,
        status: document.getElementById('add-room-status').value,
        amenities: document.getElementById('add-room-amenities').value.trim() || 'Wi-Fi, Attached Washroom',
        description: document.getElementById('add-room-desc').value.trim() || 'Cozy modern hostel room with 24/7 power backup and high speed internet.',
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
        ownerId: authState.currentUser ? authState.currentUser.id : 1
    };

    try {
        const res = await fetch(`${API_BASE}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const created = await res.json();
        closeModal('modal-add-room');
        showToast(`Room ${created.roomNumber} created successfully! Available for tenant booking.`, 'success');
        notifyDataUpdated();
        await loadOwnerData(false);
    } catch (err) {
        showToast('Failed to create room.', 'error');
    }
}

async function handleDeleteRoom(id, roomNumber) {
    if (!confirm(`Are you sure you want to delete Room ${roomNumber}?`)) return;
    try {
        await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
        showToast(`Room ${roomNumber} deleted.`, 'info');
        notifyDataUpdated();
        await loadOwnerData(false);
    } catch (err) {
        showToast('Error deleting room.', 'error');
    }
}

async function handleApproveApplication(appId) {
    try {
        const res = await fetch(`${API_BASE}/applications/${appId}/approve`, { method: 'PUT' });
        const app = await res.json();
        showToast(`Application approved! Room ${app.roomNumber} is now OCCUPIED & unavailable in tenant listings.`, 'success');
        notifyDataUpdated();
        await loadOwnerData(false);
    } catch (err) {
        showToast('Error approving application.', 'error');
    }
}

async function handleRejectApplication(appId) {
    try {
        await fetch(`${API_BASE}/applications/${appId}/reject`, { method: 'PUT' });
        showToast('Application marked as rejected.', 'info');
        notifyDataUpdated();
        await loadOwnerData(false);
    } catch (err) {
        showToast('Error rejecting application.', 'error');
    }
}

function openResolveComplaintModal(id, status, notes) {
    document.getElementById('resolve-complaint-id').value = id;
    document.getElementById('resolve-complaint-status').value = status;
    document.getElementById('resolve-complaint-notes').value = notes || '';
    document.getElementById('modal-resolve-complaint').classList.remove('hidden');
}

async function handleUpdateComplaintStatus(e) {
    e.preventDefault();
    const id = document.getElementById('resolve-complaint-id').value;
    const status = document.getElementById('resolve-complaint-status').value;
    const ownerNotes = document.getElementById('resolve-complaint-notes').value.trim();

    try {
        await fetch(`${API_BASE}/complaints/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, ownerNotes })
        });
        closeModal('modal-resolve-complaint');
        showToast('Complaint ticket status updated successfully.', 'success');
        notifyDataUpdated();
        await loadOwnerData(false);
    } catch (err) {
        showToast('Failed to update complaint status.', 'error');
    }
}

// ==========================================
// TENANT DASHBOARD LOGIC
// ==========================================
async function showTenantDashboard() {
    document.getElementById('view-tenant').classList.remove('hidden');
    document.getElementById('view-owner').classList.add('hidden');

    if (authState.currentUser) {
        document.getElementById('tenant-banner-name').textContent = `Welcome, ${authState.currentUser.name}`;
    }

    await loadTenantData(false);
    setTenantTab(currentTenantTab);
}

async function loadTenantData(silent = false) {
    try {
        const tenantId = authState.currentUser ? authState.currentUser.id : 1;

        // Refresh profile to get real-time assigned room
        const tenantRes = await fetch(`${API_BASE}/tenants/${tenantId}`);
        const currentTenant = await tenantRes.json();
        if (currentTenant) {
            authState.currentUser = currentTenant;
            sessionStorage.setItem('stayease_user', JSON.stringify(currentTenant));
        }

        const [roomsRes, myAppsRes, myCompRes, myRentRes] = await Promise.all([
            fetch(`${API_BASE}/rooms`),
            fetch(`${API_BASE}/applications/tenant/${tenantId}`),
            fetch(`${API_BASE}/complaints/tenant/${tenantId}`),
            fetch(`${API_BASE}/rent/payments/tenant/${tenantId}`)
        ]);

        appData.rooms = await roomsRes.json();
        appData.applications = await myAppsRes.json();
        appData.complaints = await myCompRes.json();
        appData.payments = await myRentRes.json();

        updateTenantHeaderAndBadges();
        renderTenantRooms();
        renderTenantMyRoom();
        renderTenantRent();
        renderTenantComplaints();

        if (!silent) {
            setTenantTab(currentTenantTab);
        }
    } catch (err) {
        console.error('Error loading tenant data:', err);
    }
}

function updateTenantHeaderAndBadges() {
    const tenant = authState.currentUser;
    const badge = document.getElementById('tenant-room-badge');
    if (tenant && tenant.assignedRoomNumber) {
        badge.textContent = `Room ${tenant.assignedRoomNumber}`;
    } else {
        badge.textContent = `Not Assigned Yet`;
    }
}

function setTenantTab(tab) {
    currentTenantTab = tab;
    const tabs = ['rooms', 'myroom', 'rent', 'complaints'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-tenant-${t}`);
        const content = document.getElementById(`tenant-content-${t}`);
        if (t === tab) {
            btn.className = "py-3 px-1 border-b-2 border-emerald-600 text-emerald-600 flex items-center space-x-2 whitespace-nowrap font-semibold";
            content.classList.remove('hidden');
        } else {
            btn.className = "py-3 px-1 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center space-x-2 whitespace-nowrap font-semibold";
            content.classList.add('hidden');
        }
    });
}

function renderTenantRooms() {
    const container = document.getElementById('tenant-rooms-grid');
    const filter = document.getElementById('tenant-filter-room').value;

    let filtered = appData.rooms;
    if (filter === 'AVAILABLE') {
        filtered = appData.rooms.filter(r => r.status === 'AVAILABLE');
    } else if (filter === 'OCCUPIED') {
        filtered = appData.rooms.filter(r => r.status === 'OCCUPIED');
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400">
            <i class="fa-solid fa-bed text-4xl mb-2 text-slate-300"></i>
            <p>No rooms found matching the selected filter.</p>
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(room => {
        const isAvailable = room.status === 'AVAILABLE';
        let badgeColor = isAvailable ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200';
        let statusText = isAvailable ? 'AVAILABLE FOR BOOKING' : 'UNAVAILABLE / BOOKED';

        let bookButton = '';
        if (isAvailable) {
            bookButton = `
                <button onclick="openApplyRoomModal(${room.id}, '${room.roomNumber}', '${room.roomType}', ${room.rentAmount})" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-file-signature"></i>
                    <span>Apply & Book This Room</span>
                </button>
            `;
        } else {
            bookButton = `
                <button disabled class="w-full py-2.5 px-4 bg-slate-100 text-slate-400 font-semibold rounded-xl text-xs cursor-not-allowed flex items-center justify-center space-x-2 border border-slate-200">
                    <i class="fa-solid fa-lock"></i>
                    <span>Currently Unavailable</span>
                </button>
            `;
        }

        return `
            <div class="room-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                    <div class="h-44 bg-slate-100 relative overflow-hidden">
                        <img src="${room.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'}"
                             alt="Room ${room.roomNumber}"
                             class="w-full h-full object-cover">
                        <span class="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeColor} backdrop-blur-md shadow-sm">
                            ${statusText}
                        </span>
                        <span class="absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md">
                            ${escapeHTML(room.roomType)}
                        </span>
                    </div>
                    <div class="p-5">
                        <div class="flex items-baseline justify-between mb-2">
                            <h4 class="text-xl font-bold text-slate-900">Room ${escapeHTML(room.roomNumber)}</h4>
                            <span class="text-lg font-extrabold text-emerald-700">₹${room.rentAmount.toLocaleString('en-IN')}<span class="text-xs font-normal text-slate-400">/mo</span></span>
                        </div>
                        <p class="text-xs text-slate-500 mb-3 line-clamp-2">${escapeHTML(room.description || 'Furnished student room with study table and daily maintenance.')}</p>
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${(room.amenities || 'Wi-Fi, Study Desk').split(',').map(a => `<span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">${escapeHTML(a.trim())}</span>`).join('')}
                        </div>
                        <div class="text-[11px] text-slate-400 mt-2">
                            <span>Security Deposit: <b>₹${(room.securityDeposit || 0).toLocaleString('en-IN')}</b></span>
                        </div>
                    </div>
                </div>
                <div class="p-5 pt-0">
                    ${bookButton}
                </div>
            </div>
        `;
    }).join('');
}

function renderTenantMyRoom() {
    const container = document.getElementById('tenant-allocated-details');
    const tenant = authState.currentUser;

    if (tenant && tenant.assignedRoomNumber) {
        container.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-2">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">ACTIVE LEASE</span>
                    <h3 class="text-2xl font-extrabold text-slate-900">Room ${escapeHTML(tenant.assignedRoomNumber)}</h3>
                    <p class="text-xs text-slate-500">Allocated to <b>${escapeHTML(tenant.name)}</b> (${escapeHTML(tenant.collegeOrCompany || 'Student')})</p>
                    <div class="flex items-center space-x-4 pt-1 text-xs text-slate-600">
                        <span><i class="fa-solid fa-indian-rupee-sign text-emerald-600 mr-1"></i> Monthly Rent: <b>₹${(tenant.monthlyRent || 7500).toLocaleString('en-IN')}</b></span>
                        <span><i class="fa-solid fa-clock text-amber-500 mr-1"></i> Status: <b class="uppercase">${tenant.rentStatus || 'DUE'}</b></span>
                    </div>
                </div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p class="font-bold text-slate-700">Hostel Management Contact</p>
                    <p class="text-slate-500">Hostel: Shree Sai Royal PG & Hostels</p>
                    <p class="text-slate-500">Owner Helpline: +91 98765 43210</p>
                    <p class="text-slate-500">Emergency Support: 24/7 Desk</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="text-center py-6">
                <i class="fa-solid fa-house-chimney text-3xl text-slate-300 mb-2"></i>
                <h4 class="font-bold text-slate-800">No Room Allocated Yet</h4>
                <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">Please browse the "Available Room Listings" tab and apply for an available room. Once the owner approves your application, your room will show here.</p>
                <button onclick="setTenantTab('rooms')" class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition">
                    Browse Available Rooms
                </button>
            </div>
        `;
    }

    // Render applications
    const appsContainer = document.getElementById('tenant-my-applications-list');
    if (appData.applications.length === 0) {
        appsContainer.innerHTML = `<div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">No applications submitted yet.</div>`;
    } else {
        appsContainer.innerHTML = appData.applications.map(app => {
            let badge = 'bg-amber-100 text-amber-800';
            if (app.status === 'APPROVED') badge = 'bg-emerald-100 text-emerald-800';
            else if (app.status === 'REJECTED') badge = 'bg-rose-100 text-rose-800';

            return `
                <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-bold px-2 py-0.5 rounded-full ${badge}">${app.status}</span>
                            <span class="font-bold text-slate-900">Application for Room ${escapeHTML(app.roomNumber)}</span>
                        </div>
                        <p class="text-slate-500 mt-1 italic">"${escapeHTML(app.message)}"</p>
                        <span class="text-[11px] text-slate-400 mt-0.5 block">Applied on: ${escapeHTML(app.applicationDate)}</span>
                    </div>
                    <span class="font-bold text-slate-700 text-sm">₹${app.rentAmount.toLocaleString('en-IN')}/mo</span>
                </div>
            `;
        }).join('');
    }
}

function renderTenantRent() {
    const tenant = authState.currentUser;
    const rentAmount = tenant && tenant.monthlyRent ? tenant.monthlyRent : 7500;
    const rentStatus = tenant && tenant.rentStatus ? tenant.rentStatus : 'DUE';

    document.getElementById('tenant-rent-amount-display').textContent = `₹${rentAmount.toLocaleString('en-IN')}`;
    const statusPill = document.getElementById('tenant-rent-status-pill');
    const payBtn = document.getElementById('btn-pay-rent-action');

    if (rentStatus === 'PAID') {
        statusPill.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800';
        statusPill.textContent = 'PAID (All Clear)';
        payBtn.classList.add('opacity-50', 'pointer-events-none');
        payBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Rent Already Paid</span>`;
    } else {
        statusPill.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800';
        statusPill.textContent = 'DUE';
        payBtn.classList.remove('opacity-50', 'pointer-events-none');
        payBtn.innerHTML = `<i class="fa-solid fa-credit-card"></i> <span>Pay Rent Now (Digital)</span>`;
    }

    // Payment history
    const tbody = document.getElementById('tenant-rent-table-body');
    if (appData.payments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400 text-xs">No payment history yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = appData.payments.map(pay => `
        <tr class="hover:bg-slate-50/80 transition text-xs">
            <td class="p-4 font-mono text-slate-500 font-semibold">${escapeHTML(pay.transactionId)}</td>
            <td class="p-4 text-slate-700 font-medium">${escapeHTML(pay.month)}</td>
            <td class="p-4 font-bold text-slate-900">₹${pay.amount.toLocaleString('en-IN')}</td>
            <td class="p-4"><span class="px-2 py-0.5 rounded bg-slate-100 font-medium">${escapeHTML(pay.paymentMethod)}</span></td>
            <td class="p-4 text-slate-400">${escapeHTML(pay.paymentDate)}</td>
            <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">${pay.status}</span></td>
        </tr>
    `).join('');
}

function renderTenantComplaints() {
    const container = document.getElementById('tenant-complaints-list');
    if (appData.complaints.length === 0) {
        container.innerHTML = `<div class="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            <i class="fa-solid fa-hand-sparkles text-3xl mb-2 text-slate-300"></i>
            <p>No complaints submitted yet. Need maintenance? Click "File New Complaint".</p>
        </div>`;
        return;
    }

    container.innerHTML = appData.complaints.map(comp => {
        let statusBadge = 'bg-rose-100 text-rose-700';
        if (comp.status === 'IN_PROGRESS') statusBadge = 'bg-amber-100 text-amber-700';
        else if (comp.status === 'RESOLVED') statusBadge = 'bg-emerald-100 text-emerald-700';

        return `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${statusBadge}">${comp.status}</span>
                        <span class="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">${comp.category}</span>
                    </div>
                    <span class="text-xs text-slate-400">${escapeHTML(comp.createdDate)}</span>
                </div>
                <div>
                    <h4 class="text-base font-bold text-slate-900">${escapeHTML(comp.title)}</h4>
                    <p class="text-xs text-slate-600 mt-1">${escapeHTML(comp.description)}</p>
                </div>
                ${comp.ownerNotes ? `
                    <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs">
                        <span class="text-blue-800 font-bold block mb-0.5"><i class="fa-solid fa-reply mr-1"></i> Owner Response:</span>
                        <span class="text-blue-700">${escapeHTML(comp.ownerNotes)}</span>
                    </div>
                ` : `
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-400 italic">
                        Sent to Owner Dashboard. Awaiting maintenance staff response.
                    </div>
                `}
            </div>
        `;
    }).join('');
}

// Tenant Action Handlers
function openApplyRoomModal(id, roomNumber, roomType, rentAmount) {
    document.getElementById('apply-room-id').value = id;
    document.getElementById('apply-room-subtitle').textContent = `Room ${roomNumber} (${roomType})`;
    document.getElementById('apply-room-rent').textContent = `₹${rentAmount.toLocaleString('en-IN')}`;
    document.getElementById('apply-room-type').textContent = roomType;
    document.getElementById('modal-apply-room').classList.remove('hidden');
}

async function handleSubmitApplication(e) {
    e.preventDefault();
    const roomId = parseInt(document.getElementById('apply-room-id').value);
    const message = document.getElementById('apply-room-message').value.trim();
    const tenantId = authState.currentUser ? authState.currentUser.id : 1;

    try {
        const res = await fetch(`${API_BASE}/applications/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, tenantId, message })
        });
        const data = await res.json();
        closeModal('modal-apply-room');
        showToast('Room application submitted! The owner will review and approve.', 'success');

        // Broadcast to other tabs (Owner tab will receive this immediately!)
        notifyDataUpdated();

        // Refresh and switch to "My Tenancy & Applications" tab so tenant sees their pending application immediately
        await loadTenantData(true);
        setTenantTab('myroom');
    } catch (err) {
        showToast('Failed to submit application.', 'error');
    }
}

function openPayRentModal() {
    const tenant = authState.currentUser;
    const rentAmount = tenant && tenant.monthlyRent ? tenant.monthlyRent : 7500;
    const roomNum = tenant && tenant.assignedRoomNumber ? tenant.assignedRoomNumber : 'B-201';

    document.getElementById('pay-modal-amount').textContent = `₹${rentAmount.toLocaleString('en-IN')}`;
    document.getElementById('pay-modal-room').textContent = `Room ${roomNum}`;
    document.getElementById('modal-pay-rent').classList.remove('hidden');
}

async function handleDigitalPayment(e) {
    e.preventDefault();
    const tenant = authState.currentUser;
    const methodInput = document.querySelector('input[name="pay-method"]:checked');
    const paymentMethod = methodInput ? methodInput.value : 'UPI';

    const payload = {
        tenantId: tenant ? tenant.id : 1,
        amount: tenant && tenant.monthlyRent ? tenant.monthlyRent : 7500,
        month: 'October 2026',
        paymentMethod: paymentMethod
    };

    try {
        const res = await fetch(`${API_BASE}/rent/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const receipt = await res.json();
        closeModal('modal-pay-rent');
        showToast(`Rent Paid Successfully! Txn: ${receipt.transactionId}`, 'success');

        notifyDataUpdated();
        await loadTenantData(false);
    } catch (err) {
        showToast('Payment processing error.', 'error');
    }
}

function openNewComplaintModal() {
    document.getElementById('modal-file-complaint').classList.remove('hidden');
}

async function handleFileComplaint(e) {
    e.preventDefault();
    const tenant = authState.currentUser;
    const payload = {
        tenantId: tenant ? tenant.id : 1,
        category: document.getElementById('complaint-category').value,
        priority: document.getElementById('complaint-priority').value,
        title: document.getElementById('complaint-title').value.trim(),
        description: document.getElementById('complaint-desc').value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const created = await res.json();
        closeModal('modal-file-complaint');
        showToast('Complaint ticket filed! Now visible on Owner Dashboard.', 'success');

        notifyDataUpdated();
        await loadTenantData(false);
    } catch (err) {
        showToast('Error filing complaint.', 'error');
    }
}

// ==========================================
// Modal & Toast Helpers
// ==========================================
function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    let bg = 'bg-slate-900 text-white';
    let icon = 'fa-circle-info text-blue-400';
    if (type === 'success') {
        bg = 'bg-emerald-900 text-emerald-50 border border-emerald-700';
        icon = 'fa-circle-check text-emerald-400';
    } else if (type === 'error') {
        bg = 'bg-rose-900 text-rose-50 border border-rose-700';
        icon = 'fa-circle-exclamation text-rose-400';
    }

    toast.className = `toast-enter pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-medium ${bg}`;
    toast.innerHTML = `
        <i class="fa-solid ${icon} text-base"></i>
        <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
