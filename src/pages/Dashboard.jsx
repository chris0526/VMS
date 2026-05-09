import React from 'react';
import { useVisitors } from '../context/VisitorContext';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, UserCheck, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { visitors, approveVisitor, denyVisitor } = useVisitors();
  const { activeRoleName, activeManagerIdentity } = useAuth();
  const navigate = useNavigate();

  const scopedVisitors = (activeRoleName === 'Admin' || activeRoleName === 'Guard' || !activeManagerIdentity) 
    ? visitors 
    : visitors.filter(v => v.manager === activeManagerIdentity);

  const scopedActiveCount = scopedVisitors.filter(v => v.status === 'active').length;
  const scopedTotalToday = scopedVisitors.filter(v => {
    const today = new Date().toDateString();
    return v.checkInTime && new Date(v.checkInTime).toDateString() === today;
  }).length;
  const scopedPendingCount = scopedVisitors.filter(v => v.status === 'pending').length;

  const recentVisitors = scopedVisitors.filter(v => v.status !== 'pending' && v.status !== 'denied').slice(0, 3);
  const pendingVisitors = scopedVisitors.filter(v => v.status === 'pending');

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Facility status update.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(14, 165, 233, 0.12)' }}>
            <Users size={32} color="#0ea5e9" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{scopedActiveCount}</div>
            <div className="stat-label">Active on site</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
            <UserCheck size={32} color="#10b981" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{scopedTotalToday}</div>
            <div className="stat-label">Total Today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
            <Clock size={32} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <div className="stat-value">{scopedPendingCount}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>
      </div>

      {pendingVisitors.length > 0 && (
        <div className="stat-card" style={{ marginTop: '32px', display: 'block', borderLeft: '5px solid #f59e0b' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#b45309' }}>Pending Approvals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingVisitors.map(visitor => (
              <div key={visitor.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', background: '#fffbeb', borderRadius: '16px',
                border: '1px solid #fef3c7', flexWrap: 'wrap', gap: '15px'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#f59e0b' }}>
                    {visitor.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{visitor.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#b45309', fontWeight: 600 }}>{visitor.purpose}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => denyVisitor(visitor.id)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #fecaca', background: 'white', color: '#ef4444' }}>
                    <XCircle size={22} />
                  </button>
                  <button onClick={() => approveVisitor(visitor.id)} style={{ padding: '12px 20px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={22} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stat-card" style={{ marginTop: '32px', display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Recent Activity</h3>
          <button
            onClick={() => navigate('/logs')}
            style={{
              background: 'none', border: 'none', color: '#d4af37',
              fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '1rem'
            }}
          >
            View All <ArrowRight size={20} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {recentVisitors.map(visitor => (
            <div key={visitor.id} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#d4af37' }}>
                  {visitor.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1e293b' }}>{visitor.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{visitor.purpose}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, padding: '6px 12px', borderRadius: '10px', background: visitor.status === 'active' ? '#dcfce7' : '#fee2e2', color: visitor.status === 'active' ? '#15803d' : '#b91c1c' }}>
                {visitor.status === 'active' ? 'IN' : 'OUT'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
