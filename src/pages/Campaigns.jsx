import { useState } from 'react';
import { Settings, Play, Pause, List, PhoneCall, Hash, RotateCcw, Clock, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TABS = ['Campaign List', 'Statuses', 'HotKeys', 'Lead Recycle', 'Pause Codes'];

export default function Campaigns() {
  const { campaigns, addCampaign, campaignStatuses, addCampaignStatus, hotkeys, addHotkey, leadRecycle, addLeadRecycle, pauseCodes, addPauseCode } = useAppStore();
  const [activeTab, setActiveTab] = useState('Campaign List');

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addCampaign({ id: fd.get('id'), name: fd.get('name'), method: fd.get('method'), level: parseFloat(fd.get('level')), status: fd.get('active') === 'Y' ? 'ACTIVE' : 'INACTIVE', leads: fd.get('hopperLevel') || 0 });
    e.target.reset();
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addCampaignStatus({ id: fd.get('id'), name: fd.get('name'), category: fd.get('category'), humanAnswer: fd.get('humanAnswer'), scheduled: fd.get('scheduled') });
    e.target.reset();
  };

  const handleHotkeySubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addHotkey({ key: fd.get('key'), status: fd.get('status'), description: fd.get('description') });
    e.target.reset();
  };

  const handleRecycleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addLeadRecycle({ status: fd.get('status'), attempts: parseInt(fd.get('attempts')), delay: parseInt(fd.get('delay')) });
    e.target.reset();
  };

  const handlePauseSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addPauseCode({ id: fd.get('id'), name: fd.get('name'), billable: fd.get('billable') });
    e.target.reset();
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Campaigns</h1>
          <p>Manage predictive and ratio dialing campaigns</p>
        </div>
        <button className="btn btn-primary">Add New Campaign</button>
      </div>

      {/* Sub-tab navigation */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', border: 'none', background: activeTab === tab ? 'var(--primary-blue)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', borderRadius: '8px 8px 0 0', fontSize: '14px' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* TAB: Campaign List */}
      {activeTab === 'Campaign List' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div className="table-container"><table className="table"><thead><tr><th>Campaign ID</th><th>Campaign Name</th><th>Dial Method</th><th>Auto-Dial Level</th><th>Active Leads</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{campaigns.map(camp => (<tr key={camp.id}><td style={{ fontWeight: '500' }}>{camp.id}</td><td style={{ color: 'var(--primary-blue)', fontWeight: '600' }}>{camp.name}</td><td><span className="badge badge-blue">{camp.method}</span></td><td>{camp.level}</td><td>{camp.leads}</td><td><span className={`badge ${camp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{camp.status}</span></td><td><div style={{ display: 'flex', gap: '8px' }}><button className="btn-icon" title="Edit"><Settings size={16} /></button><button className="btn-icon" title="Lists"><List size={16} /></button>{camp.status === 'ACTIVE' ? <button className="btn-icon" style={{ color: 'var(--warning-color)' }} title="Pause"><Pause size={16} /></button> : <button className="btn-icon" style={{ color: 'var(--success-color)' }} title="Start"><Play size={16} /></button>}</div></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleCampaignSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><PhoneCall size={20} /> Add A New Campaign</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Campaign ID</label><input type="text" name="id" className="input" placeholder="e.g. 1000" required /></div>
            <div className="input-group"><label>Campaign Name</label><input type="text" name="name" className="input" placeholder="e.g. TESTCAMP" required /></div>
            <div className="input-group"><label>Campaign Description</label><input type="text" name="description" className="input" placeholder="Description" /></div>
            <div className="input-group"><label>Active</label><select name="active" className="input" defaultValue="Y"><option value="Y">Y - Yes</option><option value="N">N - No</option></select></div>
            <div className="input-group"><label>Dial Method</label><select name="method" className="input" defaultValue="RATIO"><option value="MANUAL">MANUAL</option><option value="RATIO">RATIO</option><option value="ADAPT_HARD_LIMIT">ADAPT_HARD_LIMIT</option><option value="PREDICT">PREDICT</option><option value="INBOUND_MAN">INBOUND_MAN</option></select></div>
            <div className="input-group"><label>Auto Dial Level</label><input type="number" name="level" className="input" defaultValue="1" step="0.1" /></div>
            <div className="input-group"><label>Hopper Level</label><input type="number" name="hopperLevel" className="input" defaultValue="200" /></div>
            <div className="input-group"><label>Next Agent Call</label><select name="nextCall" className="input" defaultValue="random"><option value="random">random</option><option value="oldest_call_start">oldest_call_start</option><option value="oldest_call_finish">oldest_call_finish</option><option value="fewest_calls">fewest_calls</option></select></div>
            <div className="input-group"><label>Local Call Time</label><select name="callTime" className="input" defaultValue="9am-9pm"><option value="24hours">24hours</option><option value="9am-9pm">9am-9pm</option><option value="9am-5pm">9am-5pm</option></select></div>
            <div className="input-group"><label>Allow Closers</label><select name="allowClosers" className="input" defaultValue="Y"><option value="Y">Y - Yes</option><option value="N">N - No</option></select></div>
            <div className="input-group"><label>Script</label><select name="script" className="input"><option value="NONE">NONE</option></select></div>
            <div className="input-group"><label>Campaign CallerID</label><input type="text" name="callerId" className="input" placeholder="e.g. 0000000000" /></div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit</button></div>
        </form>
      </>)}

      {/* TAB: Statuses */}
      {activeTab === 'Statuses' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Campaign Statuses (Dispositions)</div>
          <div className="table-container"><table className="table"><thead><tr><th>Status</th><th>Status Name</th><th>Category</th><th>Human Answer</th><th>Scheduled Callback</th></tr></thead>
            <tbody>{campaignStatuses.map(s => (<tr key={s.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{s.id}</td><td>{s.name}</td><td><span className="badge badge-blue">{s.category}</span></td><td>{s.humanAnswer}</td><td>{s.scheduled}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleStatusSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Zap size={20} /> Add A New Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Status Code</label><input type="text" name="id" className="input" placeholder="e.g. SALE" required /></div>
            <div className="input-group"><label>Status Name</label><input type="text" name="name" className="input" placeholder="e.g. Sale Made" required /></div>
            <div className="input-group"><label>Category</label><select name="category" className="input"><option value="UNDEFINED">UNDEFINED</option><option value="SALE">SALE</option><option value="REJECT">REJECT</option><option value="DNC">DNC</option><option value="CALLBACK">CALLBACK</option><option value="CONTACT">CONTACT</option></select></div>
            <div className="input-group"><label>Human Answer</label><select name="humanAnswer" className="input"><option value="Y">Y</option><option value="N">N</option></select></div>
            <div className="input-group"><label>Scheduled Callback</label><select name="scheduled" className="input"><option value="N">N</option><option value="Y">Y</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit Status</button></div>
        </form>
      </>)}

      {/* TAB: HotKeys */}
      {activeTab === 'HotKeys' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Agent HotKey Dispositions</div>
          <div className="table-container"><table className="table"><thead><tr><th>Key</th><th>Status Code</th><th>Description</th></tr></thead>
            <tbody>{hotkeys.map(hk => (<tr key={hk.key}><td><span className="badge badge-blue" style={{ fontSize: '16px', padding: '6px 14px', fontWeight: 700 }}>{hk.key}</span></td><td style={{ fontWeight: 600 }}>{hk.status}</td><td>{hk.description}</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleHotkeySubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Hash size={20} /> Add A New HotKey</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Key (1-9)</label><select name="key" className="input">{[1,2,3,4,5,6,7,8,9].map(k => <option key={k} value={k}>{k}</option>)}</select></div>
            <div className="input-group"><label>Status Code</label><input type="text" name="status" className="input" placeholder="e.g. SALE" required /></div>
            <div className="input-group"><label>Description</label><input type="text" name="description" className="input" placeholder="e.g. Sale Made" required /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit HotKey</button></div>
        </form>
      </>)}

      {/* TAB: Lead Recycle */}
      {activeTab === 'Lead Recycle' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Lead Recycle Rules</div>
          <div className="table-container"><table className="table"><thead><tr><th>Status</th><th>Max Attempts</th><th>Retry Delay (min)</th></tr></thead>
            <tbody>{leadRecycle.map(lr => (<tr key={lr.status}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{lr.status}</td><td>{lr.attempts}</td><td>{lr.delay} min</td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handleRecycleSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><RotateCcw size={20} /> Add Lead Recycle Rule</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Status Code</label><input type="text" name="status" className="input" placeholder="e.g. NA" required /></div>
            <div className="input-group"><label>Max Attempts</label><input type="number" name="attempts" className="input" defaultValue="3" required /></div>
            <div className="input-group"><label>Retry Delay (minutes)</label><input type="number" name="delay" className="input" defaultValue="60" required /></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit Rule</button></div>
        </form>
      </>)}

      {/* TAB: Pause Codes */}
      {activeTab === 'Pause Codes' && (<>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Campaign Pause Codes</div>
          <div className="table-container"><table className="table"><thead><tr><th>Pause Code</th><th>Pause Name</th><th>Billable</th></tr></thead>
            <tbody>{pauseCodes.map(pc => (<tr key={pc.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{pc.id}</td><td>{pc.name}</td><td><span className={`badge ${pc.billable === 'YES' ? 'badge-success' : pc.billable === 'HALF' ? 'badge-warning' : 'badge-danger'}`}>{pc.billable}</span></td></tr>))}</tbody>
          </table></div>
        </div>
        <form className="card" style={{ marginTop: '24px' }} onSubmit={handlePauseSubmit}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Clock size={20} /> Add A New Pause Code</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Pause Code</label><input type="text" name="id" className="input" placeholder="e.g. BREAK" required /></div>
            <div className="input-group"><label>Pause Name</label><input type="text" name="name" className="input" placeholder="e.g. Break Time" required /></div>
            <div className="input-group"><label>Billable</label><select name="billable" className="input"><option value="NO">NO</option><option value="YES">YES</option><option value="HALF">HALF</option></select></div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn btn-primary">Submit Pause Code</button></div>
        </form>
      </>)}
    </div>
  );
}
