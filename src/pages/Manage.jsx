import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShieldAlert, AlertTriangle, ChevronRight } from 'lucide-react';

function Manage() {
  const navigate = useNavigate();

  const manageModules = [
    { 
      name: 'Deliveries', 
      path: '/deliveries', 
      icon: <Package size={28} color="var(--accent-primary)" />, 
      desc: 'Log packages and notify employees for pickup' 
    },
    { 
      name: 'Watchlist', 
      path: '/watchlist', 
      icon: <ShieldAlert size={28} color="var(--warning)" />, 
      desc: 'Manage restricted or banned individuals' 
    }
  ];

  return (
    <div className="page-enter page-container" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '6px', color: 'var(--primary)' }}>Manage Domain</h1>
        <p style={{ color: 'var(--text-muted)' }}>Access facility logistics and security protocols.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {manageModules.map((module) => (
           <div 
             key={module.name}
             onClick={() => navigate(module.path)}
             className="manage-card"
           >
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ 
                 width: '52px', height: '52px', borderRadius: '12px', 
                 background: '#f8fafc', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center'
               }}>
                 {module.icon}
               </div>
               <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{module.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>{module.desc}</p>
               </div>
             </div>
             <ChevronRight color="var(--text-muted)" />
           </div>
        ))}
      </div>
    </div>
  );
}

export default Manage;
