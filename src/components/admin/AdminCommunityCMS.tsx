import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Briefcase,
  Store,
  Sparkles,
  Award,
  HeartHandshake,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Target,
  Users,
  DollarSign,
  Download,
  Upload
} from 'lucide-react';
import { JobPosting, BusinessListing, WelfareCase, DonationCampaign, Achievement } from '../../types';
import { CSVBulkImportModal } from './CSVBulkImportModal';

export const AdminCommunityCMS: React.FC = () => {
  const {
    jobs,
    addJob,
    updateJob,
    approveJob,
    rejectJob,
    deleteJob,
    businesses,
    addBusiness,
    updateBusiness,
    approveBusiness,
    rejectBusiness,
    deleteBusiness,
    memories,
    approveMemory,
    rejectMemory,
    deleteMemory,
    achievements,
    addAchievement,
    updateAchievement,
    approveAchievement,
    rejectAchievement,
    deleteAchievement,
    welfareCases,
    addWelfareCase,
    updateWelfareCase,
    deleteWelfareCase,
    donationCampaigns,
    addDonationCampaign,
    updateDonationCampaign,
    deleteDonationCampaign,
    getCSVTemplate
  } = useData();

  const [activeTab, setActiveTab] = useState<'jobs' | 'businesses' | 'campaigns' | 'welfare' | 'achievements'>('campaigns');
  const [csvModalModule, setCsvModalModule] = useState<string | null>(null);

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

  // New Campaign Form Modal
  const [isNewCampOpen, setIsNewCampOpen] = useState(false);
  const [newCamp, setNewCamp] = useState({
    title: '',
    category: 'Student Welfare' as const,
    targetAmount: 500000,
    description: '',
    beneficiary: 'JNV Pachpadra Students',
    endDate: '2026-12-31',
    status: 'ACTIVE' as const,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=350&fit=crop'
  });

  // New Achievement Form Modal
  const [isNewAchOpen, setIsNewAchOpen] = useState(false);
  const [newAch, setNewAch] = useState({
    title: '',
    alumniName: '',
    batchYear: 2012,
    category: 'Civil Services & Governance' as const,
    description: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    isApproved: true
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.title || !newCamp.targetAmount) return;
    addDonationCampaign(newCamp);
    setIsNewCampOpen(false);
    setNewCamp({
      title: '',
      category: 'Student Welfare',
      targetAmount: 500000,
      description: '',
      beneficiary: 'JNV Pachpadra Students',
      endDate: '2026-12-31',
      status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=350&fit=crop'
    });
  };

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAch.title || !newAch.alumniName) return;
    addAchievement(newAch);
    setIsNewAchOpen(false);
    setNewAch({
      title: '',
      alumniName: '',
      batchYear: 2012,
      category: 'Civil Services & Governance',
      description: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
      isApproved: true
    });
  };

  return (
    <div className="space-y-6" id="admin-community-cms-container">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-slate-900 border border-violet-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <HeartHandshake className="w-3.5 h-3.5" />
              Community & Welfare Operations
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Community CMS & Welfare Hub</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Manage donation fundraisers, alumni emergency welfare aid, hall of fame honors, career listings, and verified alumni businesses.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-violet-500/20">
          {[
            { id: 'campaigns', label: 'Donation Fundraisers', count: donationCampaigns.length, icon: Target },
            { id: 'welfare', label: 'Alumni Welfare Cases', count: welfareCases.length, icon: HeartHandshake },
            { id: 'achievements', label: 'Hall of Fame', count: achievements.length, icon: Award },
            { id: 'jobs', label: 'Job Board', count: jobs.length, icon: Briefcase },
            { id: 'businesses', label: 'Business Directory', count: businesses.length, icon: Store }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`comm-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-violet-500 text-slate-950 shadow-md shadow-violet-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-violet-300' : 'bg-slate-700 text-violet-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Donation Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Active & Past Donation Fundraisers</h3>
              <p className="text-xs text-slate-400">Launch and manage campus development campaigns</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="download-campaigns-sample-csv-btn"
                onClick={() => handleDownloadSample('donation_campaigns')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                title="Download sample donation campaigns CSV template"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Data</span>
              </button>
              <button
                id="upload-campaigns-csv-btn"
                onClick={() => setCsvModalModule('donation_campaigns')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                title="Bulk upload or update donation causes via CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload through CSV</span>
              </button>
              <button
                onClick={() => setIsNewCampOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                Launch Campaign
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {donationCampaigns.map(camp => {
              const pct = Math.min(100, Math.round((camp.currentAmount / camp.targetAmount) * 100));
              return (
                <div
                  key={camp.id}
                  id={`camp-card-${camp.id}`}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">
                        {camp.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          camp.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base mt-2">{camp.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">{camp.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold">₹{(camp.currentAmount ?? 0).toLocaleString('en-IN')}</span>
                        <span className="text-slate-400">Target: ₹{(camp.targetAmount ?? 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{pct}% Funded</span>
                        <span>{camp.donorsCount || 0} Donors</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() =>
                        updateDonationCampaign(camp.id, {
                          status: camp.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE'
                        })
                      }
                      className="text-xs text-violet-300 hover:text-white font-semibold"
                    >
                      Toggle {camp.status === 'ACTIVE' ? 'Completed' : 'Active'}
                    </button>
                    <button
                      onClick={() => deleteDonationCampaign(camp.id)}
                      className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-800 text-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Hall of Fame / Achievements */}
      {activeTab === 'achievements' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Alumni Hall of Fame & Achievements</h3>
              <p className="text-xs text-slate-400">Honoring distinguished alumni milestones in civil services, science, corporate & sports</p>
            </div>
            <button
              onClick={() => setIsNewAchOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              Add Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div
                key={ach.id}
                id={`ach-card-${ach.id}`}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={ach.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}
                      alt={ach.alumniName}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{ach.alumniName}</h4>
                      <div className="text-xs text-amber-400 font-semibold">Batch {ach.batchYear}</div>
                      <span className="text-[10px] text-violet-300 font-medium">{ach.category}</span>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-200 mt-3">{ach.title}</h5>
                  <p className="text-xs text-slate-400 line-clamp-3 mt-1 bg-slate-900/60 p-2 rounded-lg">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => (ach.isApproved ? rejectAchievement(ach.id) : approveAchievement(ach.id))}
                    className={`text-xs font-semibold ${ach.isApproved ? 'text-emerald-400' : 'text-amber-400'}`}
                  >
                    {ach.isApproved ? '✓ Published on Wall' : 'Pending Review'}
                  </button>
                  <button
                    onClick={() => deleteAchievement(ach.id)}
                    className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-800 text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Alumni Welfare Cases */}
      {activeTab === 'welfare' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Alumni Emergency Aid & Welfare Requests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {welfareCases.map(wel => (
              <div key={wel.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {wel.urgency} Priority
                  </span>
                  <span className="text-xs text-slate-400">Target: ₹{(wel.amountRequired ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <h4 className="font-bold text-white text-base">{wel.title}</h4>
                <p className="text-xs text-slate-300">{wel.description}</p>
                <div className="text-[11px] text-slate-400">
                  Beneficiary: {wel.beneficiary} {wel.beneficiaryBatch ? `(Batch ${wel.beneficiaryBatch})` : ''}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-xs text-emerald-400 font-bold">Raised: ₹{(wel.amountRaised ?? 0).toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => deleteWelfareCase(wel.id)}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    Delete Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Jobs & 5. Businesses */}
      {(activeTab === 'jobs' || activeTab === 'businesses') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {activeTab === 'jobs' ? 'Alumni Job Postings' : 'Verified Business Directory'}
              </h3>
              <p className="text-xs text-slate-400">
                Use the "Approvals Queue" tab for quick verification, or manage details below.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id={`download-${activeTab}-sample-csv-btn`}
                onClick={() => handleDownloadSample(activeTab)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                title={`Download sample ${activeTab} CSV template`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Data</span>
              </button>
              <button
                id={`upload-${activeTab}-csv-btn`}
                onClick={() => setCsvModalModule(activeTab)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                title={`Bulk upload or update ${activeTab} via CSV`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload through CSV</span>
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {activeTab === 'jobs' &&
              jobs.map(job => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{job.title} - {job.company}</div>
                    <div className="text-slate-400">{job.location} • {job.jobType} • Posted by {job.postedByName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (job.isActive ? rejectJob(job.id) : approveJob(job.id))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        job.isActive ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/40' : 'bg-amber-900/50 text-amber-300'
                      }`}
                    >
                      {job.isActive ? 'Active Listing' : 'Approve'}
                    </button>
                    <button onClick={() => deleteJob(job.id)} className="p-1.5 text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === 'businesses' &&
              businesses.map(biz => (
                <div
                  key={biz.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{biz.businessName} ({biz.category})</div>
                    <div className="text-slate-400">Owner: {biz.ownerName} (Batch {biz.ownerBatch}) • {biz.city}, {biz.state}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (biz.isVerified ? rejectBusiness(biz.id) : approveBusiness(biz.id))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        biz.isVerified ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/40' : 'bg-amber-900/50 text-amber-300'
                      }`}
                    >
                      {biz.isVerified ? 'Verified Badge' : 'Grant Badge'}
                    </button>
                    <button onClick={() => deleteBusiness(biz.id)} className="p-1.5 text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isNewCampOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Launch New Donation Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={newCamp.title}
                  onChange={e => setNewCamp({ ...newCamp, title: e.target.value })}
                  placeholder="e.g. Smart Science Lab & Robotics Kit"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newCamp.targetAmount}
                    onChange={e => setNewCamp({ ...newCamp, targetAmount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newCamp.category}
                    onChange={e => setNewCamp({ ...newCamp, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="School Infrastructure">School Infrastructure</option>
                    <option value="Student Welfare">Student Welfare</option>
                    <option value="Alumni Emergency Fund">Alumni Emergency Fund</option>
                    <option value="Sports & Cultural Development">Sports & Cultural Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Beneficiary</label>
                <input
                  type="text"
                  value={newCamp.beneficiary}
                  onChange={e => setNewCamp({ ...newCamp, beneficiary: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newCamp.description}
                  onChange={e => setNewCamp({ ...newCamp, description: e.target.value })}
                  placeholder="Details about project objectives, equipment purchased, impact on students..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCampOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Achievement Modal */}
      {isNewAchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Hall of Fame Achievement</h3>
            <form onSubmit={handleCreateAchievement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Alumnus Name *</label>
                <input
                  type="text"
                  required
                  value={newAch.alumniName}
                  onChange={e => setNewAch({ ...newAch, alumniName: e.target.value })}
                  placeholder="e.g. Shri Vikram Singh Rathore"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Passout Batch Year *</label>
                  <input
                    type="number"
                    required
                    value={newAch.batchYear}
                    onChange={e => setNewAch({ ...newAch, batchYear: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Domain / Category</label>
                  <select
                    value={newAch.category}
                    onChange={e => setNewAch({ ...newAch, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Civil Services & Governance">Civil Services & Governance</option>
                    <option value="Armed Forces & Defense">Armed Forces & Defense</option>
                    <option value="Medicine & Healthcare">Medicine & Healthcare</option>
                    <option value="Engineering & Tech Leadership">Engineering & Tech Leadership</option>
                    <option value="Entrepreneurship & Industry">Entrepreneurship & Industry</option>
                    <option value="Sports & Athletics">Sports & Athletics</option>
                    <option value="Academia & Research">Academia & Research</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Achievement Headline *</label>
                <input
                  type="text"
                  required
                  value={newAch.title}
                  onChange={e => setNewAch({ ...newAch, title: e.target.value })}
                  placeholder="e.g. Selected in Indian Administrative Service (IAS) with AIR 45"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newAch.description}
                  onChange={e => setNewAch({ ...newAch, description: e.target.value })}
                  placeholder="Notable postings, honors received, or contribution..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAchOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Add Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CSV Bulk Import Universal Modal */}
      <CSVBulkImportModal
        isOpen={!!csvModalModule}
        onClose={() => setCsvModalModule(null)}
        initialModule={csvModalModule || 'donation_campaigns'}
      />
    </div>
  );
};
