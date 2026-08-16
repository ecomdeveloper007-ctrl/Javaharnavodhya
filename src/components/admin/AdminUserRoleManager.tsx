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
  Mail,
  Phone,
  Building,
  MapPin,
  Plus,
  Save,
  X
} from 'lucide-react';
import { UserRole, AlumniProfile } from '../../types';
import { SEED_ROLES_PERMISSIONS } from '../../data/seedData';

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
    deactivateAlumni
  } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');

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

  // Selected User for Role assignment
  const [selectedUserRole, setSelectedUserRole] = useState<{ id: string; email: string; currentRole: UserRole } | null>(null);

  // Filtered alumni list
  const filteredAlumni = alumni.filter(a => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city.toLowerCase().includes(searchTerm.toLowerCase());

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

  return (
    <div className="space-y-6" id="admin-user-role-manager-container">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role-Based Access Control (RBAC) & User Management
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Users & Role Assignment</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Assign administrative roles (Super Admin, Alumni Manager, Election Officer, Financial Auditor, Verified Alumnus), manage membership credentials, and directly onboard alumni.
            </p>
          </div>
          <button
            id="add-direct-alumnus-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Verified Alumnus Directly
          </button>
        </div>

        {/* Roles Quick Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-blue-500/20">
          {SEED_ROLES_PERMISSIONS.map(r => (
            <div
              key={r.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <Key className="w-3 h-3" />
                {r.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{r.description}</div>
              <div className="text-[10px] text-amber-400 font-mono mt-2 font-semibold">
                {r.permissions.length} Permissions
              </div>
            </div>
          ))}
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
            placeholder="Search by name, email, profession, city..."
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
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="deactivated">Deactivated</option>
            <option value="rejected">Rejected</option>
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
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Assign Role</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAlumni.map(alum => {
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
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : alum.verificationStatus === 'deactivated'
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {alum.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                        {alum.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                        {alum.verificationStatus === 'deactivated' && <Lock className="w-3 h-3" />}
                        {alum.verificationStatus.toUpperCase()}
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
                          alert(`Role for ${alum.fullName} updated to ${newRole.toUpperCase()}`);
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
                        {alum.verificationStatus !== 'verified' && (
                          <button
                            id={`quick-verify-${alum.id}`}
                            onClick={() => approveAlumni(alum.id)}
                            className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50"
                            title="Verify"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {alum.verificationStatus === 'verified' && (
                          <button
                            id={`quick-deactivate-${alum.id}`}
                            onClick={() => deactivateAlumni(alum.id)}
                            className="p-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800 text-amber-300 border border-amber-700/50"
                            title="Deactivate Account"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          id={`edit-alum-btn-${alum.id}`}
                          onClick={() => setEditingAlumnus(alum)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-alum-btn-${alum.id}`}
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently delete alumnus record for ${alum.fullName}?`)) {
                              deleteAlumni(alum.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-800 text-rose-300 border border-rose-700/40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Direct Alumnus Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-blue-400">
                <UserPlus className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Directly Onboard Verified Alumnus</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAlumnus.fullName}
                    onChange={e => setNewAlumnus({ ...newAlumnus, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newAlumnus.email}
                    onChange={e => setNewAlumnus({ ...newAlumnus, email: e.target.value })}
                    placeholder="e.g. ramesh.alum@jnv.in"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Passout Batch Year *</label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={2030}
                    value={newAlumnus.batchYear}
                    onChange={e => setNewAlumnus({ ...newAlumnus, batchYear: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">School House</label>
                  <select
                    value={newAlumnus.house}
                    onChange={e => setNewAlumnus({ ...newAlumnus, house: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Aravali">Aravali (Blue)</option>
                    <option value="Nilgiri">Nilgiri (Green)</option>
                    <option value="Shivalik">Shivalik (Red)</option>
                    <option value="Udaygiri">Udaygiri (Yellow)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Profession / Job Title</label>
                  <input
                    type="text"
                    value={newAlumnus.profession}
                    onChange={e => setNewAlumnus({ ...newAlumnus, profession: e.target.value })}
                    placeholder="e.g. Civil Servant, Doctor, Software Engineer"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newAlumnus.company || ''}
                    onChange={e => setNewAlumnus({ ...newAlumnus, company: e.target.value })}
                    placeholder="e.g. Govt of Rajasthan / Google"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Current City</label>
                  <input
                    type="text"
                    value={newAlumnus.city}
                    onChange={e => setNewAlumnus({ ...newAlumnus, city: e.target.value })}
                    placeholder="e.g. Jaipur, Barmer, Bangalore"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newAlumnus.phone || ''}
                    onChange={e => setNewAlumnus({ ...newAlumnus, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={newAlumnus.bio || ''}
                  onChange={e => setNewAlumnus({ ...newAlumnus, bio: e.target.value })}
                  placeholder="Memories, current pursuits, achievements..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-new-alumnus-btn"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Create & Auto-Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Alumnus Modal */}
      {editingAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <Edit2 className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Edit Alumnus Profile: {editingAlumnus.fullName}</h3>
              </div>
              <button
                onClick={() => setEditingAlumnus(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingAlumnus.fullName}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, fullName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingAlumnus.email}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Batch Year</label>
                  <input
                    type="number"
                    value={editingAlumnus.batchYear}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, batchYear: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">House</label>
                  <select
                    value={editingAlumnus.house}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, house: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Aravali">Aravali</option>
                    <option value="Nilgiri">Nilgiri</option>
                    <option value="Shivalik">Shivalik</option>
                    <option value="Udaygiri">Udaygiri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Profession</label>
                  <input
                    type="text"
                    value={editingAlumnus.profession}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, profession: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Verification Status</label>
                  <select
                    value={editingAlumnus.verificationStatus}
                    onChange={e => setEditingAlumnus({ ...editingAlumnus, verificationStatus: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="deactivated">Deactivated</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editingAlumnus.bio || ''}
                  onChange={e => setEditingAlumnus({ ...editingAlumnus, bio: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAlumnus(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-edit-alumnus-btn"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30"
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
