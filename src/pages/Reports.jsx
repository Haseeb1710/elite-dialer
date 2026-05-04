import { useState, useEffect, useMemo } from 'react';
import { Activity, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const REPORT_LIST = [
  { section: 'Real-Time', items: ['Real-Time Main Report', 'Real-Time Campaign Summary'] },
  { section: 'Agent Reports', items: ['Agent Performance Detail', 'Agent Time Sheet', 'Agent Status Detail'] },
  { section: 'Campaign Reports', items: ['Outbound Calling Report', 'Inbound Report', 'Campaign Status List Report'] },
  { section: 'Exports', items: ['Export Calls Report', 'Export Leads Report'] },
  { section: 'System', items: ['Server Performance Report'] },
];

// Generate stable mock agents
const mockAgents = Array.from({ length: 12 }).map((_, i) => ({
  id: `10${i}`, name: `Agent ${i + 1}`,
  status: ['INCALL', 'READY', 'PAUSED', 'DISPO'][i % 4],
  timeInStatus: `${(i % 5)}m ${(i * 7) % 59}s`,
  callsToday: 10 + i * 4, talkTime: `${i * 3 + 5}m`, pauseTime: `${i * 2}m`,
  loginTime: '08:00 AM', logoutTime: '--',
}));

const statusBg = (s) => s === 'INCALL' ? 'var(--success-color)' : s === 'READY' ? 'var(--primary-blue)' : s === 'PAUSED' ? 'var(--warning-color)' : 'var(--danger-color)';

// --- Sub-report components ---
function RealTimeMain({ time, showOptions, setShowOptions }) {
  return (<>
    <div className="card" style={{ padding: '8px 16px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '12px', background: 'white' }}>
      <div style={{ display: 'flex', gap: '16px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '4px', color: '#000099' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowOptions(!showOptions); }} style={{ color: '#000099', textDecoration: 'underline' }}>{showOptions ? '- HIDE OPTIONS' : '+ VIEW MORE'}</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowOptions(!showOptions); }} style={{ color: '#000099', textDecoration: 'underline', background: '#ccf', padding: '0 4px' }}>Choose Report Display Options</a>
        <span>refresh: 40</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', lineHeight: '1.4' }}>
        <div><b>DIAL LEVEL:</b> 7.039</div><div><b>TRUNK SHORT/FILL:</b> 0 / 0</div><div><b>FILTER:</b> NONE</div><div><b>TIME:</b> {time}</div>
        <div><b>DIALABLE LEADS:</b> 451982</div><div><b>CALLS TODAY:</b> 0</div><div><b>AVG AGENTS:</b> 0.00</div><div><b>DIAL METHOD:</b> INBOUND_MAN</div>
        <div><b>HOPPER (min/auto):</b> 78000 / 4</div><div><b>DROPPED / ANSWERED:</b> 0.000 / 0</div><div><b>DL DIFF:</b> 0.00</div><div><b>STATUSES:</b> AL, AB, NA, AA</div>
        <div><b>LEADS IN HOPPER:</b> 33915</div><div><b>DROPPED PERCENT:</b> 0.00%</div><div><b>DIFF:</b> 0.00%</div><div><b>ORDER:</b> RANDOM</div>
      </div>
    </div>
    {showOptions && (
      <div style={{ background: '#e6e6fa', border: '1px solid #ccc', padding: '16px', marginBottom: '16px', fontSize: '13px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ flex: 1 }}>
            <div>Select Campaigns:</div>
            <select multiple style={{ width: '100%', height: '100px', fontFamily: 'monospace', border: '1px solid #999', padding: '4px' }}>
              <option>ALL-ACTIVE</option><option>001 - elitetrackers</option><option>Bally_H</option><option>CheckBo</option>
            </select>
            <div style={{ marginTop: '12px' }}>Select User Groups:</div>
            <select multiple style={{ width: '100%', height: '60px', fontFamily: 'monospace', border: '1px solid #999', padding: '4px' }}>
              <option>ALL-GROUPS</option><option>elitetrackers</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '150px 1fr', gap: '4px', alignItems: 'center', alignContent: 'start' }}>
            <div style={{ textAlign: 'right' }}>Refresh Rate:</div><select style={{ padding: '2px' }}><option>40 seconds</option></select>
            <div style={{ textAlign: 'right' }}>Inbound:</div><select style={{ padding: '2px' }}><option>Yes</option><option>No</option></select>
            <div style={{ textAlign: 'right' }}>Agent Time Stats:</div><select style={{ padding: '2px' }}><option>NO</option><option>YES</option></select>
            <div></div><button style={{ padding: '4px 16px', fontWeight: 'bold', marginTop: '8px', border: '1px solid #000', background: '#ccc' }}>SUBMIT</button>
          </div>
        </div>
      </div>
    )}
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Real-Time Main Report (120 Connected)</div>
      <div className="table-container"><table className="table"><thead><tr><th>Agent ID</th><th>Name</th><th>Status</th><th>Time</th><th>Calls</th><th>Action</th></tr></thead>
        <tbody>{mockAgents.map(a => (<tr key={a.id}><td>{a.id}</td><td style={{ fontWeight: 600 }}>{a.name}</td><td><span className="badge" style={{ background: statusBg(a.status), color: 'white', padding: '4px 10px' }}>{a.status}</span></td><td style={{ fontFamily: 'monospace' }}>{a.timeInStatus}</td><td>{a.callsToday}</td><td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Barge</button></td></tr>))}</tbody>
      </table></div>
    </div>
  </>);
}

function CampaignSummary({ campaigns }) {
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Real-Time Campaign Summary</div>
    <div className="table-container"><table className="table"><thead><tr><th>Campaign</th><th>Dial Method</th><th>Dial Level</th><th>Agents Logged In</th><th>Calls Today</th><th>Leads in Hopper</th><th>Status</th></tr></thead>
      <tbody>{campaigns.map(c => (<tr key={c.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{c.name}</td><td><span className="badge badge-blue">{c.method}</span></td><td>{c.level}</td><td>{Math.floor(Math.random() * 20)}</td><td>{Math.floor(Math.random() * 200)}</td><td>{c.leads}</td><td><span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{c.status}</span></td></tr>))}</tbody>
    </table></div>
  </div>);
}

function AgentPerformance() {
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Agent Performance Detail</div>
    <div className="table-container"><table className="table"><thead><tr><th>Agent</th><th>Name</th><th>Calls Handled</th><th>Talk Time</th><th>Pause Time</th><th>Avg Call</th><th>Sales</th><th>Conversion %</th></tr></thead>
      <tbody>{mockAgents.map(a => { const sales = Math.floor(a.callsToday * 0.15); return (<tr key={a.id}><td>{a.id}</td><td style={{ fontWeight: 600 }}>{a.name}</td><td>{a.callsToday}</td><td>{a.talkTime}</td><td>{a.pauseTime}</td><td>{Math.floor(parseInt(a.talkTime) * 60 / (a.callsToday || 1))}s</td><td style={{ color: 'var(--success-color)', fontWeight: 600 }}>{sales}</td><td>{((sales / (a.callsToday || 1)) * 100).toFixed(1)}%</td></tr>);})}</tbody>
    </table></div>
  </div>);
}

function AgentTimeSheet() {
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Agent Time Sheet</div>
    <div className="table-container"><table className="table"><thead><tr><th>Agent</th><th>Name</th><th>Login Time</th><th>Logout Time</th><th>Total Logged In</th><th>Talk Time</th><th>Pause Time</th><th>Wait Time</th></tr></thead>
      <tbody>{mockAgents.map(a => (<tr key={a.id}><td>{a.id}</td><td style={{ fontWeight: 600 }}>{a.name}</td><td>{a.loginTime}</td><td>{a.logoutTime}</td><td>{parseInt(a.talkTime) + parseInt(a.pauseTime) + 20}m</td><td>{a.talkTime}</td><td>{a.pauseTime}</td><td>{20 - (parseInt(a.pauseTime) || 0)}m</td></tr>))}</tbody>
    </table></div>
  </div>);
}

function AgentStatusDetail() {
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Agent Status Detail</div>
    <div className="table-container"><table className="table"><thead><tr><th>Agent</th><th>Name</th><th>Current Status</th><th>Time in Status</th><th>Campaign</th><th>Calls Waiting</th><th>Session ID</th></tr></thead>
      <tbody>{mockAgents.map(a => (<tr key={a.id}><td>{a.id}</td><td style={{ fontWeight: 600 }}>{a.name}</td><td><span className="badge" style={{ background: statusBg(a.status), color: 'white', padding: '4px 10px' }}>{a.status}</span></td><td style={{ fontFamily: 'monospace' }}>{a.timeInStatus}</td><td>TESTCAMP</td><td>{a.status === 'READY' ? Math.floor(Math.random() * 3) : 0}</td><td style={{ color: 'var(--text-muted)', fontSize: 12 }}>SES_{a.id}_{Date.now()}</td></tr>))}</tbody>
    </table></div>
  </div>);
}

function OutboundCallingReport({ campaigns }) {
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Outbound Calling Report</div>
    <div className="table-container"><table className="table"><thead><tr><th>Campaign</th><th>Total Calls</th><th>Answered</th><th>No Answer</th><th>Busy</th><th>Dropped</th><th>Avg Talk</th><th>Answer %</th></tr></thead>
      <tbody>{campaigns.map(c => { const total = c.leads || 100; const ans = Math.floor(total * 0.6); return (<tr key={c.id}><td style={{ fontWeight: 600 }}>{c.name}</td><td>{total}</td><td style={{ color: 'var(--success-color)' }}>{ans}</td><td>{Math.floor(total * 0.2)}</td><td>{Math.floor(total * 0.1)}</td><td style={{ color: 'var(--danger-color)' }}>{Math.floor(total * 0.05)}</td><td>2m 34s</td><td style={{ fontWeight: 600 }}>{((ans / total) * 100).toFixed(1)}%</td></tr>);})}</tbody>
    </table></div>
  </div>);
}

function InboundReport() {
  const groups = [{ id: 'SALESLINE', name: 'Main Sales', calls: 45, answered: 38, avgWait: '12s', abandoned: 3 }, { id: 'SUPPORT', name: 'Tech Support', calls: 22, answered: 20, avgWait: '8s', abandoned: 1 }];
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Inbound Report</div>
    <div className="table-container"><table className="table"><thead><tr><th>In-Group</th><th>Group Name</th><th>Total Calls</th><th>Answered</th><th>Abandoned</th><th>Avg Wait</th><th>Answer %</th></tr></thead>
      <tbody>{groups.map(g => (<tr key={g.id}><td style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>{g.id}</td><td>{g.name}</td><td>{g.calls}</td><td style={{ color: 'var(--success-color)' }}>{g.answered}</td><td style={{ color: 'var(--danger-color)' }}>{g.abandoned}</td><td>{g.avgWait}</td><td>{((g.answered / g.calls) * 100).toFixed(1)}%</td></tr>))}</tbody>
    </table></div>
  </div>);
}

