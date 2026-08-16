import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  Vote,
  Briefcase,
  Store,
  Sparkles,
  Award,
  Inbox,
  Filter,
  Check,
  X,
  ExternalLink,
  Shield,
  Eye,
  MessageSquare
} from 'lucide-react';

export const AdminModerationQueue: React.FC = () => {
  const {
    alumni,
    approveAlumni,
    rejectAlumni,
    deactivateAlumni,
    nominations,
    approveNomination,
    rejectNomination,
    jobs,
    approveJob,
    rejectJob,
    deleteJob,
    businesses,
    approveBusiness,
    rejectBusiness,
    deleteBusiness,
    memories,
    approveMemory,
    rejectMemory,
    deleteMemory,
    achievements,
    approveAchievement,
    rejectAchievement,
    deleteAchievement,
    admissionEnquiries,
    updateEnquiryStatus,
    deleteAdmissionEnquiry
  } = useData();

  const [activeFilter, setActiveFilter] = useState<'all' | 'alumni' | 'nominations' | 'jobs' | 'businesses' | 'memories' | 'achievements' | 'admissions'>('all');
  const [rejectModalItem, setRejectModalItem] = useState<{ type: string; id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Pending counts
  const pendingAlumni = alumni.filter(a => a.verificationStatus === 'pending');
  const pendingNominations = nominations.filter(n => n.status === 'PENDING');
  const pendingJobs = jobs.filter(j => !j.isActive);
  const pendingBusinesses = businesses.filter(b => !b.isVerified);
  const pendingMemories = memories.filter(m => !m.isApproved);
  const pendingAchievements = achievements.filter(a => !a.isApproved);
  const pendingAdmissions = admissionEnquiries.filter(e => e.status === 'New');

  const totalPending =
    pendingAlumni.length +
    pendingNominations.length +
    pendingJobs.length +
    pendingBusinesses.length +
    pendingMemories.length +
    pendingAchievements.length +
    pendingAdmissions.length;

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    const { type, id } = rejectModalItem;
    if (type === 'alumni') rejectAlumni(id);
    else if (type === 'nomination') rejectNomination(id, rejectReason);
    else if (type === 'job') rejectJob(id);
    else if (type === 'business') rejectBusiness(id);
    else if (type === 'memory') rejectMemory(id);
    else if (type === 'achievement') rejectAchievement(id);
    else if (type === 'admission') updateEnquiryStatus(id, 'Closed');

    setRejectModalItem(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6" id="admin-moderation-queue-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Central Moderation & Verification Hub
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Pending Approvals Queue</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Review and approve/disapprove new alumni registrations, election candidatures, job listings, verified businesses, nostalgic memories, and admission leads in real time.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-amber-500/30">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalPending}</div>
              <div className="text-xs text-amber-400 font-medium">Pending Tasks</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-amber-500/20">
          {[
            { id: 'all', label: 'All Pending', count: totalPending, icon: Inbox },
            { id: 'alumni', label: 'Alumni Registrations', count: pendingAlumni.length, icon: UserCheck },
            { id: 'nominations', label: 'E-Ballot Nominations', count: pendingNominations.length, icon: Vote },
            { id: 'jobs', label: 'Job Opportunities', count: pendingJobs.length, icon: Briefcase },
            { id: 'businesses', label: 'Business Directory', count: pendingBusinesses.length, icon: Store },
            { id: 'memories', label: 'Alumni Memories', count: pendingMemories.length, icon: Sparkles },
            { id: 'achievements', label: 'Hall of Fame', count: pendingAchievements.length, icon: Award },
            { id: 'admissions', label: 'Admission Inquiries', count: pendingAdmissions.length, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-${tab.id}`}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-700 text-amber-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Queue Content */}
      <div className="space-y-6">
        {totalPending === 0 && (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              There are no pending items awaiting approval across any module. Everything is verified and clean.
            </p>
          </div>
        )}

        {/* 1. Alumni Registrations */}
        {(activeFilter === 'all' || activeFilter === 'alumni') && pendingAlumni.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Pending Alumni Verifications</h3>
                  <p className="text-xs text-slate-400">New alumni accounts requiring identity check & verification</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                {pendingAlumni.length} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingAlumni.map(alum => (
                <div
                  key={alum.id}
                  id={`pending-alum-${alum.id}`}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <img
                        src={alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                        alt={alum.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-base truncate">{alum.fullName}</div>
                        <div className="text-xs text-amber-400 font-semibold">
                          Class of {alum.batchYear} • {alum.house || 'Aravali'} House
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">{alum.email}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs space-y-1.5">
                      <div className="text-slate-300">
                        <span className="text-slate-500">Profession:</span> {alum.profession} ({alum.designation || 'Alumnus'})
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-500">Location:</span> {alum.city}, {alum.state}
                      </div>
                      {alum.phone && (
                        <div className="text-slate-300">
                          <span className="text-slate-500">Phone:</span> {alum.phone}
                        </div>
                      )}
                      {alum.bio && (
                        <div className="text-slate-400 line-clamp-2 italic bg-slate-900/60 p-2 rounded-lg mt-2">
                          "{alum.bio}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      id={`approve-alum-btn-${alum.id}`}
                      onClick={() => approveAlumni(alum.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Verify
                    </button>
                    <button
                      id={`reject-alum-btn-${alum.id}`}
                      onClick={() => setRejectModalItem({ type: 'alumni', id: alum.id, name: alum.fullName })}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 border border-rose-700/60 transition-colors"
                      title="Disapprove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Election Nominations */}
        {(activeFilter === 'all' || activeFilter === 'nominations') && pendingNominations.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">E-Ballot Candidature Nominations</h3>
                  <p className="text-xs text-slate-400">Alumni self-nominations for executive governing body elections</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                {pendingNominations.length} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingNominations.map(nom => (
                <div
                  key={nom.id}
                  id={`pending-nom-${nom.id}`}
                  className="bg-slate-800/80 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/60 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/40 text-[11px] font-bold">
                          {nom.positionTitle}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{nom.candidateName}</h4>
                        <div className="text-xs text-slate-400">
                          Batch {nom.batch} • {nom.candidateEmail}
                        </div>
                      </div>
                      <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {new Date(nom.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-900/80 rounded-lg border border-slate-700/80">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                        Candidate Manifesto / Vision
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-3 italic">"{nom.manifesto}"</p>
                    </div>

                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
                      <span>
                        <strong className="text-slate-300">City:</strong> {nom.city}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-300">Profession:</strong> {nom.profession}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      id={`approve-nom-btn-${nom.id}`}
                      onClick={() => approveNomination(nom.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Candidature & Add to Ballot
                    </button>
                    <button
                      id={`reject-nom-btn-${nom.id}`}
                      onClick={() => setRejectModalItem({ type: 'nomination', id: nom.id, name: nom.candidateName })}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 border border-rose-700/60 transition-colors"
                      title="Reject Nomination"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Job Postings */}
        {(activeFilter === 'all' || activeFilter === 'jobs') && pendingJobs.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Pending Job Postings</h3>
                  <p className="text-xs text-slate-400">Alumni career opportunities needing approval before publication</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                {pendingJobs.length} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingJobs.map(job => (
                <div
                  key={job.id}
                  id={`pending-job-${job.id}`}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-base">{job.title}</h4>
                    <div className="text-xs text-teal-400 font-semibold mt-0.5">{job.company}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {job.location} • {job.jobType} • {job.salaryRange || 'Best in industry'}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 mt-2 bg-slate-900/60 p-2.5 rounded-lg">
                      {job.description}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Posted by: <span className="text-slate-200">{job.postedByName}</span> ({job.contactEmail})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      id={`approve-job-btn-${job.id}`}
                      onClick={() => approveJob(job.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Listing
                    </button>
                    <button
                      id={`reject-job-btn-${job.id}`}
                      onClick={() => deleteJob(job.id)}
                      className="p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 border border-rose-700/60"
                      title="Reject & Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Business Directory */}
        {(activeFilter === 'all' || activeFilter === 'businesses') && pendingBusinesses.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Business Verification Requests</h3>
                  <p className="text-xs text-slate-400">Alumni entrepreneur business listings pending official verification</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {pendingBusinesses.length} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingBusinesses.map(biz => (
                <div
                  key={biz.id}
                  id={`pending-biz-${biz.id}`}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-base">{biz.businessName}</h4>
                    <div className="text-xs text-emerald-400 font-semibold">{biz.category}</div>
                    <div className="text-xs text-slate-400 mt-1">{biz.city}, {biz.state}</div>
                    <p className="text-xs text-slate-300 line-clamp-3 mt-2 bg-slate-900/60 p-2.5 rounded-lg">
                      {biz.description}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Owner: <span className="text-slate-200">{biz.ownerName}</span> (Batch {biz.ownerBatch})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      id={`approve-biz-btn-${biz.id}`}
                      onClick={() => approveBusiness(biz.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Grant Verified Badge
                    </button>
                    <button
                      id={`reject-biz-btn-${biz.id}`}
                      onClick={() => deleteBusiness(biz.id)}
                      className="p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 border border-rose-700/60"
                      title="Decline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Nostalgic Memories */}
        {(activeFilter === 'all' || activeFilter === 'memories') && pendingMemories.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Memories & Stories Moderation</h3>
                  <p className="text-xs text-slate-400">Community submissions for Nostalgia Wall</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                {pendingMemories.length} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingMemories.map(mem => (
                <div
                  key={mem.id}
                  id={`pending-mem-${mem.id}`}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-base">{mem.title}</h4>
                    <div className="text-xs text-pink-400 font-semibold">
                      By {mem.authorName} (Batch {mem.batchYear})
                    </div>
                    {mem.photoUrl && (
                      <img
                        src={mem.photoUrl}
                        alt={mem.title}
                        className="w-full h-32 object-cover rounded-lg mt-2 border border-slate-700"
                      />
                    )}
                    <p className="text-xs text-slate-300 line-clamp-3 mt-2 bg-slate-900/60 p-2.5 rounded-lg italic">
                      "{mem.content}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      id={`approve-mem-btn-${mem.id}`}
                      onClick={() => approveMemory(mem.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve to Wall
                    </button>
                    <button
                      id={`reject-mem-btn-${mem.id}`}
                      onClick={() => deleteMemory(mem.id)}
                      className="p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300 border border-rose-700/60"
                      title="Reject & Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Admission Inquiries */}
        {(activeFilter === 'all' || activeFilter === 'admissions') && pendingAdmissions.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">New JNVST & Lateral Entry Inquiries</h3>
                  <p className="text-xs text-slate-400">Prospective parents & student admission queries</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
                {pendingAdmissions.length} New Inquiries
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAdmissions.map(enq => (
                <div
                  key={enq.id}
                  id={`pending-enq-${enq.id}`}
                  className="bg-slate-800/80 border border-orange-500/30 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{enq.studentName}</h4>
                        <div className="text-xs text-slate-400">Parent: {enq.parentName}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-xs font-bold">
                        {enq.classSeeking}
                      </span>
                    </div>

                    <div className="mt-2 text-xs space-y-1 text-slate-300 bg-slate-900/60 p-2.5 rounded-lg">
                      <div><strong>Phone:</strong> {enq.phone} | <strong>Email:</strong> {enq.email}</div>
                      <div><strong>Category:</strong> {enq.category} ({enq.gender}) • Rural Quota: {enq.ruralQuota ? 'Yes' : 'No'}</div>
                      <div className="italic text-slate-300 mt-1.5 pt-1.5 border-t border-slate-800">
                        "{enq.message}"
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      id={`contact-enq-btn-${enq.id}`}
                      onClick={() => updateEnquiryStatus(enq.id, 'Contacted')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Contacted
                    </button>
                    <button
                      id={`close-enq-btn-${enq.id}`}
                      onClick={() => updateEnquiryStatus(enq.id, 'Closed')}
                      className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold"
                    >
                      Close
                    </button>
                    <button
                      id={`delete-enq-btn-${enq.id}`}
                      onClick={() => deleteAdmissionEnquiry(enq.id)}
                      className="p-2 rounded-lg bg-rose-900/40 hover:bg-rose-800 text-rose-300"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rejection Note Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Disapprove / Reject</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Are you sure you want to reject/disapprove <strong>{rejectModalItem.name}</strong>? You may optionally provide a reason.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Reason / Admin Note</label>
              <textarea
                id="reject-reason-input"
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Unverified batch records, duplicate registration, or incomplete criteria..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                id="cancel-reject-modal-btn"
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="confirm-reject-modal-btn"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Disapproval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
