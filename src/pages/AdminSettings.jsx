import { useState } from 'react';
import { Settings, Server, Phone, Database, Music, Voicemail, Clock, Calendar, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TABS = ['System Info', 'Phones', 'Conferences', 'Servers', 'Music On Hold', 'Voicemail', 'System Statuses', 'Call Times', 'Shifts', 'Audio Store'];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('System Info');
  const { phones, addPhone, conferences, addConference, servers, addServer, musicOnHold, addMusicOnHold, voicemailBoxes, addVoicemailBox, systemStatuses, addSystemStatus, callTimes, addCallTime, shifts, addShift, audioFiles, addAudioFile } = useAppStore();

  const handleGenericSubmit = (e, addFn, fields) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = {};
    fields.forEach(f => { obj[f] = fd.get(f); });
    addFn(obj);
    e.target.reset();
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header"><div><h1>System Settings & Admin</h1><p>Core global settings, server configurations, and system status</p></div></div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 16px', border: 'none', background: activeTab === tab ? 'var(--primary-blue)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', borderRadius: '8px 8px 0 0', fontSize: '13px' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* System Info */}
      {activeTab === 'System Info' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', color: 'var(--primary-blue)' }}><Settings size={24} /></div><div><h3 style={{ margin: 0 }}>Global Settings</h3><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Dialer defaults, Timezones</div></div></div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', color: 'var(--success-color)' }}><Server size={24} /></div><div><h3 style={{ margin: 0 }}>Servers</h3><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage Asterisk nodes</div></div></div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', color: 'var(--warning-color)' }}><Phone size={24} /></div><div><h3 style={{ margin: 0 }}>Phones</h3><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>SIP/IAX extension configuration</div></div></div>
        </div>
        <div className="card"><h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}><Database size={18} /> System Information</h3>
          <div className="table-container"><table className="table"><tbody>
            <tr><td style={{ fontWeight: '500', width: '250px' }}>VICIdial Version</td><td>2.14-923a</td></tr>
            <tr><td style={{ fontWeight: '500' }}>Build</td><td>240708-2332</td></tr>
            <tr><td style={{ fontWeight: '500' }}>Asterisk Version</td><td>13.29.2-vici</td></tr>
            <tr><td style={{ fontWeight: '500' }}>Database Uptime</td><td>14 Days, 2 Hours</td></tr>
            <tr><td style={{ fontWeight: '500' }}>Active Sessions</td><td><span className="badge badge-success" style={{ color: 'white' }}>120 Users</span></td></tr>
          </tbody></table></div>
        </div>
      </>)}

      {/* Phones */}
      {activeTab === 'Phones' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Phone Extensions</div>
          <div className="table-container"><table className="table"><thead><tr><th>Extension</th><th>Server</th><th>Dialplan #</th><th>Voicemail</th><th>Protocol</th><th>Status</th></tr></thead>
            <tbody>{phones.map(p => (<tr key={p.extension}><td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{p.extension}</td><td>{p.server}</td><td>{p.dialplanNum}</td><td>{p.voicemail || '—'}</td><td><span className="badge badge-blue">{p.protocol}</span></td><td><span className="badge badge-success">{p.status}</span></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addPhone, ['extension', 'server', 'dialplanNum', 'voicemail', 'protocol', 'status'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add A New Phone</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Extension</label><input type="text" name="extension" className="input" required /></div>
            <div className="input-group"><label>Server IP</label><input type="text" name="server" className="input" defaultValue="10.10.10.15" /></div>
            <div className="input-group"><label>Dialplan Number</label><input type="text" name="dialplanNum" className="input" /></div>
            <div className="input-group"><label>Voicemail ID</label><input type="text" name="voicemail" className="input" /></div>
            <div className="input-group"><label>Protocol</label><select name="protocol" className="input"><option>SIP</option><option>IAX2</option></select></div>
            <div className="input-group"><label>Status</label><select name="status" className="input"><option>ACTIVE</option><option>INACTIVE</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit Phone</button></div>
        </form>
      </>)}

      {/* Conferences */}
      {activeTab === 'Conferences' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Conference Rooms</div>
          <div className="table-container"><table className="table"><thead><tr><th>Conf ID</th><th>Name</th><th>Server</th></tr></thead>
            <tbody>{conferences.map(c => (<tr key={c.id}><td style={{ fontWeight: 600 }}>{c.id}</td><td>{c.name}</td><td>{c.server}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addConference, ['id', 'name', 'server'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add Conference Room</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Conference ID</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>Server</label><input type="text" name="server" className="input" defaultValue="10.10.10.15" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* Servers */}
      {activeTab === 'Servers' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Server Listings</div>
          <div className="table-container"><table className="table"><thead><tr><th>Server IP</th><th>Name</th><th>Active</th><th>Asterisk</th><th>Channels</th><th>Uptime</th></tr></thead>
            <tbody>{servers.map(s => (<tr key={s.id}><td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{s.id}</td><td>{s.name}</td><td><span className="badge badge-success">{s.active}</span></td><td>{s.asteriskVersion}</td><td>{s.channels}</td><td>{s.uptime}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addServer, ['id', 'name', 'active', 'asteriskVersion', 'channels', 'uptime'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add Server</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Server IP</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Server Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>Active</label><select name="active" className="input"><option value="Y">Y</option><option value="N">N</option></select></div>
            <div className="input-group"><label>Asterisk Version</label><input type="text" name="asteriskVersion" className="input" defaultValue="13.29.2-vici" /></div>
            <div className="input-group"><label>Max Channels</label><input type="text" name="channels" className="input" defaultValue="120" /></div>
            <div className="input-group"><label>Uptime</label><input type="text" name="uptime" className="input" defaultValue="0 days" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* Music On Hold */}
      {activeTab === 'Music On Hold' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Music On Hold Entries</div>
          <div className="table-container"><table className="table"><thead><tr><th>MOH ID</th><th>Name</th><th>File</th></tr></thead>
            <tbody>{musicOnHold.map(m => (<tr key={m.id}><td style={{ fontWeight: 600 }}>{m.id}</td><td>{m.name}</td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{m.file}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addMusicOnHold, ['id', 'name', 'file'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add Music On Hold</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>MOH ID</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>File Name</label><input type="text" name="file" className="input" placeholder="e.g. hold_music.wav" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* Voicemail */}
      {activeTab === 'Voicemail' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Voicemail Boxes</div>
          <div className="table-container"><table className="table"><thead><tr><th>VM ID</th><th>Extension</th><th>Email</th><th>Greeting</th><th>Active</th></tr></thead>
            <tbody>{voicemailBoxes.map(v => (<tr key={v.id}><td style={{ fontWeight: 600 }}>{v.id}</td><td>{v.extension}</td><td>{v.email}</td><td>{v.greeting}</td><td><span className="badge badge-success">{v.active}</span></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addVoicemailBox, ['id', 'extension', 'email', 'greeting', 'active'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add Voicemail Box</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>VM ID</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Extension</label><input type="text" name="extension" className="input" required /></div>
            <div className="input-group"><label>Email</label><input type="email" name="email" className="input" /></div>
            <div className="input-group"><label>Greeting</label><input type="text" name="greeting" className="input" defaultValue="default" /></div>
            <div className="input-group"><label>Active</label><select name="active" className="input"><option value="Y">Y</option><option value="N">N</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* System Statuses */}
      {activeTab === 'System Statuses' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>System Status Listings</div>
          <div className="table-container"><table className="table"><thead><tr><th>Status</th><th>Name</th><th>Category</th><th>Human Answer</th><th>Selectable</th></tr></thead>
            <tbody>{systemStatuses.map(s => (<tr key={s.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{s.id}</td><td>{s.name}</td><td><span className="badge badge-blue">{s.category}</span></td><td>{s.humanAnswer}</td><td>{s.selectable}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addSystemStatus, ['id', 'name', 'category', 'humanAnswer', 'selectable'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add System Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Status Code</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Status Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>Category</label><select name="category" className="input"><option>UNDEFINED</option><option>SALE</option><option>DNC</option><option>CONTACT</option></select></div>
            <div className="input-group"><label>Human Answer</label><select name="humanAnswer" className="input"><option value="N">N</option><option value="Y">Y</option></select></div>
            <div className="input-group"><label>Selectable</label><select name="selectable" className="input"><option value="N">N</option><option value="Y">Y</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* Call Times */}
      {activeTab === 'Call Times' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Call Time Definitions</div>
          <div className="table-container"><table className="table"><thead><tr><th>Call Time ID</th><th>Name</th><th>Start</th><th>End</th><th>Days</th></tr></thead>
            <tbody>{callTimes.map(ct => (<tr key={ct.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{ct.id}</td><td>{ct.name}</td><td>{ct.start}</td><td>{ct.end}</td><td>{ct.days}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addCallTime, ['id', 'name', 'start', 'end', 'days'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add Call Time</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Call Time ID</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>Start Time</label><input type="text" name="start" className="input" placeholder="e.g. 9:00" /></div>
            <div className="input-group"><label>End Time</label><input type="text" name="end" className="input" placeholder="e.g. 17:00" /></div>
            <div className="input-group"><label>Days</label><input type="text" name="days" className="input" defaultValue="Mon-Fri" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* Shifts */}
      {activeTab === 'Shifts' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Shift Definitions</div>
          <div className="table-container"><table className="table"><thead><tr><th>Shift ID</th><th>Name</th><th>Start</th><th>End</th></tr></thead>
            <tbody>{shifts.map(s => (<tr key={s.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{s.id}</td><td>{s.name}</td><td>{s.start}</td><td>{s.end}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addShift, ['id', 'name', 'start', 'end'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Add Shift</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Shift ID</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>Start Time</label><input type="text" name="start" className="input" placeholder="e.g. 6:00" /></div>
            <div className="input-group"><label>End Time</label><input type="text" name="end" className="input" placeholder="e.g. 14:00" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* Audio Store */}
      {activeTab === 'Audio Store' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Audio File Store</div>
          <div className="table-container"><table className="table"><thead><tr><th>Audio ID</th><th>Name</th><th>File</th><th>Size</th></tr></thead>
            <tbody>{audioFiles.map(af => (<tr key={af.id}><td style={{ fontWeight: 600 }}>{af.id}</td><td>{af.name}</td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{af.file}</td><td>{af.size}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={(e) => handleGenericSubmit(e, addAudioFile, ['id', 'name', 'file', 'size'])}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>Upload Audio File</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Audio ID</label><input type="text" name="id" className="input" required /></div>
            <div className="input-group"><label>Name</label><input type="text" name="name" className="input" required /></div>
            <div className="input-group"><label>File Name</label><input type="text" name="file" className="input" placeholder="e.g. greeting.wav" /></div>
            <div className="input-group"><label>Size</label><input type="text" name="size" className="input" defaultValue="0 KB" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}
    </div>
  );
}
