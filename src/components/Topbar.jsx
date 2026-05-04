import { Search, Bell, Grid, Clock, MessageSquare, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Topbar() {
  const toggleDialer = useAppStore((state) => state.toggleDialer);
  const currentUser = useAppStore((state) => state.currentUser);
  const userRole = useAppStore((state) => state.userRole);
  const logout = useAppStore((state) => state.logout);

  return (
    <div className="topbar">
      <div className="topbar-search">
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Search contacts, recordings, settings..." />
      </div>

      <div className="topbar-actions">
        <button className="btn-icon" title="Timeclock" style={{ position: 'relative' }}>
          <Clock size={20} />
        </button>
        <button className="btn-icon" title="Chat" style={{ position: 'relative' }}>
          <MessageSquare size={20} />
        </button>
        <button className="btn-icon" title="Notifications">
          <Bell size={20} />
        </button>
        <button className="btn btn-primary" onClick={toggleDialer}>
          <Grid size={18} />
          Open Dialer
        </button>
        <div className="user-profile">
          <div className="avatar">{currentUser?.name?.split(' ').map(n => n[0]).join('') || 'AD'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{currentUser?.name || 'Admin User'}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{userRole}</span>
          </div>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout" style={{ color: '#dc2626' }}>
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
