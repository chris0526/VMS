import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const VisitorContext = createContext();

export function useVisitors() {
  return useContext(VisitorContext);
}

const DUMMY_VISITORS = [
  {
    id: 'v1001',
    name: 'Sarah Connor',
    phone: '555-010-9932',
    manager: 'Deepak Sharma',
    purpose: 'Guest',
    status: 'active',
    checkInTime: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
    checkOutTime: null,
    createdAt: new Date(Date.now() - 3605000).toISOString()
  },
  {
    id: 'v1002',
    name: 'John Smith',
    phone: '555-882-1102',
    manager: 'Super Admin',
    purpose: 'Delivery',
    status: 'checked-out',
    checkInTime: new Date(Date.now() - 7200000).toISOString(), // 2 hrs ago
    checkOutTime: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    createdAt: new Date(Date.now() - 7205000).toISOString()
  },
  {
    id: 'v1003',
    name: 'Mike Ross',
    phone: '555-334-8811',
    manager: 'Deepak Sharma',
    purpose: 'Maintenance',
    status: 'pending',
    checkInTime: null,
    checkOutTime: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'v1004',
    name: 'Harvey Specter',
    phone: '555-992-0012',
    manager: 'Deepak Sharma',
    purpose: 'Guest',
    status: 'denied',
    checkInTime: null,
    checkOutTime: null,
    createdAt: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: 'v1005',
    name: 'Alice Johnson',
    phone: '555-111-2222',
    manager: 'Super Admin',
    purpose: 'Other',
    status: 'active',
    checkInTime: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    checkOutTime: null,
    createdAt: new Date(Date.now() - 1850000).toISOString()
  }
];

export function VisitorProvider({ children }) {
  const [visitors, setVisitors] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const { apiBaseUrl } = useAuth();

  const fetchVisitors = () => {
    fetch(`${apiBaseUrl}/api/visitors`)
      .then(res => res.json())
      .then(data => setVisitors(data.map(v => ({...v, checkInTime: v.checkIn, checkOutTime: v.checkOut}))))
      .catch(err => console.error("Error fetching visitors:", err));
  };

  useEffect(() => {
    if (apiBaseUrl) {
      fetchVisitors();
    }
  }, [apiBaseUrl]);

  const addVisitor = async (visitorData) => {
    const newVisitor = {
      ...visitorData,
      id: 'v' + Date.now().toString(),
      status: 'pending',
      checkIn: null, // use 'checkIn' to match backend schema
      checkOut: null,
      createdAt: new Date().toISOString()
    };
    
    fetch(`${apiBaseUrl}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVisitor)
    }).then(() => {
      // Notify the manager
      fetch(`${apiBaseUrl}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manager_name: newVisitor.manager,
          visitor_name: newVisitor.name
        })
      }).catch(err => console.error("Notification trigger failed:", err));
      
      fetchVisitors();
    })
      .catch(err => console.error("Error adding visitor", err));
  };

  const approveVisitor = async (id) => {
    fetch(`${apiBaseUrl}/api/visitors/${id}/checkout`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkOut: null, status: 'active' })
    }).then(() => fetchVisitors());
  };

  const denyVisitor = async (id) => {
    fetch(`${apiBaseUrl}/api/visitors/${id}/checkout`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkOut: new Date().toISOString(), status: 'denied' })
    }).then(() => fetchVisitors());
  };

  const checkOutVisitor = async (id) => {
    fetch(`${apiBaseUrl}/api/visitors/${id}/checkout`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkOut: new Date().toISOString(), status: 'checked-out' })
    }).then(() => fetchVisitors());
  };

  const activeCount = visitors.filter(v => v.status === 'active').length;
  const pendingCount = visitors.filter(v => v.status === 'pending').length;

  const totalToday = visitors.filter(v => {
    if (!v.checkIn) return false;
    const today = new Date().toDateString();
    return new Date(v.checkIn).toDateString() === today;
  }).length;

  return (
    <VisitorContext.Provider value={{
      visitors, addVisitor, checkOutVisitor, approveVisitor, denyVisitor,
      activeCount, pendingCount, totalToday,
      loading
    }}>
      {children}
    </VisitorContext.Provider>
  );
}
