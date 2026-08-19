import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';
import { UserRole, AlumniProfile } from '../../types';
import { SEED_ROLES_PERMISSIONS } from '../../data/seedData';
import { CSVBulkImportModal } from './CSVBulkImportModal';

export const AdminUserRoleManager: React.FC = () => {
  const {
    alumni,
    user,
    currentRole,
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

  // User details view modal
  const [viewingAlumnus, setViewingAlumnus] = useState<AlumniProfile | null>(null);

  // Reject confirmation modal with reason
  const [rejectModalItem, setRejectModalItem] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

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

  // Edit Alumnus Modal
  const [editingAlumnus, setEditingAlumnus] = useState<AlumniProfile | null>(null);

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
            <h2 className="text-2xl font-bold text-white tracking-tight">User Approvals & Role Administration</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Review pending registrations, view full profile information, approve or reject new alumni, disable/reactivate accounts, and configure permissions.
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

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="alumni-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, mobile, profession, city..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            id="alumni-status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="pending">Pending Approval ({pendingCount})</option>
            <option value="verified">Verified ({verifiedCount})</option>
            <option value="deactivated">Disabled / Deactivated ({deactivatedCount})</option>
            <option value="rejected">Rejected ({rejectedCount})</option>
          </select>

          <select
            id="alumni-batch-filter"
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Batches</option>
            {batchYears.map(year => (
              <option key={year} value={year.toString()}>
                Batch {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni User List Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-700/80">
              <tr>
                <th className="px-5 py-3.5">User / Alumnus</th>
                <th className="px-5 py-3.5">Batch & House</th>
                <th className="px-5 py-3.5">Profession & City</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Assign Role</th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                    No alumni records matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlumni.map(alum => {
                  const isSuperAdminEmail =
                    alum.email === 'prakashinfosys1234@gmail.com' ||
                    alum.id === 'alum-1';

                  return (
                    <tr key={alum.id} id={`user-row-${alum.id}`} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                            alt={alum.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
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
                        <select
                          id={`role-select-${alum.id}`}
                          defaultValue={isSuperAdminEmail ? 'super_admin' : 'alumnus'}
                          onChange={e => {
                            const newRole = e.target.value as UserRole;
                            assignUserRole(alum.email, newRole);
                            assignUserRole(alum.id, newRole);
                          }}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-500"
                        >
                          <option value="super_admin">Super Administrator</option>
                          <option value="alumni_manager">Alumni Manager</option>
                          <option value="election_officer">Election Officer</option>
                          <option value="auditor">Financial Auditor</option>
                          <option value="alumnus">Verified Alumnus</option>
                          <option value="guest">Guest / Read-only</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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

                          {/* Edit Button */}
                          <button
                            id={`edit-alum-btn-${alum.id}`}
                            onClick={() => setEditingAlumnus(alum)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                            title="Edit Profile"
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
                            title="Delete"
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

      {/* User Details Modal */}
      {viewingAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl my-8 space-y-5 text-slate-100">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={viewingAlumnus.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                  alt={viewingAlumnus.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                />
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
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
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
            </div>

            {viewingAlumnus.bio && (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-400 block font-medium mb-1">Bio / Notes:</span>
                <p className="text-slate-200 italic">"{viewingAlumnus.bio}"</p>
              </div>
            )}

            {/* Quick Actions in View Modal */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
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

              {viewingAlumnus.verificationStatus === 'verified' && (
                <button
                  onClick={() => {
                    deactivateAlumni(viewingAlumnus.id);
                    setViewingAlumnus({ ...viewingAlumnus, verificationStatus: 'deactivated' });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-900/50 hover:bg-amber-800 text-amber-200 border border-amber-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>Disable User</span>
                </button>
              )}

              {(viewingAlumnus.verificationStatus === 'deactivated' || viewingAlumnus.verificationStatus === 'rejected') && (
                <button
                  onClick={() => {
                    reactivateAlumni(viewingAlumnus.id);
                    setViewingAlumnus({ ...viewingAlumnus, verificationStatus: 'verified' });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Reactivate User</span>
                </button>
              )}

              <button
                onClick={() => setViewingAlumnus(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
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
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
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
    </div>
  );
};

