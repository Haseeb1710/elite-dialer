import { Filter, Plus, Search, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Filters() {
  const { filters, addFilter } = useAppStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addFilter({ id: fd.get('id'), name: fd.get('name'), sql: fd.get('sql'), group: fd.get('group') });
    e.target.reset();
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Lead Filters</h1>
          <p>Manage SQL-based lead filtering logic for campaigns</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Add New Filter</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Lead Filter Listings</div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Filter ID</th><th>Filter Name</th><th>SQL Fragment</th><th>Admin Group</th><th>Actions</th></tr></thead>
            <tbody>
              {filters.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No filters configured.</td></tr>
              ) : filters.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{f.id}</td>
                  <td>{f.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.sql}</td>
                  <td>{f.group}</td>
                  <td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }}>Modify</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form className="card" style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
          <Filter size={20} /> Add A New Filter
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="input-group"><label>Filter ID</label><input type="text" name="id" className="input" placeholder="e.g. DROP72HOUR" required /></div>
          <div className="input-group"><label>Filter Name</label><input type="text" name="name" className="input" placeholder="e.g. UK 72 hour Drop No Call" required /></div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>SQL Fragment</label>
            <textarea name="sql" className="input" rows="4" placeholder="e.g. called_since_last_reset='Y' AND status IN ('DROP')" style={{ fontFamily: 'monospace', resize: 'vertical' }}></textarea>
          </div>
          <div className="input-group"><label>Admin Group</label><input type="text" name="group" className="input" defaultValue="---ALL---" /></div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">Submit Filter</button>
        </div>
      </form>
    </div>
  );
}
