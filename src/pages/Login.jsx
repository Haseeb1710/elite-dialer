import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Phone, Shield, Headphones, Eye, EyeOff, AlertCircle, Megaphone } from 'lucide-react';

export default function Login() {
  const { login, campaigns } = useAppStore();
  const [role, setRole] = useState(null); // null = selection screen, 'admin' or 'agent'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (role === 'agent' && !selectedCampaign) {
      setError('Please select a campaign to dial.');
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
      const result = login(username, password, role, selectedCampaign);
      if (!result.success) {
        setError(result.message);
      }
      setIsLoading(false);
    }, 800);
  };

  // Role Selection Screen
  if (!role) {
    return (
      <div style={styles.container}>
        <div style={styles.bgOrbs}>
          <div style={{ ...styles.orb, ...styles.orb1 }}></div>
          <div style={{ ...styles.orb, ...styles.orb2 }}></div>
          <div style={{ ...styles.orb, ...styles.orb3 }}></div>
        </div>
        <div style={styles.glass}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>
              <Phone size={32} color="white" />
            </div>
            <h1 style={styles.brand}>ELITE DIALER</h1>
            <p style={styles.subtitle}>Enterprise Contact Center Platform</p>
          </div>

          <p style={styles.selectText}>Select your login type</p>

          <div style={styles.roleCards}>
            <button onClick={() => setRole('admin')} style={styles.roleCard} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.3)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
              <div style={{ ...styles.roleIconWrap, background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
                <Shield size={28} color="white" />
              </div>
              <h3 style={styles.roleTitle}>Admin Login</h3>
              <p style={styles.roleDesc}>Full access to campaigns, reports, users, system settings and all admin tools</p>
            </button>

            <button onClick={() => setRole('agent')} style={styles.roleCard} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.3)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
              <div style={{ ...styles.roleIconWrap, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Headphones size={28} color="white" />
              </div>
              <h3 style={styles.roleTitle}>Agent Login</h3>
              <p style={styles.roleDesc}>Access the agent dialer screen, call controls, scripts and dispositions</p>
            </button>
          </div>

          <div style={styles.footer}>
            <span style={styles.footerText}>© 2026 Elite Dialer • v2.14</span>
          </div>
        </div>
      </div>
    );
  }

  // Login Form
  const isAdmin = role === 'admin';
  const accentColor = isAdmin ? '#2563eb' : '#10b981';
  const gradientBg = isAdmin ? 'linear-gradient(135deg, #2563eb, #1e40af)' : 'linear-gradient(135deg, #10b981, #059669)';

  return (
    <div style={styles.container}>
      <div style={styles.bgOrbs}>
        <div style={{ ...styles.orb, ...styles.orb1 }}></div>
        <div style={{ ...styles.orb, ...styles.orb2 }}></div>
        <div style={{ ...styles.orb, ...styles.orb3 }}></div>
      </div>
      <div style={{ ...styles.glass, maxWidth: '420px' }}>
        <div style={styles.logoSection}>
          <div style={{ ...styles.logoIcon, background: gradientBg }}>
            {isAdmin ? <Shield size={28} color="white" /> : <Headphones size={28} color="white" />}
          </div>
          <h1 style={styles.brand}>ELITE DIALER</h1>
          <p style={styles.subtitle}>{isAdmin ? 'Administrator Portal' : 'Agent Portal'}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isAdmin ? 'Enter admin username' : 'Enter agent ID'}
              style={{ ...styles.input, borderColor: error ? '#ef4444' : '#e2e8f0' }}
              required
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ ...styles.input, paddingRight: '48px', borderColor: error ? '#ef4444' : '#e2e8f0' }}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Campaign Selector for Agents */}
          {!isAdmin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Megaphone size={14} color="#10b981" />
                  Select Campaign
                </span>
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                style={{ ...styles.input, cursor: 'pointer', appearance: 'auto' }}
                required
              >
                <option value="">-- Choose a campaign --</option>
                {activeCampaigns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name} ({c.method})
                  </option>
                ))}
              </select>
              {selectedCampaign && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', padding: '8px 12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 500 }}>Campaign ready: {activeCampaigns.find(c => c.id === selectedCampaign)?.name}</span>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{ ...styles.submitBtn, background: gradientBg, opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? (
              <div style={styles.spinner}></div>
            ) : (
              <>{isAdmin ? 'Sign In' : 'Sign In & Start Dialing'}</>
            )}
          </button>
        </form>

        <button onClick={() => { setRole(null); setError(''); setUsername(''); setPassword(''); setSelectedCampaign(''); }} style={styles.backBtn}>
          ← Back to role selection
        </button>

        <div style={styles.footer}>
          <span style={styles.footerText}>© 2026 Elite Dialer • v2.14</span>
        </div>

        <div style={styles.credBox}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Credentials</div>
          {isAdmin ? (
            <div style={styles.credLine}><span style={{ color: '#94a3b8' }}>admin</span> / <span style={{ color: '#94a3b8' }}>admin123</span></div>
          ) : (
            <div style={styles.credLine}><span style={{ color: '#94a3b8' }}>agent1</span> / <span style={{ color: '#94a3b8' }}>agent123</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  bgOrbs: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.15,
  },
  orb1: {
    width: '600px',
    height: '600px',
    background: '#2563eb',
    top: '-200px',
    right: '-150px',
    animation: 'float 8s ease-in-out infinite',
  },
  orb2: {
    width: '400px',
    height: '400px',
    background: '#10b981',
    bottom: '-100px',
    left: '-100px',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  orb3: {
    width: '300px',
    height: '300px',
    background: '#8b5cf6',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 12s ease-in-out infinite',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 10,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
  },
  brand: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
  },
  selectText: {
    textAlign: 'center',
    fontSize: '15px',
    color: '#475569',
    marginBottom: '24px',
    fontWeight: '500',
  },
  roleCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '32px',
  },
  roleCard: {
    background: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    padding: '28px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  roleIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  roleDesc: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#f8fafc',
    color: '#0f172a',
    boxSizing: 'border-box',
  },
  passwordWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto 24px',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'color 0.2s',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  credBox: {
    marginTop: '16px',
    padding: '12px',
    background: '#f1f5f9',
    borderRadius: '10px',
    textAlign: 'center',
  },
  credLine: {
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#475569',
  },
};
