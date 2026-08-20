import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Shield,
  Key,
  Award,
  Lock,
  Unlock,
  Mail,
  Phone,
  Building,
  MapPin,
  Plus,
  Save,
  X,
  Upload,
  Download,
  FileSpreadsheet,
  Eye,
  Check,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Heart,
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ListFilter,
  Sliders
} from 'lucide-react';
import { UserRole, AlumniProfile, HouseType } from '../../types';
import { SEED_ROLES_PERMISSIONS } from '../../data/seedData';
import { CSVBulkImportModal } from './CSVBulkImportModal';
import { RoleAccessMatrix, ROLE_METADATA } from './RoleAccessMatrix';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces'
];

export const AdminUserRoleManager: React.FC = () => {
  const {
    alumni,
    user,
    currentRole,
    userRolesMap,
    assignUserRole,
    addAlumnusDirectly,
    updateAlumniProfile,
    deleteAlumni,
    approveAlumni,
    rejectAlumni,
    deactivateAlumni,
    reactivateAlumni,
    getCSVTemplate
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'users' | 'permissions'>('users');
  const [inspectingRole, setInspectingRole] = useState<UserRole | null>(null);

  // User details view modal
  const [viewingAlumnus, setViewingAlumnus] = useState<AlumniProfile | null>(null);

  // Quick Photo Edit Modal
  const [photoModalUser, setPhotoModalUser] = useState<AlumniProfile | null>(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [photoCustomUrlInput, setPhotoCustomUrlInput] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Reject confirmation modal with reason
  const [rejectModalItem, setRejectModalItem] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Direct Alumnus Creator Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAlumnus, setNewAlumnus] = useState<Omit<AlumniProfile, 'id' | 'createdAt'>>({
    fullName: '',
    batchYear: 2015,
    email: '',
    phone: '',
    house: 'Aravali',
    city: 'Barmer',
    state: 'Rajasthan',
    country: 'India',
    profession: 'Software Engineer',
    company: 'Tech Corp',
    designation: 'Senior Engineer',
    industry: 'Information Technology',
    bloodGroup: 'B+',
    bio: 'Proud Navodayan of JNV Pachpadra',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: false,
    verificationStatus: 'verified'
  });
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Alumnus Full Profile Modal
  const [editingAlumnus, setEditingAlumnus] = useState<AlumniProfile | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSampleAlumni = () => {
    const template = getCSVTemplate('alumni');
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_alumni_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter counts
  const pendingCount = alumni.filter(a => a.verificationStatus === 'pending').length;
  const verifiedCount = alumni.filter(a => a.verificationStatus === 'verified').length;
  const deactivatedCount = alumni.filter(a => a.verificationStatus === 'deactivated').length;
  const rejectedCount = alumni.filter(a => a.verificationStatus === 'rejected').length;

  // Filtered alumni list
  const filteredAlumni = alumni.filter(a => {
    const matchesSearch =
      !searchTerm ||
      (a.fullName && a.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.profession && a.profession.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.city && a.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.phone && a.phone.includes(searchTerm));

    const matchesStatus = statusFilter === 'all' || a.verificationStatus === statusFilter;
    const matchesBatch = batchFilter === 'all' || a.batchYear.toString() === batchFilter;

    return matchesSearch && matchesStatus && matchesBatch;
  });

  // Available Batches
  const batchYears = Array.from(new Set(alumni.map(a => Number(a.batchYear)))).sort((a: number, b: number) => b - a);

  // Image resize & base64 conversion helper
  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 320;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          callback(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPhotoModal = (alum: AlumniProfile) => {
    setPhotoModalUser(alum);
    setTempPhotoUrl(alum.avatar || '');
    setPhotoCustomUrlInput(false);
  };

  const handleSavePhotoModal = () => {
    if (!photoModalUser) return;
    updateAlumniProfile(photoModalUser.id, { avatar: tempPhotoUrl });
    if (viewingAlumnus && viewingAlumnus.id === photoModalUser.id) {
      setViewingAlumnus({ ...viewingAlumnus, avatar: tempPhotoUrl });
    }
    if (editingAlumnus && editingAlumnus.id === photoModalUser.id) {
      setEditingAlumnus({ ...editingAlumnus, avatar: tempPhotoUrl });
    }
    setPhotoModalUser(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumnus.fullName || !newAlumnus.email) {
      alert('Please fill in required Full Name and Email fields.');
      return;
    }
    addAlumnusDirectly(newAlumnus);
    setIsAddModalOpen(false);
    setNewAlumnus({
      fullName: '',
      batchYear: 2015,
      email: '',
      phone: '',
      house: 'Aravali',
      city: 'Barmer',
      state: 'Rajasthan',
      country: 'India',
      profession: 'Software Engineer',
      company: '',
      designation: '',
      industry: 'Information Technology',
      bloodGroup: 'B+',
      bio: 'Proud Navodayan of JNV Pachpadra',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      isMentorAvailable: true,
      isBusinessOwner: false,
      isLookingForJobs: false,
      isHiring: false,
      verificationStatus: 'verified'
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumnus) return;
    updateAlumniProfile(editingAlumnus.id, editingAlumnus);
    if (viewingAlumnus && viewingAlumnus.id === editingAlumnus.id) {
      setViewingAlumnus(editingAlumnus);
    }
    setEditingAlumnus(null);
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    rejectAlumni(rejectModalItem.id);
    if (viewingAlumnus && viewingAlumnus.id === rejectModalItem.id) {
      setViewingAlumnus({ ...viewingAlumnus, verificationStatus: 'rejected' });
    }
    setRejectModalItem(null);
    setRejectReason('');
  };

  // Helper to convert ISO date string to datetime-local input value
  const toDateTimeLocal = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6" id="admin-user-role-manager-container">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              User Approval & Management Hub
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">User Approvals, Photos & Role Administration</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Review registrations, update user profile pictures, adjust registration timestamps, approve or reject new alumni, and assign system roles.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="download-alumni-sample-csv-btn"
              onClick={handleDownloadSampleAlumni}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              title="Download sample alumni CSV"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Template</span>
            </button>
            <button
              id="upload-alumni-csv-btn"
              onClick={() => setIsCSVModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
              title="Bulk import or update alumni details via CSV"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
            </button>
            <button
              id="add-direct-alumnus-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Verified Alumnus</span>
            </button>
          </div>
        </div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-blue-500/20">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-blue-600/20 border-blue-500/60 shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Registered</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{alumni.length}</div>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 border-amber-500/60 shadow-md ring-1 ring-amber-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-300 font-medium">Pending Approval</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-2">
              {pendingCount}
              {pendingCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold uppercase animate-pulse">
                  Action Needed
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('verified')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'verified'
                ? 'bg-emerald-500/20 border-emerald-500/60 shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-300 font-medium">Active & Verified</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{verifiedCount}</div>
          </button>

          <button
            onClick={() => setStatusFilter('deactivated')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              statusFilter === 'deactivated'
                ? 'bg-rose-500/20 border-rose-500/60 shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Disabled / Inactive</span>
              <Lock className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1">{deactivatedCount + rejectedCount}</div>
          </button>
        </div>
      </div>

      {/* Sub-view Navigation Switch: User Roster vs Role & Permissions Directory */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            id="view-tab-users-roster"
            onClick={() => setActiveSubView('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'users'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Alumni Users & Role Assignment</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/60 text-slate-300">
              {filteredAlumni.length}
            </span>
          </button>

          <button
            id="view-tab-role-matrix"
            onClick={() => setActiveSubView('permissions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'permissions'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Role Permissions & Access Guide</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              7 Roles
            </span>
          </button>
        </div>

        {activeSubView === 'users' && (
          <button
            onClick={() => setInspectingRole('super_admin')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>What do roles have access to?</span>
          </button>
        )}
      </div>

      {activeSubView === 'permissions' ? (
        <RoleAccessMatrix />
      ) : (
        <>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, designation, or city..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="verified">Active & Verified</option>
            <option value="deactivated">Deactivated / Inactive</option>
            <option value="rejected">Rejected Requests</option>
          </select>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Batches</option>
            {batchYears.map(year => (
              <option key={year} value={year.toString()}>
                Class of {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User / Profile Photo</th>
                <th className="px-5 py-3.5">Batch & House</th>
                <th className="px-5 py-3.5">Profession & City</th>
                <th className="px-5 py-3.5">Registered On</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 min-w-[210px]">
                  <div className="flex items-center justify-between">
                    <span>Assign Role</span>
                    <button
                      type="button"
                      onClick={() => setActiveSubView('permissions')}
                      className="text-[10px] text-amber-400 hover:underline normal-case flex items-center gap-1 font-semibold cursor-pointer"
                      title="View complete RBAC matrix"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Role Guide</span>
                    </button>
                  </div>
                </th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No alumni records matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlumni.map(alum => {
                  const isSuperAdminEmail =
                    alum.email === 'prakashinfosys1234@gmail.com' ||
                    alum.id === 'alum-1';

                  const regDate = alum.createdAt
                    ? new Date(alum.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'N/A';

                  return (
                    <tr key={alum.id} id={`user-row-${alum.id}`} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar with change photo overlay button */}
                          <div className="relative group shrink-0">
                            <img
                              src={alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                              alt={alum.fullName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleOpenPhotoModal(alum)}
                              className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400 cursor-pointer"
                              title="Update User Image / Profile Photo"
                            >
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              {alum.fullName}
                              {isSuperAdminEmail && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                  Super Admin
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">{alum.email}</div>
                            {alum.phone && <div className="text-[11px] text-slate-500">{alum.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-white font-semibold text-xs">Class of {alum.batchYear}</div>
                        <div className="text-[11px] text-blue-400 font-medium">{alum.house || 'Aravali'} House</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-white text-xs">{alum.profession}</div>
                        <div className="text-[11px] text-slate-400">{alum.city}, {alum.state}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-300 text-xs font-mono flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{regDate}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            alum.verificationStatus === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : alum.verificationStatus === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : alum.verificationStatus === 'deactivated'
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {alum.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                          {alum.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                          {alum.verificationStatus === 'deactivated' && <Lock className="w-3 h-3" />}
                          {alum.verificationStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                          {alum.verificationStatus ? alum.verificationStatus.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const emailKey = (alum.email || '').toLowerCase().trim();
                            const currentAssignedRole: UserRole = isSuperAdminEmail
                              ? 'super_admin'
                              : (userRolesMap[emailKey] || userRolesMap[alum.id] || 'alumnus');

                            return (
                              <>
                                <select
                                  id={`role-select-${alum.id}`}
                                  value={currentAssignedRole}
                                  onChange={e => {
                                    const newRole = e.target.value as UserRole;
                                    assignUserRole(alum.email, newRole);
                                    assignUserRole(alum.id, newRole);
                                  }}
                                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-500 flex-1"
                                >
                                  <option value="super_admin">Super Administrator</option>
                                  <option value="principal">Principal / School Admin</option>
                                  <option value="alumni_manager">Alumni Manager</option>
                                  <option value="election_officer">Election Officer</option>
                                  <option value="auditor">Financial Auditor</option>
                                  <option value="alumnus">Verified Alumnus</option>
                                  <option value="guest">Guest / Read-only</option>
                                </select>

                                <button
                                  type="button"
                                  id={`inspect-role-btn-${alum.id}`}
                                  onClick={() => {
                                    setInspectingRole(currentAssignedRole);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 transition cursor-pointer shrink-0"
                                  title={`View access permissions for ${currentAssignedRole.replace('_', ' ')} role`}
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Change Photo */}
                          <button
                            id={`change-photo-btn-${alum.id}`}
                            onClick={() => handleOpenPhotoModal(alum)}
                            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 transition cursor-pointer"
                            title="Update Profile Photo"
                          >
                            <Camera className="w-4 h-4" />
                          </button>

                          {/* View Details */}
                          <button
                            id={`view-user-details-${alum.id}`}
                            onClick={() => setViewingAlumnus(alum)}
                            className="p-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 border border-blue-700/50 transition cursor-pointer"
                            title="View Full User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Approve Button */}
                          {alum.verificationStatus !== 'verified' && (
                            <button
                              id={`quick-approve-${alum.id}`}
                              onClick={() => approveAlumni(alum.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
                              title="Approve User Account"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {alum.verificationStatus === 'pending' && (
                            <button
                              id={`quick-reject-${alum.id}`}
                              onClick={() => setRejectModalItem({ id: alum.id, name: alum.fullName })}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 border border-rose-700/60 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                              title="Reject Registration"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Disable / Deactivate Button */}
                          {alum.verificationStatus === 'verified' && (
                            <button
                              id={`quick-disable-${alum.id}`}
                              onClick={() => deactivateAlumni(alum.id)}
                              className="p-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800 text-amber-300 border border-amber-700/50 transition cursor-pointer"
                              title="Disable / Deactivate Account"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Reactivate Button */}
                          {(alum.verificationStatus === 'deactivated' || alum.verificationStatus === 'rejected') && (
                            <button
                              id={`quick-reactivate-${alum.id}`}
                              onClick={() => reactivateAlumni(alum.id)}
                              className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50 transition cursor-pointer"
                              title="Reactivate Account"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Full Profile */}
                          <button
                            id={`edit-alum-btn-${alum.id}`}
                            onClick={() => setEditingAlumnus(alum)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                            title="Edit Full Profile & Registration Time"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            id={`delete-alum-btn-${alum.id}`}
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete alumnus record for ${alum.fullName}?`)) {
                                deleteAlumni(alum.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-800 text-rose-300 border border-rose-700/40 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK PHOTO UPDATE MODAL */}
      {photoModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Update Profile Photo</h3>
                  <p className="text-xs text-slate-400">{photoModalUser.fullName} ({photoModalUser.batchYear})</p>
                </div>
              </div>
              <button
                onClick={() => setPhotoModalUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Preview */}
            <div className="flex flex-col items-center gap-3 py-2">
              <img
                src={tempPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                alt="Photo preview"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-slate-800"
              />
              <span className="text-[11px] text-slate-400">Live Preview</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <input
                type="file"
                ref={photoFileInputRef}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processImageFile(file, url => setTempPhotoUrl(url));
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => photoFileInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoCustomUrlInput(!photoCustomUrlInput)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {photoCustomUrlInput && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-400">Or Paste Image URL:</label>
                  <input
                    type="url"
                    value={tempPhotoUrl}
                    onChange={e => setTempPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Preset Avatars */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Or Choose from Preset Avatars:</label>
                <div className="flex items-center justify-between gap-1.5">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempPhotoUrl(preset)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition transform hover:scale-110 cursor-pointer ${
                        tempPhotoUrl === preset ? 'border-amber-400 ring-2 ring-amber-500/50' : 'border-slate-700'
                      }`}
                    >
                      <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save / Cancel Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPhotoModalUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhotoModal}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save New Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAILS VIEW MODAL */}
      {viewingAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl my-8 space-y-5 text-slate-100">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative group shrink-0">
                  <img
                    src={viewingAlumnus.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                    alt={viewingAlumnus.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoModal(viewingAlumnus)}
                    className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400 cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{viewingAlumnus.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        viewingAlumnus.verificationStatus === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : viewingAlumnus.verificationStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : viewingAlumnus.verificationStatus === 'deactivated'
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {viewingAlumnus.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                      {viewingAlumnus.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                      {viewingAlumnus.verificationStatus === 'deactivated' && <Lock className="w-3 h-3" />}
                      {viewingAlumnus.verificationStatus ? viewingAlumnus.verificationStatus.toUpperCase() : 'PENDING'}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      Class of {viewingAlumnus.batchYear} • {viewingAlumnus.house} House
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingAlumnus(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-medium">User ID / Email:</span>
                <span className="text-white font-mono text-xs">{viewingAlumnus.email}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-medium">Mobile Number:</span>
                <span className="text-white font-semibold">{viewingAlumnus.phone || 'Not provided'}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-medium">Profession / Designation:</span>
                <span className="text-white font-semibold">{viewingAlumnus.profession}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-medium">Company / Department:</span>
                <span className="text-white font-semibold">{viewingAlumnus.company || 'Not provided'}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-medium">Current Location:</span>
                <span className="text-white font-semibold">{viewingAlumnus.city}, {viewingAlumnus.state}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block font-medium">Blood Group:</span>
                <span className="text-white font-semibold">{viewingAlumnus.bloodGroup || 'Not provided'}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 sm:col-span-2">
                <span className="text-slate-400 block font-medium">Registration Time & Date:</span>
                <span className="text-amber-300 font-mono text-xs">
                  {viewingAlumnus.createdAt
                    ? `${new Date(viewingAlumnus.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })} (${viewingAlumnus.createdAt})`
                    : 'Not specified'}
                </span>
              </div>
            </div>

            {viewingAlumnus.bio && (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-400 block font-medium mb-1">Bio / Notes:</span>
                <p className="text-slate-200 italic">"{viewingAlumnus.bio}"</p>
              </div>
            )}

            {/* Quick Actions in View Modal */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingAlumnus;
                  setViewingAlumnus(null);
                  handleOpenPhotoModal(toEdit);
                }}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Update Photo</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {viewingAlumnus.verificationStatus !== 'verified' && (
                  <button
                    onClick={() => {
                      approveAlumni(viewingAlumnus.id);
                      setViewingAlumnus({ ...viewingAlumnus, verificationStatus: 'verified' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve User</span>
                  </button>
                )}

                {viewingAlumnus.verificationStatus === 'pending' && (
                  <button
                    onClick={() => {
                      setRejectModalItem({ id: viewingAlumnus.id, name: viewingAlumnus.fullName });
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-900/50 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject User</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const toEdit = viewingAlumnus;
                    setViewingAlumnus(null);
                    setEditingAlumnus(toEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setViewingAlumnus(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL EDIT ALUMNUS MODAL (Includes Avatar + Registration Time Edit) */}
      {editingAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Alumnus Profile & Registration Details</h3>
                  <p className="text-xs text-slate-400">Update photo, credentials, status, and registration timestamp.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingAlumnus(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              {/* Photo Edit Section */}
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>Profile Photo / Avatar</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Device upload or URL</span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={editingAlumnus.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-slate-900"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, url => setEditingAlumnus({ ...editingAlumnus, avatar: url }));
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                      >
                        Upload Device Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const randomPreset = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
                          setEditingAlumnus({ ...editingAlumnus, avatar: randomPreset });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition cursor-pointer"
                      >
                        Pick Random Preset
                      </button>
                    </div>
                    <input
                      type="url"
                      value={editingAlumnus.avatar || ''}
                      onChange={e => setEditingAlumnus({ ...editingAlumnus, avatar: e.target.value })}
                      placeholder="Or enter Image URL"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Timestamp (Option Time of Registration) */}
              <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Registration Time / Date (Option to Adjust)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingAlumnus({ ...editingAlumnus, createdAt: new Date().toISOString() })}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Set to Current Time</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Pick Date & Time:</span>
                    <input
                      type="datetime-local"
                      value={toDateTimeLocal(editingAlumnus.createdAt)}
                      onChange={e => {
                        const val = e.target.value;
                        setEditingAlumnus({
                          ...editingAlumnus,
                          createdAt: val ? new Date(val).toISOString() : new Date().toISOString()
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Raw Timestamp (ISO String):</span>
                    <input
                      type="text"
                      value={editingAlumnus.createdAt || ''}
                      onChange={e => setEditingAlumnus({ ...editingAlumnus, createdAt: e.target.value })}
                      placeholder="2026-08-19T10:00:00.000Z"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Names & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingAlumnus.fullName}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, fullName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email / User ID *</label>
                  <input
                    type="email"
                    required
                    value={editingAlumnus.email}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Batch, House & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Passout Batch *</label>
                  <select
                    value={editingAlumnus.batchYear}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, batchYear: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: 35 }, (_, i) => 1994 + i).map(yr => (
                      <option key={yr} value={yr}>
                        Class of {yr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Navodaya House</label>
                  <select
                    value={editingAlumnus.house}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, house: e.target.value as HouseType })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aravali">Aravali</option>
                    <option value="Nilgiri">Nilgiri</option>
                    <option value="Shivalik">Shivalik</option>
                    <option value="Udaygiri">Udaygiri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Verification Status</label>
                  <select
                    value={editingAlumnus.verificationStatus || 'pending'}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, verificationStatus: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="verified">Verified & Active</option>
                    <option value="pending">Pending Approval</option>
                    <option value="deactivated">Deactivated / Disabled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Profession & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Profession / Title</label>
                  <input
                    type="text"
                    value={editingAlumnus.profession}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, profession: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Company / Firm</label>
                  <input
                    type="text"
                    value={editingAlumnus.company || ''}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, company: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Location & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={editingAlumnus.city}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={editingAlumnus.state}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, state: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingAlumnus.phone || ''}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Blood Group & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Blood Group</label>
                  <select
                    value={editingAlumnus.bloodGroup || 'B+'}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, bloodGroup: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Bio / Notes</label>
                  <input
                    type="text"
                    value={editingAlumnus.bio || ''}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, bio: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAlumnus(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT ALUMNUS CREATOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Add Verified Alumnus Directly</h3>
                  <p className="text-xs text-slate-400">Instantly create a verified alumnus record in the directory.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Photo Upload */}
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                <label className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Camera className="w-4 h-4" />
                  <span>Profile Photo</span>
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={newAlumnus.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={addFileInputRef}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, url => setNewAlumnus({ ...newAlumnus, avatar: url }));
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Upload Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const randomPreset = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
                          setNewAlumnus({ ...newAlumnus, avatar: randomPreset });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs cursor-pointer"
                      >
                        Preset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Names & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAlumnus.fullName}
                    onChange={e => setNewAlumnus({ ...newAlumnus, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email / User ID *</label>
                  <input
                    type="email"
                    required
                    value={newAlumnus.email}
                    onChange={e => setNewAlumnus({ ...newAlumnus, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Batch & House */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Passout Batch *</label>
                  <select
                    value={newAlumnus.batchYear}
                    onChange={e => setNewAlumnus({ ...newAlumnus, batchYear: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {Array.from({ length: 35 }, (_, i) => 1994 + i).map(yr => (
                      <option key={yr} value={yr}>
                        Class of {yr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Navodaya House</label>
                  <select
                    value={newAlumnus.house}
                    onChange={e => setNewAlumnus({ ...newAlumnus, house: e.target.value as HouseType })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aravali">Aravali</option>
                    <option value="Nilgiri">Nilgiri</option>
                    <option value="Shivalik">Shivalik</option>
                    <option value="Udaygiri">Udaygiri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newAlumnus.phone}
                    onChange={e => setNewAlumnus({ ...newAlumnus, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Profession & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Profession</label>
                  <input
                    type="text"
                    value={newAlumnus.profession}
                    onChange={e => setNewAlumnus({ ...newAlumnus, profession: e.target.value })}
                    placeholder="e.g. Doctor"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={newAlumnus.city}
                    onChange={e => setNewAlumnus({ ...newAlumnus, city: e.target.value })}
                    placeholder="e.g. Jodhpur"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Blood Group</label>
                  <select
                    value={newAlumnus.bloodGroup}
                    onChange={e => setNewAlumnus({ ...newAlumnus, bloodGroup: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Alumnus Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Reason Confirmation Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Reject User Registration</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to reject the registration request for <strong className="text-white">{rejectModalItem.name}</strong>?
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Reason for Rejection (Optional):</label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Unverified batchmate identity / invalid credentials"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectModalItem(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Bulk Import and Update Modal */}
      <CSVBulkImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        initialModule="alumni"
      />
        </>
      )}

      {/* QUICK ROLE ACCESS INSPECTION MODAL */}
      {inspectingRole && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{ROLE_METADATA[inspectingRole]?.name || inspectingRole}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ROLE_METADATA[inspectingRole]?.badgeColor}`}>
                      {ROLE_METADATA[inspectingRole]?.adminScope}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Role Permission Breakdown & Authorized Privileges</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingRole(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Role Description</div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {ROLE_METADATA[inspectingRole]?.summary}
                </p>
                <div className="mt-2 text-xs text-amber-300">
                  <strong>Recommended For: </strong> {ROLE_METADATA[inspectingRole]?.recommendedFor}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Accessible Modules & Actions
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectingRole(null);
                      setActiveSubView('permissions');
                    }}
                    className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    Open Full Matrix
                  </button>
                </div>

                <div className="space-y-2">
                  {(() => {
                    const rolePerms = SEED_ROLES_PERMISSIONS.find(r => r.role === inspectingRole);
                    if (inspectingRole === 'super_admin') {
                      return (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                          <strong>Master Unrestricted Privileges:</strong> Super Administrators have global root access across all school settings, notices, faculty, gallery, alumni moderation, RBAC role assignment, e-voting tallies, financial ledger creation, and CSV import/export.
                        </div>
                      );
                    }
                    if (!rolePerms || rolePerms.permissions.length === 0) {
                      return (
                        <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400">
                          No administrative permissions granted. This role has standard public guest view access only.
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rolePerms.permissions.map(perm => (
                          <div key={perm} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-xs">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="font-mono text-slate-200">{perm}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setInspectingRole(null);
                  setActiveSubView('permissions');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Compare All Roles
              </button>
              <button
                type="button"
                onClick={() => setInspectingRole(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
