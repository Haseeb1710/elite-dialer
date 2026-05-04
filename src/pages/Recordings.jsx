import { useState } from 'react';
import { Play, Download, Search, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Recordings() {
  const recordings = useAppStore((state) => state.recordings);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecordings = recordings.filter(r => 
    r.number.includes(searchTerm) || 
    r.agent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Call Recordings</h1>
          <p>Search and playback call recordings</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
          <div className="input-group" style={{ margin: 0, flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search by phone number or agent..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>
          <button className="btn btn-secondary">
            <Calendar size={16} /> Date Range
          </button>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Phone Number</th>
                <th>Agent</th>
                <th>Duration</th>
                <th>Disposition</th>
                <th>Playback</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecordings.map(rec => (
                <tr key={rec.id}>
                  <td>{rec.date}</td>
                  <td style={{ fontWeight: '500' }}>{rec.number}</td>
                  <td>{rec.agent}</td>
                  <td>{rec.duration}</td>
                  <td>
                    <span className="badge badge-blue">
                      {rec.disposition}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon">
                        <Play size={16} />
                      </button>
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecordings.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No recordings found for this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
