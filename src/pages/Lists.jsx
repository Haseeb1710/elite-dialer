import { useState } from 'react';
import { Database, Upload, RefreshCw, Trash2, Search, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Lists() {
  const { lists, addList, campaigns } = useAppStore();
  const [activeTab, setActiveTab] = useState('List Management');

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addList({ id: fd.get('id'), name: fd.get('name'), campaign: fd.get('campaign'), active: fd.get('active'), leads: 0, dialed: 0 });
    e.target.reset();
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div><h1>Lists Management</h1><p>Upload and manage dialing lists for campaigns</p></div>
        <button className="btn btn-primary"><Upload size={16} /> Load New Leads</button>
      </div>

      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
        {['List Management', 'Lead Loader', 'Search Leads'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', border: 'none', background: activeTab === tab ? 'var(--primary-blue)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', borderRadius: '8px 8px 0 0', fontSize: '14px' }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'List Management' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container"><table className="table"><thead><tr><th>List ID</th><th>List Name</th><th>Campaign</th><th>Active</th><th>Total Leads</th><th>Dialed</th><th>Actions</th></tr></thead>
              <tbody>{lists.map(list => (<tr key={list.id}><td style={{ fontWeight: '500' }}>{list.id}</td><td>{list.name}</td><td style={{ color: 'var(--primary-blue)' }}>{list.campaign}</td><td><span className={`badge ${list.active === 'Y' ? 'badge-success' : 'badge-danger'}`}>{list.active}</span></td><td>{list.leads}</td><td>{list.dialed}</td><td><div style={{ display: 'flex', gap: '8px' }}><button className="btn-icon" title="Reset"><RefreshCw size={16} /></button><button className="btn-icon" style={{ color: 'var(--danger-color)' }} title="Delete"><Trash2 size={16} /></button></div></td></tr>))}</tbody>
            </table></div>
          </div>
          <form className="card" style={{ height: 'fit-content' }} onSubmit={handleSubmit}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Database size={18} /> Add A New List</h3>
            <div className="input-group"><label>List ID</label><input type="text" name="id" className="input" placeholder="e.g. 1002" required /></div>
            <div className="input-group"><label>List Name</label><input type="text" name="name" className="input" placeholder="e.g. Web Leads" required /></div>
            <div className="input-group"><label>Campaign</label><select name="campaign" className="input">{campaigns.map(c => <option key={c.id} value={`${c.id} - ${c.name}`}>{c.id} - {c.name}</option>)}</select></div>
            <div className="input-group"><label>Active</label><select name="active" className="input" defaultValue="Y"><option value="Y">Y</option><option value="N">N</option></select></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Submit List</button>
          </form>
        </div>
      )}

      {activeTab === 'Lead Loader' && (
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Upload size={20} /> Load Leads From File</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Select List</label><select className="input">{lists.map(l => <option key={l.id} value={l.id}>{l.id} - {l.name}</option>)}</select></div>
            <div className="input-group"><label>Phone Code</label><input type="text" className="input" defaultValue="1" /></div>
            <div className="input-group"><label>File Upload</label>
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '40px', textAlign: 'center', background: 'var(--bg-color)', cursor: 'pointer' }}>
                <FileText size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 500 }}>Click or drag CSV/TXT file here</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '4px' }}>Supported: .csv, .txt, .xls</div>
                <input type="file" style={{ display: 'none' }} accept=".csv,.txt,.xls,.xlsx" />
              </div>
            </div>
            <div className="input-group"><label>Duplicate Check</label>
              <select className="input"><option>DUPLIST - Check List</option><option>DUPCAMP - Check Campaign</option><option>DUPSYS - System Wide</option><option>DUPTITLEALTPHONELIST - Title Alt Phone List</option><option>NONE - Skip</option></select>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Field Mapping (CSV Column Order)</label>
              <input type="text" className="input" defaultValue="vendor_lead_code,source_id,list_id,phone_number,title,first_name,middle_initial,last_name,address1,address2,address3,city,state,province,postal_code,country_code,gender,date_of_birth,alt_phone,email,security_phrase,comments" style={{ fontFamily: 'monospace', fontSize: 11 }} />
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary">Preview Data</button>
            <button className="btn btn-primary"><Upload size={16} /> Load Leads</button>
          </div>
        </div>
      )}

      {activeTab === 'Search Leads' && (
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Search size={20} /> Advanced Lead Search</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Phone Number</label><input type="text" className="input" placeholder="Enter phone number" /></div>
            <div className="input-group"><label>First Name</label><input type="text" className="input" placeholder="First name" /></div>
            <div className="input-group"><label>Last Name</label><input type="text" className="input" placeholder="Last name" /></div>
            <div className="input-group"><label>City</label><input type="text" className="input" placeholder="City" /></div>
            <div className="input-group"><label>State</label><input type="text" className="input" placeholder="State" /></div>
            <div className="input-group"><label>Status</label><select className="input"><option value="">Any Status</option><option>NEW</option><option>SALE</option><option>NI</option><option>NA</option><option>CB</option><option>DNC</option></select></div>
            <div className="input-group"><label>List</label><select className="input"><option value="">All Lists</option>{lists.map(l => <option key={l.id} value={l.id}>{l.id} - {l.name}</option>)}</select></div>
            <div className="input-group"><label>Vendor Lead Code</label><input type="text" className="input" placeholder="Vendor code" /></div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary">Reset</button>
            <button className="btn btn-primary"><Search size={16} /> Search</button>
          </div>
          <div style={{ marginTop: '24px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-color)', borderRadius: '8px' }}>
            Enter search criteria above and click Search to find leads.
          </div>
        </div>
      )}
    </div>
  );
}
