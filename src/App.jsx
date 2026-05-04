import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DialerWidget from './components/DialerWidget';
import AgentScreen from './pages/AgentScreen';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Lists from './pages/Lists';
import Users from './pages/Users';
import Carriers from './pages/Carriers';
import CustomFields from './pages/CustomFields';
import Recordings from './pages/Recordings';
import Reports from './pages/Reports';
import Scripts from './pages/Scripts';
import Filters from './pages/Filters';
import Inbound from './pages/Inbound';
import UserGroups from './pages/UserGroups';
import RemoteAgents from './pages/RemoteAgents';
import AdminSettings from './pages/AdminSettings';
import './App.css';

function App() {
  const { isAuthenticated, userRole } = useAppStore();

  // Not logged in → show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Agent role → show agent-only interface
  if (userRole === 'agent') {
    return (
      <Router>
        <div className="dashboard-layout">
          <AgentSidebar />
          <div className="main-content">
            <Topbar />
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<AgentScreen />} />
                <Route path="/agent" element={<AgentScreen />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
          <DialerWidget />
        </div>
      </Router>
    );
  }

  // Admin role → full access
  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />
        
        <div className="main-content">
          <Topbar />
          
          <div className="content-wrapper">
            <Routes>
              <Route path="/agent" element={<AgentScreen />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/users" element={<Users />} />
              <Route path="/carriers" element={<Carriers />} />
              <Route path="/custom-fields" element={<CustomFields />} />
              <Route path="/recordings" element={<Recordings />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* VICIdial Admin Sections */}
              <Route path="/scripts" element={<Scripts />} />
              <Route path="/filters" element={<Filters />} />
              <Route path="/inbound" element={<Inbound />} />
              <Route path="/user-groups" element={<UserGroups />} />
              <Route path="/remote-agents" element={<RemoteAgents />} />
              <Route path="/admin" element={<AdminSettings />} />
              
              <Route path="/settings" element={<div className="content-area animate-fade-in"><h1>Settings (Coming Soon)</h1></div>} />
            </Routes>
          </div>
        </div>

        <DialerWidget />
      </div>
    </Router>
  );
}

// Minimal sidebar for agents — only shows Agent Screen link
function AgentSidebar() {
  const { currentUser, logout } = useAppStore();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <span className="logo-text">ELITE DIALER</span>
      </div>
      <nav className="sidebar-nav">
        <a href="/" className="nav-item active" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Agent Screen
        </a>
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Logged in as:</div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>{currentUser?.name}</div>
        <button onClick={logout} style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
