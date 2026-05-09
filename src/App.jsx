import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, LogOut, Settings as SettingsIcon, ShieldCheck, Package, ShieldAlert, AlertTriangle, Briefcase, Menu, X, Gem } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import AddVisitor from './pages/AddVisitor';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Invites from './pages/Invites';
import Deliveries from './pages/Deliveries';
import Watchlist from './pages/Watchlist';
import Evacuation from './pages/Evacuation';
import Manage from './pages/Manage';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VisitorProvider } from './context/VisitorContext';
// Consolidated styles in index.css

function Navigation({ isSidebarCollapsed, setIsSidebarCollapsed }) {
  const { activeRole, logout, currentUser } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const allNavItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Add Check-In', path: '/add', icon: <PlusSquare size={20} /> },
    { name: 'Directory Logs', path: '/logs', icon: <Search size={20} /> },
    { name: 'Event Invites', path: '/invites', icon: <Briefcase size={20} /> },
    { name: 'Manage Domain', path: '/manage', icon: <ShieldCheck size={20} /> },
    { name: 'Framework Setup', path: '/settings', icon: <SettingsIcon size={20} /> }
  ];

  const filteredItems = allNavItems.filter(item => activeRole.modules.includes(item.path));

  const NavContent = () => (
    <>
      <div className={`logo-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <img src="/logo.png" alt="LKS Logo" className="app-logo" style={{ borderRadius: '6px' }} />
        {!isSidebarCollapsed && <h2 className="hide-mobile">LKS Jewellary</h2>}
        <h2 className="show-mobile">LKS Jewellary</h2>
        {isDrawerOpen && (
          <X size={24} className="show-mobile" style={{ marginLeft: 'auto', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsDrawerOpen(false)} />
        )}
      </div>
      <nav className="nav-menu">
        <div
          className="nav-item hide-mobile"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{ marginBottom: '12px', color: '#cbd5e1' }}
          title="Toggle Menu"
        >
          <Menu size={20} style={{ flexShrink: 0 }} />
          {!isSidebarCollapsed && <span>Collapse</span>}
        </div>
        {filteredItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsDrawerOpen(false)}
          >
            {item.icon}
            {!isSidebarCollapsed && <span className="hide-mobile">{item.name}</span>}
            <span className="show-mobile">{item.name}</span>
          </NavLink>
        ))}
        <div className="nav-item" onClick={logout} style={{ marginTop: 'auto', color: '#f87171' }} title="Logout">
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!isSidebarCollapsed && <span className="hide-mobile">Terminate Session</span>}
          <span className="show-mobile">Terminate Session</span>
        </div>
      </nav>
    </>
  );

  return (
    <>
      <aside className="sidebar hide-mobile">
        <NavContent />
      </aside>

      <header className="mobile-header show-mobile">
        <Menu size={28} color="#d4af37" onClick={() => setIsDrawerOpen(true)} style={{ cursor: 'pointer' }} />
        <div className="header-brand">
          <div className="header-logo-wrap">
            <img src="/logo.png" alt="LKS Logo" className="header-logo" />
          </div>
          <h2 className="header-title">LKS</h2>
        </div>
        <div style={{ width: '28px' }}></div>
      </header>

      {isDrawerOpen && <div className="drawer-overlay show-mobile" onClick={() => setIsDrawerOpen(false)}></div>}

      <div className={`drawer show-mobile ${isDrawerOpen ? 'open' : ''}`}>
        <NavContent />
      </div>
    </>
  );
}

function ProtectedRoute({ element }) {
  const { isAuthenticated, activeRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasAccess = activeRole.modules.includes(location.pathname);
  if (!hasAccess && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return element;
}

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className={isAuthenticated ? `app-container ${isSidebarCollapsed ? 'collapsed' : ''}` : ""} style={!isAuthenticated ? { height: '100vh', width: '100vw' } : {}}>
        {isAuthenticated && <Navigation isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />}
        <main className={isAuthenticated ? "main-content" : ""} style={!isAuthenticated ? { padding: 0 } : {}}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/add" element={<ProtectedRoute element={<AddVisitor />} />} />
            <Route path="/logs" element={<ProtectedRoute element={<Logs />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
            <Route path="/manage" element={<ProtectedRoute element={<Manage />} />} />
            <Route path="/invites" element={<ProtectedRoute element={<Invites />} />} />
            <Route path="/deliveries" element={<ProtectedRoute element={<Deliveries />} />} />
            <Route path="/watchlist" element={<ProtectedRoute element={<Watchlist />} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <VisitorProvider>
        <Toaster position="top-right" />
        <MainApp />
      </VisitorProvider>
    </AuthProvider>
  );
}

export default App;
