import { useState, useEffect } from 'react';
import { PhoneOff, Play, Pause, User, MapPin, Calendar, FileText, ChevronRight, CheckCircle, Mic, MicOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function AgentScreen() {
  const { 
    agentStatus, 
    setAgentStatus, 
    currentLead, 
    simulateIncomingCall, 
    hangupAutodialer, 
    submitDisposition,
    customFieldsSetup
  } = useAppStore();

  const [dispoCode, setDispoCode] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  // Conference/Transfer State
  const [conferenceState, setConferenceState] = useState({
    closerConnected: false,
    externalConnected: false,
    dialingCloser: false,
    dialingExternal: false
  });
  // Simulate an auto-dialer connecting a call after 3 seconds of being READY
  useEffect(() => {
    let timeout;
    if (agentStatus === 'READY') {
      timeout = setTimeout(() => {
        simulateIncomingCall();
        setConferenceState({ closerConnected: false, externalConnected: false, dialingCloser: false, dialingExternal: false });
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [agentStatus, simulateIncomingCall]);

  const handleDispositionSubmit = () => {
    if (dispoCode) {
      submitDisposition(dispoCode);
      setDispoCode('');
    }
  };

  return (
    <div className="content-area animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px' }}>
      
      {/* Top Status Bar */}
      <div className="card" style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: agentStatus === 'INCALL' ? 'var(--success-color)' : agentStatus === 'READY' ? 'var(--primary-blue)' : 'var(--danger-color)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Current Status</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{agentStatus}</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.3)' }}></div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Campaign</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>TESTCAMP - B2B Sales</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {agentStatus === 'PAUSED' && (
            <button className="btn" style={{ background: 'white', color: 'var(--text-main)' }} onClick={() => setAgentStatus('READY')}>
              <Play size={16} /> Resume Auto-Dialing
            </button>
          )}
          {agentStatus === 'READY' && (
            <button className="btn" style={{ background: 'white', color: 'var(--text-main)' }} onClick={() => setAgentStatus('PAUSED')}>
              <Pause size={16} /> Pause
            </button>
          )}
          {agentStatus === 'INCALL' && (
            <>
              <button className="btn" onClick={() => setIsMuted(!isMuted)} style={{ background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }}>
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />} {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button className="btn btn-danger" onClick={hangupAutodialer} style={{ border: '2px solid white' }}>
                <PhoneOff size={16} /> End & Disposition
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, position: 'relative' }}>
        
        {/* Lead Info Panel */}
        <div className="card" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
            <User size={20} /> Lead Information
          </h2>
          
          {currentLead ? (
            <>
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label>First Name</label>
                <input type="text" className="input" defaultValue={currentLead.name.split(' ')[0]} readOnly style={{ background: 'var(--bg-color)' }} />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" className="input" defaultValue={currentLead.name.split(' ')[1] || ''} readOnly style={{ background: 'var(--bg-color)' }} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" className="input" defaultValue={currentLead.phone} readOnly style={{ background: 'var(--bg-color)', fontWeight: 'bold', color: 'var(--primary-blue)' }} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="text" className="input" defaultValue={currentLead.email} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Company</label>
                <input type="text" className="input" defaultValue={currentLead.company} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Notes</label>
                <textarea className="input" rows={4} placeholder="Agent notes here..."></textarea>
              </div>

              {/* Custom Lead Information Sections */}
              {customFieldsSetup.length > 0 && (
                <div style={{ gridColumn: '1 / -1', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', margin: 0 }}>Custom Lead Information</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admin-defined fields</p>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {customFieldsSetup.map((field) => (
                      <div key={field.id} className="input-group">
                        <label>{field.label}</label>
                        <input 
                          type="text" 
                          className="input" 
                          placeholder={`Enter ${field.label}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Conference & Transfer Controls (Appears only during call) */}
            {agentStatus === 'INCALL' && (
              <div className="card animate-slide-up" style={{ marginTop: '16px', background: 'var(--secondary-blue)', border: '1px solid var(--primary-blue)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                  <User size={18} /> Live Conference Bridge
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Stage 2: Add Closer */}
                  {!conferenceState.closerConnected ? (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setConferenceState({ ...conferenceState, dialingCloser: true });
                        setTimeout(() => setConferenceState({ ...conferenceState, closerConnected: true, dialingCloser: false }), 2000);
                      }}
                      disabled={conferenceState.dialingCloser}
                    >
                      {conferenceState.dialingCloser ? 'Dialing Closer...' : '+ Dial Closer (3-Way)'}
                    </button>
                  ) : (
                    <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '14px' }}>
                      <CheckCircle size={14} style={{ marginRight: '6px' }}/> Closer Connected
                    </div>
                  )}

                  {/* Stage 3: Closer Adds External */}
                  {conferenceState.closerConnected && !conferenceState.externalConnected ? (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setConferenceState({ ...conferenceState, dialingExternal: true });
                        setTimeout(() => setConferenceState({ ...conferenceState, externalConnected: true, dialingExternal: false }), 2000);
                      }}
                      disabled={conferenceState.dialingExternal}
                      style={{ border: '1px solid var(--primary-blue)' }}
                    >
                      {conferenceState.dialingExternal ? 'Dialing 3rd Party...' : '+ Add 3rd Party (Insurance/RE)'}
                    </button>
                  ) : conferenceState.externalConnected ? (
                    <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '14px' }}>
                      <CheckCircle size={14} style={{ marginRight: '6px' }}/> 3rd Party Connected
                    </div>
                  ) : null}

                  {/* Leave actions */}
                  {conferenceState.closerConnected && (
                    <button className="btn btn-secondary" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', marginLeft: 'auto' }} onClick={() => setConferenceState({...conferenceState, closerConnected: false, externalConnected: false})}>
                      Leave Conference Bridge
                    </button>
                  )}
                </div>
              </div>
            )}
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {agentStatus === 'READY' ? 'Waiting for next call...' : 'Agent is Paused'}
            </div>
          )}
        </div>

        {/* Script Panel */}
        <div className="card" style={{ flex: 1, background: '#f8fafc' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
            <FileText size={20} /> Campaign Script
          </h2>
          {currentLead ? (
            <div className="animate-fade-in" style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-main)' }}>
              <p>Hi, is <strong>{currentLead.name}</strong> available?</p>
              <br/>
              <p>Hello <strong>{currentLead.name}</strong>, my name is Admin from Elite Services.</p>
              <br/>
              <p>I noticed you are currently with <strong>{currentLead.company}</strong>. We are offering a new enterprise dialer solution that integrates directly with your existing infrastructure.</p>
              <br/>
              <p>Do you have a quick minute to discuss how we can improve your call center efficiency by 40%?</p>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
              Script will appear when call connects.
            </div>
          )}
        </div>

        {/* Disposition Overlay */}
        {agentStatus === 'DISPO' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div className="card animate-slide-up" style={{ width: '400px', boxShadow: 'var(--shadow-lg)', border: '2px solid var(--primary-blue)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Call Disposition</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }}>Select an outcome for this call to continue.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {['SALE - Made Sale', 'NI - Not Interested', 'CB - Call Back', 'VM - Voicemail', 'DNC - Do Not Call', 'DEC - Declined'].map(code => (
                  <button 
                    key={code} 
                    className="btn" 
                    style={{ 
                      justifyContent: 'flex-start', 
                      background: dispoCode === code ? 'var(--primary-blue)' : 'var(--bg-color)',
                      color: dispoCode === code ? 'white' : 'var(--text-main)',
                      border: '1px solid var(--border-color)'
                    }}
                    onClick={() => setDispoCode(code)}
                  >
                    {code.split(' - ')[0]}
                  </button>
                ))}
              </div>

              <button 
                className="btn btn-success" 
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                disabled={!dispoCode}
                onClick={handleDispositionSubmit}
              >
                Submit & Next Call <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
