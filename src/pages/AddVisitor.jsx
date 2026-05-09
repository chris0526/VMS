import React, { useState, useRef, useEffect } from 'react';
import { useVisitors } from '../context/VisitorContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Phone, Briefcase, Camera, X, FlipHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

function AddVisitor() {
  const { addVisitor } = useVisitors();
  const { managers } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    manager: '',
    purpose: '',
    photoBase64: null
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      // We need to wait for the modal to render and videoRef to attach
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      toast.error("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setFormData(prev => ({ ...prev, photoBase64: dataUrl }));
      stopCamera();
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    const phoneRegex = /^\d{10}$/;
    const cleanPhone = formData.phone.replace(/[\s-()]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    
    toast.success("Visitor registered successfully!");
    addVisitor({...formData, phone: cleanPhone});
    navigate('/logs');
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="page-enter" style={{ paddingBottom: '40px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', padding: '8px', borderRadius: '10px', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <X size={22} />
        </button>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.8px', color: 'var(--primary)' }}>New Visitor Registration</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Fill in the details below to check in a visitor.</p>
        </div>
      </div>

      <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Identity Capture</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div
              style={{ width: '70px', height: '70px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #cbd5e1', cursor: 'pointer' }}
              onClick={startCamera}
            >
              {formData.photoBase64 ? (
                <img src={formData.photoBase64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Camera size={28} color="#94a3b8" />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
               <button type="button" onClick={startCamera} style={{ padding: '8px 16px', backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  {formData.photoBase64 ? 'Retake Photograph' : 'Take Photograph'}
               </button>
               <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Required for security badge</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Visitor Details</h3>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Full Legal Name</label>
            <input
              type="text" name="name" placeholder="E.g. John Smith"
              value={formData.name} onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Phone Number</label>
            <input
              type="tel" name="phone" placeholder="+1 (555) 000-0000"
              value={formData.phone} onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', color: '#0f172a' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Host / Approving Manager</label>
            <select
              name="manager" value={formData.manager} onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', color: '#0f172a', appearance: 'none' }}
            >
              <option value="" disabled>Select the authorized host</option>
              {managers.map(mgr => <option key={mgr} value={mgr}>{mgr}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Purpose of Visit</label>
            <select
              name="purpose" value={formData.purpose} onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', color: '#0f172a', appearance: 'none' }}
            >
              <option value="" disabled>Select purpose</option>
              <option value="Delivery">Delivery / Courier</option>
              <option value="Guest">Business Guest</option>
              <option value="Maintenance">Facility Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <button
            onClick={handleSubmit}
            style={{ marginTop: '8px', width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.35)', letterSpacing: '0.2px' }}
          >
            Authorize Check-In
          </button>
        </div>
      </div>

      {isCameraOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#000', zIndex: 9999, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <video 
            ref={videoRef} autoPlay playsInline 
            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', transform: isMirrored ? 'scaleX(-1)' : 'none' }} 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ position: 'absolute', bottom: '30px', display: 'flex', gap: '20px' }}>
            <button type="button" onClick={stopCamera} className="btn btn-secondary" style={{ borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={24} />
            </button>
            <button type="button" onClick={capturePhoto} className="btn btn-primary" style={{ borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={24} />
            </button>
            <button type="button" onClick={() => setIsMirrored(!isMirrored)} className="btn btn-secondary" style={{ borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlipHorizontal size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddVisitor;
