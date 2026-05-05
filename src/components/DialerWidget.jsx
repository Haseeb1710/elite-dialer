import { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Pause, Play, Hash, Users, X, ChevronUp, ChevronDown, UserPlus, Clipboard, Delete } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function DialerWidget() {
  const { isDialerOpen, toggleDialer, activeLine, setActiveLine, lines, dialNumber, hangup, answer } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  if (!isDialerOpen) return null;

  const handleNumClick = (num) => {
    setCurrentInput(prev => prev + num);
  };

  const handleCall = () => {
    if (currentInput) {
      dialNumber(currentInput);
    }
  };

  const currentCallState = lines[activeLine];
  const isCalling = currentCallState.status !== 'idle';

  return (
    <>
      <div className={`dialer-widget animate-fade-in ${isMinimized ? 'minimized' : ''}`}>
        <div className="dialer-header" onClick={() => setIsMinimized(!isMinimized)}>
          <h3>
            <Phone size={16} /> 
            Dialer - Line {activeLine}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <X size={20} onClick={(e) => { e.stopPropagation(); toggleDialer(); }} />
          </div>
        </div>

        {!isMinimized && (
          <div className="dialer-body">
            <div className="line-tabs">
              <div 
                className={`line-tab ${activeLine === 1 ? 'active' : ''}`}
                onClick={() => setActiveLine(1)}
              >
                Line 1 {lines[1].status !== 'idle' && '📞'}
              </div>
              <div 
                className={`line-tab ${activeLine === 2 ? 'active' : ''}`}
                onClick={() => setActiveLine(2)}
              >
                Line 2 {lines[2].status !== 'idle' && '📞'}
              </div>
            </div>

            <div style={{ background: 'var(--surface-color)', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="dial-display" style={{ flex: 1 }}>
                  {isCalling ? currentCallState.number : currentInput || 'Enter Number'}
                </div>
                {!isCalling && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      title="Paste number"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          const cleaned = text.replace(/[^0-9+*#]/g, '');
                          if (cleaned) setCurrentInput(cleaned);
                        } catch (e) { /* clipboard not available */ }
                      }}
                      style={{ background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Clipboard size={16} color="#0369a1" />
                    </button>
                    <button
                      title="Backspace"
                      onClick={() => setCurrentInput(prev => prev.slice(0, -1))}
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Delete size={16} color="#dc2626" />
                    </button>
                  </div>
                )}
              </div>
              
              {isCalling && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                  {currentCallState.status === 'calling' ? 'Calling...' : 'Connected - 02:45'}
                </div>
              )}

              {!isCalling ? (
                <div className="numpad">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(num => (
                    <button key={num} className="num-btn" onClick={() => handleNumClick(num)}>
                      {num}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <button className="btn btn-secondary" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />} Mute
                  </button>
                  <button className="btn btn-secondary">
                    <Pause size={16} /> Hold
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsTransferModalOpen(true)}>
                    <UserPlus size={16} /> Transfer
                  </button>
                  <button className="btn btn-secondary">
                    <Hash size={16} /> Keypad
                  </button>
                </div>
              )}

              <div className="call-controls">
                {!isCalling ? (
                  <button className="call-btn btn-dial" onClick={handleCall}>
                    <Phone size={24} />
                  </button>
                ) : (
                  <>
                    <button className="call-btn btn-hangup" onClick={() => { hangup(activeLine); setCurrentInput(''); }}>
                      <PhoneOff size={24} />
                    </button>
                    {currentCallState.status === 'calling' && (
                      <button className="call-btn btn-dial" onClick={() => answer(activeLine)}>
                        <Play size={24} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isTransferModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-fade-in">
            <div className="modal-header">
              <h3>Transfer Call</h3>
              <button className="btn-icon" onClick={() => setIsTransferModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Select Closer or Enter Number</label>
                <input type="text" className="input" placeholder="Name or extension..." />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>Attended Transfer</button>
                <button className="btn btn-secondary" style={{ flex: 1 }}>Blind Transfer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
