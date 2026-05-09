import React, { useState, useEffect } from 'react';
import { useVisitors } from '../context/VisitorContext';
import { AlertTriangle, CheckSquare, Users } from 'lucide-react';

function Evacuation() {
  const { visitors } = useVisitors();
  
  // Only visitors currently IN the building
  const activeVisitors = visitors.filter(v => v.status === 'active');
  const [accountedFor, setAccountedFor] = useState([]);

  const toggleAccounted = (id) => {
    if (accountedFor.includes(id)) {
      setAccountedFor(accountedFor.filter(accId => accId !== id));
    } else {
      setAccountedFor([...accountedFor, id]);
    }
  };

  const accountedPercentage = activeVisitors.length > 0 
    ? Math.round((accountedFor.length / activeVisitors.length) * 100) 
    : 100;

  return (
    <div className="page-enter" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '20px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: 'var(--danger)', padding: '12px', borderRadius: '50%', display: 'flex' }}>
          <AlertTriangle size={32} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ff8a80', margin: 0 }}>Emergency Roll Call</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Use this tablet to account for all currently checked-in visitors during an evacuation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total On-Site</div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Users size={36} /> {activeVisitors.length}
          </div>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Safe / Accounted</div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: accountedPercentage === 100 ? 'var(--success)' : 'var(--warning)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <CheckSquare size={36} /> {accountedFor.length}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Visitor Roster</h2>
        {activeVisitors.length === 0 ? (
          <p style={{ color: 'var(--success)', textAlign: 'center', padding: '20px', border: '1px dashed var(--success)', borderRadius: '8px' }}>
            Building is clear. No active visitors found.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeVisitors.map(visitor => {
              const isSafe = accountedFor.includes(visitor.id);
              return (
                <div 
                  key={visitor.id} 
                  onClick={() => toggleAccounted(visitor.id)}
                  style={{ 
                    padding: '16px', background: isSafe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.3)', 
                    border: `1px solid ${isSafe ? 'var(--success)' : 'var(--panel-border)'}`, 
                    borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '4px',
                      border: `2px solid ${isSafe ? 'var(--success)' : 'var(--text-secondary)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isSafe ? 'var(--success)' : 'transparent'
                    }}>
                      {isSafe && <CheckSquare size={16} color="black" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', color: isSafe ? 'white' : 'var(--warning)' }}>{visitor.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Host: {visitor.manager} • Phone: {visitor.phone}</div>
                    </div>
                  </div>
                  {isSafe && <span className="badge badge-success">ACCOUNTED</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Evacuation;
