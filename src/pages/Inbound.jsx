import { useState } from 'react';
import { PhoneIncoming, Plus, Phone, Hash, Filter } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TABS = ['In-Groups', 'DIDs', 'Call Menus', 'Filter Phone Groups'];

export default function Inbound() {
  const { inboundGroups, addInboundGroup, dids, addDid, callMenus, addCallMenu, filterPhoneGroups, addFilterPhoneGroup } = useAppStore();
  const [activeTab, setActiveTab] = useState('In-Groups');

  const handleInboundSubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); addInboundGroup({ id: fd.get('id'), name: fd.get('name'), color: fd.get('color'), active: fd.get('active') }); e.target.reset(); };
  const handleDidSubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); addDid({ id: fd.get('id'), description: fd.get('description'), carrier: fd.get('carrier'), active: fd.get('active'), group: fd.get('group'), route: fd.get('route'), recording: fd.get('recording') }); e.target.reset(); };
  const handleMenuSubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); addCallMenu({ id: fd.get('id'), name: fd.get('name'), prompt: fd.get('prompt'), timeout: parseInt(fd.get('timeout'), 10), timeoutPrompt: fd.get('timeoutPrompt') }); e.target.reset(); };
  const handleFpgSubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); addFilterPhoneGroup({ id: fd.get('id'), name: fd.get('name'), description: fd.get('description') }); e.target.reset(); };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><h1>Inbound Management</h1><p>Configure In-Groups, DIDs, Call Menus (IVR), and Filter Phone Groups</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary"><Plus size={18} /> Add DID</button>
          <button className="btn btn-primary"><Plus size={18} /> Add Inbound Group</button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ flex: 1, borderLeft: '4px solid var(--primary-blue)' }}><h3>In-Groups</h3><h2 style={{ fontSize: '28px', marginTop: '8px' }}>{inboundGroups.length}</h2></div>
        <div className="card" style={{ flex: 1, borderLeft: '4px solid var(--success-color)' }}><h3>Active DIDs</h3><h2 style={{ fontSize: '28px', marginTop: '8px' }}>{dids.length}</h2></div>
        <div className="card" style={{ flex: 1, borderLeft: '4px solid var(--warning-color)' }}><h3>Call Menus</h3><h2 style={{ fontSize: '28px', marginTop: '8px' }}>{callMenus.length}</h2></div>
        <div className="card" style={{ flex: 1, borderLeft: '4px solid var(--danger-color)' }}><h3>Filter Phone Groups</h3><h2 style={{ fontSize: '28px', marginTop: '8px' }}>{filterPhoneGroups.length}</h2></div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', border: 'none', background: activeTab === tab ? 'var(--primary-blue)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', borderRadius: '8px 8px 0 0', fontSize: '14px' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* TAB: In-Groups */}
      {activeTab === 'In-Groups' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Inbound Group Listings</div>
          <div className="table-container"><table className="table"><thead><tr><th>Group ID</th><th>Group Name</th><th>Color</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>{inboundGroups.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No In-Groups configured.</td></tr> : inboundGroups.map(g => (<tr key={g.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{g.id}</td><td>{g.name}</td><td><span style={{ display: 'inline-block', width: 16, height: 16, background: g.color || '#ccc', borderRadius: 4, verticalAlign: 'middle' }}></span> {g.color}</td><td><span className={`badge ${g.active === 'Y' ? 'badge-success' : 'badge-danger'}`}>{g.active}</span></td><td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }}>Modify</button></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleInboundSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><PhoneIncoming size={20} /> Add A New In-Group</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Group ID</label><input type="text" name="id" className="input" placeholder="e.g. SALESLINE" required /></div>
            <div className="input-group"><label>Group Name</label><input type="text" name="name" className="input" placeholder="e.g. Main Sales Queue" required /></div>
            <div className="input-group"><label>Group Color</label><input type="text" name="color" className="input" placeholder="e.g. #FF0000" /></div>
            <div className="input-group"><label>Active</label><select name="active" className="input" defaultValue="Y"><option value="Y">Y - Yes</option><option value="N">N - No</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit In-Group</button></div>
        </form>
      </>)}

      {/* TAB: DIDs */}
      {activeTab === 'DIDs' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Inbound DID Listings</div>
          <div className="table-container"><table className="table"><thead><tr><th>#</th><th>DID</th><th>Description</th><th>Carrier</th><th>Active</th><th>Admin Group</th><th>Route</th><th>Rec</th><th>Actions</th></tr></thead>
            <tbody>{dids.map((d, i) => (<tr key={d.id}><td>{i + 1}</td><td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{d.id}</td><td>{d.description}</td><td>{d.carrier || '—'}</td><td><span className={`badge ${d.active === 'Y' ? 'badge-success' : 'badge-danger'}`}>{d.active}</span></td><td>{d.group}</td><td><span className="badge badge-blue">{d.route}</span></td><td>{d.recording}</td><td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }}>Modify</button></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleDidSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Phone size={20} /> Add A New DID</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>DID Extension</label><input type="text" name="id" className="input" placeholder="e.g. 12025551234" required /></div>
            <div className="input-group"><label>DID Description</label><input type="text" name="description" className="input" placeholder="Description" /></div>
            <div className="input-group"><label>Carrier</label><input type="text" name="carrier" className="input" placeholder="Carrier" /></div>
            <div className="input-group"><label>Active</label><select name="active" className="input" defaultValue="Y"><option value="Y">Y</option><option value="N">N</option></select></div>
            <div className="input-group"><label>Admin Group</label><input type="text" name="group" className="input" defaultValue="---ALL---" /></div>
            <div className="input-group"><label>Route</label><select name="route" className="input" defaultValue="IN_GROUP"><option value="IN_GROUP">IN_GROUP</option><option value="EXTEN">EXTEN</option><option value="VOICEMAIL">VOICEMAIL</option><option value="PHONE">PHONE</option></select></div>
            <div className="input-group"><label>Recording</label><select name="recording" className="input" defaultValue="N"><option value="N">N</option><option value="Y">Y</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit DID</button></div>
        </form>
      </>)}

      {/* TAB: Call Menus */}
      {activeTab === 'Call Menus' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Call Menu (IVR) Listings</div>
          <div className="table-container"><table className="table"><thead><tr><th>Menu ID</th><th>Menu Name</th><th>Prompt</th><th>Timeout</th><th>Actions</th></tr></thead>
            <tbody>{callMenus.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No Call Menus configured.</td></tr> : callMenus.map(m => (<tr key={m.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{m.id}</td><td>{m.name}</td><td>{m.prompt}</td><td>{m.timeout}s</td><td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }}>Modify</button></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleMenuSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Hash size={20} /> Add A New Call Menu (IVR)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Menu ID</label><input type="text" name="id" className="input" placeholder="e.g. MAIN_IVR" required /></div>
            <div className="input-group"><label>Menu Name</label><input type="text" name="name" className="input" placeholder="e.g. Main Office IVR" required /></div>
            <div className="input-group"><label>Menu Prompt</label><input type="text" name="prompt" className="input" placeholder="e.g. greeting_recording" /></div>
            <div className="input-group"><label>Menu Timeout</label><input type="number" name="timeout" className="input" defaultValue="10" /></div>
            <div className="input-group"><label>Timeout Prompt</label><input type="text" name="timeoutPrompt" className="input" placeholder="e.g. timeout_recording" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit Call Menu</button></div>
        </form>
      </>)}

      {/* TAB: Filter Phone Groups */}
      {activeTab === 'Filter Phone Groups' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Filter Phone Group Listings</div>
          <div className="table-container"><table className="table"><thead><tr><th>Group ID</th><th>Group Name</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>{filterPhoneGroups.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No Filter Phone Groups configured.</td></tr> : filterPhoneGroups.map(fpg => (<tr key={fpg.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{fpg.id}</td><td>{fpg.name}</td><td>{fpg.description}</td><td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }}>Modify</button></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleFpgSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Filter size={20} /> Add Filter Phone Group</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Group ID</label><input type="text" name="id" className="input" placeholder="e.g. BLOCK_LIST" required /></div>
            <div className="input-group"><label>Group Name</label><input type="text" name="name" className="input" placeholder="e.g. Blocked Numbers" required /></div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><input type="text" name="description" className="input" placeholder="Description of this filter group" /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}
    </div>
  );
}
