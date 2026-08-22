import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import {
  User,
  Store,
  Briefcase,
  Plus,
  PlusCircle,
  Edit2,
  Trash2,
  Receipt,
  HeartHandshake,
  Vote,
  Image as ImageIcon,
  Droplet,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Save,
  LogIn,
  Layers,
  Sparkles,
  AlertCircle,
  DollarSign,
  Share2,
  Eye,
  Check
} from 'lucide-react';
import { JobPosting, BusinessListing, DonationRecord, AlumniProfile } from '../../types';

export const MemberDashboard: React.FC = () => {
  const {
    user,
    alumni,
    updateAlumnus,
    businesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    jobs,
    addJob,
    updateJob,
    deleteJob,
    donationRecords,
    donationCampaigns,
    welfareCases,
    addWelfareCase,
    nominations,
    election,
    memories,
    bloodDonors,
    toggleBloodDonorAvailability,
    eventRsvps,
    events,
    setLastGeneratedReceipt,
    setIsDonationModalOpen,
    setSelectedCampaignForDonation,
    setIsAuthModalOpen,
    setActiveTab,
    setActiveAlumniSubTab
  } = useData();

  const [activeTab, setActiveTabState] = useState<
    'profile' | 'businesses' | 'post_job' | 'my_jobs' | 'submissions' | 'donations' | 'welfare'
  >('profile');

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Find user's matched alumnus record
  const currentAlumnus = alumni.find(
    a => (user?.email && a.email?.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
         (user?.uid && a.id === user.uid)
  );

  // 1. Profile State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.displayName || currentAlumnus?.fullName || '',
    batchYear: currentAlumnus?.batchYear || user?.profile?.batchYear || 2012,
    house: currentAlumnus?.house || user?.profile?.house || 'Aravali',
    profession: currentAlumnus?.profession || user?.profile?.profession || 'Software Engineer',
    company: currentAlumnus?.company || user?.profile?.company || '',
    designation: currentAlumnus?.designation || user?.profile?.designation || '',
    city: currentAlumnus?.city || user?.profile?.city || 'Jaipur',
    state: currentAlumnus?.state || 'Rajasthan',
    country: currentAlumnus?.country || 'India',
    phone: currentAlumnus?.phone || user?.profile?.phone || '',
    bloodGroup: currentAlumnus?.bloodGroup || user?.profile?.bloodGroup || 'O+',
    bio: currentAlumnus?.bio || 'Proud Navodayan contributing to society.',
    linkedin: currentAlumnus?.linkedin || '',
    website: currentAlumnus?.website || '',
    isMentorAvailable: currentAlumnus?.isMentorAvailable ?? true,
    isLookingForJob: currentAlumnus?.isLookingForJob ?? false,
    isHiring: currentAlumnus?.isHiring ?? false
  });

  useEffect(() => {
    if (currentAlumnus || user) {
      setProfileForm({
        fullName: currentAlumnus?.fullName || user?.displayName || '',
        batchYear: currentAlumnus?.batchYear || user?.profile?.batchYear || 2012,
        house: currentAlumnus?.house || user?.profile?.house || 'Aravali',
        profession: currentAlumnus?.profession || user?.profile?.profession || 'Software Engineer',
        company: currentAlumnus?.company || user?.profile?.company || '',
        designation: currentAlumnus?.designation || user?.profile?.designation || '',
        city: currentAlumnus?.city || user?.profile?.city || 'Jaipur',
        state: currentAlumnus?.state || 'Rajasthan',
        country: currentAlumnus?.country || 'India',
        phone: currentAlumnus?.phone || user?.profile?.phone || '',
        bloodGroup: currentAlumnus?.bloodGroup || user?.profile?.bloodGroup || 'O+',
        bio: currentAlumnus?.bio || 'Proud Navodayan contributing to society.',
        linkedin: currentAlumnus?.linkedin || '',
        website: currentAlumnus?.website || '',
        isMentorAvailable: currentAlumnus?.isMentorAvailable ?? true,
        isLookingForJob: currentAlumnus?.isLookingForJob ?? false,
        isHiring: currentAlumnus?.isHiring ?? false
      });
    }
  }, [currentAlumnus, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAlumnus) {
      updateAlumnus(currentAlumnus.id, {
        fullName: profileForm.fullName,
        batchYear: Number(profileForm.batchYear),
        house: profileForm.house as any,
        profession: profileForm.profession,
        company: profileForm.company,
        designation: profileForm.designation,
        city: profileForm.city,
        state: profileForm.state,
        country: profileForm.country,
        phone: profileForm.phone,
        bloodGroup: profileForm.bloodGroup,
        bio: profileForm.bio,
        linkedin: profileForm.linkedin,
        website: profileForm.website,
        isMentorAvailable: profileForm.isMentorAvailable,
        isLookingForJob: profileForm.isLookingForJob,
        isHiring: profileForm.isHiring
      });
    }
    setSaveSuccessMsg('Your Alumni Member Profile has been updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // 2. Business Listings of User
  const myBusinesses = businesses.filter(
    b =>
      (user?.email && b.ownerEmail?.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
      (user?.displayName && b.ownerName?.toLowerCase().trim() === user.displayName.toLowerCase().trim())
  );

  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<BusinessListing | null>(null);
  const [bizForm, setBizForm] = useState({
    name: '',
    category: 'IT & Software',
    city: 'Jaipur / Barmer',
    website: '',
    discountForAlumni: '15% discount for all verified Navodayans',
    description: '',
    ownerPhone: user?.profile?.phone || '',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop'
  });

  const handleOpenAddBiz = () => {
    setEditingBiz(null);
    setBizForm({
      name: '',
      category: 'IT & Software',
      city: profileForm.city || 'Jaipur / Barmer',
      website: '',
      discountForAlumni: '15% special discount for verified Navodaya alumni',
      description: '',
      ownerPhone: profileForm.phone || '',
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop'
    });
    setIsNewBizModalOpen(true);
  };

  const handleOpenEditBiz = (biz: BusinessListing) => {
    setEditingBiz(biz);
    setBizForm({
      name: biz.name,
      category: biz.category,
      city: biz.city,
      website: biz.website || '',
      discountForAlumni: biz.discountForAlumni || '',
      description: biz.description,
      ownerPhone: biz.ownerPhone || '',
      logoUrl: biz.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop'
    });
    setIsNewBizModalOpen(true);
  };

  const handleSubmitBiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizForm.name || !bizForm.description) return;

    if (editingBiz) {
      updateBusiness(editingBiz.id, {
        name: bizForm.name,
        category: bizForm.category,
        city: bizForm.city,
        website: bizForm.website,
        discountForAlumni: bizForm.discountForAlumni,
        description: bizForm.description,
        ownerPhone: bizForm.ownerPhone,
        logoUrl: bizForm.logoUrl
      });
      setSaveSuccessMsg('Business listing updated successfully!');
    } else {
      addBusiness({
        name: bizForm.name,
        category: bizForm.category,
        city: bizForm.city,
        ownerName: user?.displayName || profileForm.fullName || 'Alumnus',
        ownerBatch: Number(profileForm.batchYear) || 2012,
        ownerEmail: user?.email || 'member@jnvpachpadra.org',
        ownerPhone: bizForm.ownerPhone || profileForm.phone || '+91 98000 00000',
        website: bizForm.website,
        discountForAlumni: bizForm.discountForAlumni,
        description: bizForm.description,
        logoUrl: bizForm.logoUrl
      });
      setSaveSuccessMsg('New business listed successfully in Alumni Directory!');
    }

    setIsNewBizModalOpen(false);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // 3. Post a Job / My Jobs
  const myJobs = jobs.filter(
    j =>
      (user?.email && j.postedByEmail?.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
      (user?.displayName && j.postedByName?.toLowerCase().trim() === user.displayName.toLowerCase().trim())
  );

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Bengaluru / Remote',
    employmentType: 'Full-Time' as const,
    experience: '2-4 Years',
    salaryRange: '₹12 - 20 LPA',
    description: '',
    applyLinkOrEmail: user?.email || ''
  });

  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      company: profileForm.company || '',
      location: 'Bengaluru / Remote',
      employmentType: 'Full-Time',
      experience: '2-5 Years',
      salaryRange: 'Competitive INR',
      description: '',
      applyLinkOrEmail: user?.email || 'hr@company.com'
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      employmentType: job.employmentType,
      experience: job.experience,
      salaryRange: job.salaryRange || '',
      description: job.description,
      applyLinkOrEmail: job.applyLinkOrEmail
    });
    setIsJobModalOpen(true);
  };

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company) return;

    if (editingJob) {
      updateJob(editingJob.id, {
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        employmentType: jobForm.employmentType,
        experience: jobForm.experience,
        salaryRange: jobForm.salaryRange,
        description: jobForm.description,
        applyLinkOrEmail: jobForm.applyLinkOrEmail
      });
      setSaveSuccessMsg('Job posting updated successfully!');
    } else {
      addJob({
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        employmentType: jobForm.employmentType,
        experience: jobForm.experience,
        salaryRange: jobForm.salaryRange,
        description: jobForm.description,
        applyLinkOrEmail: jobForm.applyLinkOrEmail || (user?.email || 'hr@company.com'),
        postedByName: user?.displayName || profileForm.fullName || 'Alumnus',
        postedByBatch: Number(profileForm.batchYear) || 2012,
        postedByEmail: user?.email || 'alumni@jnvpachpadra.org'
      });
      setSaveSuccessMsg('New job / referral opportunity published successfully!');
    }

    setIsJobModalOpen(false);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // 4. User's Donations & 80G Receipts
  const myDonations = donationRecords.filter(
    d =>
      (user?.email && d.donorEmail.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
      (user?.displayName && d.donorName.toLowerCase().trim() === user.displayName.toLowerCase().trim())
  );

  const totalDonated = myDonations
    .filter(d => d.paymentStatus === 'VERIFIED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 5. User's Submissions (Nominations, Memories, Blood Donor, RSVPs)
  const myNominations = nominations.filter(
    n =>
      (user?.uid && n.candidateId === user.uid) ||
      (user?.email && n.candidateEmail?.toLowerCase().trim() === user.email.toLowerCase().trim())
  );

  const myMemories = memories.filter(
    m =>
      (user?.displayName && m.alumnusName?.toLowerCase().trim() === user.displayName.toLowerCase().trim()) ||
      (user?.email && m.id.includes(user.email))
  );

  const myBloodDonorRecord = bloodDonors.find(
    b =>
      (user?.email && b.contactEmail?.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
      (user?.displayName && b.fullName?.toLowerCase().trim() === user.displayName.toLowerCase().trim())
  );

  const myRSVPs = eventRsvps.filter(
    r =>
      (user?.uid && r.alumnusId === user.uid) ||
      (user?.email && r.alumnusEmail?.toLowerCase().trim() === user.email.toLowerCase().trim())
  );

  // 6. Welfare Aid Request Modal
  const [isWelfareReqOpen, setIsWelfareReqOpen] = useState(false);
  const [welfareForm, setWelfareForm] = useState({
    title: '',
    alumnusName: user?.displayName || '',
    batchYear: profileForm.batchYear || 2012,
    category: 'Medical Relief' as const,
    targetAmount: 100000,
    story: '',
    contactPerson: user?.displayName || '',
    contactPhone: profileForm.phone || ''
  });

  const handleSubmitWelfareRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!welfareForm.title || !welfareForm.story) return;

    addWelfareCase({
      title: welfareForm.title,
      alumnusName: welfareForm.alumnusName,
      batchYear: Number(welfareForm.batchYear),
      category: welfareForm.category,
      targetAmount: Number(welfareForm.targetAmount),
      story: welfareForm.story,
      contactPerson: welfareForm.contactPerson,
      contactPhone: welfareForm.contactPhone,
      isVerified: true
    });

    setIsWelfareReqOpen(false);
    setSaveSuccessMsg('Welfare support case submitted to PAA committee for verification!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // If not logged in, prompt sign in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 p-3 mx-auto flex items-center justify-center shadow-md">
          <User className="w-8 h-8 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Alumni Member Dashboard</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Please sign in with your verified alumni account to manage your profile, list your business, post career opportunities, and view your 80G tax receipts.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Member Portal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="alumni-member-dashboard"
    >
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={
                  user.photoURL ||
                  currentAlumnus?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
                }
                alt={user.displayName || 'Member'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-900 shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {user.displayName || currentAlumnus?.fullName || 'Alumni Member'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                  Verified Alumnus
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profileForm.profession || 'Professional'} {profileForm.company ? `at ${profileForm.company}` : ''} • Class of {profileForm.batchYear} ({profileForm.house} House)
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profileForm.city}, {profileForm.state}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-slate-400">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-center px-2">
              <div className="text-lg font-black text-amber-400">{myBusinesses.length}</div>
              <div className="text-[10px] text-slate-400">Businesses</div>
            </div>
            <div className="text-center px-2 border-x border-slate-800">
              <div className="text-lg font-black text-purple-400">{myJobs.length}</div>
              <div className="text-[10px] text-slate-400">Job Posts</div>
            </div>
            <div className="text-center px-2">
              <div className="text-lg font-black text-emerald-400">₹{totalDonated.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-400">80G Giving</div>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pt-6 mt-6 border-t border-slate-800">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'businesses', label: 'My Business', count: myBusinesses.length, icon: Store },
            { id: 'post_job', label: 'Post a Job', icon: PlusCircle },
            { id: 'my_jobs', label: 'My Job Posts', count: myJobs.length, icon: Briefcase },
            { id: 'submissions', label: 'My Submissions & Activity', count: myNominations.length + myMemories.length, icon: Layers },
            { id: 'donations', label: 'Payment & 80G Receipts', count: myDonations.length, icon: Receipt },
            { id: 'welfare', label: 'Alumni Welfare & Aid', icon: HeartHandshake }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabState(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. MY PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-5 h-5 text-amber-600" />
                <span>Personal & Professional Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep your details updated in the JNV Pachpadra Alumni Directory & Mentorship Network.
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Save Profile Changes</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Passout Batch Year *</label>
                <input
                  type="number"
                  required
                  value={profileForm.batchYear}
                  onChange={e => setProfileForm({ ...profileForm, batchYear: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">School House</label>
                <select
                  value={profileForm.house}
                  onChange={e => setProfileForm({ ...profileForm, house: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition cursor-pointer"
                >
                  <option value="Aravali">Aravali (Red)</option>
                  <option value="Nilgiri">Nilgiri (Blue)</option>
                  <option value="Shivalik">Shivalik (Green)</option>
                  <option value="Udaygiri">Udaygiri (Yellow)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Profession / Industry</label>
                <input
                  type="text"
                  value={profileForm.profession}
                  onChange={e => setProfileForm({ ...profileForm, profession: e.target.value })}
                  placeholder="e.g. Software Engineer, Civil Servant, Doctor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Company / Organization</label>
                <input
                  type="text"
                  value={profileForm.company}
                  onChange={e => setProfileForm({ ...profileForm, company: e.target.value })}
                  placeholder="e.g. Google India, Govt of Rajasthan, AIIMS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Designation / Role</label>
                <input
                  type="text"
                  value={profileForm.designation}
                  onChange={e => setProfileForm({ ...profileForm, designation: e.target.value })}
                  placeholder="e.g. Principal Architect, Director, Consultant"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Current City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                  placeholder="e.g. Jaipur, Bengaluru, Delhi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">State / Region</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={e => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Blood Group</label>
                <select
                  value={profileForm.bloodGroup}
                  onChange={e => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition cursor-pointer"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+91 98000 00000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={profileForm.linkedin}
                  onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Website / Portfolio</label>
                <input
                  type="text"
                  value={profileForm.website}
                  onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Short Bio & Navodaya Memories</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Share your journey, areas where you can help juniors, or fond Vidyalaya recollections..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            {/* Mentorship & Networking Toggles */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Alumni Engagement & Mentorship Flags
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-start space-x-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.isMentorAvailable}
                    onChange={e => setProfileForm({ ...profileForm, isMentorAvailable: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-0 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-950">Open for Mentorship</div>
                    <div className="text-[11px] text-amber-800">Guide school students & junior batch alumni in my career field.</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.isHiring}
                    onChange={e => setProfileForm({ ...profileForm, isHiring: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-blue-950">Currently Hiring</div>
                    <div className="text-[11px] text-blue-800">My team has openings and actively welcomes Navodaya talent.</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-200/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileForm.isLookingForJob}
                    onChange={e => setProfileForm({ ...profileForm, isLookingForJob: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-purple-950">Open to Opportunities</div>
                    <div className="text-[11px] text-purple-800">Interested in career referrals & high-growth job roles.</div>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 2. MY BUSINESS TAB */}
      {activeTab === 'businesses' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <span>My Business Listings & Enterprises</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Promote your company, startup, or consultancy to 2,000+ verified alumni with special discounts.
              </p>
            </div>
            <button
              onClick={handleOpenAddBiz}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List New Business</span>
            </button>
          </div>

          {myBusinesses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <Store className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Business Listings Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Do you own a company, retail firm, startup, or professional consultancy? List it in the alumni network to gain clients and referrals.
              </p>
              <button
                onClick={handleOpenAddBiz}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                + List Your Business Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myBusinesses.map(biz => (
                <div
                  key={biz.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {biz.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditBiz(biz)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition cursor-pointer"
                          title="Edit Business"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBusiness(biz.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition cursor-pointer"
                          title="Delete Business"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{biz.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{biz.description}</p>
                    </div>

                    {biz.discountForAlumni && (
                      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{biz.discountForAlumni}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{biz.city}</span>
                    </span>
                    {biz.website && (
                      <a
                        href={biz.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. POST A JOB TAB */}
      {activeTab === 'post_job' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>Post a Job Opening / Alumni Referral</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share open opportunities in your team with talented JNV Pachpadra graduates.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitJob} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer (React/TS)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  value={jobForm.company}
                  onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                  placeholder="e.g. Microsoft India, Zomato, Startup"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="e.g. Bengaluru, Remote, Gurgaon"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Employment Type</label>
                <select
                  value={jobForm.employmentType}
                  onChange={e => setJobForm({ ...jobForm, employmentType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition cursor-pointer"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Experience Required</label>
                <input
                  type="text"
                  value={jobForm.experience}
                  onChange={e => setJobForm({ ...jobForm, experience: e.target.value })}
                  placeholder="e.g. Freshers / 2-4 Years / 5+ Years"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Estimated Salary / CTC</label>
                <input
                  type="text"
                  value={jobForm.salaryRange}
                  onChange={e => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                  placeholder="e.g. ₹12 - 20 LPA or Best in Industry"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">Application Link or Direct Referral Email *</label>
                <input
                  type="text"
                  required
                  value={jobForm.applyLinkOrEmail}
                  onChange={e => setJobForm({ ...jobForm, applyLinkOrEmail: e.target.value })}
                  placeholder="e.g. https://careers.company.com/job/123 or hr@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">Job Description & Key Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={jobForm.description}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Key responsibilities, required tech stack, eligibility, and referral notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-purple-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Publish Job Opening</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. MY JOB POSTS TAB */}
      {activeTab === 'my_jobs' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>My Active Job Postings ({myJobs.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your submitted job listings, referrals, and applications.
              </p>
            </div>
            <button
              onClick={() => setActiveTabState('post_job')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Another Opening</span>
            </button>
          </div>

          {myJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Job Openings Posted</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Help fellow Navodayans find their next big career break by posting internship or referral opportunities.
              </p>
              <button
                onClick={() => setActiveTabState('post_job')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                + Post a Job Opening
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                        {job.employmentType}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditJob(job)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition cursor-pointer"
                          title="Edit Job"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                      <div className="text-xs font-semibold text-purple-700 mt-0.5">{job.company}</div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{job.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">
                        📍 {job.location}
                      </span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">
                        ⏳ {job.experience}
                      </span>
                      {job.salaryRange && (
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200 font-semibold">
                          💰 {job.salaryRange}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">{job.applyLinkOrEmail}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Listing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. MY SUBMISSIONS & ACTIVITY TAB */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Section A: Election Nominations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Vote className="w-5 h-5 text-rose-600" />
              <span>Election Nominations & Candidacy Status</span>
            </h3>
            {myNominations.length === 0 ? (
              <p className="text-xs text-slate-500 italic">You have not submitted any self-nominations for ongoing elections.</p>
            ) : (
              <div className="space-y-3">
                {myNominations.map(nom => (
                  <div key={nom.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{nom.positionTitle}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5 italic">"{nom.manifesto}"</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        nom.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {nom.isApproved ? 'Approved Candidate' : 'Under Committee Review'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Memories Submitted */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <span>Memories & Wall of Fame Submissions</span>
            </h3>
            {myMemories.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No photo memories shared yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myMemories.map(mem => (
                  <div key={mem.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <img src={mem.imageUrl} alt={mem.caption} className="w-full h-36 object-cover rounded-xl" />
                    <div className="text-xs font-semibold text-slate-900">{mem.caption}</div>
                    <div className="text-[10px] text-slate-500">{mem.batchYear} • {mem.likesCount || 0} Likes</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section C: Blood Donor Registration */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-rose-600" />
                <span>Blood Lifeline Donor Registration</span>
              </h3>
              {myBloodDonorRecord && (
                <button
                  onClick={() => toggleBloodDonorAvailability(myBloodDonorRecord.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    myBloodDonorRecord.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {myBloodDonorRecord.isAvailable ? 'Status: Available for Donation' : 'Status: Currently Unavailable'}
                </button>
              )}
            </div>
            {myBloodDonorRecord ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-950 space-y-1">
                <div className="font-bold text-rose-900 text-sm">Blood Group: {myBloodDonorRecord.bloodGroup}</div>
                <div>Location: {myBloodDonorRecord.city}, {myBloodDonorRecord.state} • Phone: {myBloodDonorRecord.phone}</div>
                <div className="text-[11px] text-rose-700">Thank you for being registered as a life-saving blood donor for fellow Navodayans!</div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">You are not yet registered in the Navodaya Blood Lifeline network.</p>
            )}
          </div>

          {/* Section D: Event RSVPs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Campus Reunions & Event RSVPs</span>
            </h3>
            {myRSVPs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No registered event RSVPs found.</p>
            ) : (
              <div className="space-y-2">
                {myRSVPs.map(rsvp => (
                  <div key={rsvp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{rsvp.eventId}</div>
                      <div className="text-slate-500 text-[11px]">{rsvp.guestCount || 1} Attending • {rsvp.status}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-md">Confirmed</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. PAYMENT / DONATION HISTORY & 80G RECEIPTS */}
      {activeTab === 'donations' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                <span>My 80G Welfare Donations & Tax Exemption Receipts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download and print official 80G computerized receipts for 50% income tax deduction under Section 80G.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCampaignForDonation(donationCampaigns[0] || null);
                setIsDonationModalOpen(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Make a Contribution</span>
            </button>
          </div>

          {myDonations.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Donations Recorded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Support Vidyalaya infrastructure, student scholarships, or alumni emergency medical funds to receive instant 80G tax benefit certificates.
              </p>
              <button
                onClick={() => {
                  setSelectedCampaignForDonation(donationCampaigns[0] || null);
                  setIsDonationModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Contribute to Welfare Fund
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-3">Receipt No</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Campaign / Purpose</th>
                      <th className="py-3 px-3">Amount & Mode</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">80G Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myDonations.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-3 font-mono font-bold text-teal-800">{rec.receiptNumber}</td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {new Date(rec.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900">{rec.campaignTitle}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Ref: {rec.transactionRef || 'Direct Transfer'}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 text-sm">₹{rec.amount.toLocaleString('en-IN')}</div>
                          <span className="text-[10px] text-slate-500 uppercase">{rec.paymentMode}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.paymentStatus === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : rec.paymentStatus === 'PENDING'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {rec.paymentStatus === 'VERIFIED' ? 'Verified / Issued' : rec.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => setLastGeneratedReceipt(rec)}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold transition inline-flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-teal-700" />
                            <span>Download 80G Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. ALUMNI WELFARE TAB */}
      {activeTab === 'welfare' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>Alumni Welfare Aid & Mutual Support</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Support emergency medical assistance, student scholarships, or request welfare aid for a batchmate.
              </p>
            </div>
            <button
              onClick={() => setIsWelfareReqOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Request / Nominate for Welfare Aid</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {welfareCases.map(wc => {
              const collected = wc.collectedAmount ?? 0;
              const target = wc.targetAmount ?? 100000;
              const pct = Math.min(100, Math.round((collected / target) * 100));
              return (
                <div key={wc.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {wc.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">Batch {wc.batchYear}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{wc.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{wc.story}</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700">₹{collected.toLocaleString('en-IN')} Raised</span>
                      <span className="text-slate-500">Goal: ₹{target.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">Beneficiary: {wc.alumnusName}</div>
                    <button
                      onClick={() => {
                        setSelectedCampaignForDonation({
                          id: wc.id,
                          title: `Welfare Aid: ${wc.title}`,
                          category: 'Alumni Emergency Fund',
                          targetAmount: wc.targetAmount,
                          currentAmount: wc.collectedAmount,
                          description: wc.story,
                          beneficiary: wc.alumnusName,
                          endDate: '2026-12-31',
                          status: 'ACTIVE'
                        });
                        setIsDonationModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Contribute Aid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BUSINESS */}
      {isNewBizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingBiz ? 'Edit Business Listing' : 'List New Business Enterprise'}
              </h3>
              <button onClick={() => setIsNewBizModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBiz} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={bizForm.name}
                  onChange={e => setBizForm({ ...bizForm, name: e.target.value })}
                  placeholder="e.g. Marwar Solar Tech & Engineering"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={bizForm.category}
                    onChange={e => setBizForm({ ...bizForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="IT & Software">IT & Software</option>
                    <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
                    <option value="Construction & Real Estate">Construction & Real Estate</option>
                    <option value="Healthcare & Pharmacy">Healthcare & Pharmacy</option>
                    <option value="Education & EdTech">Education & EdTech</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Legal & Financial Advisory">Legal & Financial Advisory</option>
                    <option value="Hospitality & Travel">Hospitality & Travel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / Base</label>
                  <input
                    type="text"
                    value={bizForm.city}
                    onChange={e => setBizForm({ ...bizForm, city: e.target.value })}
                    placeholder="e.g. Jaipur / Barmer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={bizForm.website}
                  onChange={e => setBizForm({ ...bizForm, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Discount / Perks for Alumni</label>
                <input
                  type="text"
                  value={bizForm.discountForAlumni}
                  onChange={e => setBizForm({ ...bizForm, discountForAlumni: e.target.value })}
                  placeholder="e.g. 15% discount for all verified Navodayans"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Services Offered *</label>
                <textarea
                  rows={3}
                  required
                  value={bizForm.description}
                  onChange={e => setBizForm({ ...bizForm, description: e.target.value })}
                  placeholder="Brief overview of your products, consulting services, and expertise..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBizModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  {editingBiz ? 'Save Changes' : 'Publish Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST WELFARE AID */}
      {isWelfareReqOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Request / Nominate for Welfare Aid</h3>
              <button onClick={() => setIsWelfareReqOpen(false)} className="text-slate-400 hover:text-slate-700">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWelfareRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Case Title *</label>
                <input
                  type="text"
                  required
                  value={welfareForm.title}
                  onChange={e => setWelfareForm({ ...welfareForm, title: e.target.value })}
                  placeholder="e.g. Medical Relief for Surgery / Higher Ed Scholarship"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Beneficiary Name *</label>
                  <input
                    type="text"
                    required
                    value={welfareForm.alumnusName}
                    onChange={e => setWelfareForm({ ...welfareForm, alumnusName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Year</label>
                  <input
                    type="number"
                    value={welfareForm.batchYear}
                    onChange={e => setWelfareForm({ ...welfareForm, batchYear: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Support Category</label>
                  <select
                    value={welfareForm.category}
                    onChange={e => setWelfareForm({ ...welfareForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Medical Relief">Medical Relief</option>
                    <option value="Higher Education Support">Higher Education Support</option>
                    <option value="Emergency Family Aid">Emergency Family Aid</option>
                    <option value="Career & Skill Fellowship">Career & Skill Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Required Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={welfareForm.targetAmount}
                    onChange={e => setWelfareForm({ ...welfareForm, targetAmount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Story & Supporting Context *</label>
                <textarea
                  rows={4}
                  required
                  value={welfareForm.story}
                  onChange={e => setWelfareForm({ ...welfareForm, story: e.target.value })}
                  placeholder="Explain the background, current crisis, hospital/tuition estimates, and how PAA fund will help..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWelfareReqOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Submit Welfare Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
