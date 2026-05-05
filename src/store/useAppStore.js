import { create } from 'zustand';

// Default credentials
const CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', level: 9 },
  { username: 'agent1', password: 'agent123', role: 'agent', name: 'Agent John', level: 1 },
  { username: 'agent2', password: 'agent123', role: 'agent', name: 'Agent Sarah', level: 1 },
  { username: '6666', password: 'admin123', role: 'admin', name: 'Super Admin', level: 9 },
  { username: '1001', password: 'agent123', role: 'agent', name: 'Agent Mike', level: 1 },
];

// Mock data
const mockContacts = Array.from({ length: 50 }).map((_, i) => ({
  id: `C${i + 1}`,
  name: `Test Contact ${i + 1}`,
  company: `Company ${i % 5 + 1}`,
  phone: `+155501${Math.floor(Math.random() * 9000) + 1000}`,
  email: `contact${i + 1}@example.com`,
  status: ['Lead', 'Customer', 'Prospect'][Math.floor(Math.random() * 3)],
  lastContact: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
}));

const mockRecordings = Array.from({ length: 20 }).map((_, i) => ({
  id: `R${i + 1}`,
  date: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
  number: `+155501${Math.floor(Math.random() * 9000) + 1000}`,
  agent: `Agent ${Math.floor(Math.random() * 5) + 1}`,
  duration: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 59)}s`,
  disposition: ['Sale', 'No Answer', 'Follow Up', 'Not Interested'][Math.floor(Math.random() * 4)]
}));

export const useAppStore = create((set) => ({
  // Auth State
  isAuthenticated: false,
  currentUser: null,
  userRole: null,
  selectedCampaign: null,
  
  login: (username, password, role, campaignId) => {
    const user = CREDENTIALS.find(c => c.username === username && c.password === password && c.role === role);
    if (user) {
      set({ isAuthenticated: true, currentUser: user, userRole: user.role, selectedCampaign: campaignId || null });
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password. Please try again.' };
  },
  
  logout: () => set({ isAuthenticated: false, currentUser: null, userRole: null, selectedCampaign: null }),

  // CRM State
  contacts: mockContacts,
  recordings: mockRecordings,
  
  // Dialer State
  isDialerOpen: false,
  toggleDialer: () => set((state) => ({ isDialerOpen: !state.isDialerOpen })),
  
  activeLine: 1,
  setActiveLine: (line) => set({ activeLine: line }),

  lines: {
    1: { status: 'idle', number: '', duration: 0 },
    2: { status: 'idle', number: '', duration: 0 },
  },

  setLineState: (line, data) => set((state) => ({
    lines: {
      ...state.lines,
      [line]: { ...state.lines[line], ...data }
    }
  })),

  // Mock Actions
  dialNumber: (number) => set((state) => {
    if (state.lines[state.activeLine].status === 'idle') {
      return {
        isDialerOpen: true,
        lines: {
          ...state.lines,
          [state.activeLine]: { status: 'calling', number, duration: 0 }
        }
      };
    }
    return {};
  }),

  hangup: (line) => set((state) => ({
    lines: {
      ...state.lines,
      [line]: { status: 'idle', number: '', duration: 0 }
    }
  })),

  answer: (line) => set((state) => ({
    lines: {
      ...state.lines,
      [line]: { ...state.lines[line], status: 'connected' }
    }
  })),

  // Autodialer State
  agentStatus: 'PAUSED',
  currentLead: null,
  callDuration: 0,
  
  setAgentStatus: (status) => set({ agentStatus: status }),
  
  simulateIncomingCall: () => set((state) => {
    const randomLead = state.contacts[Math.floor(Math.random() * state.contacts.length)];
    return {
      agentStatus: 'INCALL',
      currentLead: randomLead,
      callDuration: 0,
      lines: { ...state.lines, 1: { status: 'connected', number: randomLead.phone, duration: 0 } }
    };
  }),

  hangupAutodialer: () => set((state) => ({
    agentStatus: 'DISPO',
    lines: { ...state.lines, 1: { status: 'idle', number: '', duration: 0 } }
  })),

  submitDisposition: (dispoCode) => set({ agentStatus: 'READY', currentLead: null }),

  // Admin Custom Fields Setup
  customFieldsSetup: [
    { id: 'cf_1', label: 'Budget' },
    { id: 'cf_2', label: 'Decision Maker' }
  ],
  addCustomField: (label) => set((state) => ({ 
    customFieldsSetup: [...state.customFieldsSetup, { id: `cf_${Date.now()}`, label }] 
  })),
  removeCustomField: (id) => set((state) => ({ 
    customFieldsSetup: state.customFieldsSetup.filter(f => f.id !== id) 
  })),

  // ===== CAMPAIGNS =====
  campaigns: [
    { id: '1000', name: 'TESTCAMP', method: 'PREDICT', level: 3.0, status: 'ACTIVE', leads: 4520 },
    { id: '1001', name: 'SALESOUT', method: 'RATIO', level: 2.0, status: 'INACTIVE', leads: 0 },
    { id: '1002', name: 'INBOUND', method: 'INBOUND_MAN', level: 1.0, status: 'ACTIVE', leads: 150 },
  ],
  addCampaign: (campaign) => set((state) => ({ campaigns: [...state.campaigns, campaign] })),

  // Campaign Statuses (dispositions per campaign)
  campaignStatuses: [
    { id: 'SALE', name: 'Sale Made', category: 'SALE', humanAnswer: 'Y', scheduled: 'N' },
    { id: 'NI', name: 'Not Interested', category: 'REJECT', humanAnswer: 'Y', scheduled: 'N' },
    { id: 'NA', name: 'No Answer', category: 'UNDEFINED', humanAnswer: 'N', scheduled: 'N' },
    { id: 'CB', name: 'Call Back', category: 'CALLBACK', humanAnswer: 'Y', scheduled: 'Y' },
    { id: 'DNC', name: 'Do Not Call', category: 'DNC', humanAnswer: 'Y', scheduled: 'N' },
    { id: 'B', name: 'Busy Signal', category: 'UNDEFINED', humanAnswer: 'N', scheduled: 'N' },
    { id: 'A', name: 'Answering Machine', category: 'UNDEFINED', humanAnswer: 'N', scheduled: 'N' },
    { id: 'VM', name: 'Left Voicemail', category: 'CONTACT', humanAnswer: 'N', scheduled: 'N' },
  ],
  addCampaignStatus: (status) => set((state) => ({ campaignStatuses: [...state.campaignStatuses, status] })),

  // HotKeys
  hotkeys: [
    { key: '1', status: 'SALE', description: 'Sale Made' },
    { key: '2', status: 'NI', description: 'Not Interested' },
    { key: '3', status: 'CB', description: 'Call Back' },
    { key: '4', status: 'DNC', description: 'Do Not Call' },
  ],
  addHotkey: (hk) => set((state) => ({ hotkeys: [...state.hotkeys, hk] })),

  // Pause Codes
  pauseCodes: [
    { id: 'BREAK', name: 'Break', billable: 'NO' },
    { id: 'LUNCH', name: 'Lunch', billable: 'NO' },
    { id: 'TRAIN', name: 'Training', billable: 'HALF' },
    { id: 'MEETING', name: 'Team Meeting', billable: 'YES' },
  ],
  addPauseCode: (pc) => set((state) => ({ pauseCodes: [...state.pauseCodes, pc] })),

  // Lead Recycle
  leadRecycle: [
    { status: 'NA', attempts: 3, delay: 60 },
    { status: 'B', attempts: 5, delay: 30 },
  ],
  addLeadRecycle: (lr) => set((state) => ({ leadRecycle: [...state.leadRecycle, lr] })),

  // ===== USERS =====
  users: [
    { id: '6666', name: 'Admin User', level: 9, group: 'ADMIN', active: 'Y' },
    { id: '1001', name: 'Agent John', level: 1, group: 'AGENTS', active: 'Y' },
    { id: '1002', name: 'Agent Sarah', level: 1, group: 'AGENTS', active: 'Y' },
    { id: '2001', name: 'Closer Mike', level: 5, group: 'CLOSERS', active: 'Y' },
  ],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),

  // ===== LISTS =====
  lists: [
    { id: '999', name: 'Default Test List', campaign: '1000 - TESTCAMP', active: 'Y', leads: 4520, dialed: 1200 },
    { id: '1001', name: 'Web Leads - March', campaign: '1001 - SALESOUT', active: 'N', leads: 500, dialed: 500 },
  ],
  addList: (list) => set((state) => ({ lists: [...state.lists, list] })),

  // ===== SCRIPTS =====
  scripts: [],
  addScript: (script) => set((state) => ({ scripts: [...state.scripts, script] })),

  // ===== FILTERS =====
  filters: [
    { id: 'DROP72HOUR', name: 'UK 72 hour Drop No Call', sql: "called_since_last_reset='Y' AND status IN ('DROP')", group: '---ALL---' },
  ],
  addFilter: (filter) => set((state) => ({ filters: [...state.filters, filter] })),

  // ===== INBOUND =====
  inboundGroups: [
    { id: 'SALESLINE', name: 'Main Sales Queue', color: '#FF0000', active: 'Y' },
  ],
  addInboundGroup: (group) => set((state) => ({ inboundGroups: [...state.inboundGroups, group] })),

  // DIDs
  dids: [
    { id: '12029641690', description: '12029641690', carrier: '', active: 'Y', group: '---ALL---', route: 'IN_GROUP', recording: 'N' },
    { id: '12143303332', description: '12143303332', carrier: '', active: 'Y', group: '---ALL---', route: 'IN_GROUP', recording: 'N' },
    { id: '13187238022', description: '13187238022', carrier: '', active: 'Y', group: '---ALL---', route: 'IN_GROUP', recording: 'N' },
    { id: '14047261214', description: '14047261214', carrier: '', active: 'Y', group: 'elitetrackers', route: 'IN_GROUP', recording: 'N' },
    { id: '14074204539', description: '14074204539', carrier: '', active: 'Y', group: '---ALL---', route: 'IN_GROUP', recording: 'N' },
  ],
  addDid: (did) => set((state) => ({ dids: [...state.dids, did] })),

  // Call Menus
  callMenus: [],
  addCallMenu: (menu) => set((state) => ({ callMenus: [...state.callMenus, menu] })),

  // Filter Phone Groups
  filterPhoneGroups: [],
  addFilterPhoneGroup: (fpg) => set((state) => ({ filterPhoneGroups: [...state.filterPhoneGroups, fpg] })),

  // ===== USER GROUPS =====
  userGroups: [
    { id: 'ADMIN', name: 'VICIdial Administrators', campaigns: 'ALL CAMPAIGNS', shifts: '24HR' },
    { id: 'AGENTS', name: 'Standard Agents', campaigns: 'TESTCAMP', shifts: '9AM-5PM' },
  ],
  addUserGroup: (group) => set((state) => ({ userGroups: [...state.userGroups, group] })),

  // ===== REMOTE AGENTS =====
  remoteAgents: [],
  addRemoteAgent: (agent) => set((state) => ({ remoteAgents: [...state.remoteAgents, agent] })),

  // ===== ADMIN ENTITIES =====
  // Phones
  phones: [
    { extension: '100', server: '10.10.10.15', dialplanNum: '100', voicemail: 'vm100', protocol: 'SIP', status: 'ACTIVE' },
    { extension: '101', server: '10.10.10.15', dialplanNum: '101', voicemail: 'vm101', protocol: 'SIP', status: 'ACTIVE' },
    { extension: '102', server: '10.10.10.15', dialplanNum: '102', voicemail: '', protocol: 'SIP', status: 'ACTIVE' },
  ],
  addPhone: (phone) => set((state) => ({ phones: [...state.phones, phone] })),

  // Conferences
  conferences: [
    { id: '9600', name: 'Main Conference', server: '10.10.10.15' },
    { id: '9601', name: 'Agent Bridge', server: '10.10.10.15' },
  ],
  addConference: (conf) => set((state) => ({ conferences: [...state.conferences, conf] })),

  // Servers
  servers: [
    { id: '10.10.10.15', name: 'Asterisk Primary', active: 'Y', asteriskVersion: '13.29.2-vici', channels: 120, uptime: '45 days' },
    { id: '10.10.10.16', name: 'Asterisk Secondary', active: 'Y', asteriskVersion: '13.29.2-vici', channels: 60, uptime: '45 days' },
  ],
  addServer: (srv) => set((state) => ({ servers: [...state.servers, srv] })),

  // Music On Hold
  musicOnHold: [
    { id: 'default', name: 'Default Hold Music', file: 'default_moh.wav' },
    { id: 'sales', name: 'Sales Hold Music', file: 'sales_moh.wav' },
  ],
  addMusicOnHold: (moh) => set((state) => ({ musicOnHold: [...state.musicOnHold, moh] })),

  // Voicemail
  voicemailBoxes: [
    { id: 'vm100', extension: '100', email: 'agent1@elite.com', greeting: 'default', active: 'Y' },
    { id: 'vm101', extension: '101', email: 'agent2@elite.com', greeting: 'default', active: 'Y' },
  ],
  addVoicemailBox: (vm) => set((state) => ({ voicemailBoxes: [...state.voicemailBoxes, vm] })),

  // System Statuses
  systemStatuses: [
    { id: 'NEW', name: 'New Lead', category: 'UNDEFINED', humanAnswer: 'N', selectable: 'N' },
    { id: 'QUEUE', name: 'In Queue', category: 'UNDEFINED', humanAnswer: 'N', selectable: 'N' },
    { id: 'INCALL', name: 'In Call', category: 'UNDEFINED', humanAnswer: 'N', selectable: 'N' },
    { id: 'DROP', name: 'Agent Dropped', category: 'UNDEFINED', humanAnswer: 'N', selectable: 'N' },
    { id: 'XFER', name: 'Transferred', category: 'UNDEFINED', humanAnswer: 'Y', selectable: 'N' },
  ],
  addSystemStatus: (ss) => set((state) => ({ systemStatuses: [...state.systemStatuses, ss] })),

  // Call Times
  callTimes: [
    { id: '24hours', name: '24 Hours', start: '0:00', end: '23:59', days: 'Mon-Sun' },
    { id: '9am-9pm', name: '9 AM to 9 PM', start: '9:00', end: '21:00', days: 'Mon-Fri' },
    { id: '9am-5pm', name: '9 AM to 5 PM', start: '9:00', end: '17:00', days: 'Mon-Fri' },
  ],
  addCallTime: (ct) => set((state) => ({ callTimes: [...state.callTimes, ct] })),

  // Shifts
  shifts: [
    { id: '24HR', name: '24 Hour Shift', start: '0:00', end: '23:59' },
    { id: 'AM', name: 'Morning Shift', start: '6:00', end: '14:00' },
    { id: 'PM', name: 'Afternoon Shift', start: '14:00', end: '22:00' },
  ],
  addShift: (shift) => set((state) => ({ shifts: [...state.shifts, shift] })),

  // Audio Store
  audioFiles: [
    { id: 'greeting1', name: 'Welcome Greeting', file: 'greeting1.wav', size: '245 KB' },
    { id: 'hold1', name: 'Hold Music 1', file: 'hold_music_1.wav', size: '1.2 MB' },
    { id: 'ivr_prompt', name: 'IVR Main Prompt', file: 'ivr_main.wav', size: '380 KB' },
  ],
  addAudioFile: (af) => set((state) => ({ audioFiles: [...state.audioFiles, af] })),
}));
