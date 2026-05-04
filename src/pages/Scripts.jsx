import { FileText, Plus, Search, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Scripts() {
  const { scripts, addScript } = useAppStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newScript = {
      id: formData.get('id'),
      name: formData.get('name'),
      comments: formData.get('comments'),
      active: formData.get('active'),
      text: formData.get('text'),
    };
    addScript(newScript);
    e.target.reset();
  };
  return (
    <div className="content-area animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Campaign Scripts</h1>
          <p>Manage dynamic agent scripts for inbound and outbound campaigns</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Add New Script</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="input-group" style={{ width: '300px', margin: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" className="input" placeholder="Search scripts..." style={{ paddingLeft: '36px' }} />
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Script ID</th>
                <th>Script Name</th>
                <th>Script Comments</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scripts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No scripts configured. Click "Add New Script" to begin.
                  </td>
                </tr>
              ) : (
                scripts.map(script => (
                  <tr key={script.id}>
                    <td style={{ fontWeight: '500' }}>{script.id}</td>
                    <td>{script.name}</td>
                    <td>{script.comments}</td>
                    <td>
                      <span className={`badge ${script.active === 'Y' ? 'badge-success' : 'badge-danger'}`}>
                        {script.active}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Edit Script"><Edit2 size={16} /></button>
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
          <FileText size={20} /> Add A New Script
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="input-group">
            <label>Script ID</label>
            <input type="text" name="id" className="input" placeholder="e.g. SALES_SCRIPT" required />
          </div>
          <div className="input-group">
            <label>Script Name</label>
            <input type="text" name="name" className="input" placeholder="e.g. Main Sales Pitch" required />
          </div>
          <div className="input-group">
            <label>Script Comments</label>
            <input type="text" name="comments" className="input" placeholder="Description of when to use this script" />
          </div>
          <div className="input-group">
            <label>Active</label>
            <select name="active" className="input" defaultValue="Y">
              <option value="Y">Y - Yes</option>
              <option value="N">N - No</option>
            </select>
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Script Text</label>
            <textarea name="text" className="input" rows="8" placeholder="Enter script here. Use variables like --A--first_name--B--"></textarea>
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">Submit Script</button>
        </div>
      </form>
    </div>
  );
}
