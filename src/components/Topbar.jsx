import { useState, useEffect } from 'react';
import { Search, Bell, Grid, Clock, MessageSquare, LogOut, Phone, Pause, PhoneCall, TrendingUp, Timer, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Topbar() {
  const toggleDialer = useAppStore((state) => state.toggleDialer);
  const currentUser = useAppStore((state) => state.currentUser);
  const userRole = useAppStore((state) => state.userRole);
  const logout = useAppStore((state) => state.logout);
  const agentStatus = useAppStore((state) => state.agentStatus);

  const [showTimeclock, setShowTimeclock] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Live session timer
  useEffect(() => {
    const interval = setInterval(() => setSessionTime(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock agent stats (these would come from backend in production)
  const agentStats = {
    callsTaken: 23,
    callsDialed: 47,
    talkTime: 4320,   // 1h 12m in seconds
    pauseTime: 1860,  // 31m in seconds
    waitTime: 2100,   // 35m in seconds
    avgCallDuration: 188, // 3m 8s
    dispositions: { SALE: 5, NI: 8, CB: 4, NA: 6 },
  };

  return (
    <div className="topbar">
      {userRole !== 'agent' && (
        <div className="topbar-search">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Search contacts, recordings, settings..." />
        </div>
      )}

      <div className="topbar-actions">
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

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px' }}></div>

        {/* Timeclock */}
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" title="Timeclock" onClick={() => setShowTimeclock(!showTimeclock)} style={{ position: 'relative', color: showTimeclock ? 'var(--primary-blue)' : undefined, background: showTimeclock ? 'var(--secondary-blue)' : undefined }}>
            <Clock size={20} />
          </button>

          {/* Timeclock Dropdown */}
          {showTimeclock && (
            <div style={dropdownStyles.overlay} onClick={() => setShowTimeclock(false)}>
              <div style={dropdownStyles.panel} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={dropdownStyles.header}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Timer size={18} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Agent Timeclock</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{currentUser?.name}</div>
                    </div>
                  </div>
                  <button onClick={() => setShowTimeclock(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}><X size={18} /></button>
                </div>

                {/* Live Session Timer */}
                <div style={dropdownStyles.timerBox}>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Session Duration</div>
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'monospace', color: '#0f172a', letterSpacing: 2 }}>{formatTime(sessionTime)}</div>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: agentStatus === 'INCALL' ? '#10b981' : agentStatus === 'READY' ? '#2563eb' : '#f59e0b', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Status: {agentStatus}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={dropdownStyles.statsGrid}>
                  <div style={dropdownStyles.statCard}>
                    <PhoneCall size={16} color="#2563eb" />
                    <div style={dropdownStyles.statValue}>{agentStats.callsTaken}</div>
                    <div style={dropdownStyles.statLabel}>Calls Taken</div>
                  </div>
                  <div style={dropdownStyles.statCard}>
                    <Phone size={16} color="#10b981" />
                    <div style={dropdownStyles.statValue}>{agentStats.callsDialed}</div>
                    <div style={dropdownStyles.statLabel}>Calls Dialed</div>
                  </div>
                  <div style={dropdownStyles.statCard}>
                    <TrendingUp size={16} color="#8b5cf6" />
                    <div style={dropdownStyles.statValue}>{formatTime(agentStats.talkTime)}</div>
                    <div style={dropdownStyles.statLabel}>Talk Time</div>
                  </div>
                  <div style={dropdownStyles.statCard}>
                    <Pause size={16} color="#f59e0b" />
                    <div style={dropdownStyles.statValue}>{formatTime(agentStats.pauseTime)}</div>
                    <div style={dropdownStyles.statLabel}>Pause Time</div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div style={dropdownStyles.detailSection}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Session Breakdown</div>
                  <div style={dropdownStyles.detailRow}>
                    <span style={{ color: '#64748b' }}>Wait Time</span>
                    <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{formatTime(agentStats.waitTime)}</span>
                  </div>
                  <div style={dropdownStyles.detailRow}>
                    <span style={{ color: '#64748b' }}>Avg Call Duration</span>
                    <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{formatTime(agentStats.avgCallDuration)}</span>
                  </div>
                  <div style={dropdownStyles.detailRow}>
                    <span style={{ color: '#64748b' }}>Login Time</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Disposition Summary */}
                <div style={dropdownStyles.detailSection}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dispositions</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(agentStats.dispositions).map(([code, count]) => (
                      <div key={code} style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{code}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: code === 'SALE' ? '#10b981' : '#0f172a' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {userRole !== 'agent' && (
          <>
            <button className="btn-icon" title="Chat" style={{ position: 'relative' }}>
              <MessageSquare size={20} />
            </button>
            <button className="btn-icon" title="Notifications">
              <Bell size={20} />
            </button>
          </>
        )}
        <button className="btn-icon" onClick={logout} title="Logout" style={{ color: '#dc2626' }}>
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

const dropdownStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
  },
  panel: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '380px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
  },
  timerBox: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    borderBottom: '1px solid #e2e8f0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    background: '#e2e8f0',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '16px 12px',
    background: 'white',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  detailSection: {
    padding: '16px 20px',
    borderTop: '1px solid #f1f5f9',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '13px',
    borderBottom: '1px solid #f8fafc',
  },
};
