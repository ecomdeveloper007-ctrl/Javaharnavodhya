import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { JobPosting } from '../types';
import {
  Briefcase,
  MapPin,
  Clock,
  Send,
  PlusCircle,
  X,
  Sparkles,
  Building,
  GraduationCap
} from 'lucide-react';

export const JobsTab: React.FC = () => {
  const { jobs, addJob, user } = useData();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // New job state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Bengaluru / Remote');
  const [newEmploymentType, setNewEmploymentType] = useState<'Full-Time' | 'Part-Time' | 'Remote' | 'Internship'>('Full-Time');
  const [newExperience, setNewExperience] = useState('2-4 Years');
  const [newSalary, setNewSalary] = useState('₹12 - 20 LPA');
  const [newDescription, setNewDescription] = useState('');
  const [newApplyLink, setNewApplyLink] = useState('');

  const filteredJobs = typeFilter === 'ALL'
    ? jobs
    : jobs.filter(j => j.employmentType === typeFilter);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    addJob({
      title: newTitle,
      company: newCompany,
      location: newLocation,
      employmentType: newEmploymentType,
      experience: newExperience,
      salaryRange: newSalary,
      description: newDescription,
      applyLinkOrEmail: newApplyLink || (user?.email || 'hr@company.com'),
      postedByName: user?.displayName || 'Alumnus',
      postedByBatch: user?.profile?.batchYear || 2012,
      postedByEmail: user?.email || 'alumni@jnvpachpadra.org'
    });

    setIsPostJobModalOpen(false);
    // reset
    setNewTitle('');
    setNewCompany('');
    setNewDescription('');
    setNewApplyLink('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <span>Navodaya Career & Opportunities Board</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct referral openings, internships & jobs posted exclusively by alumni for fellow Navodayans.
            </p>
          </div>

          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Job / Referral</span>
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {(['ALL', 'Full-Time', 'Remote', 'Internship'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                typeFilter === type
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {type === 'ALL' ? 'All Openings' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {job.employmentType}
                </span>
                {job.salaryRange && (
                  <span className="text-xs font-semibold text-emerald-400">
                    {job.salaryRange}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 mt-1">
                  <Building className="w-3.5 h-3.5 text-purple-400" />
                  <span>{job.company}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{job.experience} Exp</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {job.description}
              </p>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Posted by {job.postedByName} (Batch {job.postedByBatch})</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={job.applyLinkOrEmail.includes('@') ? `mailto:${job.applyLinkOrEmail}?subject=Application for ${encodeURIComponent(job.title)} (Navodaya Alum)` : job.applyLinkOrEmail}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply / Request Referral</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative text-white">
            <button
              onClick={() => setIsPostJobModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <span>Post Job or Referral Opportunity</span>
            </h3>

            <form onSubmit={handlePostJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead React Developer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location / Remote</label>
                  <input
                    type="text"
                    required
                    placeholder="Bengaluru / Remote"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={newEmploymentType}
                    onChange={(e) => setNewEmploymentType(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="1-3 Years"
                    value={newExperience}
                    onChange={(e) => setNewExperience(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="₹10-18 LPA"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Job Description & Requirements</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe key responsibilities and skills required..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Apply Email / Referral Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. referrals@company.com or career page link"
                  value={newApplyLink}
                  onChange={(e) => setNewApplyLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-xl border border-slate-700"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
