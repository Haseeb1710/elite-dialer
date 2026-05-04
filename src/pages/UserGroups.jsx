import { Users, Plus, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function UserGroups() {
  const { userGroups, addUserGroup } = useAppStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGroup = {
      id: formData.get('id'),
      name: formData.get('name'),
      campaigns: formData.get('campaigns'),
      shifts: formData.get('shifts'),
    };
    addUserGroup(newGroup);
    e.target.reset();
  };
  return (
    <div className="content-area animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>User Groups</h1>
          <p>Manage agent teams, group permissions, and allowed campaigns</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Add User Group</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="input-group" style={{ width: '300px', margin: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" className="input" placeholder="Search user groups..." style={{ paddingLeft: '36px' }} />
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Group ID</th>
                <th>Group Name</th>
                <th>Allowed Campaigns</th>
                <th>Group Shifts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userGroups.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No User Groups configured.
                  </td>
                </tr>
              ) : (
                userGroups.map(group => (
                  <tr key={group.id}>
                    <td style={{ fontWeight: '500', color: 'var(--primary-blue)' }}>{group.id}</td>
                    <td>{group.name}</td>
                    <td>{group.campaigns}</td>
                    <td>{group.shifts}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit Permissions</button>
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
          <Users size={20} /> Add A New User Group
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="input-group">
            <label>Group ID</label>
            <input type="text" name="id" className="input" placeholder="e.g. CLOSERS" required />
          </div>
          <div className="input-group">
            <label>Group Name</label>
            <input type="text" name="name" className="input" placeholder="e.g. Tier 2 Closers" required />
          </div>
          <div className="input-group">
            <label>Allowed Campaigns</label>
            <input type="text" name="campaigns" className="input" placeholder="e.g. ALL CAMPAIGNS" />
          </div>
          <div className="input-group">
            <label>Group Shifts</label>
            <input type="text" name="shifts" className="input" placeholder="e.g. 24HR" />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">Submit User Group</button>
        </div>
      </form>
    </div>
  );
}
