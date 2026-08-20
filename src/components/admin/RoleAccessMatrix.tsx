import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Lock,
  Globe,
  Bell,
  GraduationCap,
  Image,
  Vote,
  FileSpreadsheet,
  HeartHandshake,
  Database,
  Key,
  Info,
  Check,
  ChevronRight,
  UserCheck,
  Sliders,
  FileText
} from 'lucide-react';
import { UserRole } from '../../types';
import { SEED_ROLES_PERMISSIONS } from '../../data/seedData';

interface PermissionDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
}

export const SYSTEM_PERMISSIONS: PermissionDefinition[] = [
  {
    id: 'manage_website',
    name: 'Institutional Settings & CMS',
    category: 'School Administration',
    description: 'Edit school tagline, address, affiliation, hero banner slides, marquee ticker announcements, and about pages.',
    icon: Globe
  },
  {
    id: 'manage_notices',
    name: 'Notices & Circulars CMS',
    category: 'School Administration',
    description: 'Publish, pin, edit, delete official notices, circulars, tender documents, and academic calendars.',
    icon: Bell
  },
  {
    id: 'manage_faculty',
    name: 'Faculty & Staff Directory',
    category: 'School Administration',
    description: 'Add and update teachers, house masters, administrative staff profiles, qualifications, and subjects.',
    icon: GraduationCap
  },
  {
    id: 'manage_gallery',
    name: 'Media Gallery & Campus Memories',
    category: 'School Administration',
    description: 'Upload high-resolution event photos, category tagging (Campus, Cultural, Sports, Alumni Meet), and delete media.',
    icon: Image
  },
  {
    id: 'manage_inquiries',
    name: 'Admissions & Inquiries',
    category: 'School Administration',
    description: 'Review Class VI JNVST and Class IX lateral entry admission inquiries, applicant details, and update triage status.',
    icon: FileText
  },
  {
    id: 'manage_alumni',
    name: 'Alumni Directory & Verification',
    category: 'Alumni Operations',
    description: 'Approve, reject, deactivate registered alumni, edit alumni records, batch information, and update profile photos.',
    icon: Users
  },
  {
    id: 'manage_roles',
    name: 'RBAC Role Assignment & Access Control',
    category: 'System Security',
    description: 'Assign administrator privileges, grant manager or officer status, and manage role-based permission matrices.',
    icon: ShieldCheck
  },
  {
    id: 'manage_events',
    name: 'Alumni Events & RSVP Management',
    category: 'Alumni Operations',
    description: 'Create reunions, silver jubilee meets, regional chapters, and manage attendee guest rosters and confirmations.',
    icon: HeartHandshake
  },
  {
    id: 'manage_elections',
    name: 'Elections & Ballot Management',
    category: 'Governance & E-Voting',
    description: 'Create executive committee elections, approve candidate nominations, toggle live voting, and view live voter tallies.',
    icon: Vote
  },
  {
    id: 'view_election_audit',
    name: 'Election Audit Logs',
    category: 'Governance & E-Voting',
    description: 'Inspect cryptographic voter timestamps, nomination approvals, and independent election verification trails.',
    icon: Key
  },
  {
    id: 'manage_finances',
    name: 'Financial Ledger & Statutory Audits',
    category: 'Financial Governance',
    description: 'Record audited income/expenses, publish annual utilization certificates, balance sheets, and statutory audit statements.',
    icon: FileSpreadsheet
  },
  {
    id: 'csv_import_export',
    name: 'Data Hub & Bulk CSV Tools',
    category: 'System Security',
    description: 'Bulk export and import alumni rosters, financial ledgers, notices, and faculty data via CSV spreadsheets.',
    icon: Database
  },
  {
    id: 'vote_elections',
    name: 'Cast E-Ballot in Elections',
    category: 'Alumni Privilege',
    description: 'Cast verified votes in executive committee biennial elections for President, Secretary, and House reps.',
    icon: CheckCircle2
  },
  {
    id: 'nominate_election',
    name: 'File Candidate Nomination',
    category: 'Alumni Privilege',
    description: 'Submit candidature and election manifesto for executive association leadership positions.',
    icon: UserCheck
  },
  {
    id: 'rsvp_events',
    name: 'RSVP to Alumni Meets',
    category: 'Alumni Privilege',
    description: 'Register attendance and bring family guests to official campus reunions and regional alumni meets.',
    icon: HeartHandshake
  },
  {
    id: 'view_alumni_ledger',
    name: 'View Detailed Transparency Ledger',
    category: 'Alumni Privilege',
    description: 'Access complete transaction-level alumni fund receipts, scholarship payouts, and audited bank ledgers.',
    icon: FileSpreadsheet
  },
  {
    id: 'post_memories',
    name: 'Post Memories & Nostalgia',
    category: 'Alumni Privilege',
    description: 'Share vintage school memories, house victory stories, old assembly photographs, and comment on batchmate posts.',
    icon: Image
  }
];

