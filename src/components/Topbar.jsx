import { Search, Bell, Grid, Clock, MessageSquare } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Topbar() {
  const toggleDialer = useAppStore((state) => state.toggleDialer);

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
          <div className="avatar">AD</div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Admin User</span>
        </div>
      </div>
    </div>
  );
}
