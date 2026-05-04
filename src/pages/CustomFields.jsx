import { useState } from 'react';
import { Plus, Trash2, List } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function CustomFields() {
  const { customFieldsSetup, addCustomField, removeCustomField } = useAppStore();
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const handleAddField = () => {
    if (newFieldLabel.trim()) {
      addCustomField(newFieldLabel.trim());
      setNewFieldLabel('');
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Custom Lead Fields</h1>
          <p>Define the fields that agents will see and fill out on the Agent Screen</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <List size={18} /> Active Custom Fields
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Field ID</th>
                  <th>Field Label</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customFieldsSetup.map(field => (
                  <tr key={field.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{field.id}</td>
                    <td style={{ fontWeight: '500' }}>{field.label}</td>
                    <td>
                      <button 
                        className="btn-icon" 
                        style={{ color: 'var(--danger-color)' }} 
                        onClick={() => removeCustomField(field.id)}
                        title="Delete Field"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {customFieldsSetup.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No custom fields defined.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <h3>Add New Field</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Create a new data field for agents to collect during calls.
          </p>
          
          <div className="input-group">
            <label>Field Label</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Current Provider" 
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
            />
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleAddField}>
            <Plus size={16} /> Create Field
          </button>
        </div>
      </div>
    </div>
  );
}
