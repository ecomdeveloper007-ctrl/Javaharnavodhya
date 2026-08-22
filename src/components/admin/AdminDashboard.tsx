import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { JNV_LOGO, handleLogoError } from '../../assets/logo';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Globe,
  Bell,
  GraduationCap,
  Image,
  Vote,
  FileSpreadsheet,
  HeartHandshake,
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  ArrowRight,
  TrendingUp,
  Download,
  Upload,
  Calendar,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  Layers,
  X,
  ChevronDown,
  BookOpen,
  DollarSign,
  Award,
  Compass,
  ExternalLink,
  LogIn
} from 'lucide-react';

import { AdminModerationQueue } from './AdminModerationQueue';
import { AdminUserRoleManager } from './AdminUserRoleManager';
import { AdminWebsiteCMS } from './AdminWebsiteCMS';
import { AdminCommunityCMS } from './AdminCommunityCMS';
import { AdminCSVTools } from './AdminCSVTools';
import { CSVBulkImportModal } from './CSVBulkImportModal';
import { SEED_ROLES_PERMISSIONS } from '../../data/seedData';
import { UserRole } from '../../types';

export const AdminDashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const {
    user,
    currentRole,
    setCurrentRole,
    hasPermission,
    alumni,
    batches,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    events,
    eventRsvps,
    addEvent,
    deleteEvent,
    election,
    nominations,
    approveNomination,
    rejectNomination,
    auditLogs,
    createOrUpdateElection,
    financialReports,
    ledgerTransactions,
    addFinancialReport,
    deleteFinancialReport,
    addLedgerTransaction,
    deleteLedgerTransaction,
    faculty,
    addFaculty,
    deleteFaculty,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    admissionEnquiries,
    donationCampaigns,
    jobs,
    businesses,
    memories,
    achievements,
    toppers,
    vmcMembers,
    schoolSettings,
    exportToCSV,
    getCSVTemplate,
    resetToDefaultSeedData,
    setActiveTab: setGlobalActiveTab,
    setActiveAlumniSubTab,
    setIsAuthModalOpen
  } = useData();

  const isAuthorized = user && (user.isAdmin || hasPermission('access_admin_portal') || user.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com');

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [csvModalModule, setCsvModalModule] = useState<string | null>(null);
  const [isAdminAlumniDropdownOpen, setIsAdminAlumniDropdownOpen] = useState(false);
  const adminAlumniDropdownRef = useRef<HTMLDivElement>(null);

  const handleDownloadSample = (moduleId: string) => {
    const template = getCSVTemplate(moduleId);
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_${moduleId}_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        adminAlumniDropdownRef.current &&
        !adminAlumniDropdownRef.current.contains(e.target as Node)
      ) {
        setIsAdminAlumniDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNavigateToAlumni = (subTab: string) => {
    setGlobalActiveTab('alumni');
    setActiveAlumniSubTab(subTab);
    setIsAdminAlumniDropdownOpen(false);
  };

  const handleNavigateToPublicHome = () => {
    if (onClose) {
      onClose();
    } else {
      setGlobalActiveTab('home');
    }
  };

  // Pending Count for notification badge
  const pendingCount =
    alumni.filter(a => a.verificationStatus === 'pending').length +
    nominations.filter(n => n.status === 'PENDING').length +
    jobs.filter(j => !j.isActive).length +
    businesses.filter(b => !b.isVerified).length +
    memories.filter(m => !m.isApproved).length +
    achievements.filter(a => !a.isApproved).length +
    admissionEnquiries.filter(e => e.status === 'New').length;

  // New Notice Form Modal
  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'General' as const,
    publishDate: new Date().toISOString().split('T')[0],
    targetAudience: 'All' as const,
    content: '',
    isPinned: false,
    referenceNo: ''
  });

  // New Event Form Modal
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Reunion' as const,
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 04:00 PM',
    location: 'JNV Pachpadra Campus',
    isOnline: false,
    isAlumniEvent: true,
    maxCapacity: 200,
    description: '',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=350&fit=crop'
  });

  // New Report Modal
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    financialYear: '2025-2026',
    category: 'Annual Audit Report' as const,
    reportSummary: '',
    visibility: 'public' as const,
    publishedDate: new Date().toISOString().split('T')[0],
    auditorName: 'M/s Chartered Accountants',
    amountAudited: 1000000,
    status: 'Published' as const
  });

  // New Ledger Modal
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    transactionId: `TXN-${Date.now()}`,
    type: 'CREDIT' as const,
    category: 'Donations' as const,
    amount: 25000,
    description: '',
    date: new Date().toISOString().split('T')[0],
    visibility: 'public' as const,
    auditedBy: 'CA Auditor',
    payeeOrDonor: ''
  });

  // New Faculty Modal
  const [isNewFacultyOpen, setIsNewFacultyOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    designation: 'PGT Teacher',
    department: 'Physics' as const,
    qualification: 'M.Sc., B.Ed.',
    experienceYears: 8,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    email: '',
    phone: '',
    bio: ''
  });

  // New Gallery Modal
  const [isNewGalleryOpen, setIsNewGalleryOpen] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Campus' as const,
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop',
    caption: '',
    uploadedAt: new Date().toISOString().split('T')[0]
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    addNotice(newNotice);
    setIsNewNoticeOpen(false);
    setNewNotice({
      title: '',
      category: 'General',
      publishDate: new Date().toISOString().split('T')[0],
      targetAudience: 'All',
      content: '',
      isPinned: false,
      referenceNo: ''
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    addEvent(newEvent);
    setIsNewEventOpen(false);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title) return;
    addFinancialReport(newReport);
    setIsNewReportOpen(false);
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    addLedgerTransaction(newTx);
    setIsNewTxOpen(false);
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name) return;
    addFaculty(newFaculty);
    setIsNewFacultyOpen(false);
  };

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.imageUrl) return;
    addGalleryItem(newGallery);
    setIsNewGalleryOpen(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-950 text-slate-100" id="admin-access-restricted">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Master Admin Portal Access Restricted</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This administrative interface is reserved for authorized institutional officers and executive alumni managers. Please sign in with your verified Super Admin Google account.
            </p>
          </div>
          <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
            <div className="font-semibold text-slate-300">Designated Super Administrator:</div>
            <div className="font-mono text-amber-300 break-all bg-slate-900 px-2 py-1 rounded border border-slate-800 font-bold">
              prakashinfosys1234@gmail.com
            </div>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
            <button
              onClick={handleNavigateToPublicHome}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24" id="admin-master-portal">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-700 p-0.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
              <img
                src={JNV_LOGO}
                onError={handleLogoError}
                alt="Navodaya Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base sm:text-lg tracking-tight">
                  Master Administrative Portal
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Jawahar Navodaya Vidyalaya Pachpadra, Dist. Balotra / Barmer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Alumni Hub Dropdown directly inside Admin */}
            <div className="relative" ref={adminAlumniDropdownRef}>
              <button
                type="button"
                id="admin-alumni-hub-dropdown-btn"
                onClick={() => setIsAdminAlumniDropdownOpen(!isAdminAlumniDropdownOpen)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                title="Navigate to Alumni Hub"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Alumni Hub</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAdminAlumniDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAdminAlumniDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800 text-slate-200">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                    <span>Jump to Alumni Section</span>
                    <span className="text-slate-500 font-mono">PAA</span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigateToAlumni('directory')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>Alumni Directory</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('batches')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Batch Rosters</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('events')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reunions & RSVPs</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('elections')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <Vote className="w-3.5 h-3.5 text-rose-400" />
                      <span>Live Elections (E-Ballot)</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('financials')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                      <span>Financial Ledger</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('jobs')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Careers & Businesses</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('memories')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <Image className="w-3.5 h-3.5 text-amber-400" />
                      <span>Memories & Wall of Fame</span>
                    </button>
                    <button
                      onClick={() => handleNavigateToAlumni('welfare')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2.5 cursor-pointer text-slate-200 hover:text-white"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Welfare & Giving Back</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Public Website */}
            <button
              onClick={handleNavigateToPublicHome}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition cursor-pointer"
              title="Return to School Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Website</span>
            </button>

            {/* Role Switcher for preview */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium hidden md:inline">Role:</span>
              <select
                id="active-role-switcher"
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-amber-400 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="super_admin" className="bg-slate-900 text-white">Super Admin</option>
                <option value="alumni_manager" className="bg-slate-900 text-white">Alumni Manager</option>
                <option value="election_officer" className="bg-slate-900 text-white">Election Officer</option>
                <option value="auditor" className="bg-slate-900 text-white">Financial Auditor</option>
                <option value="alumnus" className="bg-slate-900 text-white">Alumnus</option>
              </select>
            </div>

            {onClose && (
              <button
                id="close-admin-portal-btn"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Exit Admin Portal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/80 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
              { id: 'moderation', label: 'Approvals Queue', icon: CheckCircle, badge: pendingCount },
              { id: 'users', label: 'Users & Roles', icon: Users },
              { id: 'website', label: 'Website & CMS', icon: Globe },
              { id: 'notices', label: 'Notices & Circulars', icon: Bell },
              { id: 'faculty', label: 'Faculty Directory', icon: GraduationCap },
              { id: 'gallery', label: 'Gallery Media', icon: Image },
              { id: 'elections', label: 'Elections & Ballot', icon: Vote },
              { id: 'finance', label: 'Finance & Ledger', icon: FileSpreadsheet },
              { id: 'community', label: 'Community & Welfare', icon: HeartHandshake },
              { id: 'data', label: 'Data Hub & CSV', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950 animate-pulse'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* 1. OVERVIEW & COMMAND CENTER */}
        {activeTab === 'overview' && (
          <div className="space-y-6" id="admin-overview-section">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div
                onClick={() => setActiveTab('moderation')}
                className="bg-slate-900/80 border border-amber-500/40 rounded-2xl p-4 cursor-pointer hover:border-amber-400 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">Action</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {pendingCount}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Pending Approvals</div>
              </div>

              <div
                onClick={() => setActiveTab('users')}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between text-blue-400 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">Alumni</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {alumni.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Registered Alumni</div>
              </div>

              <div
                onClick={() => setActiveTab('website')}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Merit</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {toppers.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Board Toppers</div>
              </div>

              <div
                onClick={() => setActiveTab('elections')}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between text-purple-400 mb-2">
                  <Vote className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">Ballot</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">
                  {election.status}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Election Status</div>
              </div>

              <div
                onClick={() => setActiveTab('finance')}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between text-teal-400 mb-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold bg-teal-500/10 px-1.5 py-0.5 rounded">Ledger</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-teal-400 transition-colors">
                  {ledgerTransactions.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Audited Entries</div>
              </div>

              <div
                onClick={() => setActiveTab('community')}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-slate-700 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between text-rose-400 mb-2">
                  <HeartHandshake className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">Welfare</span>
                </div>
                <div className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">
                  {donationCampaigns.length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Active Fundraisers</div>
              </div>
            </div>

            {/* Fast Action Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Approvals Snapshot */}
              <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Quick Action Moderation</h3>
                      <p className="text-xs text-slate-400">Items requiring administrative decision</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('moderation')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    Open Full Queue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {pendingCount === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      All queues clear. No pending approvals at this time.
                    </div>
                  ) : (
                    <>
                      {alumni
                        .filter(a => a.verificationStatus === 'pending')
                        .slice(0, 3)
                        .map(alum => (
                          <div
                            key={alum.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                                alt={alum.fullName}
                                className="w-9 h-9 rounded-lg object-cover"
                              />
                              <div>
                                <div className="text-sm font-bold text-white">{alum.fullName}</div>
                                <div className="text-xs text-slate-400">
                                  Batch {alum.batchYear} • {alum.email}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveTab('moderation')}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                            >
                              Review
                            </button>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>

              {/* Quick CMS Shortcuts */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  Quick CMS Updates
                </h3>
                <p className="text-xs text-slate-400">Jump directly to website content editors</p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('website')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-left transition-colors border border-amber-500/30 cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">Hero Slider Banners & Images</div>
                      <div className="text-[11px] text-slate-300">Upload slider images, edit captions & CTAs</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('website')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-left transition-colors border border-slate-700/60 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Institutional Settings & Ticker</div>
                      <div className="text-[11px] text-slate-400">Name, code, marquee banner notice</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('website')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-left transition-colors border border-slate-700/60"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Principal's Desk & Vision</div>
                      <div className="text-[11px] text-slate-400">Principal message and photo</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-left transition-colors border border-slate-700/60"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Assign User & Admin Roles</div>
                      <div className="text-[11px] text-slate-400">Promote managers, auditors, officers</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('data')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-left transition-colors border border-slate-700/60"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">CSV Data Backups & Import</div>
                      <div className="text-[11px] text-slate-400">Bulk manage alumni, ledger, faculty</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. APPROVALS & MODERATION QUEUE */}
        {activeTab === 'moderation' && <AdminModerationQueue />}

        {/* 3. USER & ROLE MANAGEMENT */}
        {activeTab === 'users' && <AdminUserRoleManager />}

        {/* 4. WEBSITE & CMS UPDATE */}
        {activeTab === 'website' && <AdminWebsiteCMS />}

        {/* 5. NOTICES & CIRCULARS */}
        {activeTab === 'notices' && (
          <div className="space-y-6" id="admin-notices-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Official Notices & Circulars CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Publish, update and manage institutional announcements</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="download-notices-sample-csv-btn"
                  onClick={() => handleDownloadSample('notices')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                  title="Download sample notices CSV template"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Data</span>
                </button>
                <button
                  id="upload-notices-csv-btn"
                  onClick={() => setCsvModalModule('notices')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                  title="Bulk upload or update notices via CSV"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload through CSV</span>
                </button>
                <button
                  onClick={() => setIsNewNoticeOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Publish Notice
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  id={`notice-card-${notice.id}`}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {notice.category}
                      </span>
                      <span className="text-xs text-slate-400">{notice.publishDate}</span>
                    </div>
                    <h4 className="font-bold text-white text-base mt-2">{notice.title}</h4>
                    {notice.referenceNo && (
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">Ref: {notice.referenceNo}</div>
                    )}
                    <p className="text-xs text-slate-300 line-clamp-3 mt-2">{notice.content}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => updateNotice(notice.id, { isPinned: !notice.isPinned })}
                      className={`text-xs font-semibold ${notice.isPinned ? 'text-amber-400' : 'text-slate-400'}`}
                    >
                      {notice.isPinned ? '★ Pinned to Top' : '☆ Pin Notice'}
                    </button>
                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-800 text-rose-300"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* New Notice Modal */}
            {isNewNoticeOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Publish New Official Notice</h3>
                  <form onSubmit={handleCreateNotice} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Notice Title *</label>
                      <input
                        type="text"
                        required
                        value={newNotice.title}
                        onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                        <select
                          value={newNotice.category}
                          onChange={e => setNewNotice({ ...newNotice, category: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Academic">Academic</option>
                          <option value="Admission">Admission</option>
                          <option value="General">General</option>
                          <option value="Tender">Tender</option>
                          <option value="Alumni">Alumni</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Ref Number</label>
                        <input
                          type="text"
                          value={newNotice.referenceNo}
                          onChange={e => setNewNotice({ ...newNotice, referenceNo: e.target.value })}
                          placeholder="e.g. JNV/PCH/2026/08"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Notice Content *</label>
                      <textarea
                        rows={5}
                        required
                        value={newNotice.content}
                        onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsNewNoticeOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                      >
                        Publish Notice
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. FACULTY & STAFF DIRECTORY */}
        {activeTab === 'faculty' && (
          <div className="space-y-6" id="admin-faculty-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Faculty & Staff Directory CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Manage teachers, qualifications, and department rosters</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="download-faculty-sample-csv-btn"
                  onClick={() => handleDownloadSample('faculty')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                  title="Download sample faculty CSV template"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Data</span>
                </button>
                <button
                  id="upload-faculty-csv-btn"
                  onClick={() => setCsvModalModule('faculty')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                  title="Bulk upload or update faculty records via CSV"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload through CSV</span>
                </button>
                <button
                  onClick={() => setIsNewFacultyOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Faculty
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faculty.map(f => (
                <div
                  key={f.id}
                  id={`faculty-card-${f.id}`}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={f.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}
                        alt={f.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{f.name}</h4>
                        <div className="text-xs text-emerald-400 font-semibold">{f.designation}</div>
                        <div className="text-[11px] text-slate-400">{f.department} Department</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1 text-slate-300">
                      <div><strong>Qualification:</strong> {f.qualification}</div>
                      <div><strong>Experience:</strong> {f.experienceYears} Years</div>
                      {f.email && <div><strong>Email:</strong> {f.email}</div>}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                    <button
                      onClick={() => deleteFaculty(f.id)}
                      className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-800 text-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* New Faculty Modal */}
            {isNewFacultyOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Add Faculty Member</h3>
                  <form onSubmit={handleCreateFaculty} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Teacher Name *</label>
                      <input
                        type="text"
                        required
                        value={newFaculty.name}
                        onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Designation</label>
                        <input
                          type="text"
                          value={newFaculty.designation}
                          onChange={e => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                        <input
                          type="text"
                          value={newFaculty.department}
                          onChange={e => setNewFaculty({ ...newFaculty, department: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsNewFacultyOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Save Teacher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. GALLERY & MEDIA */}
        {activeTab === 'gallery' && (
          <div className="space-y-6" id="admin-gallery-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Campus Gallery Media CMS</h2>
                <p className="text-xs text-slate-400 mt-1">Upload and organize campus albums, events, and sports media</p>
              </div>
              <button
                onClick={() => setIsNewGalleryOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Gallery Photo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(g => (
                <div key={g.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden group">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white truncate">{g.title}</div>
                    <div className="text-[11px] text-slate-400">{g.category}</div>
                    <button
                      onClick={() => deleteGalleryItem(g.id)}
                      className="mt-2 text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Delete Photo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* New Gallery Modal */}
            {isNewGalleryOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Add Gallery Photo</h3>
                  <form onSubmit={handleCreateGallery} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={newGallery.title}
                        onChange={e => setNewGallery({ ...newGallery, title: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={newGallery.imageUrl}
                        onChange={e => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                      <select
                        value={newGallery.category}
                        onChange={e => setNewGallery({ ...newGallery, category: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Campus">Campus</option>
                        <option value="Academic">Academic</option>
                        <option value="Sports">Sports</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Alumni Meet">Alumni Meet</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsNewGalleryOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                      >
                        Save Photo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. ELECTIONS & BALLOTS */}
        {activeTab === 'elections' && (
          <div className="space-y-6" id="admin-elections-section">
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300">
                    Status: {election.status}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">{election.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Term: {election.term}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      createOrUpdateElection({
                        ...election,
                        status: election.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE'
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Toggle {election.status === 'ACTIVE' ? 'Complete Election' : 'Activate Live Voting'}
                  </button>
                </div>
              </div>
            </div>

            {/* Positions & Tally */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {election.positions.map(pos => (
                <div key={pos.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{pos.title}</h4>
                    <span className="text-xs text-purple-400 font-bold">{pos.candidates.length} Candidates</span>
                  </div>
                  <p className="text-xs text-slate-400">{pos.description}</p>
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {pos.candidates.map(cand => (
                      <div
                        key={cand.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 text-xs"
                      >
                        <div>
                          <strong className="text-white">{cand.name}</strong>
                          <span className="text-slate-400 ml-2">Batch {cand.batch}</span>
                        </div>
                        <span className="font-bold text-amber-400">{cand.votes} Votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. FINANCIAL TRANSPARENCY & LEDGER */}
        {activeTab === 'finance' && (
          <div className="space-y-6" id="admin-finance-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Financial Transparency & Double-Entry Ledger</h2>
                <p className="text-xs text-slate-400 mt-1">Audit reports, donor utilization, and chartered ledger</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="download-ledger-sample-csv-btn"
                  onClick={() => handleDownloadSample('ledger')}
                  className="px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                  title="Download sample financial ledger CSV template"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Data</span>
                </button>
                <button
                  id="upload-ledger-csv-btn"
                  onClick={() => setCsvModalModule('ledger')}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
                  title="Bulk upload or update ledger entries via CSV"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload through CSV</span>
                </button>
                <button
                  onClick={() => setIsNewTxOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                >
                  + Add Transaction
                </button>
                <button
                  onClick={() => setIsNewReportOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
                >
                  + Publish Audit Report
                </button>
              </div>
            </div>

            {/* Ledger Entries Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 font-bold text-white text-sm">
                Recent Audited Ledger Transactions ({ledgerTransactions.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-[11px] uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Tx ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Category & Description</th>
                      <th className="px-4 py-3">Audited By</th>
                      <th className="px-4 py-3 text-right">Amount (INR)</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {ledgerTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono text-slate-400">{tx.transactionId}</td>
                        <td className="px-4 py-3">{tx.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              tx.type === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{tx.description}</div>
                          <div className="text-[10px] text-slate-400">{tx.category} • {tx.payeeOrDonor || 'Alumni Fund'}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{tx.auditedBy}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-white">
                          ₹{(tx.amount ?? 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => deleteLedgerTransaction(tx.id)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Tx Modal */}
            {isNewTxOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Record Audited Ledger Entry</h3>
                  <form onSubmit={handleCreateTx} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                        <select
                          value={newTx.type}
                          onChange={e => setNewTx({ ...newTx, type: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                        >
                          <option value="CREDIT">CREDIT (Inflow)</option>
                          <option value="DEBIT">DEBIT (Outflow)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Amount (INR) *</label>
                        <input
                          type="number"
                          required
                          value={newTx.amount}
                          onChange={e => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Description *</label>
                      <input
                        type="text"
                        required
                        value={newTx.description}
                        onChange={e => setNewTx({ ...newTx, description: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsNewTxOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                      >
                        Record Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 10. COMMUNITY & WELFARE CMS */}
        {activeTab === 'community' && <AdminCommunityCMS />}

        {/* 11. DATA HUB & CSV TOOLS */}
        {activeTab === 'data' && (
          <div className="space-y-6" id="admin-data-hub-section">
            <AdminCSVTools />
          </div>
        )}
      </main>

      {/* CSV Bulk Import & Update Universal Modal */}
      <CSVBulkImportModal
        isOpen={!!csvModalModule}
        onClose={() => setCsvModalModule(null)}
        initialModule={csvModalModule || 'alumni'}
      />
    </div>
  );
};