function CampaignStatusList({ campaigns, lists }) {
  return (<div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Campaign Status List Report</div>
    <div className="table-container"><table className="table"><thead><tr><th>List ID</th><th>List Name</th><th>Campaign</th><th>Total Leads</th><th>Dialed</th><th>Remaining</th><th>Penetration %</th></tr></thead>
      <tbody>{lists.map(l => (<tr key={l.id}><td style={{ fontWeight: 500 }}>{l.id}</td><td>{l.name}</td><td style={{ color: 'var(--primary-blue)' }}>{l.campaign}</td><td>{l.leads}</td><td>{l.dialed}</td><td>{l.leads - l.dialed}</td><td>{l.leads > 0 ? ((l.dialed / l.leads) * 100).toFixed(1) : 0}%</td></tr>))}</tbody>
    </table></div>
  </div>);
}

function ExportReport({ type }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  return (<div className="card">
    <h2 style={{ marginBottom: '16px' }}>Export {type} Report</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
      <div className="input-group"><label>Date From</label><input type="date" className="input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
      <div className="input-group"><label>Date To</label><input type="date" className="input" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
      <div className="input-group"><label>Campaign</label><select className="input"><option>ALL CAMPAIGNS</option><option>TESTCAMP</option><option>SALESOUT</option></select></div>
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      <button className="btn btn-primary"><Download size={16} /> Export as CSV</button>
      <button className="btn btn-secondary"><Download size={16} /> Export as Excel</button>
    </div>
    <div style={{ marginTop: '24px', padding: '32px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-color)', borderRadius: '8px' }}>
      Select date range and click Export to generate the {type.toLowerCase()} report.
    </div>
  </div>);
}