export const ROLE_METADATA: Record<
  UserRole,
  {
    name: string;
    badgeColor: string;
    borderClass: string;
    bgClass: string;
    textClass: string;
    summary: string;
    recommendedFor: string;
    adminScope: string;
  }
> = {
  super_admin: {
    name: 'Super Administrator',
    badgeColor: 'bg-amber-500 text-slate-950',
    borderClass: 'border-amber-500/50',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    summary: 'Complete unrestricted access across the entire school CMS, alumni network, user permissions, finances, and data backups.',
    recommendedFor: 'Chief Alumni President, IT Lead (Dr. Prakash Rathore)',
    adminScope: 'Full System Master Access'
  },
  principal: {
    name: 'Principal / School Admin',
    badgeColor: 'bg-blue-500 text-white',
    borderClass: 'border-blue-500/50',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    summary: 'Administrative control over official school website content, notices, admissions, faculty directory, and campus media.',
    recommendedFor: 'School Principal & Designated Academic Office Staff',
    adminScope: 'School Operations CMS'
  },
  alumni_manager: {
    name: 'Alumni Association Lead / Manager',
    badgeColor: 'bg-emerald-500 text-white',
    borderClass: 'border-emerald-500/50',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    summary: 'Approves registered alumni, updates directory profiles, organizes reunions, manages jobs, and oversees welfare cases.',
    recommendedFor: 'Alumni General Secretary, Batch Coordinators, Welfare Committee Leads',
    adminScope: 'Alumni Directory, Events & Moderation'
  },
  election_officer: {
    name: 'Chief Election Officer',
    badgeColor: 'bg-purple-500 text-white',
    borderClass: 'border-purple-500/50',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    summary: 'Dedicated authority to configure executive elections, verify candidate eligibility, monitor voting integrity, and certify voter tallies.',
    recommendedFor: 'Independent Election Commissioner, Senior Advisory Council',
    adminScope: 'E-Ballot & Election Governance'
  },
  auditor: {
    name: 'Financial Auditor / CA',
    badgeColor: 'bg-teal-500 text-white',
    borderClass: 'border-teal-500/50',
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-400',
    summary: 'Publishes official annual audited reports, enters bank and ledger transaction records, and certifies 80G tax compliance statements.',
    recommendedFor: 'Chartered Accountants, Treasurer, Statutory Audit Committee',
    adminScope: 'Financial Ledger & Audit Reports'
  },
  alumnus: {
    name: 'Verified Alumnus',
    badgeColor: 'bg-slate-700 text-slate-200',
    borderClass: 'border-slate-700',
    bgClass: 'bg-slate-800/60',
    textClass: 'text-slate-300',
    summary: 'Verified alumni member with full access to the global directory, voting in biennial elections, filing nominations, and registering for events.',
    recommendedFor: 'All Verified JNV Pachpadra Passouts (Class VI-XII)',
    adminScope: 'Member Privileges'
  },
  guest: {
    name: 'Guest / Public User',
    badgeColor: 'bg-slate-800 text-slate-400',
    borderClass: 'border-slate-800',
    bgClass: 'bg-slate-900/40',
    textClass: 'text-slate-400',
    summary: 'Public visitor with view-only access to published school information, notices, toppers, gallery, and public donation campaigns.',
    recommendedFor: 'Prospective Students, Parents, General Public',
    adminScope: 'Public Read-Only'
  }
};

