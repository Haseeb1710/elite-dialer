import { useState, useRef } from 'react';
import { Database, Upload, RefreshCw, Trash2, Search, FileText, CheckCircle, AlertCircle, X, Eye } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Lists() {
  const { lists, addList, campaigns, contacts, addContacts, updateListLeadCount } = useAppStore();
  const [activeTab, setActiveTab] = useState('List Management');
  const fileInputRef = useRef(null);

  // Lead Loader State
  const [selectedList, setSelectedList] = useState('');
  const [phoneCode, setPhoneCode] = useState('1');
  const [dupCheck, setDupCheck] = useState('DUPLIST');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedLeads, setParsedLeads] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loadResult, setLoadResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldMapping, setFieldMapping] = useState(
    'vendor_lead_code,source_id,list_id,phone_number,title,first_name,middle_initial,last_name,address1,address2,address3,city,state,province,postal_code,country_code,gender,date_of_birth,alt_phone,email,security_phrase,comments'
  );

  // Search Leads State
  const [searchCriteria, setSearchCriteria] = useState({ phone: '', firstName: '', lastName: '', city: '', state: '', status: '', list: '', vendorCode: '' });
  const [searchResults, setSearchResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addList({ id: fd.get('id'), name: fd.get('name'), campaign: fd.get('campaign'), active: fd.get('active'), leads: 0, dialed: 0 });
    e.target.reset();
  };

  // ===== FILE PARSING =====
  const parseCSV = (text) => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const fields = fieldMapping.split(',').map(f => f.trim());
    const results = [];

    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split(/[,\t]/).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row = {};
      fields.forEach((field, idx) => {
        row[field] = values[idx] || '';
      });

      // Must have at least a phone number
      if (row.phone_number) {
        results.push(row);
      }
    }
    return results;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setLoadResult(null);
    setShowPreview(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const leads = parseCSV(text);
      setParsedLeads(leads);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
      setUploadedFile(file);
      setLoadResult(null);
      setShowPreview(false);

      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        const leads = parseCSV(text);
        setParsedLeads(leads);
      };
      reader.readAsText(file);
    }
  };

  const handlePreview = () => {
    if (parsedLeads.length === 0) {
      setLoadResult({ type: 'error', message: 'No leads parsed from file. Check your CSV format and field mapping.' });
      return;
    }
    setShowPreview(true);
  };

  const handleLoadLeads = () => {
    if (!selectedList) {
      setLoadResult({ type: 'error', message: 'Please select a target list.' });
      return;
    }
    if (parsedLeads.length === 0) {
      setLoadResult({ type: 'error', message: 'No leads to load. Upload a CSV file first.' });
      return;
    }

    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const targetList = lists.find(l => l.id === selectedList);
      let duplicates = 0;
      let loaded = 0;
      const newContacts = [];

      parsedLeads.forEach((lead, idx) => {
        const phone = phoneCode ? `+${phoneCode}${lead.phone_number}` : lead.phone_number;
        
        // Duplicate check
        const isDuplicate = dupCheck !== 'NONE' && contacts.some(c => c.phone === phone);
        if (isDuplicate) {
          duplicates++;
          return;
        }

        newContacts.push({
          id: `C${Date.now()}_${idx}`,
          name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || `Lead ${idx + 1}`,
          company: lead.address1 || '',
          phone: phone,
          email: lead.email || '',
          status: 'Lead',
          lastContact: new Date().toISOString().split('T')[0],
          listId: selectedList,
          listName: targetList?.name || '',
          campaign: targetList?.campaign || '',
          city: lead.city || '',
          state: lead.state || '',
          vendorCode: lead.vendor_lead_code || '',
          sourceId: lead.source_id || '',
          altPhone: lead.alt_phone || '',
          postalCode: lead.postal_code || '',
          comments: lead.comments || '',
        });
        loaded++;
      });

      // Add contacts to global store
      if (newContacts.length > 0) {
        addContacts(newContacts);
        updateListLeadCount(selectedList, newContacts.length);
      }

      setLoadResult({
        type: 'success',
        message: `Successfully loaded ${loaded} leads into "${targetList?.name || selectedList}".`,
        details: { total: parsedLeads.length, loaded, duplicates, skipped: parsedLeads.length - loaded - duplicates }
      });

      // Reset upload state
      setUploadedFile(null);
      setParsedLeads([]);
      setShowPreview(false);
      setIsLoading(false);
    }, 1200);
  };

  // ===== SEARCH =====
  const handleSearch = () => {
    const results = contacts.filter(c => {
      const [firstName = '', lastName = ''] = (c.name || '').split(' ');
      if (searchCriteria.phone && !c.phone.includes(searchCriteria.phone)) return false;
      if (searchCriteria.firstName && !firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase())) return false;
      if (searchCriteria.lastName && !lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase())) return false;
      if (searchCriteria.city && !(c.city || '').toLowerCase().includes(searchCriteria.city.toLowerCase())) return false;
      if (searchCriteria.state && !(c.state || '').toLowerCase().includes(searchCriteria.state.toLowerCase())) return false;
      if (searchCriteria.status && c.status !== searchCriteria.status) return false;
      if (searchCriteria.list && c.listId !== searchCriteria.list) return false;
      return true;
    });
    setSearchResults(results);
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div><h1>Lists Management</h1><p>Upload and manage dialing lists for campaigns</p></div>
        <button className="btn btn-primary" onClick={() => setActiveTab('Lead Loader')}><Upload size={16} /> Load New Leads</button>
      </div>

      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)', marginBottom: '24px' }}>
        {['List Management', 'Lead Loader', 'Search Leads'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', border: 'none', background: activeTab === tab ? 'var(--primary-blue)' : 'transparent', color: activeTab === tab ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', borderRadius: '8px 8px 0 0', fontSize: '14px' }}>{tab}</button>
        ))}
      </div>

      {/* ===== LIST MANAGEMENT TAB ===== */}
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

      {/* ===== LEAD LOADER TAB ===== */}
      {activeTab === 'Lead Loader' && (
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Upload size={20} /> Load Leads From File</h2>
          
          {/* Result Banner */}
          {loadResult && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: loadResult.type === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${loadResult.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
              color: loadResult.type === 'success' ? '#065f46' : '#991b1b',
            }}>
              {loadResult.type === 'success' ? <CheckCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} /> : <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: loadResult.details ? 6 : 0 }}>{loadResult.message}</div>
                {loadResult.details && (
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', marginTop: '4px' }}>
                    <span>Total: <strong>{loadResult.details.total}</strong></span>
                    <span style={{ color: '#059669' }}>Loaded: <strong>{loadResult.details.loaded}</strong></span>
                    <span style={{ color: '#d97706' }}>Duplicates: <strong>{loadResult.details.duplicates}</strong></span>
                  </div>
                )}
              </div>
              <button onClick={() => setLoadResult(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={18} color="#94a3b8" /></button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Select List</label>
              <select className="input" value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
                <option value="">-- Select a list --</option>
                {lists.map(l => <option key={l.id} value={l.id}>{l.id} - {l.name}</option>)}
              </select>
            </div>
            <div className="input-group"><label>Phone Code</label><input type="text" className="input" value={phoneCode} onChange={e => setPhoneCode(e.target.value)} /></div>
            
            <div className="input-group">
              <label>File Upload</label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${uploadedFile ? '#10b981' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  padding: '32px',
                  textAlign: 'center',
                  background: uploadedFile ? '#ecfdf5' : 'var(--bg-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {uploadedFile ? (
                  <>
                    <CheckCircle size={32} color="#10b981" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600, color: '#065f46' }}>{uploadedFile.name}</div>
                    <div style={{ fontSize: 12, color: '#059669', marginTop: '4px' }}>
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {parsedLeads.length} leads parsed
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: '8px' }}>Click to change file</div>
                  </>
                ) : (
                  <>
                    <FileText size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: 500 }}>Click or drag CSV/TXT file here</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: '4px' }}>Supported: .csv, .txt</div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Duplicate Check</label>
              <select className="input" value={dupCheck} onChange={e => setDupCheck(e.target.value)}>
                <option value="DUPLIST">DUPLIST - Check List</option>
                <option value="DUPCAMP">DUPCAMP - Check Campaign</option>
                <option value="DUPSYS">DUPSYS - System Wide</option>
                <option value="NONE">NONE - Skip</option>
              </select>
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Field Mapping (CSV Column Order)</label>
              <input
                type="text"
                className="input"
                value={fieldMapping}
                onChange={e => setFieldMapping(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: 11 }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Required: <strong>phone_number</strong>. Common: first_name, last_name, email, city, state, address1
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={handlePreview} disabled={!uploadedFile || parsedLeads.length === 0}>
              <Eye size={16} /> Preview Data ({parsedLeads.length})
            </button>
            <button
              className="btn btn-primary"
              onClick={handleLoadLeads}
              disabled={isLoading || !uploadedFile || parsedLeads.length === 0 || !selectedList}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  Loading...
                </span>
              ) : (
                <><Upload size={16} /> Load {parsedLeads.length} Leads</>
              )}
            </button>
          </div>

          {/* Preview Table */}
          {showPreview && parsedLeads.length > 0 && (
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Eye size={18} /> Data Preview
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>Showing first {Math.min(parsedLeads.length, 10)} of {parsedLeads.length} leads</span>
                </h3>
                <button className="btn-icon" onClick={() => setShowPreview(false)}><X size={18} /></button>
              </div>
              <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Phone</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedLeads.slice(0, 10).map((lead, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--primary-blue)' }}>
                          {phoneCode ? `+${phoneCode}` : ''}{lead.phone_number}
                        </td>
                        <td>{lead.first_name || '—'}</td>
                        <td>{lead.last_name || '—'}</td>
                        <td>{lead.email || '—'}</td>
                        <td>{lead.city || '—'}</td>
                        <td>{lead.state || '—'}</td>
                        <td>{lead.source_id || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== SEARCH LEADS TAB ===== */}
      {activeTab === 'Search Leads' && (
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}><Search size={20} /> Advanced Lead Search</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="input-group"><label>Phone Number</label><input type="text" className="input" placeholder="Enter phone number" value={searchCriteria.phone} onChange={e => setSearchCriteria({ ...searchCriteria, phone: e.target.value })} /></div>
            <div className="input-group"><label>First Name</label><input type="text" className="input" placeholder="First name" value={searchCriteria.firstName} onChange={e => setSearchCriteria({ ...searchCriteria, firstName: e.target.value })} /></div>
            <div className="input-group"><label>Last Name</label><input type="text" className="input" placeholder="Last name" value={searchCriteria.lastName} onChange={e => setSearchCriteria({ ...searchCriteria, lastName: e.target.value })} /></div>
            <div className="input-group"><label>City</label><input type="text" className="input" placeholder="City" value={searchCriteria.city} onChange={e => setSearchCriteria({ ...searchCriteria, city: e.target.value })} /></div>
            <div className="input-group"><label>State</label><input type="text" className="input" placeholder="State" value={searchCriteria.state} onChange={e => setSearchCriteria({ ...searchCriteria, state: e.target.value })} /></div>
            <div className="input-group"><label>Status</label>
              <select className="input" value={searchCriteria.status} onChange={e => setSearchCriteria({ ...searchCriteria, status: e.target.value })}>
                <option value="">Any Status</option><option>NEW</option><option>Lead</option><option>Customer</option><option>Prospect</option><option>SALE</option><option>NI</option><option>NA</option><option>CB</option><option>DNC</option>
              </select>
            </div>
            <div className="input-group"><label>List</label>
              <select className="input" value={searchCriteria.list} onChange={e => setSearchCriteria({ ...searchCriteria, list: e.target.value })}>
                <option value="">All Lists</option>{lists.map(l => <option key={l.id} value={l.id}>{l.id} - {l.name}</option>)}
              </select>
            </div>
            <div className="input-group"><label>Vendor Lead Code</label><input type="text" className="input" placeholder="Vendor code" value={searchCriteria.vendorCode} onChange={e => setSearchCriteria({ ...searchCriteria, vendorCode: e.target.value })} /></div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => { setSearchCriteria({ phone: '', firstName: '', lastName: '', city: '', state: '', status: '', list: '', vendorCode: '' }); setSearchResults(null); }}>Reset</button>
            <button className="btn btn-primary" onClick={handleSearch}><Search size={16} /> Search</button>
          </div>

          {/* Search Results */}
          {searchResults === null ? (
            <div style={{ marginTop: '24px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-color)', borderRadius: '8px' }}>
              Enter search criteria above and click Search to find leads.
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ marginTop: '24px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
              No leads found matching your criteria.
            </div>
          ) : (
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                Found <strong style={{ color: 'var(--primary-blue)' }}>{searchResults.length}</strong> matching leads
              </div>
              <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Company</th><th>Status</th><th>List</th><th>Last Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.slice(0, 50).map(c => (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.id}</td>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--primary-blue)' }}>{c.phone}</td>
                        <td>{c.email || '—'}</td>
                        <td>{c.company || '—'}</td>
                        <td><span className={`badge ${c.status === 'Lead' ? 'badge-info' : c.status === 'Customer' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                        <td>{c.listName || '—'}</td>
                        <td>{c.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
