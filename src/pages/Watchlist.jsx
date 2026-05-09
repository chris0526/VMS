import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserX, FileText, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Watchlist() {
  const { apiBaseUrl } = useAuth();
  const [banned, setBanned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', reason: '' });

  const fetchWatchlist = () => {
    setLoading(true);
    fetch(`${apiBaseUrl}/api/watchlist`)
      .then(res => res.json())
      .then(data => {
        setBanned(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching watchlist:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (apiBaseUrl) fetchWatchlist();
  }, [apiBaseUrl]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const newBan = {
      id: Date.now().toString(),
      name: formData.name,
      reason: formData.reason || 'Not documented',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    fetch(`${apiBaseUrl}/api/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBan)
    }).then(() => {
      toast.success(`${formData.name} added to security watchlist.`);
      fetchWatchlist();
    });
    
    setFormData({ name: '', reason: '' });
  };

  const removeBan = (id) => {
    fetch(`${apiBaseUrl}/api/watchlist/${id}`, { method: 'DELETE' })
      .then(() => fetchWatchlist());
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--danger)' }}>Security Watchlist</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage restricted or banned individuals to notify guards.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--danger)' }}>
            <UserX size={20} /> Add to Watchlist
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Individual's Name</label>
              <input type="text" name="name" className="input-field" placeholder="Full Name or Description" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Reason for Restriction</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-secondary)' }}><FileText size={18} /></div>
                <input type="text" name="reason" className="input-field" style={{ paddingLeft: '44px' }} placeholder="Why is this person banned?" value={formData.reason} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'var(--danger)' }}>
              Submit Restriction
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="var(--warning)" /> Active Restrictions
            </div>
            <button onClick={fetchWatchlist} className="btn-secondary" style={{ padding: '4px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }} title="Refresh List">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </h2>
          {loading ? (
             <p style={{ color: 'var(--text-secondary)' }}>Syncing security database...</p>
          ) : banned.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No individuals currently on watchlist.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {banned.map(person => (
                <div key={person.id} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--danger)' }}>{person.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reason: {person.reason}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Added: {person.date}</div>
                  </div>
                  <button onClick={() => removeBan(person.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Pardon</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
