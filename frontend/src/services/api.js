const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData.message) errorMsg = errData.message;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // Handle void or string response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const authApi = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  registerTenant: (data) => request('/auth/register/tenant', { method: 'POST', body: JSON.stringify(data) }),
  registerOwner: (data) => request('/auth/register/owner', { method: 'POST', body: JSON.stringify(data) }),
};

export const roomsApi = {
  getAll: () => request('/rooms'),
  getAvailable: () => request('/rooms/available'),
  getById: (id) => request(`/rooms/${id}`),
  create: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
};

export const tenantsApi = {
  getAll: () => request('/tenants'),
  getById: (id) => request(`/tenants/${id}`),
};

export const applicationsApi = {
  apply: (data) => request('/applications/apply', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request('/applications'),
  getByTenant: (tenantId) => request(`/applications/tenant/${tenantId}`),
  approve: (id) => request(`/applications/${id}/approve`, { method: 'PUT' }),
  reject: (id) => request(`/applications/${id}/reject`, { method: 'PUT' }),
};

export const rentApi = {
  getPayments: () => request('/rent/payments'),
  getPaymentsByTenant: (tenantId) => request(`/rent/payments/tenant/${tenantId}`),
  pay: (data) => request('/rent/pay', { method: 'POST', body: JSON.stringify(data) }),
  getStats: () => request('/rent/stats'),
};

export const complaintsApi = {
  getAll: () => request('/complaints'),
  getByTenant: (tenantId) => request(`/complaints/tenant/${tenantId}`),
  file: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status, ownerNotes) =>
    request(`/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ownerNotes }),
    }),
};
