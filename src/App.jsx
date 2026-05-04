import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DialerWidget from './components/DialerWidget';
import AgentScreen from './pages/AgentScreen';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Lists from './pages/Lists';
import Users from './pages/Users';
import Carriers from './pages/Carriers';
import CustomFields from './pages/CustomFields';
import Recordings from './pages/Recordings';
import Reports from './pages/Reports';
import Scripts from './pages/Scripts';
import Filters from './pages/Filters';
import Inbound from './pages/Inbound';
import UserGroups from './pages/UserGroups';
import RemoteAgents from './pages/RemoteAgents';
import AdminSettings from './pages/AdminSettings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />
        
        <div className="main-content">
          <Topbar />
          
          <div className="content-wrapper">
            <Routes>
              <Route path="/agent" element={<AgentScreen />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/users" element={<Users />} />
              <Route path="/carriers" element={<Carriers />} />
              <Route path="/custom-fields" element={<CustomFields />} />
              <Route path="/recordings" element={<Recordings />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* New VICIdial Admin Sections */}
              <Route path="/scripts" element={<Scripts />} />
              <Route path="/filters" element={<Filters />} />
              <Route path="/inbound" element={<Inbound />} />
              <Route path="/user-groups" element={<UserGroups />} />
              <Route path="/remote-agents" element={<RemoteAgents />} />
              <Route path="/admin" element={<AdminSettings />} />
              
              <Route path="/settings" element={<div className="content-area animate-fade-in"><h1>Settings (Coming Soon)</h1></div>} />
            </Routes>
          </div>
        </div>

        <DialerWidget />
      </div>
    </Router>
  );
}

export default App;
