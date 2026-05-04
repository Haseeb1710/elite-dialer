import { Headphones, Plus, Search, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function RemoteAgents() {
  const { remoteAgents, addRemoteAgent } = useAppStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAgent = {
      id: formData.get('id'),
      lines: parseInt(formData.get('lines'), 10),
      server: formData.get('server'),
      campaign: formData.get('campaign'),
      status: formData.get('status'),
    };
    addRemoteAgent(newAgent);
    e.target.reset();
  };
  return (
    <div className="content-area animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Remote Agents</h1>
          <p>Manage external extensions mapped to external numbers</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Add Remote Agent</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="input-group" style={{ width: '300px', margin: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" className="input" placeholder="Search remote agents..." style={{ paddingLeft: '36px' }} />
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Number of Lines</th>
                <th>Server IP</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {remoteAgents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No remote agents configured. Click "Add Remote Agent" to begin.
                  </td>
                </tr>
              ) : (
                remoteAgents.map(agent => (
                  <tr key={agent.id}>
                    <td style={{ fontWeight: '500' }}>{agent.id}</td>
                    <td>{agent.lines}</td>
                    <td>{agent.server}</td>
                    <td>{agent.campaign}</td>
                    <td>
                      <span className={`badge ${agent.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                        {agent.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Edit Remote Agent"><Edit2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form className="card" style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
          <Headphones size={20} /> Add A New Remote Agent
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="input-group">
            <label>User ID</label>
            <input type="text" name="id" className="input" placeholder="e.g. 5001" required />
          </div>
          <div className="input-group">
            <label>Number of Lines</label>
            <input type="number" name="lines" className="input" defaultValue="1" required />
          </div>
          <div className="input-group">
            <label>Server IP</label>
            <input type="text" name="server" className="input" placeholder="e.g. 10.10.10.15" />
          </div>
          <div className="input-group">
            <label>Campaign</label>
            <input type="text" name="campaign" className="input" placeholder="e.g. TESTCAMP" />
          </div>
          <div className="input-group">
            <label>Status</label>
            <select name="status" className="input" defaultValue="ACTIVE">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">Submit Remote Agent</button>
        </div>
      </form>
    </div>
  );
}
