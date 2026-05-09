import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Gem, Mail, Lock, Globe, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

function Login() {
  const { login, apiBaseUrl, updateApiBaseUrl } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showNetworkConfig, setShowNetworkConfig] = useState(false);
  const [tempApiUrl, setTempApiUrl] = useState(apiBaseUrl);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (isForgotPassword) {
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
            to_name: formData.email,
            from_email: 'christopherjoshva99@gmail.com',
            message: `Hello! A secure password reset was requested for the MyGatePro account associated with ${formData.email}.\n\nSince this is an active prototype, your Super Admin can manually update your password in the Settings Dashboard if needed.\n\nThank you!`
          }
        })
      })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }
        setSuccessMsg(`Password reset link has been officially emailed to ${formData.email}. Please check your inbox!`);
        setTimeout(() => {
          setIsForgotPassword(false);
          setSuccessMsg('');
        }, 5000);
      })
      .catch((err) => {
        console.error('EmailJS REST Error:', err);
        setError('Email configuration error: ' + err.message);
      });
      return;
    }

    const result = login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />

      <div className="card page-enter" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '56px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(212, 175, 55, 0.1)',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '18px',
            background: 'transparent',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <img src="/logo.png" alt="LKS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 900,
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #0f172a 0%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}>
            LKS Jewellary
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 16px 0', fontWeight: 500, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
            Visitor Management System
          </p>
          <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', borderRadius: '2px', margin: '0 auto' }} />
        </div>


        {/* Server Info */}
        <div 
          onClick={() => setShowNetworkConfig(true)}
          style={{ 
            marginBottom: '32px', 
            fontSize: '0.82rem', 
            color: '#d4af37', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
            padding: '10px 16px', 
            borderRadius: '12px',
            fontWeight: 600, 
            transition: 'all 0.3s ease',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            backdropFilter: 'blur(10px)',
            ':hover': { background: 'rgba(212, 175, 55, 0.15)' }
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(212, 175, 55, 0.15)'}
          onMouseLeave={e => e.target.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))'}
        >
          <Globe size={16} /> Server: {apiBaseUrl.replace('http://', '')}
        </div>

        {showNetworkConfig && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
          }} onClick={() => setShowNetworkConfig(false)}>
            <div style={{
              width: '90%', maxWidth: '420px', background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
              padding: '32px',
              borderRadius: '16px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              zIndex: 2001
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Network Configuration</h3>
                <X size={22} style={{ cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s' }} onClick={() => setShowNetworkConfig(false)} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontWeight: 600, color: '#1e293b', marginBottom: '8px', display: 'block', fontSize: '0.9rem' }}>Backend IP Address</label>
                <input 
                  className="input-field"
                  value={tempApiUrl}
                  onChange={e => setTempApiUrl(e.target.value)}
                  placeholder="http://192.168.x.x:5000"
                  style={{ 
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    transition: 'all 0.3s ease',
                    background: '#f8fafc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d4af37';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button 
                className="btn btn-primary" 
                style={{ 
                  width: '100%',
                  padding: '12px',
                  marginTop: '20px',
                  background: 'linear-gradient(135deg, #d4af37, #e9c560)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 20px rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  updateApiBaseUrl(tempApiUrl);
                  setShowNetworkConfig(false);
                  toast.success("Connection endpoint updated!");
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 25px rgba(212, 175, 55, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.25)';
                }}
              >
                <Save size={16} /> Save & Connect
              </button>
              <p style={{ fontSize: '0.8rem', marginTop: '16px', color: '#64748b', textAlign: 'center', lineHeight: '1.5' }}>
                Enter your computer's IP address so this device can reach the backend server.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            width: '100%', padding: '14px 16px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#dc2626', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', fontWeight: 500,
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}
        
        {successMsg && (
          <div style={{ 
            width: '100%', padding: '14px 16px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.04))',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#059669', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', fontWeight: 500,
            backdropFilter: 'blur(10px)'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isForgotPassword ? (
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#1e293b', marginBottom: '10px', display: 'block', fontSize: '0.95rem' }}>Email Address for Reset</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ 
                    paddingLeft: '48px', 
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    background: '#f8fafc'
                  }}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d4af37';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                  required 
                />
              </div>
            </div>
          ) : (
            <>
              <div className="input-group">
                <label className="input-label" style={{ fontWeight: 600, color: '#1e293b', marginBottom: '10px', display: 'block', fontSize: '0.95rem' }}>Email Address</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    className="input-field" 
                    style={{ 
                      paddingLeft: '48px', 
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      background: '#f8fafc'
                    }}
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#d4af37';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="input-label" style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>Password</label>
                  <span onClick={() => setIsForgotPassword(true)} style={{ fontSize: '0.8rem', color: '#d4af37', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration = 'underline'} onMouseLeave={e => e.target.style.textDecoration = 'none'}>Forgot Password?</span>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    className="input-field" 
                    style={{ 
                      paddingLeft: '48px', 
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      background: '#f8fafc'
                    }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#d4af37';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    required 
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ 
            width: '100%', 
            padding: '16px', 
            marginTop: '8px', 
            fontSize: '1.02rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #d4af37 0%, #e9c560 100%)',
            border: 'none',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.3)';
          }}>
            {isForgotPassword ? "Send Reset Link" : "Sign In to Dashboard"}
          </button>
          
          {isForgotPassword && (
             <div style={{ textAlign: 'center', marginTop: '8px' }}>
               <span onClick={() => setIsForgotPassword(false)} style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={e => { e.target.style.color = '#d4af37'; e.target.style.textDecoration = 'underline'; }} onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.textDecoration = 'none'; }}>← Back to Login</span>
             </div>
          )}
        </form>

        {/* Footer info removed */}
      </div>
    </div>
  );
}

export default Login;