function ServerPerformance() {
  const metrics = [
    { label: 'CPU Usage', value: '23%', color: 'var(--success-color)' }, { label: 'Memory Usage', value: '61%', color: 'var(--warning-color)' },
    { label: 'Disk I/O', value: '12%', color: 'var(--success-color)' }, { label: 'Network', value: '340 Mbps', color: 'var(--primary-blue)' },
  ];
  const servers = [
    { name: '10.10.10.15', role: 'Asterisk Primary', status: 'ONLINE', uptime: '45 days', channels: 87 },
    { name: '10.10.10.16', role: 'Asterisk Secondary', status: 'ONLINE', uptime: '45 days', channels: 33 },
    { name: '10.10.10.10', role: 'Database / Web', status: 'ONLINE', uptime: '90 days', channels: 0 },
  ];
  return (<>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
      {metrics.map(m => (<div key={m.label} className="card" style={{ borderLeft: `4px solid ${m.color}` }}><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.label}</div><div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{m.value}</div></div>))}
    </div>
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Server Status</div>
      <div className="table-container"><table className="table"><thead><tr><th>Server IP</th><th>Role</th><th>Status</th><th>Uptime</th><th>Active Channels</th></tr></thead>
        <tbody>{servers.map(s => (<tr key={s.name}><td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{s.name}</td><td>{s.role}</td><td><span className="badge badge-success">{s.status}</span></td><td>{s.uptime}</td><td>{s.channels}</td></tr>))}</tbody>
      </table></div>
    </div>
  </>);
}

