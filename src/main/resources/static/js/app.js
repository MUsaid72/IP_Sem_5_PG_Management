/* ===== StayEase - Hostel Management System - Shared JavaScript ===== */

const API_BASE = '';

/* ===== Toast Notification System ===== */
function initToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'success') {
    initToastContainer();
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ===== API Call Helper ===== */
async function apiCall(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body && method !== 'GET' && method !== 'DELETE') {
        options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(`${API_BASE}${url}`, options);
        if (method === 'DELETE') {
            if (response.ok) return true;
            throw new Error('Delete failed');
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error(`API Error [${method} ${url}]:`, error);
        throw error;
    }
}

/* ===== Modal Helpers ===== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function setupModalClose(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modalId);
    });
}

/* ===== Status Badge Helper ===== */
function getStatusBadge(status) {
    const statusMap = {
        'Available': 'badge-success',
        'Occupied': 'badge-danger',
        'Maintenance': 'badge-warning',
        'Applied': 'badge-primary',
        'Approved': 'badge-success',
        'Rejected': 'badge-danger',
        'Paid': 'badge-success',
        'Pending': 'badge-warning',
        'Overdue': 'badge-danger',
        'Open': 'badge-primary',
        'InProgress': 'badge-warning',
        'In Progress': 'badge-warning',
        'Resolved': 'badge-success',
    };
    const cls = statusMap[status] || 'badge-secondary';
    const displayStatus = status === 'InProgress' ? 'In Progress' : status;
    return `<span class="badge ${cls}">${displayStatus}</span>`;
}

/* ===== Date Formatting ===== */
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/* ===== Clear Form Helper ===== */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

/* ===== Set Header Date ===== */
function setHeaderDate() {
    const el = document.getElementById('headerDate');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

/* ===== OWNERS CRUD ===== */
async function loadOwners() {
    const tbody = document.getElementById('ownersTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="loading-cell"><div class="loading"><i class="fas fa-spinner"></i> Loading owners...</div></td></tr>`;
    try {
        const owners = await apiCall('/owners');
        renderOwnersTable(owners);
        updateCount('ownerCount', owners.length);
    } catch (error) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Failed to load owners. Is the server running?</td></tr>`;
        showToast('Failed to load owners', 'error');
    }
}

function renderOwnersTable(owners) {
    const tbody = document.getElementById('ownersTableBody');
    if (!owners || owners.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No owners found. Click "Add Owner" to create one.</td></tr>`;
        return;
    }
    tbody.innerHTML = owners.map(o => `
        <tr>
            <td>${o.id}</td>
            <td><strong>${escapeHtml(o.name)}</strong></td>
            <td>${escapeHtml(o.email)}</td>
            <td>${escapeHtml(o.phone)}</td>
            <td>${escapeHtml(o.address)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-warning btn-icon" onclick="editOwner(${o.id})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-danger btn-icon" onclick="deleteOwner(${o.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddOwnerModal() {
    document.getElementById('ownerModalTitle').textContent = 'Add New Owner';
    document.getElementById('ownerForm').reset();
    document.getElementById('ownerId').value = '';
    document.getElementById('ownerId').disabled = false;
    document.getElementById('ownerFormMode').value = 'add';
    openModal('ownerModal');
}

async function editOwner(id) {
    try {
        const owner = await apiCall(`/owners/${id}`);
        document.getElementById('ownerModalTitle').textContent = 'Edit Owner';
        document.getElementById('ownerId').value = owner.id;
        document.getElementById('ownerId').disabled = true;
        document.getElementById('ownerName').value = owner.name;
        document.getElementById('ownerEmail').value = owner.email;
        document.getElementById('ownerPhone').value = owner.phone;
        document.getElementById('ownerAddress').value = owner.address;
        document.getElementById('ownerFormMode').value = 'edit';
        openModal('ownerModal');
    } catch (error) {
        showToast('Failed to fetch owner details', 'error');
    }
}

async function saveOwner() {
    const mode = document.getElementById('ownerFormMode').value;
    const data = {
        id: parseInt(document.getElementById('ownerId').value),
        name: document.getElementById('ownerName').value.trim(),
        email: document.getElementById('ownerEmail').value.trim(),
        phone: document.getElementById('ownerPhone').value.trim(),
        address: document.getElementById('ownerAddress').value.trim(),
    };
    if (!data.name || !data.email || !data.phone) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    try {
        if (mode === 'edit') {
            await apiCall(`/owners/${data.id}`, 'PUT', data);
            showToast('Owner updated successfully');
        } else {
            await apiCall('/owners', 'POST', data);
            showToast('Owner added successfully');
        }
        closeModal('ownerModal');
        loadOwners();
    } catch (error) {
        showToast('Failed to save owner: ' + error.message, 'error');
    }
}

async function deleteOwner(id) {
    if (!confirm('Are you sure you want to delete this owner?')) return;
    try {
        await apiCall(`/owners/${id}`, 'DELETE');
        showToast('Owner deleted successfully');
        loadOwners();
    } catch (error) {
        showToast('Failed to delete owner', 'error');
    }
}

/* ===== ROOMS CRUD ===== */
async function loadRooms() {
    const tbody = document.getElementById('roomsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7"><div class="loading"><i class="fas fa-spinner"></i> Loading rooms...</div></td></tr>`;
    try {
        const rooms = await apiCall('/rooms');
        renderRoomsTable(rooms);
        updateCount('roomCount', rooms.length);
    } catch (error) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Failed to load rooms.</td></tr>`;
        showToast('Failed to load rooms', 'error');
    }
}

function renderRoomsTable(rooms) {
    const tbody = document.getElementById('roomsTableBody');
    if (!rooms || rooms.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No rooms found. Click "Add Room" to create one.</td></tr>`;
        return;
    }
    tbody.innerHTML = rooms.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.ownerId}</td>
            <td><strong>${escapeHtml(String(r.roomNumber))}</strong></td>
            <td><span class="badge badge-info">${r.type}</span></td>
            <td>₹${Number(r.rentAmount).toLocaleString('en-IN')}</td>
            <td>${getStatusBadge(r.status)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-warning btn-icon" onclick="editRoom(${r.id})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-danger btn-icon" onclick="deleteRoom(${r.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddRoomModal() {
    document.getElementById('roomModalTitle').textContent = 'Add New Room';
    document.getElementById('roomForm').reset();
    document.getElementById('roomId').value = '';
    document.getElementById('roomId').disabled = false;
    document.getElementById('roomFormMode').value = 'add';
    openModal('roomModal');
}

async function editRoom(id) {
    try {
        const room = await apiCall(`/rooms/${id}`);
        document.getElementById('roomModalTitle').textContent = 'Edit Room';
        document.getElementById('roomId').value = room.id;
        document.getElementById('roomId').disabled = true;
        document.getElementById('roomOwnerId').value = room.ownerId;
        document.getElementById('roomNumber').value = room.roomNumber;
        document.getElementById('roomType').value = room.type;
        document.getElementById('roomRentAmount').value = room.rentAmount;
        document.getElementById('roomStatus').value = room.status;
        document.getElementById('roomFormMode').value = 'edit';
        openModal('roomModal');
    } catch (error) {
        showToast('Failed to fetch room details', 'error');
    }
}

async function saveRoom() {
    const mode = document.getElementById('roomFormMode').value;
    const data = {
        id: parseInt(document.getElementById('roomId').value),
        ownerId: parseInt(document.getElementById('roomOwnerId').value),
        roomNumber: document.getElementById('roomNumber').value.trim(),
        type: document.getElementById('roomType').value,
        rentAmount: parseFloat(document.getElementById('roomRentAmount').value),
        status: document.getElementById('roomStatus').value,
    };
    if (!data.roomNumber || !data.rentAmount) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    try {
        if (mode === 'edit') {
            await apiCall(`/rooms/${data.id}`, 'PUT', data);
            showToast('Room updated successfully');
        } else {
            await apiCall('/rooms', 'POST', data);
            showToast('Room added successfully');
        }
        closeModal('roomModal');
        loadRooms();
    } catch (error) {
        showToast('Failed to save room: ' + error.message, 'error');
    }
}

async function deleteRoom(id) {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
        await apiCall(`/rooms/${id}`, 'DELETE');
        showToast('Room deleted successfully');
        loadRooms();
    } catch (error) {
        showToast('Failed to delete room', 'error');
    }
}

/* ===== TENANTS CRUD ===== */
async function loadTenants() {
    const tbody = document.getElementById('tenantsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="8"><div class="loading"><i class="fas fa-spinner"></i> Loading tenants...</div></td></tr>`;
    try {
        const tenants = await apiCall('/tenants');
        renderTenantsTable(tenants);
        updateCount('tenantCount', tenants.length);
    } catch (error) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">Failed to load tenants.</td></tr>`;
        showToast('Failed to load tenants', 'error');
    }
}

function renderTenantsTable(tenants) {
    const tbody = document.getElementById('tenantsTableBody');
    if (!tenants || tenants.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No tenants found. Click "Add Tenant" to create one.</td></tr>`;
        return;
    }
    tbody.innerHTML = tenants.map(t => `
        <tr>
            <td>${t.id}</td>
            <td><strong>${escapeHtml(t.name)}</strong></td>
            <td>${escapeHtml(t.email)}</td>
            <td>${escapeHtml(t.phone)}</td>
            <td>${t.roomId}</td>
            <td>${getStatusBadge(t.status)}</td>
            <td>${formatDate(t.applicationDate)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-warning btn-icon" onclick="editTenant(${t.id})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-danger btn-icon" onclick="deleteTenant(${t.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddTenantModal() {
    document.getElementById('tenantModalTitle').textContent = 'Add New Tenant';
    document.getElementById('tenantForm').reset();
    document.getElementById('tenantId').value = '';
    document.getElementById('tenantId').disabled = false;
    document.getElementById('tenantApplicationDate').value = getTodayDate();
    document.getElementById('tenantFormMode').value = 'add';
    openModal('tenantModal');
}

async function editTenant(id) {
    try {
        const tenant = await apiCall(`/tenants/${id}`);
        document.getElementById('tenantModalTitle').textContent = 'Edit Tenant';
        document.getElementById('tenantId').value = tenant.id;
        document.getElementById('tenantId').disabled = true;
        document.getElementById('tenantName').value = tenant.name;
        document.getElementById('tenantEmail').value = tenant.email;
        document.getElementById('tenantPhone').value = tenant.phone;
        document.getElementById('tenantRoomId').value = tenant.roomId;
        document.getElementById('tenantStatus').value = tenant.status;
        document.getElementById('tenantApplicationDate').value = tenant.applicationDate ? tenant.applicationDate.split('T')[0] : '';
        document.getElementById('tenantFormMode').value = 'edit';
        openModal('tenantModal');
    } catch (error) {
        showToast('Failed to fetch tenant details', 'error');
    }
}

async function saveTenant() {
    const mode = document.getElementById('tenantFormMode').value;
    const data = {
        id: parseInt(document.getElementById('tenantId').value),
        name: document.getElementById('tenantName').value.trim(),
        email: document.getElementById('tenantEmail').value.trim(),
        phone: document.getElementById('tenantPhone').value.trim(),
        roomId: parseInt(document.getElementById('tenantRoomId').value),
        status: document.getElementById('tenantStatus').value,
        applicationDate: document.getElementById('tenantApplicationDate').value,
    };
    if (!data.name || !data.email || !data.phone) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    try {
        if (mode === 'edit') {
            await apiCall(`/tenants/${data.id}`, 'PUT', data);
            showToast('Tenant updated successfully');
        } else {
            await apiCall('/tenants', 'POST', data);
            showToast('Tenant added successfully');
        }
        closeModal('tenantModal');
        loadTenants();
    } catch (error) {
        showToast('Failed to save tenant: ' + error.message, 'error');
    }
}

async function deleteTenant(id) {
    if (!confirm('Are you sure you want to delete this tenant?')) return;
    try {
        await apiCall(`/tenants/${id}`, 'DELETE');
        showToast('Tenant deleted successfully');
        loadTenants();
    } catch (error) {
        showToast('Failed to delete tenant', 'error');
    }
}

/* ===== RENT PAYMENTS CRUD ===== */
async function loadRentPayments() {
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7"><div class="loading"><i class="fas fa-spinner"></i> Loading payments...</div></td></tr>`;
    try {
        const payments = await apiCall('/rentpayments');
        renderPaymentsTable(payments);
        updateCount('paymentCount', payments.length);
    } catch (error) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Failed to load payments.</td></tr>`;
        showToast('Failed to load payments', 'error');
    }
}

function renderPaymentsTable(payments) {
    const tbody = document.getElementById('paymentsTableBody');
    if (!payments || payments.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No payments found. Click "Add Payment" to create one.</td></tr>`;
        return;
    }
    tbody.innerHTML = payments.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.tenantId}</td>
            <td><strong>₹${Number(p.amount).toLocaleString('en-IN')}</strong></td>
            <td>${escapeHtml(p.month)}</td>
            <td>${formatDate(p.paymentDate)}</td>
            <td>${getStatusBadge(p.status)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-warning btn-icon" onclick="editPayment(${p.id})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-danger btn-icon" onclick="deletePayment(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddPaymentModal() {
    document.getElementById('paymentModalTitle').textContent = 'Add New Payment';
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentId').value = '';
    document.getElementById('paymentId').disabled = false;
    document.getElementById('paymentDate').value = getTodayDate();
    document.getElementById('paymentFormMode').value = 'add';
    openModal('paymentModal');
}

async function editPayment(id) {
    try {
        const payment = await apiCall(`/rentpayments/${id}`);
        document.getElementById('paymentModalTitle').textContent = 'Edit Payment';
        document.getElementById('paymentId').value = payment.id;
        document.getElementById('paymentId').disabled = true;
        document.getElementById('paymentTenantId').value = payment.tenantId;
        document.getElementById('paymentAmount').value = payment.amount;
        document.getElementById('paymentMonth').value = payment.month;
        document.getElementById('paymentDate').value = payment.paymentDate ? payment.paymentDate.split('T')[0] : '';
        document.getElementById('paymentStatus').value = payment.status;
        document.getElementById('paymentFormMode').value = 'edit';
        openModal('paymentModal');
    } catch (error) {
        showToast('Failed to fetch payment details', 'error');
    }
}

async function savePayment() {
    const mode = document.getElementById('paymentFormMode').value;
    const data = {
        id: parseInt(document.getElementById('paymentId').value),
        tenantId: parseInt(document.getElementById('paymentTenantId').value),
        amount: parseFloat(document.getElementById('paymentAmount').value),
        month: document.getElementById('paymentMonth').value.trim(),
        paymentDate: document.getElementById('paymentDate').value,
        status: document.getElementById('paymentStatus').value,
    };
    if (!data.amount || !data.month) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    try {
        if (mode === 'edit') {
            await apiCall(`/rentpayments/${data.id}`, 'PUT', data);
            showToast('Payment updated successfully');
        } else {
            await apiCall('/rentpayments', 'POST', data);
            showToast('Payment added successfully');
        }
        closeModal('paymentModal');
        loadRentPayments();
    } catch (error) {
        showToast('Failed to save payment: ' + error.message, 'error');
    }
}

async function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    try {
        await apiCall(`/rentpayments/${id}`, 'DELETE');
        showToast('Payment deleted successfully');
        loadRentPayments();
    } catch (error) {
        showToast('Failed to delete payment', 'error');
    }
}

/* ===== COMPLAINTS CRUD ===== */
async function loadComplaints() {
    const tbody = document.getElementById('complaintsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7"><div class="loading"><i class="fas fa-spinner"></i> Loading complaints...</div></td></tr>`;
    try {
        const complaints = await apiCall('/complaints');
        renderComplaintsTable(complaints);
        updateCount('complaintCount', complaints.length);
    } catch (error) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Failed to load complaints.</td></tr>`;
        showToast('Failed to load complaints', 'error');
    }
}

function renderComplaintsTable(complaints) {
    const tbody = document.getElementById('complaintsTableBody');
    if (!complaints || complaints.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No complaints found. Click "Add Complaint" to create one.</td></tr>`;
        return;
    }
    tbody.innerHTML = complaints.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.tenantId}</td>
            <td><strong>${escapeHtml(c.title)}</strong></td>
            <td>${escapeHtml(c.description ? c.description.substring(0, 60) + (c.description.length > 60 ? '...' : '') : '')}</td>
            <td>${getStatusBadge(c.status)}</td>
            <td>${formatDate(c.createdDate)}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-warning btn-icon" onclick="editComplaint(${c.id})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-danger btn-icon" onclick="deleteComplaint(${c.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddComplaintModal() {
    document.getElementById('complaintModalTitle').textContent = 'Add New Complaint';
    document.getElementById('complaintForm').reset();
    document.getElementById('complaintId').value = '';
    document.getElementById('complaintId').disabled = false;
    document.getElementById('complaintCreatedDate').value = getTodayDate();
    document.getElementById('complaintFormMode').value = 'add';
    openModal('complaintModal');
}

async function editComplaint(id) {
    try {
        const complaint = await apiCall(`/complaints/${id}`);
        document.getElementById('complaintModalTitle').textContent = 'Edit Complaint';
        document.getElementById('complaintId').value = complaint.id;
        document.getElementById('complaintId').disabled = true;
        document.getElementById('complaintTenantId').value = complaint.tenantId;
        document.getElementById('complaintTitle').value = complaint.title;
        document.getElementById('complaintDescription').value = complaint.description;
        document.getElementById('complaintStatus').value = complaint.status;
        document.getElementById('complaintCreatedDate').value = complaint.createdDate ? complaint.createdDate.split('T')[0] : '';
        document.getElementById('complaintFormMode').value = 'edit';
        openModal('complaintModal');
    } catch (error) {
        showToast('Failed to fetch complaint details', 'error');
    }
}

async function saveComplaint() {
    const mode = document.getElementById('complaintFormMode').value;
    const data = {
        id: parseInt(document.getElementById('complaintId').value),
        tenantId: parseInt(document.getElementById('complaintTenantId').value),
        title: document.getElementById('complaintTitle').value.trim(),
        description: document.getElementById('complaintDescription').value.trim(),
        status: document.getElementById('complaintStatus').value,
        createdDate: document.getElementById('complaintCreatedDate').value,
    };
    if (!data.title || !data.description) {
        showToast('Please fill in all required fields', 'warning');
        return;
    }
    try {
        if (mode === 'edit') {
            await apiCall(`/complaints/${data.id}`, 'PUT', data);
            showToast('Complaint updated successfully');
        } else {
            await apiCall('/complaints', 'POST', data);
            showToast('Complaint added successfully');
        }
        closeModal('complaintModal');
        loadComplaints();
    } catch (error) {
        showToast('Failed to save complaint: ' + error.message, 'error');
    }
}

async function deleteComplaint(id) {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    try {
        await apiCall(`/complaints/${id}`, 'DELETE');
        showToast('Complaint deleted successfully');
        loadComplaints();
    } catch (error) {
        showToast('Failed to delete complaint', 'error');
    }
}

/* ===== Dashboard Loader ===== */
async function loadDashboard() {
    try {
        const [owners, rooms, tenants, payments, complaints] = await Promise.allSettled([
            apiCall('/owners'),
            apiCall('/rooms'),
            apiCall('/tenants'),
            apiCall('/rentpayments'),
            apiCall('/complaints'),
        ]);
        updateCount('dashOwnerCount', owners.status === 'fulfilled' ? owners.value.length : 0);
        updateCount('dashRoomCount', rooms.status === 'fulfilled' ? rooms.value.length : 0);
        updateCount('dashTenantCount', tenants.status === 'fulfilled' ? tenants.value.length : 0);
        updateCount('dashPaymentCount', payments.status === 'fulfilled' ? payments.value.length : 0);
        updateCount('dashComplaintCount', complaints.status === 'fulfilled' ? complaints.value.length : 0);

        if (rooms.status === 'fulfilled') {
            const roomList = rooms.value;
            updateCount('availableRooms', roomList.filter(r => r.status === 'Available').length);
            updateCount('occupiedRooms', roomList.filter(r => r.status === 'Occupied').length);
            updateCount('maintenanceRooms', roomList.filter(r => r.status === 'Maintenance').length);
        }

        if (payments.status === 'fulfilled') {
            const payList = payments.value;
            updateCount('paidPayments', payList.filter(p => p.status === 'Paid').length);
            updateCount('pendingPayments', payList.filter(p => p.status === 'Pending').length);
            updateCount('overduePayments', payList.filter(p => p.status === 'Overdue').length);
        }

        if (complaints.status === 'fulfilled') {
            const compList = complaints.value;
            updateCount('openComplaints', compList.filter(c => c.status === 'Open').length);
            updateCount('inProgressComplaints', compList.filter(c => c.status === 'InProgress').length);
            updateCount('resolvedComplaints', compList.filter(c => c.status === 'Resolved').length);
        }
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

/* ===== Utility ===== */
function updateCount(elementId, count) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = count;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
    setHeaderDate();
});
