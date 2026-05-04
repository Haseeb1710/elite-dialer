import { User, Shield, Edit2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Users() {
  const { users, addUser } = useAppStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: formData.get('id'),
      name: formData.get('name'),
      level: parseInt(formData.get('level'), 10),
      group: formData.get('group'),
      active: 'Y', // Defaulting to Y for now
    };
    addUser(newUser);
    e.target.reset();
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage agent access levels and user groups</p>
        </div>
        <button className="btn btn-primary">
          <User size={16} /> Add New User
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>User Level</th>
                <th>User Group</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: '500' }}>{user.id}</td>
                  <td>{user.name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user.level >= 8 ? <ShieldAlert size={14} color="var(--danger-color)" /> : <Shield size={14} color="var(--text-muted)" />}
                      {user.level}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{user.group}</span>
                  </td>
                  <td>
                    <span className={`badge ${user.active === 'Y' ? 'badge-success' : 'badge-danger'}`}>
                      {user.active}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" title="Edit User">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New User Form (Phase 1 Exact Replication) */}
      <form className="card" style={{ marginTop: '24px' }} onSubmit={handleSubmit}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
          <User size={20} /> Add A New User
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="input-group">
            <label>User Number</label>
            <input type="text" name="id" className="input" placeholder="e.g. 1000" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" className="input" placeholder="User login password" required />
          </div>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="name" className="input" placeholder="e.g. John Doe" required />
          </div>
          <div className="input-group">
            <label>User Level</label>
            <select name="level" className="input" defaultValue="1">
              {[...Array(9).keys()].map(i => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>User Group</label>
            <select name="group" className="input" defaultValue="AGENTS">
              <option value="ADMIN">ADMIN - Administrators</option>
              <option value="AGENTS">AGENTS - Standard Agents</option>
            </select>
          </div>
          <div className="input-group">
            <label>Phone Login</label>
            <input type="text" name="phoneLogin" className="input" placeholder="Extension (e.g. 100)" />
          </div>
          <div className="input-group">
            <label>Phone Password</label>
            <input type="password" name="phonePassword" className="input" placeholder="Phone registration password" />
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}
