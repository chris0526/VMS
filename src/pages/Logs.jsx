import React from 'react';
import { useVisitors } from '../context/VisitorContext';
import { useAuth } from '../context/AuthContext';
import { Search, LogOut, Download } from 'lucide-react';

function Logs() {
  const { visitors, checkOutVisitor } = useVisitors();
  const { activeRoleName, activeManagerIdentity } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({ name: '', phone: '', purpose: '', date: '', status: '' });

  const scopedVisitors = (activeRoleName === 'Admin' || activeRoleName === 'Guard' || !activeManagerIdentity) 
    ? visitors 
    : visitors.filter(v => v.manager === activeManagerIdentity);

  const filteredVisitors = scopedVisitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.phone.includes(searchTerm);
    const matchesName = v.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesPhone = v.phone.includes(filters.phone);
    const matchesPurpose = filters.purpose === '' || v.purpose === filters.purpose;
    const matchesStatus = filters.status === '' || v.status === filters.status;
    const vDateStr = v.checkInTime ? new Date(v.checkInTime).toISOString().split('T')[0] : '';
    const matchesDate = filters.date === '' || vDateStr === filters.date;
    return matchesSearch && matchesName && matchesPhone && matchesPurpose && matchesStatus && matchesDate;
  });

  const exportToExcel = () => {
    const headers = ["ID", "Name", "Phone", "Purpose", "Status", "Check In Time", "Check Out Time"];
    const csvContent = [
      headers.join(","),
      ...filteredVisitors.map(v => {
        const checkIn = v.checkInTime ? new Date(v.checkInTime).toLocaleString().replace(/,/g, '') : "Pending";
        const checkOut = v.checkOutTime ? new Date(v.checkOutTime).toLocaleString().replace(/,/g, '') : "N/A";
        return [
          v.id,
          `"${v.name}"`,
          `"${v.phone}"`,
          `"${v.purpose}"`,
          v.status,
          `"${checkIn}"`,
          `"${checkOut}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `visitor_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-enter page-container" style={{ paddingBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '6px', color: 'var(--primary)' }}>Visitor Logs</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and manage all visitor entries.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '420px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', top: '10px', left: '16px', color: 'var(--text-secondary)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              className="input-field"
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px', paddingRight: '16px', paddingBottom: '10px', paddingTop: '10px', borderRadius: '30px', width: '100%' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={exportToExcel} style={{ padding: '10px 16px', borderRadius: '30px', whiteSpace: 'nowrap' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Visitor details</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Phone</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Purpose</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Date</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Check In</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>Action</th>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--panel-border)' }}>
                <th style={{ padding: '6px 18px' }}>
                  <input type="text" placeholder="Filter name..." value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} className="logs-filter-input" />
                </th>
                <th style={{ padding: '6px 18px' }}>
                  <input type="text" placeholder="Filter phone..." value={filters.phone} onChange={e => setFilters({...filters, phone: e.target.value})} className="logs-filter-input" />
                </th>
                <th style={{ padding: '6px 18px' }}>
                  <select value={filters.purpose} onChange={e => setFilters({...filters, purpose: e.target.value})} className="logs-filter-input">
                    <option value="">All</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Guest">Guest</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </th>
                <th style={{ padding: '6px 18px' }}>
                  <input type="date" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} className="logs-filter-input" />
                </th>
                <th style={{ padding: '6px 18px' }}></th>
                <th style={{ padding: '6px 18px' }}>
                  <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="logs-filter-input">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="pending">Pending</option>
                    <option value="denied">Denied</option>
                  </select>
                </th>
                <th style={{ padding: '6px 18px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map(visitor => (
                <tr key={visitor.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div 
                        style={{ 
                          width: '40px', height: '40px', borderRadius: '8px', 
                          background: '#f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                          color: '#64748b', overflow: 'hidden', cursor: visitor.photoBase64 ? 'pointer' : 'default',
                          border: '1px solid #e2e8f0', fontSize: '0.9rem'
                        }}
                        onClick={() => visitor.photoBase64 && setSelectedPhoto(visitor.photoBase64)}
                      >
                        {visitor.photoBase64 ? (
                          <img src={visitor.photoBase64} alt="Visitor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          visitor.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{visitor.name}</div>
                        {visitor.manager && <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '2px' }}>Host: {visitor.manager}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem' }}>
                    {visitor.phone}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 500 }}>{visitor.purpose}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Waiting'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${
                      visitor.status === 'active' ? 'badge-success' : 
                      visitor.status === 'checked-out' ? 'badge-warning' : 
                      visitor.status === 'denied' ? 'badge-danger' : 'badge-warning'
                    }`} style={{ 
                      backgroundColor: visitor.status === 'pending' ? 'rgba(59, 130, 246, 0.15)' : undefined, 
                      color: visitor.status === 'pending' ? 'var(--accent-primary)' : undefined 
                    }}>
                      {visitor.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {visitor.status === 'active' && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--warning)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                        onClick={() => checkOutVisitor(visitor.id)}
                      >
                        <LogOut size={14} /> Check Out
                      </button>
                    )}
                    {visitor.status === 'checked-out' && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Out: {new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVisitors.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No visitors found matching current filters.
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto} alt="Preview" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}

export default Logs;
