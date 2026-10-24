import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

// Cross-tab broadcast channel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('stayease_cross_tab_sync')
  : null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'OWNER' or 'TENANT'
  const [loading, setLoading] = useState(true);
  const [syncTrigger, setSyncTrigger] = useState(0);

  useEffect(() => {
    // Restore session from sessionStorage (tab isolated)
    let savedRole = sessionStorage.getItem('stayease_role');
    let savedUser = sessionStorage.getItem('stayease_user');

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
        setRole(savedRole);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Session parse error:', err);
      }
    }
    setLoading(false);

    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data?.type === 'DATA_UPDATED') {
          setSyncTrigger((prev) => prev + 1);
        }
      };
    }
  }, []);

  const notifyChange = () => {
    setSyncTrigger((prev) => prev + 1);
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
      } catch (_) {}
    }
  };

  const login = async (email, password, loginRole) => {
    const res = await authApi.login({ email, password, role: loginRole });
    if (res.success) {
      setUser(res.user);
      setRole(res.role);
      sessionStorage.setItem('stayease_role', res.role);
      sessionStorage.setItem('stayease_user', JSON.stringify(res.user));
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const registerTenant = async (data) => {
    const res = await authApi.registerTenant(data);
    if (res.success) {
      setUser(res.user);
      setRole('TENANT');
      sessionStorage.setItem('stayease_role', 'TENANT');
      sessionStorage.setItem('stayease_user', JSON.stringify(res.user));
      notifyChange();
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const registerOwner = async (data) => {
    const res = await authApi.registerOwner(data);
    if (res.success) {
      setUser(res.user);
      setRole('OWNER');
      sessionStorage.setItem('stayease_role', 'OWNER');
      sessionStorage.setItem('stayease_user', JSON.stringify(res.user));
      notifyChange();
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem('stayease_role');
    sessionStorage.removeItem('stayease_user');
    localStorage.removeItem('stayease_role');
    localStorage.removeItem('stayease_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        syncTrigger,
        login,
        registerTenant,
        registerOwner,
        logout,
        notifyChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
