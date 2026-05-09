import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, User, CheckCircle, Bell, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

function Deliveries() {
  const { managers, apiBaseUrl } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ courier: '', recipient: '' });

  const fetchDeliveries = () => {
    setLoading(true);
    fetch(`${apiBaseUrl}/api/deliveries`)
      .then(res => res.json())
      .then(data => {
        setDeliveries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching deliveries:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (apiBaseUrl) fetchDeliveries();
  }, [apiBaseUrl]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    const newPkg = {
      id: Date.now().toString(),
      courier: formData.courier,
      recipient: formData.recipient,
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };
    
    fetch(`${apiBaseUrl}/api/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPkg)
    })
    .then(() => {
      toast.success(`Notification beamed to ${formData.recipient} successfully!`);
      fetchDeliveries();
    });
    
    setFormData({ courier: '', recipient: '' });
  };

  const markCollected = (id) => {
    fetch(`${apiBaseUrl}/api/deliveries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'collected' })
    }).then(() => fetchDeliveries());
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '6px' }}>Incoming Deliveries</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Log packages and notify employees for pickup.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Package size={20} color="var(--accent-primary)" /> Log New Package
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Courier Service</label>
              <input type="text" name="courier" className="input-field" placeholder="e.g. FedEx, Amazon, Swiggy" value={formData.courier} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Recipient (Employee)</label>
              <select name="recipient" className="input-field" style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.3)' }} value={formData.recipient} onChange={handleChange} required>
                <option value="" disabled>Select Employee</option>
                {managers.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
              <Bell size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> Notify Recipient
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="var(--success)" /> Delivery Status
            </div>
            <button onClick={fetchDeliveries} className="btn-secondary" style={{ padding: '4px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }} title="Refresh List">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading && <p style={{ color: 'var(--text-secondary)' }}>Syncing package status...</p>}
            {!loading && deliveries.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No deliveries logged.</p>}
            {deliveries.map(pkg => (
              <div key={pkg.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{pkg.courier}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>For: {pkg.recipient} • {pkg.time}</div>
                </div>
                {pkg.status === 'pending' ? (
                  <button onClick={() => markCollected(pkg.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Mark Collected</button>
                ) : (
                  <span className="badge badge-success">Collected</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deliveries;
