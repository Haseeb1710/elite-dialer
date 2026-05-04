import { useState } from 'react';
import { Server, Save, Plus, Trash2 } from 'lucide-react';

export default function Carriers() {
  const [carriers, setCarriers] = useState([
    {
      id: 'CARRIER_1',
      name: 'Primary SIP Trunk',
      description: 'Main outbound route via Twilio',
      protocol: 'SIP',
      serverIp: '192.168.1.100',
      active: true,
      registration: 'register => user:pass@sip.provider.com:5060',
      template: '[provider]\ntype=friend\ncontext=default\nhost=sip.provider.com\nsecret=pass\nusername=user\ndisallow=all\nallow=ulaw\nallow=alaw',
      globals: 'TRUNK_PRIMARY = SIP/provider',
      dialplan: 'exten => _91NXXNXXXXXX,1,AGI(agi://127.0.0.1:4577/call_log)\nexten => _91NXXNXXXXXX,n,Dial(${TRUNK_PRIMARY}/${EXTEN:1},,tTo)\nexten => _91NXXNXXXXXX,n,Hangup()'
    }
  ]);

  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0]);

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Carriers Management</h1>
          <p>Configure VICIdial-style SIP/IAX trunks and dialplans</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add New Carrier
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Carriers List */}
        <div className="card" style={{ padding: 0, height: 'calc(100vh - 160px)', overflowY: 'auto' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>
            Active Carriers
          </div>
          {carriers.map(c => (
            <div 
              key={c.id}
              onClick={() => setSelectedCarrier(c)}
              style={{
                padding: '16px',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: selectedCarrier?.id === c.id ? 'var(--secondary-blue)' : 'transparent',
                borderLeft: selectedCarrier?.id === c.id ? '3px solid var(--primary-blue)' : '3px solid transparent'
              }}
            >
              <div style={{ fontWeight: '500', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                {c.name}
                <span className={`badge ${c.active ? 'badge-success' : 'badge-danger'}`}>
                  {c.active ? 'Y' : 'N'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{c.id} - {c.serverIp}</div>
            </div>
          ))}
        </div>

        {/* Carrier Form */}
        {selectedCarrier && (
          <div className="card" style={{ height: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2>Edit Carrier: {selectedCarrier.id}</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
                  <Trash2 size={16} /> Delete
                </button>
                <button className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="input-group">
                <label>Carrier ID</label>
                <input type="text" className="input" defaultValue={selectedCarrier.id} />
              </div>
              <div className="input-group">
                <label>Carrier Name</label>
                <input type="text" className="input" defaultValue={selectedCarrier.name} />
              </div>
              <div className="input-group">
                <label>Protocol</label>
                <select className="input" defaultValue={selectedCarrier.protocol}>
                  <option value="SIP">SIP</option>
                  <option value="IAX2">IAX2</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div className="input-group">
                <label>Server IP</label>
                <div style={{ position: 'relative' }}>
                  <Server size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input type="text" className="input" defaultValue={selectedCarrier.serverIp} style={{ width: '100%', paddingLeft: '36px' }} />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Carrier Description</label>
              <input type="text" className="input" defaultValue={selectedCarrier.description} />
            </div>

            <div className="input-group">
              <label>Registration String</label>
              <input type="text" className="input" defaultValue={selectedCarrier.registration} placeholder="register => user:pass@host" style={{ fontFamily: 'monospace' }} />
              <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>Asterisk sip.conf format</small>
            </div>

            <div className="input-group">
              <label>Template ID / Account Entry</label>
              <textarea 
                className="input" 
                rows={8} 
                defaultValue={selectedCarrier.template}
                style={{ fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            <div className="input-group">
              <label>Globals String</label>
              <textarea 
                className="input" 
                rows={2} 
                defaultValue={selectedCarrier.globals}
                style={{ fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            <div className="input-group">
              <label>Dialplan Entry</label>
              <textarea 
                className="input" 
                rows={6} 
                defaultValue={selectedCarrier.dialplan}
                style={{ fontFamily: 'monospace', resize: 'vertical' }}
              />
              <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>Asterisk extensions.conf format</small>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
              <label style={{ fontWeight: '500' }}>Active:</label>
              <select className="input" style={{ width: '100px' }} defaultValue={selectedCarrier.active ? 'Y' : 'N'}>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
