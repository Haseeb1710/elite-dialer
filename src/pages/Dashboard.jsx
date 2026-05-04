import { useState } from 'react';
import { Phone, Mail, MoreVertical, Filter } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const contacts = useAppStore((state) => state.contacts);
  const dialNumber = useAppStore((state) => state.dialNumber);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div>
          <h1>CRM Contacts</h1>
          <p>Manage your 120 leads and customers</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
          <button className="btn btn-primary">Add Contact</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Search contacts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => (
                <tr key={contact.id}>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--primary-blue)' }}>{contact.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{contact.email}</div>
                  </td>
                  <td>{contact.company}</td>
                  <td>{contact.phone}</td>
                  <td>
                    <span className={`badge ${
                      contact.status === 'Customer' ? 'badge-success' : 
                      contact.status === 'Lead' ? 'badge-blue' : 'badge-warning'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td>{contact.lastContact}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => dialNumber(contact.phone)} title="Click to dial">
                        <Phone size={16} />
                      </button>
                      <button className="btn-icon">
                        <Mail size={16} />
                      </button>
                      <button className="btn-icon">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
