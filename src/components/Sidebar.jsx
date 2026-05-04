import { NavLink } from 'react-router-dom';
import { Phone, Users, BarChart2, Settings, Headphones, MonitorPlay, FileText, Filter, PhoneIncoming, Server } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Agent Screen', path: '/agent', icon: <MonitorPlay size={20} /> },
    { name: 'CRM Contacts', path: '/', icon: <Users size={20} /> },
    { name: 'Campaigns', path: '/campaigns', icon: <BarChart2 size={20} /> },
    { name: 'Lists', path: '/lists', icon: <Users size={20} /> },
    { name: 'Recordings', path: '/recordings', icon: <Headphones size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Carriers', path: '/carriers', icon: <Settings size={20} /> },
    { name: 'Custom Fields', path: '/custom-fields', icon: <Settings size={20} /> },
    { name: 'Scripts', path: '/scripts', icon: <FileText size={20} /> },
    { name: 'Filters', path: '/filters', icon: <Filter size={20} /> },
    { name: 'Inbound', path: '/inbound', icon: <PhoneIncoming size={20} /> },
    { name: 'User Groups', path: '/user-groups', icon: <Users size={20} /> },
    { name: 'Remote Agents', path: '/remote-agents', icon: <Headphones size={20} /> },
    { name: 'Admin / System', path: '/admin', icon: <Server size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '6px', borderRadius: '8px' }}>
          <Phone size={24} />
        </div>
        <h2>ELITE DIALER</h2>
      </div>
      
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
