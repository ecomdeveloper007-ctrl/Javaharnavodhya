import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AlumniProfile,
  BatchInfo,
  BusinessListing,
  JobPosting,
  WelfareCase,
  DonationCampaign,
  DonationRecord,
  FinancialTransaction,
  FinancialReport,
  AlumniEvent,
  EventRSVP,
  Election,
  ElectionNomination,
  ElectionVote,
  ElectionAuditLog,
  AlumniMemory,
  Achievement,
  SchoolNotice,
  FacultyMember,
  GalleryItem,
  AdmissionEnquiry,
  UserAuth,
  UserRole,
  RolePermission,
  SchoolSettings,
  BoardTopper,
  VMCLeader,
  HouseInfo
} from '../types';
import {
  SEED_ALUMNI,
  SEED_BATCHES,
  SEED_BUSINESSES,
  SEED_JOBS,
  SEED_WELFARE_CASES,
  SEED_DONATION_CAMPAIGNS,
  SEED_TRANSACTIONS,
  SEED_FINANCIAL_REPORTS,
  SEED_EVENTS,
  SEED_EVENT_RSVPS,
  SEED_ELECTIONS,
  SEED_NOMINATIONS,
  SEED_AUDIT_LOGS,
  SEED_MEMORIES,
  SEED_ACHIEVEMENTS,
  SEED_NOTICES,
  SEED_FACULTY,
  SEED_GALLERY,
  SEED_ADMISSION_ENQUIRIES,
  SEED_ROLES_PERMISSIONS,
  SEED_SCHOOL_SETTINGS,
  SEED_HOUSES,
  SEED_TOPPERS,
  SEED_VMC_MEMBERS
} from '../data/seedData';
import { auth, signInWithGoogle, logoutUser, AuthErrorDetails, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface CSVImportResult {
  success: boolean;
  importedCount: number;
  duplicateCount: number;
  errors: string[];
  message: string;
}

interface DataContextType {
  // Auth & RBAC
  user: UserAuth | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  assignUserRole: (alumniIdOrEmail: string, role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  loginWithGoogle: () => Promise<void>;
  loginDirectlyAsSuperAdmin: () => void;
  loginDirectlyAs: (emailOrId: string, role?: UserRole) => void;
  simulateLoginAs: (alumniId: string, customProfile?: Partial<AlumniProfile>, role?: UserRole) => void;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authError: AuthErrorDetails | null;
  setAuthError: (err: AuthErrorDetails | null) => void;

  // School CMS & Global Settings
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (updates: Partial<SchoolSettings>) => void;
  houses: HouseInfo[];
  updateHouse: (id: string, updates: Partial<HouseInfo>) => void;
  toppers: BoardTopper[];
  addTopper: (topper: Omit<BoardTopper, 'id'>) => void;
  updateTopper: (id: string, updates: Partial<BoardTopper>) => void;
  deleteTopper: (id: string) => void;
  vmcMembers: VMCLeader[];
  addVMCMember: (member: Omit<VMCLeader, 'id'>) => void;
  updateVMCMember: (id: string, updates: Partial<VMCLeader>) => void;
  deleteVMCMember: (id: string) => void;

  // School Notices & Circulars
  notices: SchoolNotice[];
  addNotice: (notice: Omit<SchoolNotice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<SchoolNotice>) => void;
  deleteNotice: (id: string) => void;

  // Faculty & Staff Directory
  faculty: FacultyMember[];
  addFaculty: (faculty: Omit<FacultyMember, 'id'>) => void;
  updateFaculty: (id: string, faculty: Partial<FacultyMember>) => void;
  deleteFaculty: (id: string) => void;

  // Gallery & Media
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  // Admissions & Inquiries
  admissionEnquiries: AdmissionEnquiry[];
  submitAdmissionEnquiry: (enquiry: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: AdmissionEnquiry['status']) => void;
  deleteAdmissionEnquiry: (id: string) => void;

  // Alumni Directory & Moderation
  alumni: AlumniProfile[];
  batches: BatchInfo[];
  updateBatchInfo: (passoutYear: number, updates: Partial<BatchInfo>) => void;
  approveAlumni: (id: string) => void;
  rejectAlumni: (id: string) => void;
  deactivateAlumni: (id: string) => void;
  addAlumnusDirectly: (profile: Omit<AlumniProfile, 'id' | 'createdAt'>) => void;
  updateAlumniProfile: (id: string, updates: Partial<AlumniProfile>) => void;
  deleteAlumni: (id: string) => void;
  registerAlumni: (profile: Omit<AlumniProfile, 'id' | 'createdAt' | 'verificationStatus'>) => void;

  // Business Directory
  businesses: BusinessListing[];
  addBusiness: (business: Omit<BusinessListing, 'id' | 'createdAt' | 'isVerified'>) => void;
  updateBusiness: (id: string, updates: Partial<BusinessListing>) => void;
  approveBusiness: (id: string) => void;
  rejectBusiness: (id: string) => void;
  deleteBusiness: (id: string) => void;

  // Job Board
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, 'id' | 'createdAt' | 'isActive'>) => void;
  updateJob: (id: string, updates: Partial<JobPosting>) => void;
  approveJob: (id: string) => void;
  rejectJob: (id: string) => void;
  deleteJob: (id: string) => void;

  // Welfare & Campaigns
  welfareCases: WelfareCase[];
  addWelfareCase: (welfare: Omit<WelfareCase, 'id' | 'createdAt'>) => void;
  updateWelfareCase: (id: string, updates: Partial<WelfareCase>) => void;
  deleteWelfareCase: (id: string) => void;
  donationCampaigns: DonationCampaign[];
  addDonationCampaign: (camp: Omit<DonationCampaign, 'id' | 'createdAt' | 'currentAmount' | 'donorsCount'>) => void;
  updateDonationCampaign: (id: string, updates: Partial<DonationCampaign>) => void;
  deleteDonationCampaign: (id: string) => void;
  donationRecords: DonationRecord[];
  recordDonation: (donation: Omit<DonationRecord, 'id' | 'createdAt' | 'paymentStatus' | 'transactionRef'>) => DonationRecord;

  // Memories & Nostalgia
  memories: AlumniMemory[];
  addMemory: (memory: Omit<AlumniMemory, 'id' | 'createdAt' | 'likesCount' | 'isApproved'>) => void;
  approveMemory: (id: string) => void;
  rejectMemory: (id: string) => void;
  deleteMemory: (id: string) => void;
  likeMemory: (memoryId: string) => void;

  // Achievements & Hall of Fame
  achievements: Achievement[];
  addAchievement: (ach: Omit<Achievement, 'id' | 'createdAt'>) => void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => void;
  approveAchievement: (id: string) => void;
  rejectAchievement: (id: string) => void;
  deleteAchievement: (id: string) => void;

  // Events & RSVP
  events: AlumniEvent[];
  eventRsvps: EventRSVP[];
  addEvent: (event: Omit<AlumniEvent, 'id' | 'registeredCount'>) => void;
  updateEvent: (id: string, updates: Partial<AlumniEvent>) => void;
  deleteEvent: (id: string) => void;
  submitRSVP: (rsvp: Omit<EventRSVP, 'id' | 'createdAt'>) => { success: boolean; message: string };
  cancelRSVP: (rsvpId: string) => void;
  deleteEventRSVP: (id: string) => void;
  getUserRSVP: (eventId: string, userIdOrEmail: string) => EventRSVP | undefined;

  // Elections, Nominations & E-Ballot
  election: Election;
  nominations: ElectionNomination[];
  votes: ElectionVote[];
  auditLogs: ElectionAuditLog[];
  createOrUpdateElection: (electionData: Partial<Election>) => void;
  submitNomination: (nomination: Omit<ElectionNomination, 'id' | 'submittedAt' | 'status'>) => { success: boolean; message: string };
  approveNomination: (nominationId: string) => void;
  rejectNomination: (nominationId: string, reason?: string) => void;
  deleteNomination: (nominationId: string) => void;
  castVote: (electionId: string, positionId: string, candidateId: string) => { success: boolean; message: string };
  hasUserVotedForPosition: (positionId: string) => boolean;

  // Financial Transparency & Ledger
  financialReports: FinancialReport[];
  ledgerTransactions: FinancialTransaction[];
  addFinancialReport: (report: Omit<FinancialReport, 'id'>) => void;
  updateFinancialReport: (id: string, report: Partial<FinancialReport>) => void;
  deleteFinancialReport: (id: string) => void;
  addLedgerTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;
  updateLedgerTransaction: (id: string, tx: Partial<FinancialTransaction>) => void;
  deleteLedgerTransaction: (id: string) => void;

  // CSV Import & Export Suite
  exportToCSV: (moduleType: string, customRows?: any[]) => void;
  importFromCSV: (moduleType: string, csvContent: string) => CSVImportResult;
  getCSVTemplate: (moduleType: string) => string;

  // System & Reset
  resetToDefaultSeedData: () => void;

  // Navigation & UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlumniSubTab: string;
  setActiveAlumniSubTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isDonationModalOpen: boolean;
  setIsDonationModalOpen: (open: boolean) => void;
  selectedCampaignForDonation: DonationCampaign | null;
  setSelectedCampaignForDonation: (campaign: DonationCampaign | null) => void;
  lastGeneratedReceipt: DonationRecord | null;
  setLastGeneratedReceipt: (receipt: DonationRecord | null) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeAlumniSubTab, setActiveAlumniSubTab] = useState<string>('directory');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthErrorDetails | null>(null);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<DonationCampaign | null>(null);
  const [lastGeneratedReceipt, setLastGeneratedReceipt] = useState<DonationRecord | null>(null);

  // User & RBAC state
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [userRolesMap, setUserRolesMap] = useState<Record<string, UserRole>>({
    'prakashinfosys1234@gmail.com': 'super_admin',
    'sunita.ias@rajasthan.gov.in': 'alumni_manager',
    'vikram.shekhawat@google.com': 'election_officer',
    'rajesh.ca@audit.in': 'auditor'
  });

  const [user, setUser] = useState<UserAuth | null>(null);

  // State collections initialized from rich seeds
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(SEED_SCHOOL_SETTINGS);
  const [houses, setHouses] = useState<HouseInfo[]>(SEED_HOUSES as HouseInfo[]);
  const [toppers, setToppers] = useState<BoardTopper[]>(SEED_TOPPERS);
  const [vmcMembers, setVmcMembers] = useState<VMCLeader[]>(SEED_VMC_MEMBERS);

  const [notices, setNotices] = useState<SchoolNotice[]>(SEED_NOTICES);
  const [faculty, setFaculty] = useState<FacultyMember[]>(SEED_FACULTY);
  const [gallery, setGallery] = useState<GalleryItem[]>(SEED_GALLERY);
  const [admissionEnquiries, setAdmissionEnquiries] = useState<AdmissionEnquiry[]>(SEED_ADMISSION_ENQUIRIES);

  const [alumni, setAlumni] = useState<AlumniProfile[]>(SEED_ALUMNI);
  const [batches, setBatches] = useState<BatchInfo[]>(SEED_BATCHES);
  const [businesses, setBusinesses] = useState<BusinessListing[]>(SEED_BUSINESSES);
  const [jobs, setJobs] = useState<JobPosting[]>(SEED_JOBS);
  const [welfareCases, setWelfareCases] = useState<WelfareCase[]>(SEED_WELFARE_CASES);
  const [donationCampaigns, setDonationCampaigns] = useState<DonationCampaign[]>(SEED_DONATION_CAMPAIGNS);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [memories, setMemories] = useState<AlumniMemory[]>(SEED_MEMORIES);
  const [achievements, setAchievements] = useState<Achievement[]>(SEED_ACHIEVEMENTS);

  const [events, setEvents] = useState<AlumniEvent[]>(SEED_EVENTS);
  const [eventRsvps, setEventRsvps] = useState<EventRSVP[]>(SEED_EVENT_RSVPS);

  const [election, setElection] = useState<Election>(SEED_ELECTIONS);
  const [nominations, setNominations] = useState<ElectionNomination[]>(SEED_NOMINATIONS);
  const [votes, setVotes] = useState<ElectionVote[]>([]);
  const [auditLogs, setAuditLogs] = useState<ElectionAuditLog[]>(SEED_AUDIT_LOGS);

  const [financialReports, setFinancialReports] = useState<FinancialReport[]>(SEED_FINANCIAL_REPORTS);
  const [ledgerTransactions, setLedgerTransactions] = useState<FinancialTransaction[]>(SEED_TRANSACTIONS);

  // Sync user state with Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        const userEmail = (fbUser.email || '').toLowerCase().trim();
        const isSuperAdminEmail = userEmail === 'prakashinfosys1234@gmail.com';
        const mappedRole = userRolesMap[userEmail] || userRolesMap[fbUser.uid];
        const assignedRole: UserRole = isSuperAdminEmail ? 'super_admin' : (mappedRole || 'alumnus');
        const isAuthorizedAdmin = assignedRole === 'super_admin' || assignedRole === 'alumni_manager' || assignedRole === 'election_officer' || assignedRole === 'auditor' || assignedRole === 'principal';
        const existingProfile = alumni.find(a => a.email.toLowerCase() === userEmail);
        
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (existingProfile ? existingProfile.fullName : (isSuperAdminEmail ? 'Prakash (Super Admin)' : 'Alumnus')),
          photoURL: fbUser.photoURL || existingProfile?.avatar || null,
          isAdmin: isSuperAdminEmail || isAuthorizedAdmin,
          role: assignedRole,
          profile: existingProfile
        });
        setCurrentRole(assignedRole);
      } else {
        setUser(null);
        setCurrentRole('guest');
      }
    });

    return () => unsubscribe();
  }, [alumni, userRolesMap]);

  // Role Assignment
  const assignUserRole = (alumniIdOrEmail: string, role: UserRole) => {
    const key = alumniIdOrEmail.toLowerCase().trim();
    setUserRolesMap(prev => ({
      ...prev,
      [key]: role
    }));

    if (user && (user.uid === alumniIdOrEmail || user.email?.toLowerCase().trim() === key)) {
      const isSuperAdmin = key === 'prakashinfosys1234@gmail.com' || role === 'super_admin';
      const isAuthorizedAdmin = isSuperAdmin || role === 'alumni_manager' || role === 'election_officer' || role === 'auditor' || role === 'principal';
      setUser(prev => prev ? { ...prev, role, isAdmin: isAuthorizedAdmin } : null);
      setCurrentRole(role);
    }
  };

  // RBAC Permission Helper
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const isSuperAdmin = user.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com' || user.role === 'super_admin' || currentRole === 'super_admin';
    if (isSuperAdmin) return true;
    const activeRole = user.role || currentRole;
    const roleObj = SEED_ROLES_PERMISSIONS.find(r => r.role === activeRole || r.role === currentRole);
    return roleObj ? roleObj.permissions.includes(permission) : false;
  };

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const userEmail = (fbUser.email || '').toLowerCase().trim();
        const isSuperAdminEmail = userEmail === 'prakashinfosys1234@gmail.com';
        const mappedRole = userRolesMap[userEmail] || userRolesMap[fbUser.uid];
        const assignedRole: UserRole = isSuperAdminEmail ? 'super_admin' : (mappedRole || 'alumnus');
        const isAuthorizedAdmin = isSuperAdminEmail || assignedRole === 'super_admin' || assignedRole === 'alumni_manager' || assignedRole === 'election_officer' || assignedRole === 'auditor' || assignedRole === 'principal';
        const existingProfile = alumni.find(a => a.email.toLowerCase() === userEmail);

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (existingProfile ? existingProfile.fullName : (isSuperAdminEmail ? 'Prakash (Super Admin)' : 'Alumnus')),
          photoURL: fbUser.photoURL || existingProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
          isAdmin: isAuthorizedAdmin,
          role: assignedRole,
          profile: existingProfile
        });
        setCurrentRole(assignedRole);
        setIsAuthModalOpen(false);
      }
    } catch (e: any) {
      console.warn("Sign-in notice:", e);
      setAuthError(e);
      setIsAuthModalOpen(true);
    }
  };

  const loginDirectlyAsSuperAdmin = () => {
    const superAdminEmail = 'prakashinfosys1234@gmail.com';
    const existingProfile = alumni.find(a => a.email.toLowerCase() === superAdminEmail);

    setUser({
      uid: 'prakash-super-admin-uid',
      email: superAdminEmail,
      displayName: 'Prakash (Super Admin)',
      photoURL: existingProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      isAdmin: true,
      role: 'super_admin',
      profile: existingProfile || alumni[0]
    });
    setCurrentRole('super_admin');
    setAuthError(null);
    setIsAuthModalOpen(false);
  };

  const loginDirectlyAs = (emailOrId: string, roleOverride?: UserRole) => {
    const key = emailOrId.toLowerCase().trim();
    let alum = alumni.find(a => a.id === emailOrId || a.email.toLowerCase() === key);
    if (!alum) {
      alum = alumni[0];
    }

    const assignedRole: UserRole = roleOverride || (alum.email === 'prakashinfosys1234@gmail.com' ? 'super_admin' : (userRolesMap[alum.email.toLowerCase()] || 'alumnus'));
    const isSuperAdmin = alum.email === 'prakashinfosys1234@gmail.com' || assignedRole === 'super_admin';
    const isAuthorizedAdmin = isSuperAdmin || assignedRole === 'alumni_manager' || assignedRole === 'election_officer' || assignedRole === 'auditor' || assignedRole === 'principal';

    setUser({
      uid: alum.id,
      email: alum.email,
      displayName: alum.fullName,
      photoURL: alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      isAdmin: isAuthorizedAdmin,
      role: assignedRole,
      profile: alum
    });
    setCurrentRole(assignedRole);
    setAuthError(null);
    setIsAuthModalOpen(false);
  };

  const simulateLoginAs = (alumniId: string, customProfileData?: Partial<AlumniProfile>, roleOverride?: UserRole) => {
    let alum = alumni.find(a => a.id === alumniId);
    
    if (!alum && customProfileData) {
      const newProfile: AlumniProfile = {
        id: alumniId,
        fullName: customProfileData.fullName || 'Navodaya Alumnus',
        email: customProfileData.email || 'alumni@jnv.in',
        batchYear: customProfileData.batchYear || 2012,
        city: customProfileData.city || 'Barmer',
        state: customProfileData.state || 'Rajasthan',
        country: 'India',
        profession: customProfileData.profession || 'Professional',
        company: customProfileData.company || 'Enterprise',
        designation: customProfileData.designation || 'Lead',
        industry: customProfileData.industry || 'Technology & Services',
        bio: customProfileData.bio || 'Proud Navodayan of JNV Pachpadra',
        avatar: customProfileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        isMentorAvailable: true,
        isBusinessOwner: false,
        isLookingForJobs: false,
        isHiring: false,
        verificationStatus: 'verified',
        createdAt: new Date().toISOString()
      };
      setAlumni(prev => [newProfile, ...prev]);
      alum = newProfile;
    } else if (!alum) {
      alum = alumni[0];
    }

    const assignedRole = roleOverride || (alum.email === 'prakashinfosys1234@gmail.com' ? 'super_admin' : 'alumnus');

    setUser({
      uid: alum.id,
      email: alum.email,
      displayName: alum.fullName,
      photoURL: alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      isAdmin: assignedRole === 'super_admin',
      role: assignedRole,
      profile: alum
    });
    setCurrentRole(assignedRole);
    setAuthError(null);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout note", e);
    }
    setUser(null);
    setCurrentRole('guest');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // School Settings & CMS
  const updateSchoolSettings = (updates: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => ({ ...prev, ...updates }));
  };

  const updateHouse = (id: string, updates: Partial<HouseInfo>) => {
    setHouses(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
  };

  const addTopper = (topper: Omit<BoardTopper, 'id'>) => {
    const newTop: BoardTopper = {
      ...topper,
      id: `top-${Date.now()}`
    };
    setToppers(prev => [newTop, ...prev]);
  };

  const updateTopper = (id: string, updates: Partial<BoardTopper>) => {
    setToppers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTopper = (id: string) => {
    setToppers(prev => prev.filter(t => t.id !== id));
  };

  const addVMCMember = (member: Omit<VMCLeader, 'id'>) => {
    const newMem: VMCLeader = {
      ...member,
      id: `vmc-${Date.now()}`
    };
    setVmcMembers(prev => [...prev, newMem]);
  };

  const updateVMCMember = (id: string, updates: Partial<VMCLeader>) => {
    setVmcMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteVMCMember = (id: string) => {
    setVmcMembers(prev => prev.filter(m => m.id !== id));
  };

  // School Notices Operations
  const addNotice = (notice: Omit<SchoolNotice, 'id'>) => {
    const newNotice: SchoolNotice = {
      ...notice,
      id: `not-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const updateNotice = (id: string, updates: Partial<SchoolNotice>) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // Faculty & Staff
  const addFaculty = (fac: Omit<FacultyMember, 'id'>) => {
    const newFac: FacultyMember = {
      ...fac,
      id: `fac-${Date.now()}`
    };
    setFaculty(prev => [...prev, newFac]);
  };

  const updateFaculty = (id: string, updates: Partial<FacultyMember>) => {
    setFaculty(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  // Admission Enquiries
  const submitAdmissionEnquiry = (enquiry: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: AdmissionEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setAdmissionEnquiries(prev => [newEnq, ...prev]);
  };

  const updateEnquiryStatus = (id: string, status: AdmissionEnquiry['status']) => {
    setAdmissionEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
  };

  const deleteAdmissionEnquiry = (id: string) => {
    setAdmissionEnquiries(prev => prev.filter(e => e.id !== id));
  };

  // Alumni Directory & Moderation
  const approveAlumni = (id: string) => {
    setAlumni(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              verificationStatus: 'verified',
              verifiedAt: new Date().toISOString(),
              verifiedBy: user?.displayName || 'Administrator'
            }
          : a
      )
    );
  };

  const rejectAlumni = (id: string) => {
    setAlumni(prev =>
      prev.map(a => (a.id === id ? { ...a, verificationStatus: 'rejected' } : a))
    );
  };

  const deactivateAlumni = (id: string) => {
    setAlumni(prev =>
      prev.map(a => (a.id === id ? { ...a, verificationStatus: 'deactivated' } : a))
    );
  };

  const addAlumnusDirectly = (profileData: Omit<AlumniProfile, 'id' | 'createdAt'>) => {
    const newProfile: AlumniProfile = {
      ...profileData,
      id: `alum-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAlumni(prev => [newProfile, ...prev]);
  };

  const updateAlumniProfile = (id: string, updates: Partial<AlumniProfile>) => {
    setAlumni(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAlumni = (id: string) => {
    setAlumni(prev => prev.filter(a => a.id !== id));
  };

  const registerAlumni = (profileData: Omit<AlumniProfile, 'id' | 'createdAt' | 'verificationStatus'>) => {
    const newProfile: AlumniProfile = {
      ...profileData,
      id: `alum-${Date.now()}`,
      verificationStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    setAlumni(prev => [newProfile, ...prev]);
  };

  const updateBatchInfo = (passoutYear: number, updates: Partial<BatchInfo>) => {
    setBatches(prev => prev.map(b => (b.passoutYear === passoutYear ? { ...b, ...updates } : b)));
  };

  // Business Directory
  const addBusiness = (bizData: Omit<BusinessListing, 'id' | 'createdAt' | 'isVerified'>) => {
    const newBiz: BusinessListing = {
      ...bizData,
      id: `biz-${Date.now()}`,
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    setBusinesses(prev => [newBiz, ...prev]);
  };

  const updateBusiness = (id: string, updates: Partial<BusinessListing>) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const approveBusiness = (id: string) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, isVerified: true } : b)));
  };

  const rejectBusiness = (id: string) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, isVerified: false } : b)));
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  // Job Board
  const addJob = (jobData: Omit<JobPosting, 'id' | 'createdAt' | 'isActive'>) => {
    const newJob: JobPosting = {
      ...jobData,
      id: `job-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, updates: Partial<JobPosting>) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, ...updates } : j)));
  };

  const approveJob = (id: string) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, isActive: true } : j)));
  };

  const rejectJob = (id: string) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, isActive: false } : j)));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  // Welfare & Campaigns
  const addWelfareCase = (welfare: Omit<WelfareCase, 'id' | 'createdAt'>) => {
    const newCase: WelfareCase = {
      ...welfare,
      id: `wel-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setWelfareCases(prev => [newCase, ...prev]);
  };

  const updateWelfareCase = (id: string, updates: Partial<WelfareCase>) => {
    setWelfareCases(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWelfareCase = (id: string) => {
    setWelfareCases(prev => prev.filter(w => w.id !== id));
  };

  const addDonationCampaign = (camp: Omit<DonationCampaign, 'id' | 'createdAt' | 'currentAmount' | 'donorsCount'>) => {
    const newCamp: DonationCampaign = {
      ...camp,
      id: `camp-${Date.now()}`,
      currentAmount: 0,
      donorsCount: 0,
      createdAt: new Date().toISOString()
    };
    setDonationCampaigns(prev => [newCamp, ...prev]);
  };

  const updateDonationCampaign = (id: string, updates: Partial<DonationCampaign>) => {
    setDonationCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteDonationCampaign = (id: string) => {
    setDonationCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // Memories & Nostalgia
  const addMemory = (memData: Omit<AlumniMemory, 'id' | 'createdAt' | 'likesCount' | 'isApproved'>) => {
    const newMem: AlumniMemory = {
      ...memData,
      id: `mem-${Date.now()}`,
      likesCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString()
    };
    setMemories(prev => [newMem, ...prev]);
  };

  const approveMemory = (id: string) => {
    setMemories(prev => prev.map(m => (m.id === id ? { ...m, isApproved: true } : m)));
  };

  const rejectMemory = (id: string) => {
    setMemories(prev => prev.map(m => (m.id === id ? { ...m, isApproved: false } : m)));
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const likeMemory = (memoryId: string) => {
    setMemories(prev =>
      prev.map(m => {
        if (m.id === memoryId) {
          const isLiked = m.liked;
          return {
            ...m,
            liked: !isLiked,
            likesCount: isLiked ? m.likesCount - 1 : m.likesCount + 1
          };
        }
        return m;
      })
    );
  };

  // Achievements & Hall of Fame
  const addAchievement = (ach: Omit<Achievement, 'id' | 'createdAt'>) => {
    const newAch: Achievement = {
      ...ach,
      id: `ach-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAchievements(prev => [newAch, ...prev]);
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const approveAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => (a.id === id ? { ...a, isApproved: true } : a)));
  };

  const rejectAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => (a.id === id ? { ...a, isApproved: false } : a)));
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  // Events & RSVP System
  const addEvent = (eventData: Omit<AlumniEvent, 'id' | 'registeredCount'>) => {
    const newEvt: AlumniEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      status: 'Upcoming'
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<AlumniEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const submitRSVP = (rsvpData: Omit<EventRSVP, 'id' | 'createdAt'>): { success: boolean; message: string } => {
    if (!user) {
      return { success: false, message: 'Please sign in to submit your RSVP.' };
    }

    const existingIndex = eventRsvps.findIndex(
      r => r.eventId === rsvpData.eventId && (r.userId === rsvpData.userId || r.userEmail === rsvpData.userEmail)
    );

    if (existingIndex >= 0) {
      const updated = [...eventRsvps];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: rsvpData.status,
        guestCount: rsvpData.guestCount,
        phone: rsvpData.phone,
        notes: rsvpData.notes
      };
      setEventRsvps(updated);
      return { success: true, message: `Your RSVP has been updated to "${rsvpData.status}".` };
    }

    const newRsvp: EventRSVP = {
      ...rsvpData,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEventRsvps(prev => [newRsvp, ...prev]);

    if (rsvpData.status === 'Going') {
      setEvents(prev =>
        prev.map(e => (e.id === rsvpData.eventId ? { ...e, registeredCount: (e.registeredCount || 0) + 1 } : e))
      );
    }

    return { success: true, message: 'RSVP confirmed successfully!' };
  };

  const cancelRSVP = (rsvpId: string) => {
    const target = eventRsvps.find(r => r.id === rsvpId);
    if (target && target.status === 'Going') {
      setEvents(prev =>
        prev.map(e => (e.id === target.eventId ? { ...e, registeredCount: Math.max(0, (e.registeredCount || 1) - 1) } : e))
      );
    }
    setEventRsvps(prev => prev.filter(r => r.id !== rsvpId));
  };

  const deleteEventRSVP = (id: string) => {
    setEventRsvps(prev => prev.filter(r => r.id !== id));
  };

  const getUserRSVP = (eventId: string, userIdOrEmail: string): EventRSVP | undefined => {
    return eventRsvps.find(
      r => r.eventId === eventId && (r.userId === userIdOrEmail || r.userEmail.toLowerCase() === userIdOrEmail.toLowerCase())
    );
  };

  // Elections, Nominations & E-Ballot
  const createOrUpdateElection = (electionData: Partial<Election>) => {
    setElection(prev => ({
      ...prev,
      ...electionData
    }));

    const newLog: ElectionAuditLog = {
      id: `aud-${Date.now()}`,
      electionId: election.id,
      action: 'ELECTION_EDITED',
      actorName: user?.displayName || 'Administrator',
      actorEmail: user?.email || 'admin@jnv.in',
      details: `Election parameters updated by ${user?.displayName || 'Admin'}.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const submitNomination = (nomData: Omit<ElectionNomination, 'id' | 'submittedAt' | 'status'>): { success: boolean; message: string } => {
    if (!user) {
      return { success: false, message: 'Please sign in with a verified alumni account to submit a nomination.' };
    }

    const duplicate = nominations.find(
      n => n.electionId === nomData.electionId && n.positionId === nomData.positionId && n.candidateEmail.toLowerCase() === nomData.candidateEmail.toLowerCase()
    );

    if (duplicate) {
      return { success: false, message: 'You have already submitted a nomination for this position.' };
    }

    const newNom: ElectionNomination = {
      ...nomData,
      id: `nom-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };

    setNominations(prev => [newNom, ...prev]);

    const audit: ElectionAuditLog = {
      id: `aud-${Date.now()}`,
      electionId: nomData.electionId,
      action: 'NOMINATION_SUBMITTED',
      actorName: nomData.candidateName,
      actorEmail: nomData.candidateEmail,
      details: `Nomination submitted for position ${nomData.positionTitle} by Batch ${nomData.batch} alumnus.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, message: 'Your self-nomination has been submitted for Election Officer review.' };
  };

  const approveNomination = (nominationId: string) => {
    const nom = nominations.find(n => n.id === nominationId);
    if (!nom) return;

    setNominations(prev =>
      prev.map(n =>
        n.id === nominationId
          ? {
              ...n,
              status: 'APPROVED',
              reviewedBy: user?.displayName || 'Election Officer',
              reviewedAt: new Date().toISOString()
            }
          : n
      )
    );

    setElection(prev => {
      const updatedPositions = prev.positions.map(pos => {
        if (pos.id === nom.positionId) {
          const alreadyExists = pos.candidates.some(c => c.id === nom.candidateId || c.name === nom.candidateName);
          if (alreadyExists) return pos;

          return {
            ...pos,
            candidates: [
              ...pos.candidates,
              {
                id: nom.candidateId || `cand-${Date.now()}`,
                name: nom.candidateName,
                batch: nom.batch,
                profession: nom.profession,
                city: nom.city,
                manifesto: nom.manifesto,
                avatar: nom.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
                votes: 0,
                status: 'APPROVED'
              }
            ]
          };
        }
        return pos;
      });

      return {
        ...prev,
        positions: updatedPositions
      };
    });

    const audit: ElectionAuditLog = {
      id: `aud-${Date.now()}`,
      electionId: nom.electionId,
      action: 'NOMINATION_APPROVED',
      actorName: user?.displayName || 'Election Officer',
      actorEmail: user?.email || 'officer@jnv.in',
      details: `Nomination approved for ${nom.candidateName} on position ${nom.positionTitle}.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const rejectNomination = (nominationId: string, reason?: string) => {
    const nom = nominations.find(n => n.id === nominationId);
    if (!nom) return;

    setNominations(prev =>
      prev.map(n =>
        n.id === nominationId
          ? {
              ...n,
              status: 'REJECTED',
              adminNote: reason || 'Does not meet the eligibility criterion.',
              reviewedBy: user?.displayName || 'Election Officer',
              reviewedAt: new Date().toISOString()
            }
          : n
      )
    );

    const audit: ElectionAuditLog = {
      id: `aud-${Date.now()}`,
      electionId: nom.electionId,
      action: 'NOMINATION_REJECTED',
      actorName: user?.displayName || 'Election Officer',
      actorEmail: user?.email || 'officer@jnv.in',
      details: `Nomination rejected for ${nom.candidateName}. Reason: ${reason || 'Incomplete criteria'}.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const deleteNomination = (nominationId: string) => {
    setNominations(prev => prev.filter(n => n.id !== nominationId));
  };

  const hasUserVotedForPosition = (positionId: string): boolean => {
    if (!user) return false;
    return votes.some(v => v.positionId === positionId && (v.voterUid === user.uid || v.voterEmail.toLowerCase() === user.email?.toLowerCase()));
  };

  const castVote = (electionId: string, positionId: string, candidateId: string): { success: boolean; message: string } => {
    if (!user) {
      return { success: false, message: 'You must be signed in to vote.' };
    }

    if (election.status !== 'ACTIVE') {
      return { success: false, message: 'This election is currently not active.' };
    }

    if (hasUserVotedForPosition(positionId)) {
      return { success: false, message: 'Duplicate Vote Blocked: You have already cast your e-ballot for this position.' };
    }

    const newVote: ElectionVote = {
      id: `vote-${Date.now()}`,
      electionId,
      positionId,
      candidateId,
      voterUid: user.uid,
      voterEmail: user.email || 'alumni@jnv.in',
      voterBatch: user.profile?.batchYear || 2012,
      timestamp: new Date().toISOString()
    };

    setVotes(prev => [...prev, newVote]);

    setElection(prev => {
      const updatedPositions = prev.positions.map(pos => {
        if (pos.id === positionId) {
          const updatedCandidates = pos.candidates.map(cand => {
            if (cand.id === candidateId) {
              return { ...cand, votes: cand.votes + 1 };
            }
            return cand;
          });
          return { ...pos, candidates: updatedCandidates };
        }
        return pos;
      });

      return {
        ...prev,
        totalVotesCast: prev.totalVotesCast + 1,
        positions: updatedPositions
      };
    });

    const audit: ElectionAuditLog = {
      id: `aud-${Date.now()}`,
      electionId,
      action: 'VOTE_CAST',
      actorName: 'Verified Voter (Confidential)',
      actorEmail: `Batch ${user.profile?.batchYear || 2012} Alumnus`,
      details: `E-ballot securely cast for position ID ${positionId}. Timestamp certified.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, message: 'Your vote has been securely recorded on the electronic ballot!' };
  };

  // Financial Transparency & Ledger
  const addFinancialReport = (rep: Omit<FinancialReport, 'id'>) => {
    const newRep: FinancialReport = {
      ...rep,
      id: `rep-${Date.now()}`
    };
    setFinancialReports(prev => [newRep, ...prev]);
  };

  const updateFinancialReport = (id: string, updates: Partial<FinancialReport>) => {
    setFinancialReports(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteFinancialReport = (id: string) => {
    setFinancialReports(prev => prev.filter(r => r.id !== id));
  };

  const addLedgerTransaction = (tx: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setLedgerTransactions(prev => [newTx, ...prev]);
  };

  const updateLedgerTransaction = (id: string, updates: Partial<FinancialTransaction>) => {
    setLedgerTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteLedgerTransaction = (id: string) => {
    setLedgerTransactions(prev => prev.filter(t => t.id !== id));
  };

  const recordDonation = (donationData: Omit<DonationRecord, 'id' | 'createdAt' | 'paymentStatus' | 'transactionRef'>): DonationRecord => {
    const newRecord: DonationRecord = {
      ...donationData,
      id: `don-${Date.now()}`,
      paymentStatus: 'SUCCESS',
      transactionRef: `JNV-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    setDonationRecords(prev => [newRecord, ...prev]);

    setDonationCampaigns(prev =>
      prev.map(c =>
        c.id === donationData.campaignId
          ? {
              ...c,
              currentAmount: c.currentAmount + donationData.amount,
              donorsCount: c.donorsCount + 1
            }
          : c
      )
    );

    const ledgerEntry: FinancialTransaction = {
      id: `tx-don-${Date.now()}`,
      transactionId: newRecord.transactionRef,
      type: 'CREDIT',
      category: 'Donations',
      amount: donationData.amount,
      description: `Donation towards ${donationData.campaignTitle}`,
      date: new Date().toISOString().split('T')[0],
      visibility: 'public',
      auditedBy: 'CA Devendra Saini',
      payeeOrDonor: donationData.isAnonymous ? 'Anonymous Well-Wisher' : donationData.donorName
    };
    setLedgerTransactions(prev => [ledgerEntry, ...prev]);

    setLastGeneratedReceipt(newRecord);
    return newRecord;
  };

  // Reset to default seed data
  const resetToDefaultSeedData = () => {
    setSchoolSettings(SEED_SCHOOL_SETTINGS);
    setHouses(SEED_HOUSES as HouseInfo[]);
    setToppers(SEED_TOPPERS);
    setVmcMembers(SEED_VMC_MEMBERS);
    setNotices(SEED_NOTICES);
    setFaculty(SEED_FACULTY);
    setGallery(SEED_GALLERY);
    setAdmissionEnquiries(SEED_ADMISSION_ENQUIRIES);
    setAlumni(SEED_ALUMNI);
    setBatches(SEED_BATCHES);
    setBusinesses(SEED_BUSINESSES);
    setJobs(SEED_JOBS);
    setWelfareCases(SEED_WELFARE_CASES);
    setDonationCampaigns(SEED_DONATION_CAMPAIGNS);
    setDonationRecords([]);
    setMemories(SEED_MEMORIES);
    setAchievements(SEED_ACHIEVEMENTS);
    setEvents(SEED_EVENTS);
    setEventRsvps(SEED_EVENT_RSVPS);
    setElection(SEED_ELECTIONS);
    setNominations(SEED_NOMINATIONS);
    setVotes([]);
    setAuditLogs(SEED_AUDIT_LOGS);
    setFinancialReports(SEED_FINANCIAL_REPORTS);
    setLedgerTransactions(SEED_TRANSACTIONS);
  };

  // CSV Import & Export Suite
  const getCSVTemplate = (moduleType: string): string => {
    switch (moduleType) {
      case 'alumni':
        return `fullName,batchYear,email,phone,house,city,state,country,profession,company,designation,industry,bloodGroup,bio\n"Ravi Sharma",2012,"ravi.sharma@example.com","+91 9876543210","Aravali","Jaipur","Rajasthan","India","Software Engineer","Infosys","Senior Dev","IT","B+","Alumnus bio"`;
      case 'events':
        return `title,category,date,time,location,isOnline,isAlumniEvent,maxCapacity,description\n"Regional Alumni Gathering","Chapter Meet","2026-11-20","06:00 PM IST","Barmer Club",false,true,100,"Annual meetup description"`;
      case 'financial_reports':
        return `title,financialYear,category,reportSummary,visibility,auditorName,amountAudited\n"Annual Balance Sheet 2025","2024-2025","Balance Sheet","Comprehensive statutory audit statement","public","CA Saini",5000000`;
      case 'ledger':
        return `transactionId,type,category,amount,description,date,visibility,auditedBy,payeeOrDonor\n"TXN-2026-0901","CREDIT","Donations",50000,"Smart Lab Contribution","2026-08-14","public","CA Saini","Batch 2012"`;
      case 'notices':
        return `title,category,publishDate,targetAudience,content,isPinned,referenceNo\n"Holiday Notice","General","2026-08-15","All","School holiday notice content",false,"JNV/PACH/2026/99"`;
      case 'faculty':
        return `name,designation,department,qualification,experienceYears,email\n"Dr. K.L. Sharma","PGT Physics","Physics","M.Sc., Ph.D.",15,"kl.physics@jnv.in"`;
      default:
        return 'id,title,description';
    }
  };

  const exportToCSV = (moduleType: string, customRows?: any[]) => {
    let rows: any[] = [];
    let filename = `${moduleType}_export_${new Date().toISOString().split('T')[0]}.csv`;

    if (customRows && customRows.length > 0) {
      rows = customRows;
    } else {
      switch (moduleType) {
        case 'alumni':
          rows = alumni;
          break;
        case 'events':
          rows = events;
          break;
        case 'rsvps':
          rows = eventRsvps;
          break;
        case 'financial_reports':
          rows = financialReports;
          break;
        case 'ledger':
          rows = ledgerTransactions;
          break;
        case 'notices':
          rows = notices;
          break;
        case 'faculty':
          rows = faculty;
          break;
        case 'elections':
          rows = election.positions.flatMap(p => p.candidates.map(c => ({ position: p.title, candidateName: c.name, batch: c.batch, votes: c.votes })));
          break;
        case 'inquiries':
          rows = admissionEnquiries;
          break;
        default:
          rows = [];
      }
    }

    if (rows.length === 0) {
      alert(`No records found to export for ${moduleType}.`);
      return;
    }

    const headers = Object.keys(rows[0]).filter(k => typeof rows[0][k] !== 'object');
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        headers
          .map(header => {
            const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSVLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const importFromCSV = (moduleType: string, csvContent: string): CSVImportResult => {
    const lines = csvContent.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      return { success: false, importedCount: 0, duplicateCount: 0, errors: ['CSV file is empty or missing data rows.'], message: 'File has no content.' };
    }

    const headers = parseCSVLine(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());
    const dataLines = lines.slice(1);
    let imported = 0;
    let duplicates = 0;
    const errors: string[] = [];

    dataLines.forEach((line, idx) => {
      const rowIdx = idx + 2;
      const values = parseCSVLine(line);
      const rowObj: any = {};
      headers.forEach((h, i) => {
        rowObj[h] = values[i] !== undefined ? values[i] : '';
      });

      try {
        if (moduleType === 'alumni') {
          if (!rowObj.fullName || !rowObj.email) {
            errors.push(`Row ${rowIdx}: Missing required fullName or email.`);
            return;
          }
          const exists = alumni.some(a => a.email.toLowerCase() === rowObj.email.toLowerCase());
          if (exists) {
            duplicates++;
            return;
          }
          const newAlum: AlumniProfile = {
            id: `alum-imp-${Date.now()}-${idx}`,
            fullName: rowObj.fullName,
            email: rowObj.email,
            batchYear: Number(rowObj.batchYear) || 2015,
            phone: rowObj.phone || '',
            house: (rowObj.house as any) || 'Aravali',
            city: rowObj.city || 'Barmer',
            state: rowObj.state || 'Rajasthan',
            country: rowObj.country || 'India',
            profession: rowObj.profession || 'Professional',
            company: rowObj.company || '',
            designation: rowObj.designation || '',
            industry: rowObj.industry || 'Services',
            bloodGroup: rowObj.bloodGroup || '',
            bio: rowObj.bio || 'Imported alumnus profile',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
            isMentorAvailable: true,
            isBusinessOwner: false,
            isLookingForJobs: false,
            isHiring: false,
            verificationStatus: 'verified',
            createdAt: new Date().toISOString()
          };
          setAlumni(prev => [newAlum, ...prev]);
          imported++;
        } else if (moduleType === 'events') {
          if (!rowObj.title || !rowObj.date) {
            errors.push(`Row ${rowIdx}: Missing required event title or date.`);
            return;
          }
          const newEvt: AlumniEvent = {
            id: `evt-imp-${Date.now()}-${idx}`,
            title: rowObj.title,
            category: (rowObj.category as any) || 'Reunion',
            date: rowObj.date,
            time: rowObj.time || '10:00 AM',
            location: rowObj.location || 'JNV Campus',
            isOnline: rowObj.isOnline === 'true' || rowObj.isOnline === true,
            isAlumniEvent: rowObj.isAlumniEvent !== 'false',
            maxCapacity: Number(rowObj.maxCapacity) || 200,
            description: rowObj.description || '',
            registeredCount: 0,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=350&fit=crop',
            status: 'Upcoming'
          };
          setEvents(prev => [newEvt, ...prev]);
          imported++;
        } else if (moduleType === 'ledger') {
          if (!rowObj.amount || !rowObj.description) {
            errors.push(`Row ${rowIdx}: Missing required ledger amount or description.`);
            return;
          }
          const newTx: FinancialTransaction = {
            id: `tx-imp-${Date.now()}-${idx}`,
            transactionId: rowObj.transactionId || `TXN-IMP-${Date.now()}-${idx}`,
            type: rowObj.type === 'DEBIT' ? 'DEBIT' : 'CREDIT',
            category: (rowObj.category as any) || 'Donations',
            amount: Number(rowObj.amount) || 0,
            description: rowObj.description,
            date: rowObj.date || new Date().toISOString().split('T')[0],
            visibility: (rowObj.visibility as any) || 'public',
            auditedBy: rowObj.auditedBy || 'Auditor',
            payeeOrDonor: rowObj.payeeOrDonor || ''
          };
          setLedgerTransactions(prev => [newTx, ...prev]);
          imported++;
        } else if (moduleType === 'financial_reports') {
          if (!rowObj.title || !rowObj.financialYear) {
            errors.push(`Row ${rowIdx}: Missing report title or financial year.`);
            return;
          }
          const newRep: FinancialReport = {
            id: `rep-imp-${Date.now()}-${idx}`,
            title: rowObj.title,
            financialYear: rowObj.financialYear,
            category: (rowObj.category as any) || 'Annual Audit Report',
            reportSummary: rowObj.reportSummary || '',
            visibility: (rowObj.visibility as any) || 'public',
            publishedDate: new Date().toISOString().split('T')[0],
            auditorName: rowObj.auditorName || 'Chartered Accountant',
            amountAudited: Number(rowObj.amountAudited) || 0,
            status: 'Published'
          };
          setFinancialReports(prev => [newRep, ...prev]);
          imported++;
        } else if (moduleType === 'notices') {
          if (!rowObj.title || !rowObj.content) {
            errors.push(`Row ${rowIdx}: Missing notice title or content.`);
            return;
          }
          const newNot: SchoolNotice = {
            id: `not-imp-${Date.now()}-${idx}`,
            title: rowObj.title,
            category: (rowObj.category as any) || 'General',
            publishDate: rowObj.publishDate || new Date().toISOString().split('T')[0],
            targetAudience: (rowObj.targetAudience as any) || 'All',
            content: rowObj.content,
            isPinned: rowObj.isPinned === 'true',
            referenceNo: rowObj.referenceNo || '',
            status: 'Published'
          };
          setNotices(prev => [newNot, ...prev]);
          imported++;
        } else if (moduleType === 'faculty') {
          if (!rowObj.name || !rowObj.department) {
            errors.push(`Row ${rowIdx}: Missing faculty name or department.`);
            return;
          }
          const newFac: FacultyMember = {
            id: `fac-imp-${Date.now()}-${idx}`,
            name: rowObj.name,
            designation: rowObj.designation || 'Teacher',
            department: (rowObj.department as any) || 'Physics',
            qualification: rowObj.qualification || 'M.Sc., B.Ed.',
            experienceYears: Number(rowObj.experienceYears) || 5,
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
            email: rowObj.email || ''
          };
          setFaculty(prev => [...prev, newFac]);
          imported++;
        }
      } catch (err: any) {
        errors.push(`Row ${rowIdx}: Parse error - ${err.message}`);
      }
    });

    return {
      success: imported > 0,
      importedCount: imported,
      duplicateCount: duplicates,
      errors,
      message: `Imported ${imported} records successfully. ${duplicates} duplicates skipped. ${errors.length} errors.`
    };
  };

  return (
    <DataContext.Provider
      value={{
        user,
        currentRole,
        setCurrentRole,
        assignUserRole,
        hasPermission,
        loginWithGoogle,
        loginDirectlyAsSuperAdmin,
        loginDirectlyAs,
        simulateLoginAs,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        setAuthError,

        schoolSettings,
        updateSchoolSettings,
        houses,
        updateHouse,
        toppers,
        addTopper,
        updateTopper,
        deleteTopper,
        vmcMembers,
        addVMCMember,
        updateVMCMember,
        deleteVMCMember,

        notices,
        addNotice,
        updateNotice,
        deleteNotice,

        faculty,
        addFaculty,
        updateFaculty,
        deleteFaculty,

        gallery,
        addGalleryItem,
        deleteGalleryItem,

        admissionEnquiries,
        submitAdmissionEnquiry,
        updateEnquiryStatus,
        deleteAdmissionEnquiry,

        alumni,
        batches,
        updateBatchInfo,
        approveAlumni,
        rejectAlumni,
        deactivateAlumni,
        addAlumnusDirectly,
        updateAlumniProfile,
        deleteAlumni,
        registerAlumni,

        businesses,
        addBusiness,
        updateBusiness,
        approveBusiness,
        rejectBusiness,
        deleteBusiness,

        jobs,
        addJob,
        updateJob,
        approveJob,
        rejectJob,
        deleteJob,

        welfareCases,
        addWelfareCase,
        updateWelfareCase,
        deleteWelfareCase,

        donationCampaigns,
        addDonationCampaign,
        updateDonationCampaign,
        deleteDonationCampaign,
        donationRecords,
        recordDonation,

        memories,
        addMemory,
        approveMemory,
        rejectMemory,
        deleteMemory,
        likeMemory,

        achievements,
        addAchievement,
        updateAchievement,
        approveAchievement,
        rejectAchievement,
        deleteAchievement,

        events,
        eventRsvps,
        addEvent,
        updateEvent,
        deleteEvent,
        submitRSVP,
        cancelRSVP,
        deleteEventRSVP,
        getUserRSVP,

        election,
        nominations,
        votes,
        auditLogs,
        createOrUpdateElection,
        submitNomination,
        approveNomination,
        rejectNomination,
        deleteNomination,
        castVote,
        hasUserVotedForPosition,

        financialReports,
        ledgerTransactions,
        addFinancialReport,
        updateFinancialReport,
        deleteFinancialReport,
        addLedgerTransaction,
        updateLedgerTransaction,
        deleteLedgerTransaction,

        exportToCSV,
        importFromCSV,
        getCSVTemplate,

        resetToDefaultSeedData,

        activeTab,
        setActiveTab,
        activeAlumniSubTab,
        setActiveAlumniSubTab,
        searchQuery,
        setSearchQuery,
        isAboutModalOpen,
        setIsAboutModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isDonationModalOpen,
        setIsDonationModalOpen,
        selectedCampaignForDonation,
        setSelectedCampaignForDonation,
        lastGeneratedReceipt,
        setLastGeneratedReceipt,
        isAdminPanelOpen,
        setIsAdminPanelOpen
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
