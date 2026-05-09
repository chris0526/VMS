import React, { createContext, useState, useContext, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AVAILABLE_MODULES = [
  { path: '/', name: 'Dashboard' },
  { path: '/add', name: 'Add Visitor' },
  { path: '/logs', name: 'Logs' },
  { path: '/invites', name: 'Pre-Registration' },
  { path: '/deliveries', name: 'Deliveries' },
  { path: '/watchlist', name: 'Watchlist' },
  { path: '/manage', name: 'Manage Space' },
  { path: '/settings', name: 'Settings' }
];

export function AuthProvider({ children }) {
  const defaultUsers = [
    { id: '1', name: 'Super Admin', email: 'admin@vms.com', password: 'admin', role: 'Admin', modules: ['/', '/add', '/logs', '/invites', '/deliveries', '/watchlist', '/settings'] },
    { id: '2', name: 'Front Desk Guard', email: 'guard@vms.com', password: 'guard', role: 'Guard', modules: ['/', '/add', '/logs', '/deliveries', '/watchlist'] },
    { id: '3', name: 'Deepak Sharma', email: 'deepak@vms.com', password: 'password', role: 'Manager', modules: ['/', '/logs', '/invites'] },
    { id: '4', name: 'User', email: 'user@vms.com', password: 'user123', role: 'Admin', modules: ['/', '/add', '/logs', '/invites', '/deliveries', '/watchlist', '/settings'] },
  ];

  const [users, setUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vms_current_user_v4');
    return saved ? JSON.parse(saved) : null;
  });

  const [apiBaseUrl, setApiBaseUrl] = useState(() => {
    return localStorage.getItem('vms_api_base_url') || 'http://192.168.1.56:5000';
  });

  const updateApiBaseUrl = (newUrl) => {
    const sanitized = newUrl.endsWith('/') ? newUrl.slice(0, -1) : newUrl;
    setApiBaseUrl(sanitized);
    localStorage.setItem('vms_api_base_url', sanitized);
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => {
        console.error("Error fetching users:", err);
        // If it fails, we keep the default set of users for login logic to at least try local admin
        setUsers(defaultUsers);
      });
  }, [apiBaseUrl]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vms_current_user_v4', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vms_current_user_v4');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      
      // Register for push notifications
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();
        }
      });

      PushNotifications.addListener('registration', (token) => {
        fetch(`${apiBaseUrl}/api/push-tokens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, token: token.value })
        });
      });

      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (userData) => {
    const newUser = { ...userData, id: Date.now().toString() };
    fetch(`${apiBaseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(res => res.json())
    .then(savedUser => setUsers([...users, savedUser]))
    .catch(err => console.error("Error adding user:", err));
  };

  const removeUser = (id) => {
    if (id === '1') return;
    fetch(`${apiBaseUrl}/api/users/${id}`, { method: 'DELETE' })
      .then(() => setUsers(users.filter(u => u.id !== id)))
      .catch(err => console.error("Error removing user:", err));
  };


  const activeRole = currentUser ? {
    name: currentUser.role,
    modules: currentUser.modules || []
  } : { name: 'Guest', modules: [] };

  const managers = users.filter(u => u.role === 'Manager' || u.role === 'Admin').map(u => u.name);

  return (
    <AuthContext.Provider value={{ 
      users, 
      currentUser, 
      isAuthenticated: !!currentUser,
      login, 
      logout,
      addUser,
      removeUser,
      managers,
      activeRole,
      activeRoleName: currentUser?.role || 'Guest',
      activeManagerIdentity: currentUser?.role === 'Manager' ? currentUser.name : null,
      apiBaseUrl,
      updateApiBaseUrl
    }}>
      {children}
    </AuthContext.Provider>
  );
}