export const RoleAccessMatrix: React.FC = () => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('super_admin');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  const roles: UserRole[] = [
    'super_admin',
    'principal',
    'alumni_manager',
    'election_officer',
    'auditor',
    'alumnus',
    'guest'
  ];

  const getRolePermissions = (role: UserRole): string[] => {
    const found = SEED_ROLES_PERMISSIONS.find(r => r.role === role);
    if (role === 'super_admin') {
      return SYSTEM_PERMISSIONS.map(p => p.id);
    }
    if (role === 'guest') {
      return [];
    }
    return found ? found.permissions : [];
  };

  const hasAccess = (role: UserRole, permissionId: string): boolean => {
    if (role === 'super_admin') return true;
    if (role === 'guest') return false;
    const permissions = getRolePermissions(role);
    return permissions.includes(permissionId);
  };

  const categories = Array.from(new Set(SYSTEM_PERMISSIONS.map(p => p.category)));

  return (
    <div className="space-y-6" id="role-access-matrix-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role-Based Access Control (RBAC) Architecture
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Role Definitions & Permissions Directory
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
              Inspect exactly what modules, actions, and features each user role is authorized to access across the JNV Pachpadra platform.
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Role Deep Dive
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Comparison Grid
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Role Deep Dive Cards & Interactive Role Explorer */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {/* Role Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {roles.map(role => {
              const meta = ROLE_METADATA[role];
              const isSelected = selectedRoleTab === role;
              const perms = getRolePermissions(role);

              return (
                <button
                  key={role}
                  id={`role-tab-btn-${role}`}
                  onClick={() => setSelectedRoleTab(role)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-left transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? `${meta.bgClass} ${meta.borderClass} ring-1 ring-amber-400/50 shadow-lg`
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className={`w-4 h-4 ${isSelected ? meta.textClass : 'text-slate-500'}`} />
                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {meta.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {role === 'super_admin' ? 'All Permissions' : `${perms.length} Permissions`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Role Deep Dive Details */}
          {(() => {
            const currentMeta = ROLE_METADATA[selectedRoleTab];
            const currentPerms = getRolePermissions(selectedRoleTab);

            return (
              <div
                id={`role-details-card-${selectedRoleTab}`}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
              >
                {/* Role Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl ${currentMeta.bgClass} border ${currentMeta.borderClass}`}>
                      <ShieldCheck className={`w-7 h-7 ${currentMeta.textClass}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-xl font-bold text-white">{currentMeta.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentMeta.badgeColor}`}>
                          {currentMeta.adminScope}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                        {currentMeta.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-amber-300/90">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Recommended Assignment:</strong> {currentMeta.recommendedFor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 shrink-0 text-center min-w-[140px]">
                    <div className="text-2xl font-black text-white">
                      {selectedRoleTab === 'super_admin' ? SYSTEM_PERMISSIONS.length : currentPerms.length}
                    </div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Permissions</div>
                  </div>
                </div>

                {/* Categorized Permissions List for Selected Role */}
                <div className="space-y-6">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Authorized Access & Functional Capabilities
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {SYSTEM_PERMISSIONS.map(perm => {
                      const granted = hasAccess(selectedRoleTab, perm.id);
                      const Icon = perm.icon;

                      return (
                        <div
                          key={perm.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                            granted
                              ? 'bg-slate-800/60 border-emerald-500/30'
                              : 'bg-slate-950/40 border-slate-800/60 opacity-40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${granted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-white">{perm.name}</span>
                              </div>
                              {granted ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                                  <Check className="w-3 h-3" />
                                  Granted
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                                  <Lock className="w-3 h-3" />
                                  No Access
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {perm.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-semibold text-slate-400">{perm.category}</span>
                            <span className="font-mono text-slate-400">{perm.id}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* VIEW 2: Complete Comparison Matrix (Table View) */}
      {viewMode === 'matrix' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Comprehensive RBAC Permissions Matrix
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Side-by-side comparison across all 7 user roles and {SYSTEM_PERMISSIONS.length} individual permissions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 min-w-[240px]">Permission / Module Action</th>
                  <th className="px-3 py-3 text-center min-w-[110px]">
                    <span className="text-amber-400 font-bold block">Super Admin</span>
                    <span className="text-[9px] text-slate-500 font-normal">Full Master</span>
                  </th>
                  <th className="px-3 py-3 text-center min-w-[110px]">
                    <span className="text-blue-400 font-bold block">Principal</span>
                    <span className="text-[9px] text-slate-500 font-normal">School CMS</span>
                  </th>
                  <th className="px-3 py-3 text-center min-w-[110px]">
                    <span className="text-emerald-400 font-bold block">Alumni Manager</span>
                    <span className="text-[9px] text-slate-500 font-normal">Dir & Events</span>
                  </th>
                  <th className="px-3 py-3 text-center min-w-[110px]">
                    <span className="text-purple-400 font-bold block">Election Officer</span>
                    <span className="text-[9px] text-slate-500 font-normal">Ballot Lead</span>
                  </th>
                  <th className="px-3 py-3 text-center min-w-[110px]">
                    <span className="text-teal-400 font-bold block">Auditor</span>
                    <span className="text-[9px] text-slate-500 font-normal">Ledger CA</span>
                  </th>
                  <th className="px-3 py-3 text-center min-w-[110px]">
                    <span className="text-slate-300 font-bold block">Alumnus</span>
                    <span className="text-[9px] text-slate-500 font-normal">Member</span>
                  </th>
                  <th className="px-3 py-3 text-center min-w-[90px]">
                    <span className="text-slate-500 font-bold block">Guest</span>
                    <span className="text-[9px] text-slate-600 font-normal">Public</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {categories.map(category => (
                  <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <tr className="bg-slate-800/40 font-bold text-amber-300 text-xs">
                      <td colSpan={8} className="px-4 py-2 uppercase tracking-wider">
                        {category}
                      </td>
                    </tr>

                    {/* Permissions in this Category */}
                    {SYSTEM_PERMISSIONS.filter(p => p.category === category).map(perm => {
                      const Icon = perm.icon;
                      return (
                        <tr key={perm.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2.5">
                              <Icon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-bold text-white text-xs">{perm.name}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">{perm.description}</div>
                              </div>
                            </div>
                          </td>

                          {roles.map(role => {
                            const granted = hasAccess(role, perm.id);
                            return (
                              <td key={role} className="px-3 py-3 text-center">
                                {granted ? (
                                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800/50 text-slate-600">
                                    <XCircle className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Reference Cards for Quick Delegation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {roles.filter(r => r !== 'guest').map(role => {
          const meta = ROLE_METADATA[role];
          const perms = getRolePermissions(role);

          return (
            <div
              key={role}
              id={`summary-role-card-${role}`}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${meta.badgeColor}`}>
                    {meta.adminScope}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono font-bold">
                    {role === 'super_admin' ? 'ALL' : perms.length} Perms
                  </span>
                </div>
                <h5 className="font-bold text-white text-sm">{meta.name}</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{meta.summary}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                <span className="text-slate-400 font-semibold">Typical Assignee: </span>
                <span className="text-amber-400/90">{meta.recommendedFor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
