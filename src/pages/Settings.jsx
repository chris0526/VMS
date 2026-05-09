import React, { useState, useEffect } from 'react';
import { useAuth, AVAILABLE_MODULES } from '../context/AuthContext';
import { Shield, UserPlus, X, Mail, Lock, User, Briefcase, CheckSquare, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';

function Settings() {
  const { users, addUser, removeUser, currentUser, apiBaseUrl, updateApiBaseUrl } = useAuth();
  const [newApiUrl, setNewApiUrl] = useState(apiBaseUrl);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Manager',
    modules: ['/', '/logs', '/invites'] // Default for Manager
  });

  const handleRoleChange = (e) => {
    const role = e.target.value;
    let defModules = [];
    if (role === 'Admin') defModules = AVAILABLE_MODULES.map(m => m.path);
    if (role === 'Guard') defModules = ['/', '/add', '/logs', '/deliveries', '/watchlist', '/evacuation'];
    if (role === 'Manager') defModules = ['/', '/logs', '/invites'];

    setFormData({ ...formData, role, modules: defModules });
  };

  const handleModuleToggle = (path) => {
    const hasMod = formData.modules.includes(path);
    if (hasMod) {
      // Don't let them remove Dashboard to avoid getting trapped
      if (path === '/') return;
      setFormData({ ...formData, modules: formData.modules.filter(m => m !== path) });
    } else {
      setFormData({ ...formData, modules: [...formData.modules, path] });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    if (users.find(u => u.email === formData.email)) {
      toast.error("Email already exists in system");
      return;
    }

    addUser(formData);

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_4aaxzl5',
        template_id: 'template_aw2nqnm',
        user_id: '3ZG68utdgT3EEaqhH',
        accessToken: 'tVWfhjZ_1MVw3HhluWiX9',
        template_params: {
          to_email: formData.email,
          to_name: formData.name,
          from_email: 'christopherjoshva99@gmail.com',
          message: `Welcome to LKS Jewellary VMS!\n\nYour account has been successfully provisioned.\n\nRole: ${formData.role}\nLogin ID: ${formData.email}\nPassword: ${formData.password}\n\nDownload the Android Application (APK) here: https://github.com/lks-jewellary/vms/releases/latest/download/app-debug.apk\n\nPlease install the APK and log in using the credentials above to begin.`
        }
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }
        toast.success(`System Success: A real email has been dispatched to ${formData.email} containing the APK download instructions and their secure credentials.`);
      })
      .catch((err) => {
        console.error('EmailJS REST Error:', err);
        toast.error("Email configuration error: " + err.message);
      });

    setFormData({ name: '', email: '', password: '', role: 'Manager', modules: ['/', '/logs', '/invites'] });
  };

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="page-enter card" style={{ padding: '40px', textAlign: 'center', marginTop: '20px' }}>
        <Shield size={48} color="var(--warning)" style={{ marginBottom: '15px' }} />
        <h2 style={{ marginBottom: '10px' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Only Super Administrators can access the settings module.</p>
      </div>
    );
  }

  return (
    <div className="page-enter page-container" style={{ paddingBottom: '30px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '6px', color: 'var(--primary)' }}>Framework Setup</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage users and define custom module access.</p>
      </div>
      
      <div className="card" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--accent-primary)' }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--accent-primary)' }}>
          <Globe size={20} /> Network / API Configuration
        </h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="input-label">Backend API Base URL</label>
            <input 
              type="text" 
              className="input-field" 
              value={newApiUrl} 
              onChange={(e) => setNewApiUrl(e.target.value)} 
              placeholder="http://192.168.X.X:5000"
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              updateApiBaseUrl(newApiUrl);
              toast.success("System API URL Updated Successfully!");
            }}
            style={{ padding: '12px 24px' }}
          >
            <Save size={18} /> Update Endpoint
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Current IP: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{apiBaseUrl}</span>. 
          Use this to switch between testing (192.168.11.142) and office default environments.
        </p>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <UserPlus size={20} color="var(--accent-primary)" /> Create User & Assign Rights
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-secondary)' }}><User size={18} /></div>
                <input type="text" name="name" className="input-field" style={{ paddingLeft: '44px' }} placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Login ID (Email)</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-secondary)' }}><Mail size={18} /></div>
                <input type="email" name="email" className="input-field" style={{ paddingLeft: '44px' }} placeholder="user@vms.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: '16px', color: 'var(--text-secondary)' }}><Lock size={18} /></div>
                <input type="text" name="password" className="input-field" style={{ paddingLeft: '44px' }} placeholder="Temporary password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">System Role Template</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', left: '16px', color: '#64748b' }}><Briefcase size={18} /></div>
                <select name="role" style={{ width: '100%', padding: '12px 16px', paddingLeft: '44px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', color: '#0f172a', appearance: 'none' }} value={formData.role} onChange={handleRoleChange}>
                  <option value="Manager">Manager</option>
                  <option value="Guard">Guard</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
              <CheckSquare size={16} /> Assign Accessible Area Modules
            </label>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '10px',
              background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0'
            }}>
              {AVAILABLE_MODULES.map(module => (
                <label key={module.path} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  cursor: module.path === '/' ? 'not-allowed' : 'pointer',
                  opacity: module.path === '/' ? 0.6 : 1,
                  background: 'white', padding: '8px 14px', borderRadius: '6px',
                  border: formData.modules.includes(module.path) ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(module.path)}
                    onChange={() => handleModuleToggle(module.path)}
                    disabled={module.path === '/'}
                    style={{ accentColor: '#3b82f6', width: '16px', height: '16px', margin: 0 }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: formData.modules.includes(module.path) ? 600 : 500, color: formData.modules.includes(module.path) ? '#1e293b' : '#64748b' }}>
                    {module.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 30px' }}>Create User Setup</button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Shield size={20} color="var(--success)" /> User Directory & Rights
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px', fontWeight: 500 }}>Name / Email</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Assigned Modules</th>
                <th style={{ padding: '12px', fontWeight: 500, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span className={`badge ${u.role === 'Admin' ? 'badge-warning' : u.role === 'Manager' ? 'badge-success' : 'badge-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', maxWidth: '300px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {u.modules?.map(mPath => {
                        const mObj = AVAILABLE_MODULES.find(avail => avail.path === mPath);
                        return mObj ? (
                          <span key={mPath} style={{
                            fontSize: '0.75rem', padding: '3px 8px', background: '#f1f5f9',
                            border: '1px solid #e2e8f0', borderRadius: '6px', whiteSpace: 'nowrap',
                            color: '#475569', fontWeight: 500
                          }}>
                            {mObj.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    {u.id !== '1' && (
                      <button onClick={() => removeUser(u.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Remove User">
                        <X size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Settings;