// --- Main Reports Page ---
export default function Reports() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [activeReport, setActiveReport] = useState('Real-Time Main Report');
  const [showOptions, setShowOptions] = useState(false);
  const { campaigns, lists } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderReport = () => {
    switch (activeReport) {
      case 'Real-Time Main Report': return <RealTimeMain time={currentTime} showOptions={showOptions} setShowOptions={setShowOptions} />;
      case 'Real-Time Campaign Summary': return <CampaignSummary campaigns={campaigns} />;
      case 'Agent Performance Detail': return <AgentPerformance />;
      case 'Agent Time Sheet': return <AgentTimeSheet />;
      case 'Agent Status Detail': return <AgentStatusDetail />;
      case 'Outbound Calling Report': return <OutboundCallingReport campaigns={campaigns} />;
      case 'Inbound Report': return <InboundReport />;
      case 'Campaign Status List Report': return <CampaignStatusList campaigns={campaigns} lists={lists} />;
      case 'Export Calls Report': return <ExportReport type="Calls" />;
      case 'Export Leads Report': return <ExportReport type="Leads" />;
      case 'Server Performance Report': return <ServerPerformance />;
      default: return <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Select a report from the sidebar.</div>;
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Reports</h1>
          <p>Real-time metrics and historical data exports</p>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} className="animate-pulse" /> Live: {currentTime}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Navigation */}
        <div className="card" style={{ width: '280px', height: 'fit-content', flexShrink: 0, padding: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', background: 'var(--bg-color)' }}>Available Reports</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {REPORT_LIST.map(section => (
              <div key={section.section}>
                <div style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderTop: '1px solid var(--border-color)' }}>{section.section}</div>
                {section.items.map(item => (
                  <a key={item} href="#" onClick={(e) => { e.preventDefault(); setActiveReport(item); }}
                    style={{
                      padding: '10px 16px', textDecoration: 'none', display: 'block', cursor: 'pointer',
                      color: activeReport === item ? 'var(--primary-blue)' : 'var(--text-main)',
                      background: activeReport === item ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      borderLeft: activeReport === item ? '3px solid var(--primary-blue)' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >{item}</a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div style={{ flex: 1 }} key={activeReport} className="animate-fade-in">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}
