import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import {
  Users,
  BookOpen,
  Calendar,
  Vote,
  DollarSign,
  Briefcase,
  Image as ImageIcon,
  Compass,
  Search,
  Filter,
  MapPin,
  Mail,
  Heart,
  Plus,
  CheckCircle,
  Building,
  GraduationCap,
  Award,
  Sparkles,
  Download,
  X,
  ExternalLink,
  Phone,
  Linkedin,
  Globe
} from 'lucide-react';
import { AlumniProfile } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { SchoolEventsView } from '../school/SchoolEventsView';
import { FinancialTransparencyView } from '../school/FinancialTransparencyView';
import { DonationPortalView } from '../donations/DonationPortalView';
import { BloodDonationView } from '../blood/BloodDonationView';
import { Droplet, HeartHandshake, Receipt } from 'lucide-react';

export const AlumniSectionView: React.FC = () => {
  const {
    alumni,
    batches,
    businesses,
    jobs,
    welfareCases,
    memories,
    likeMemory,
    election,
    submitNomination,
    castVote,
    hasUserVotedForPosition,
    user,
    activeAlumniSubTab,
    setActiveAlumniSubTab,
    setIsRegisterModalOpen,
    exportToCSV
  } = useData();

  // Directory Search & Filter state
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');

  // Selected Alumnus profile modal
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumniProfile | null>(null);

  // Self-Nomination Form state
  const [isNomModalOpen, setIsNomModalOpen] = useState(false);
  const [nomPositionId, setNomPositionId] = useState(election.positions[0]?.id || '');
  const [nomManifesto, setNomManifesto] = useState('');
  const [nomFeedback, setNomFeedback] = useState<string | null>(null);

  // Filtered Alumni list
  const filteredAlumni = alumni.filter(a => {
    const matchesSearch =
      !directorySearch ||
      (a.fullName && a.fullName.toLowerCase().includes(directorySearch.toLowerCase())) ||
      (a.email && a.email.toLowerCase().includes(directorySearch.toLowerCase())) ||
      (a.profession && a.profession.toLowerCase().includes(directorySearch.toLowerCase())) ||
      (a.city && a.city.toLowerCase().includes(directorySearch.toLowerCase())) ||
      (a.company && a.company.toLowerCase().includes(directorySearch.toLowerCase()));

    const matchesBatch = selectedBatchFilter === 'All' || String(a.batchYear) === selectedBatchFilter;
    const matchesHouse = selectedHouseFilter === 'All' || a.house === selectedHouseFilter;
    const matchesCity = selectedCityFilter === 'All' || a.city === selectedCityFilter;

    return matchesSearch && matchesBatch && matchesHouse && matchesCity && a.verificationStatus === 'verified';
  });

  const uniqueCities = ['All', ...Array.from(new Set(alumni.map(a => a.city))).filter(Boolean)];

  const handleNominationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setNomFeedback('Please sign in to submit nomination.');
      return;
    }
    const pos = election.positions.find(p => p.id === nomPositionId);
    if (!pos) return;

    const res = submitNomination({
      electionId: election.id,
      positionId: nomPositionId,
      positionTitle: pos.title,
      candidateId: user.uid,
      candidateName: user.displayName || 'Alumnus',
      candidateEmail: user.email || 'alumni@jnv.in',
      batch: user.profile?.batchYear || 2012,
      profession: user.profile?.profession || 'Professional',
      city: user.profile?.city || 'Barmer',
      manifesto: nomManifesto
    });

    setNomFeedback(res.message);
    if (res.success) {
      setTimeout(() => {
        setIsNomModalOpen(false);
        setNomManifesto('');
        setNomFeedback(null);
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
    >
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Navodaya Alumni Association (PAA)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              JNV Pachpadra Alumni Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Connect with batchmates, participate in democratic association elections, join reunions, offer mentorship, and support school welfare projects.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Join / Register Alumnus</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Sub-tabs */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveAlumniSubTab('directory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'directory'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Alumni Directory</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('batches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'batches'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Batch Rosters</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('events')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'events'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Reunions & RSVPs</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('elections')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'elections'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Live Elections (E-Ballot)</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('financials')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'financials'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Ledger</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'jobs'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jobs & Businesses</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('memories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'memories'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Memories & Wall</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('welfare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'welfare'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Welfare & Giving Back</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('donations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'donations'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-amber-700 bg-amber-50/70 hover:bg-amber-100 hover:text-amber-900 border border-amber-200'
            }`}
          >
            <Receipt className="w-4 h-4 text-amber-600" />
            <span>80G Donation Portal</span>
          </button>

          <button
            onClick={() => setActiveAlumniSubTab('blood')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              activeAlumniSubTab === 'blood'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-rose-700 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-900 border border-rose-200'
            }`}
          >
            <Droplet className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Blood Lifeline Network</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DIRECTORY & SEARCH */}
      {activeAlumniSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, profession, city, company..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white cursor-pointer"
              >
                <option value="All">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={String(b.passoutYear)}>
                    Batch {b.passoutYear}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedHouseFilter}
                onChange={(e) => setSelectedHouseFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white cursor-pointer"
              >
                <option value="All">All Houses</option>
                <option value="Aravali">Aravali</option>
                <option value="Nilgiri">Nilgiri</option>
                <option value="Shivalik">Shivalik</option>
                <option value="Udaygiri">Udaygiri</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white cursor-pointer"
              >
                {uniqueCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Found <strong className="text-slate-900 font-semibold">{filteredAlumni.length}</strong> verified alumni</span>
            <button
              onClick={() => exportToCSV('alumni')}
              className="text-amber-800 hover:text-amber-900 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Alumni Roster</span>
            </button>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlumni.map((alum) => (
              <motion.div
                key={alum.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedAlumnus(alum)}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-slate-300 hover:shadow-sm transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start space-x-3.5">
                  <ImageWithFallback
                    src={alum.avatar}
                    alt={alum.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Class of {alum.batchYear}
                      </span>
                      {alum.house && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          • {alum.house}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">
                      {alum.fullName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{alum.profession}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-800">{alum.city}, {alum.state}</span>
                  </div>
                  {alum.company && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Organization:</span>
                      <span className="text-slate-700 truncate max-w-[160px] font-medium">{alum.company}</span>
                    </div>
                  )}
                  {alum.isMentorAvailable && (
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ Open to Student Mentorship
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: BATCH ROSTERS */}
      {activeAlumniSubTab === 'batches' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Batch Chronology (1995 – 2026)</h2>
            <p className="text-xs text-slate-500">Class rosters, batch coordinators, and reunion schedules.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900">Batch of {b.passoutYear}</h3>
                  <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">{b.totalStudents} Students</span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="text-slate-500">Batch Coordinator:</span>{' '}
                  <strong className="text-slate-900">{b.coordinatorName}</strong>
                </div>
                {b.whatsAppGroupUrl && (
                  <a
                    href={b.whatsAppGroupUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs text-emerald-700 hover:text-emerald-800 font-semibold pt-1"
                  >
                    Join Batch WhatsApp Community →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: REUNIONS & RSVPS */}
      {activeAlumniSubTab === 'events' && (
        <div className="space-y-6">
          <SchoolEventsView />
        </div>
      )}

      {/* SUBTAB 3: LIVE ELECTIONS & E-BALLOT */}
      {activeAlumniSubTab === 'elections' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                    TERM: {election.term}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    STATUS: {election.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{election.title}</h2>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {election.description} Cast your secure, certified electronic ballot for the governing executive committee.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsNomModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  File Self-Nomination
                </button>
              </div>
            </div>
          </div>

          {/* E-Ballot Positions */}
          <div className="space-y-6">
            {election.positions.map((pos) => {
              const hasVoted = hasUserVotedForPosition(pos.id);

              return (
                <div key={pos.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{pos.title}</h3>
                      <p className="text-xs text-slate-500">{pos.description}</p>
                    </div>
                    {hasVoted && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ Ballot Cast
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pos.candidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <ImageWithFallback
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{cand.name}</h4>
                              <p className="text-[11px] text-amber-800 font-medium">
                                Batch of {cand.batch} • {cand.profession}
                              </p>
                              <p className="text-[10px] text-slate-500">{cand.city}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-200">
                            "{cand.manifesto}"
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                          <div className="text-xs text-slate-600">
                            Certified Votes: <strong className="text-slate-900">{cand.votes}</strong>
                          </div>

                          {!hasVoted && election.status === 'ACTIVE' ? (
                            <button
                              onClick={() => {
                                const res = castVote(election.id, pos.id, cand.id);
                                alert(res.message);
                              }}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                            >
                              Vote for Candidate
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: FINANCIAL LEDGER & AUDIT */}
      {activeAlumniSubTab === 'financials' && (
        <div className="space-y-6">
          <FinancialTransparencyView />
        </div>
      )}

      {/* SUBTAB 4: JOBS & BUSINESSES */}
      {activeAlumniSubTab === 'jobs' && (
        <div className="space-y-8">
          {/* Jobs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Alumni Job Opportunities & Referrals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {job.jobType}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">{job.salaryRange}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                  <div className="text-xs text-slate-600 font-medium">{job.company} • {job.location}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                    <span>Posted by {job.postedByName} (Batch {job.postedByBatch})</span>
                    <a href={`mailto:${job.contactEmail}`} className="text-slate-900 hover:underline font-semibold">Apply / Contact</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Businesses */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Alumni Enterprise & Business Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((biz) => (
                <div key={biz.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                      {biz.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-600 font-mono">{biz.city}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{biz.businessName}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{biz.description}</p>
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                    <span>Founder: {biz.ownerName} (Batch {biz.ownerBatch})</span>
                    {biz.website && <a href={biz.website} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-semibold">Visit Website</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: MEMORIES & WALL */}
      {activeAlumniSubTab === 'memories' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Alumni Memory Wall & Nostalgia</h2>
            <p className="text-xs text-slate-500">Share your cherished Navodaya moments, hostel memories, and migration stories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden space-y-3 p-5 shadow-xs"
              >
                {m.photoUrl && (
                  <ImageWithFallback src={m.photoUrl} alt={m.title} className="w-full h-44 object-cover rounded-xl" />
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Year {m.year}</span>
                  <h3 className="text-sm font-bold text-slate-900 pt-1">{m.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{m.description}"</p>
                </div>
                <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                  <span>{m.authorName} (Batch {m.batchYear})</span>
                  <button
                    onClick={() => likeMemory(m.id)}
                    className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{m.likesCount}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: WELFARE & GIVING BACK */}
      {activeAlumniSubTab === 'welfare' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Alumni Welfare & Emergency Assistance Fund</h2>
            <p className="text-xs text-slate-500">Providing medical, educational, and crisis support to Navodayan families in need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {welfareCases.map((w) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {w.urgency} Priority
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{w.status}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{w.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{w.description}</p>
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beneficiary:</span>
                    <span className="font-semibold text-slate-900">{w.beneficiary} {w.beneficiaryBatch ? `(Batch ${w.beneficiaryBatch})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Amount:</span>
                    <span className="font-bold text-slate-900">₹{(w.amountRequired ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Raised So Far:</span>
                    <span className="font-bold text-emerald-700">₹{(w.amountRaised ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 7: 80G DONATION PORTAL */}
      {activeAlumniSubTab === 'donations' && (
        <div className="pt-2">
          <DonationPortalView />
        </div>
      )}

      {/* SUBTAB 8: BLOOD LIFELINE NETWORK */}
      {activeAlumniSubTab === 'blood' && (
        <div className="pt-2">
          <BloodDonationView />
        </div>
      )}

      {/* Selected Alumnus Profile Detail Modal */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-xl relative"
          >
            <button
              onClick={() => setSelectedAlumnus(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4">
              <ImageWithFallback
                src={selectedAlumnus.avatar}
                alt={selectedAlumnus.fullName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedAlumnus.fullName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Class of {selectedAlumnus.batchYear}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700">{selectedAlumnus.profession}</p>
                {selectedAlumnus.company && (
                  <p className="text-xs text-slate-500">{selectedAlumnus.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{selectedAlumnus.city}, {selectedAlumnus.state}</span>
              </div>
              {selectedAlumnus.house && (
                <div className="flex justify-between">
                  <span className="text-slate-500">House:</span>
                  <span className="font-semibold text-slate-800">{selectedAlumnus.house}</span>
                </div>
              )}
              {selectedAlumnus.bloodGroup && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-semibold text-rose-700 font-mono">🩸 {selectedAlumnus.bloodGroup}</span>
                </div>
              )}
            </div>

            {selectedAlumnus.bio && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">About</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedAlumnus.bio}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAlumnus(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Nomination Form Modal */}
      {isNomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">Alumni Association Nomination Form</h3>
                <p className="text-xs text-slate-500">Submit self-nomination for the executive committee.</p>
              </div>
              <button
                onClick={() => setIsNomModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {nomFeedback && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-medium">
                {nomFeedback}
              </div>
            )}

            <form onSubmit={handleNominationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Position</label>
                <select
                  value={nomPositionId}
                  onChange={(e) => setNomPositionId(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white cursor-pointer"
                >
                  {election.positions.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Key Manifesto & Vision</label>
                <textarea
                  rows={3}
                  required
                  value={nomManifesto}
                  onChange={(e) => setNomManifesto(e.target.value)}
                  placeholder="Outline how you will serve the alumni association..."
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNomModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Nomination
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

