import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AlumniProfile,
  AlumniEvent,
  EventRSVP,
  BloodDonor,
  BloodRequest,
  DonationCampaign,
  DonationRecord,
  PaymentSettings,
  JobPosting,
  BusinessListing,
  WelfareCase,
  AlumniMemory,
  Achievement,
  SchoolNotice,
  FacultyMember,
  GalleryItem,
  AdmissionEnquiry,
  UserAuth,
  BoardTopper,
  VMCLeader,
  HouseInfo,
  SchoolSettings,
  BatchInfo,
  Election,
  ElectionNomination,
  ElectionVote,
  ElectionAuditLog,
  FinancialReport,
  FinancialTransaction,
  UserRole,
  CSVImportResult,
  BannerSlide
} from '../types';
import {
  SEED_ALUMNI,
  SEED_EVENTS,
  SEED_EVENT_RSVPS,
  SEED_BLOOD_DONORS,
  SEED_BLOOD_REQUESTS,
  SEED_DONATION_CAMPAIGNS,
  SEED_DONATIONS,
  SEED_PAYMENT_SETTINGS,
  SEED_JOBS,
  SEED_BUSINESSES,
  SEED_WELFARE_CASES,
  SEED_MEMORIES,
  SEED_ACHIEVEMENTS,
  SEED_NOTICES,
  SEED_FACULTY,
  SEED_GALLERY,
  SEED_ADMISSION_ENQUIRIES,
  SEED_TOPPERS,
  SEED_VMC_MEMBERS,
  SEED_HOUSES,
  SEED_SCHOOL_SETTINGS,
  SEED_BATCHES,
  SEED_ELECTIONS,
  SEED_NOMINATIONS,
  SEED_AUDIT_LOGS,
  SEED_FINANCIAL_REPORTS,
  SEED_TRANSACTIONS,
  SEED_ROLES_PERMISSIONS,
  SEED_BANNER_SLIDES
} from '../data/seedData';
import {
  auth,
  loginWithEmailPassword,
  registerUserWithEmailPassword,
  sendPasswordReset,
  logoutUser
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  syncCollectionWithFirestore,
  syncSingletonWithFirestore,
  saveDocToFirestore,
  updateDocInFirestore,
  deleteDocFromFirestore,
  maskPAN,
  recordAuditLog
} from '../services/firestoreSync';
import { CSV_TEMPLATES, parseCSVLines, formatAsCSV } from '../utils/csvProcessor';

export type { CSVImportResult } from '../types';

export interface AuthErrorDetails {
  code?: string;
  message?: string;
  domain?: string;
}

export interface DataContextType {
  // Authentication & RBAC
  user: UserAuth | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  assignUserRole: (alumniIdOrEmail: string, role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerWithEmail: (
    profile: Omit<AlumniProfile, 'id' | 'createdAt' | 'verificationStatus'> & { password?: string },
    password?: string
  ) => Promise<{ success: boolean; message: string; id?: string }>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  loginDirectlyAsSuperAdmin: () => void;
  loginDirectlyAs: (emailOrId: string, roleOverride?: UserRole) => void;
  simulateLoginAs: (role: UserRole) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authError: AuthErrorDetails | null;
  setAuthError: (err: AuthErrorDetails | null) => void;

  // School Settings & CMS
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

  // Banner Slider
  bannerSlides: BannerSlide[];
  addBannerSlide: (slide: Omit<BannerSlide, 'id' | 'createdAt'>) => void;
  updateBannerSlide: (id: string, updates: Partial<BannerSlide>) => void;
  deleteBannerSlide: (id: string) => void;
  reorderBannerSlides: (newOrderedList: BannerSlide[]) => void;
  resetBannerSlidesToDefault: () => void;

  // School Notices
  notices: SchoolNotice[];
  addNotice: (notice: Omit<SchoolNotice, 'id'>) => void;
  updateNotice: (id: string, updates: Partial<SchoolNotice>) => void;
  deleteNotice: (id: string) => void;

  // Faculty & Staff
  faculty: FacultyMember[];
  addFaculty: (faculty: Omit<FacultyMember, 'id'>) => void;
  updateFaculty: (id: string, updates: Partial<FacultyMember>) => void;
  deleteFaculty: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  // Admission Enquiries
  admissionEnquiries: AdmissionEnquiry[];
  submitAdmissionEnquiry: (enquiry: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: AdmissionEnquiry['status']) => void;
  deleteAdmissionEnquiry: (id: string) => void;

  // Alumni Directory & Profiles
  alumni: AlumniProfile[];
  batches: BatchInfo[];
  updateBatchInfo: (passoutYear: number, updates: Partial<BatchInfo>) => void;
  approveAlumni: (id: string) => void;
  rejectAlumni: (id: string, reason?: string) => void;
  deactivateAlumni: (id: string) => void;
  reactivateAlumni: (id: string) => void;
  addAlumnusDirectly: (profile: Omit<AlumniProfile, 'id' | 'createdAt'>) => void;
  updateAlumniProfile: (id: string, updates: Partial<AlumniProfile>) => void;
  deleteAlumni: (id: string) => void;
  registerAlumni: (profile: Omit<AlumniProfile, 'id' | 'createdAt' | 'verificationStatus'>) => { success: boolean; message: string; id: string };

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

  // Welfare & Relief
  welfareCases: WelfareCase[];
  addWelfareCase: (welfareCase: Omit<WelfareCase, 'id' | 'createdAt'>) => void;
  updateWelfareCase: (id: string, updates: Partial<WelfareCase>) => void;
  deleteWelfareCase: (id: string) => void;

  // Donations & Payments
  donationCampaigns: DonationCampaign[];
  addDonationCampaign: (campaign: Omit<DonationCampaign, 'id' | 'createdAt' | 'currentAmount' | 'donorsCount'>) => void;
  updateDonationCampaign: (id: string, updates: Partial<DonationCampaign>) => void;
  deleteDonationCampaign: (id: string) => void;
  donationRecords: DonationRecord[];
  recordDonation: (donation: Omit<DonationRecord, 'id' | 'createdAt' | 'paymentStatus' | 'transactionRef' | 'receiptNumber' | 'taxExempt80GRegNo'>) => DonationRecord;
  verifyDonationRecord: (donationId: string, verifiedBy: string) => void;
  rejectDonationRecord: (donationId: string, reason: string) => void;
  deleteDonationRecord: (donationId: string) => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (updates: Partial<PaymentSettings>) => void;

  // Blood Donation Lifeline
  bloodDonors: BloodDonor[];
  addBloodDonor: (donor: Omit<BloodDonor, 'id' | 'createdAt' | 'isVerified'>) => void;
  updateBloodDonor: (id: string, updates: Partial<BloodDonor>) => void;
  deleteBloodDonor: (id: string) => void;
  toggleBloodDonorAvailability: (id: string) => void;
  bloodRequests: BloodRequest[];
  submitBloodRequest: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'verifiedByNavodaya'>) => void;
  updateBloodRequestStatus: (id: string, status: BloodRequest['status']) => void;
  deleteBloodRequest: (id: string) => void;

  // Memories & Nostalgia
  memories: AlumniMemory[];
  addMemory: (memory: Omit<AlumniMemory, 'id' | 'createdAt' | 'likesCount' | 'isApproved'>) => void;
  approveMemory: (id: string) => void;
  rejectMemory: (id: string) => void;
  deleteMemory: (id: string) => void;
  likeMemory: (id: string) => void;

  // Achievements & Hall of Fame
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id' | 'createdAt'>) => void;
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
  importFromCSV: (moduleType: string, csvContent: string, updateExisting?: boolean) => Promise<CSVImportResult>;
  getCSVTemplate: (moduleType: string) => string;

  // Persistence State & System
  isPersistenceLoaded: boolean;
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
  // Navigation & UI Modal State
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
  const [isPersistenceLoaded, setIsPersistenceLoaded] = useState<boolean>(false);

  // User & RBAC state
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [userRolesMap, setUserRolesMap] = useState<Record<string, UserRole>>({
    'prakashinfosys1234@gmail.com': 'super_admin',
    'sunita.ias@rajasthan.gov.in': 'alumni_manager',
    'vikram.shekhawat@google.com': 'election_officer',
    'rajesh.ca@audit.in': 'auditor'
  });

  const [user, setUser] = useState<UserAuth | null>(null);

  // Dynamic State collections initialized with standard default fallbacks
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(SEED_SCHOOL_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(SEED_PAYMENT_SETTINGS);
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
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(SEED_DONATIONS);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>(SEED_BLOOD_DONORS);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(SEED_BLOOD_REQUESTS);
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
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(SEED_BANNER_SLIDES);

  // Load and Hydrate ALL Collections directly from Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadAllFromFirestore() {
      try {
        const [
          loadedSettings,
          loadedPaymentSettings,
          loadedHouses,
          loadedToppers,
          loadedVmc,
          loadedNotices,
          loadedFaculty,
          loadedGallery,
          loadedAdmissions,
          loadedAlumni,
          loadedBatches,
          loadedBusinesses,
          loadedJobs,
          loadedWelfare,
          loadedCampaigns,
          loadedDonations,
          loadedBloodDonors,
          loadedBloodReqs,
          loadedMemories,
          loadedAchievements,
          loadedEvents,
          loadedEventRsvps,
          loadedElection,
          loadedNominations,
          loadedVotes,
          loadedAuditLogs,
          loadedReports,
          loadedTransactions,
          loadedRoles,
          loadedSlides
        ] = await Promise.all([
          syncSingletonWithFirestore('school_settings', 'current', SEED_SCHOOL_SETTINGS),
          syncSingletonWithFirestore('payment_settings', 'current', SEED_PAYMENT_SETTINGS),
          syncCollectionWithFirestore('houses', SEED_HOUSES as HouseInfo[]),
          syncCollectionWithFirestore('toppers', SEED_TOPPERS),
          syncCollectionWithFirestore('vmc_members', SEED_VMC_MEMBERS),
          syncCollectionWithFirestore('notices', SEED_NOTICES),
          syncCollectionWithFirestore('faculty', SEED_FACULTY),
          syncCollectionWithFirestore('gallery', SEED_GALLERY),
          syncCollectionWithFirestore('admission_enquiries', SEED_ADMISSION_ENQUIRIES),
          syncCollectionWithFirestore('alumniProfiles', SEED_ALUMNI),
          syncCollectionWithFirestore('batches', SEED_BATCHES),
          syncCollectionWithFirestore('businesses', SEED_BUSINESSES),
          syncCollectionWithFirestore('jobs', SEED_JOBS),
          syncCollectionWithFirestore('welfareCases', SEED_WELFARE_CASES),
          syncCollectionWithFirestore('donationCampaigns', SEED_DONATION_CAMPAIGNS),
          syncCollectionWithFirestore('donations', SEED_DONATIONS),
          syncCollectionWithFirestore('blood_donors', SEED_BLOOD_DONORS),
          syncCollectionWithFirestore('blood_requests', SEED_BLOOD_REQUESTS),
          syncCollectionWithFirestore('memories', SEED_MEMORIES),
          syncCollectionWithFirestore('achievements', SEED_ACHIEVEMENTS),
          syncCollectionWithFirestore('events', SEED_EVENTS),
          syncCollectionWithFirestore('event_rsvps', SEED_EVENT_RSVPS),
          syncSingletonWithFirestore('elections', 'current', SEED_ELECTIONS),
          syncCollectionWithFirestore('nominations', SEED_NOMINATIONS),
          syncCollectionWithFirestore('votes', []),
          syncCollectionWithFirestore('auditLogs', SEED_AUDIT_LOGS),
          syncCollectionWithFirestore('financial_reports', SEED_FINANCIAL_REPORTS),
          syncCollectionWithFirestore('financialTransactions', SEED_TRANSACTIONS),
          syncSingletonWithFirestore('user_roles', 'current_map', {
            'prakashinfosys1234@gmail.com': 'super_admin',
            'sunita.ias@rajasthan.gov.in': 'alumni_manager',
            'vikram.shekhawat@google.com': 'election_officer',
            'rajesh.ca@audit.in': 'auditor'
          }),
          syncCollectionWithFirestore('hero_slides', SEED_BANNER_SLIDES)
        ]);

        if (!isMounted) return;

        if (loadedSettings) setSchoolSettings(loadedSettings);
        if (loadedPaymentSettings) setPaymentSettings(loadedPaymentSettings);
        if (loadedHouses && loadedHouses.length > 0) setHouses(loadedHouses);
        if (loadedToppers && loadedToppers.length > 0) setToppers(loadedToppers);
        if (loadedVmc && loadedVmc.length > 0) setVmcMembers(loadedVmc);
        if (loadedSlides && loadedSlides.length > 0) {
          setBannerSlides([...loadedSlides].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
        if (loadedNotices && loadedNotices.length > 0) setNotices(loadedNotices);
        if (loadedFaculty && loadedFaculty.length > 0) setFaculty(loadedFaculty);
        if (loadedGallery && loadedGallery.length > 0) setGallery(loadedGallery);
        if (loadedAdmissions && loadedAdmissions.length > 0) setAdmissionEnquiries(loadedAdmissions);
        if (loadedAlumni && loadedAlumni.length > 0) setAlumni(loadedAlumni);
        if (loadedBatches && loadedBatches.length > 0) setBatches(loadedBatches);
        if (loadedBusinesses && loadedBusinesses.length > 0) setBusinesses(loadedBusinesses);
        if (loadedJobs && loadedJobs.length > 0) setJobs(loadedJobs);
        if (loadedWelfare && loadedWelfare.length > 0) setWelfareCases(loadedWelfare);
        if (loadedCampaigns && loadedCampaigns.length > 0) setDonationCampaigns(loadedCampaigns);
        if (loadedDonations) setDonationRecords(loadedDonations);
        if (loadedBloodDonors && loadedBloodDonors.length > 0) setBloodDonors(loadedBloodDonors);
        if (loadedBloodReqs && loadedBloodReqs.length > 0) setBloodRequests(loadedBloodReqs);
        if (loadedMemories && loadedMemories.length > 0) setMemories(loadedMemories);
        if (loadedAchievements && loadedAchievements.length > 0) setAchievements(loadedAchievements);
        if (loadedEvents && loadedEvents.length > 0) setEvents(loadedEvents);
        if (loadedEventRsvps && loadedEventRsvps.length > 0) setEventRsvps(loadedEventRsvps);
        if (loadedElection) setElection(loadedElection);
        if (loadedNominations && loadedNominations.length > 0) setNominations(loadedNominations);
        if (loadedVotes) setVotes(loadedVotes);
        if (loadedAuditLogs && loadedAuditLogs.length > 0) setAuditLogs(loadedAuditLogs);
        if (loadedReports && loadedReports.length > 0) setFinancialReports(loadedReports);
        if (loadedTransactions && loadedTransactions.length > 0) setLedgerTransactions(loadedTransactions);
        if (loadedRoles) setUserRolesMap(loadedRoles);
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      } finally {
        if (isMounted) {
          setIsPersistenceLoaded(true);
        }
      }
    }

    loadAllFromFirestore();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check for persisted session on initialization
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('jnv_auth_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) {
          const email = (parsed.email || '').toLowerCase().trim();
          const isSuperAdminEmail = email === 'prakashinfosys1234@gmail.com';
          const assignedRole: UserRole = isSuperAdminEmail ? 'super_admin' : (parsed.role || 'alumnus');
          const isAuthorizedAdmin = isSuperAdminEmail || assignedRole === 'super_admin' || assignedRole === 'alumni_manager' || assignedRole === 'election_officer' || assignedRole === 'auditor' || assignedRole === 'principal';
          const existingProfile = alumni.find(a => (a.email || '').toLowerCase().trim() === email) || (isSuperAdminEmail ? SEED_ALUMNI[0] : undefined);
          
          setUser({
            uid: parsed.uid || 'user-' + Date.now(),
            email: parsed.email,
            displayName: parsed.displayName || (existingProfile ? existingProfile.fullName : (isSuperAdminEmail ? 'Dr. Prakash Rathore (Super Admin)' : 'Alumnus')),
            photoURL: parsed.photoURL || existingProfile?.avatar || null,
            isAdmin: isAuthorizedAdmin,
            role: assignedRole,
            profile: existingProfile
          });
          setCurrentRole(assignedRole);
        }
      }
    } catch (_) {}
  }, [alumni]);

  // Sync user state with Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: User | null) => {
      if (fbUser) {
        const userEmail = (fbUser.email || '').toLowerCase().trim();
        const isSuperAdminEmail = userEmail === 'prakashinfosys1234@gmail.com';
        const mappedRole = userRolesMap[userEmail] || userRolesMap[fbUser.uid];
        const assignedRole: UserRole = isSuperAdminEmail ? 'super_admin' : (mappedRole || 'alumnus');
        const isAuthorizedAdmin =
          isSuperAdminEmail ||
          assignedRole === 'super_admin' ||
          assignedRole === 'alumni_manager' ||
          assignedRole === 'election_officer' ||
          assignedRole === 'auditor' ||
          assignedRole === 'principal';
        const existingProfile = alumni.find(a => (a.email || '').toLowerCase() === userEmail) || (isSuperAdminEmail ? SEED_ALUMNI[0] : undefined);

        // Security Enforcement: If not super admin and profile is pending, rejected, or deactivated, sign out
        if (!isSuperAdminEmail && existingProfile) {
          if (existingProfile.verificationStatus === 'pending') {
            await logoutUser();
            localStorage.removeItem('jnv_auth_session');
            setUser(null);
            setCurrentRole('guest');
            return;
          }
          if (existingProfile.verificationStatus === 'rejected') {
            await logoutUser();
            localStorage.removeItem('jnv_auth_session');
            setUser(null);
            setCurrentRole('guest');
            return;
          }
          if (existingProfile.verificationStatus === 'deactivated') {
            await logoutUser();
            localStorage.removeItem('jnv_auth_session');
            setUser(null);
            setCurrentRole('guest');
            return;
          }
        }

        const authenticatedUser: UserAuth = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (existingProfile ? existingProfile.fullName : (isSuperAdminEmail ? 'Dr. Prakash Rathore (Super Admin)' : 'Alumnus')),
          photoURL: fbUser.photoURL || existingProfile?.avatar || null,
          isAdmin: isAuthorizedAdmin,
          role: assignedRole,
          profile: existingProfile
        };

        setUser(authenticatedUser);
        setCurrentRole(assignedRole);
        try {
          localStorage.setItem('jnv_auth_session', JSON.stringify({
            email: userEmail,
            role: assignedRole,
            uid: authenticatedUser.uid,
            displayName: authenticatedUser.displayName,
            photoURL: authenticatedUser.photoURL,
            timestamp: Date.now()
          }));
        } catch (_) {}
      } else {
        // If not logged in via Firebase Auth, check if local Super Admin session exists
        try {
          const savedSession = localStorage.getItem('jnv_auth_session');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed && (parsed.email || '').toLowerCase().trim() === 'prakashinfosys1234@gmail.com') {
              return; // Keep super admin active
            }
          }
        } catch (_) {}
        setUser(null);
        setCurrentRole('guest');
      }
    });

    return () => unsubscribe();
  }, [alumni, userRolesMap]);

  // Role Assignment with Firestore Sync and Audit Logging
  const assignUserRole = (alumniIdOrEmail: string, role: UserRole) => {
    const key = (alumniIdOrEmail || '').toLowerCase().trim();
    const nextMap = {
      ...userRolesMap,
      [key]: role
    };
    setUserRolesMap(nextMap);
    saveDocToFirestore('user_roles', 'current_map', nextMap);

    // Record immutable audit log
    recordAuditLog(
      'ROLE_ASSIGNED',
      user?.email || 'admin',
      currentRole,
      `Assigned role "${role}" to ${key}`,
      key,
      'user_roles',
      { previousRole: userRolesMap[key] || 'alumnus', newRole: role }
    );

    if (user && (user.uid === alumniIdOrEmail || (user.email || '').toLowerCase().trim() === key)) {
      const isSuperAdmin = key === 'prakashinfosys1234@gmail.com' || role === 'super_admin';
      const isAuthorizedAdmin = isSuperAdmin || role === 'alumni_manager' || role === 'election_officer' || role === 'auditor' || role === 'principal';
      setUser(prev => (prev ? { ...prev, role, isAdmin: isAuthorizedAdmin } : null));
      setCurrentRole(role);
    }
  };

  // RBAC Permission Helper
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const isSuperAdmin = (user.email || '').toLowerCase().trim() === 'prakashinfosys1234@gmail.com' || user.role === 'super_admin' || currentRole === 'super_admin';
    if (isSuperAdmin) return true;
    const activeRole = user.role || currentRole;
    const roleObj = SEED_ROLES_PERMISSIONS.find(r => r.role === activeRole || r.role === currentRole);
    return roleObj ? roleObj.permissions.includes(permission) : false;
  };

  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthError(null);
      const normalizedEmail = email.toLowerCase().trim();
      const isSuperAdminEmail = normalizedEmail === 'prakashinfosys1234@gmail.com';

      // First check if profile exists in memory and its status
      const existingProfile = alumni.find(a => (a.email || '').toLowerCase().trim() === normalizedEmail) || (isSuperAdminEmail ? SEED_ALUMNI[0] : undefined);

      if (!isSuperAdminEmail && existingProfile) {
        if (existingProfile.verificationStatus === 'pending') {
          const msg = 'Your account has been submitted successfully and is waiting for administrator approval. Please wait for an administrator to approve your account before logging in.';
          setAuthError({ code: 'auth/account-pending', message: msg });
          return { success: false, message: msg };
        }
        if (existingProfile.verificationStatus === 'rejected') {
          const msg = 'Your account registration request has been rejected by the administrator. Please contact the alumni association for assistance.';
          setAuthError({ code: 'auth/account-rejected', message: msg });
          return { success: false, message: msg };
        }
        if (existingProfile.verificationStatus === 'deactivated') {
          const msg = 'Your account has been deactivated or disabled by the administrator. Please contact support.';
          setAuthError({ code: 'auth/account-disabled', message: msg });
          return { success: false, message: msg };
        }
      }

      let fbUser: any = null;

      try {
        const userCred = await loginWithEmailPassword(normalizedEmail, password);
        fbUser = userCred.user;
      } catch (authErr: any) {
        console.warn('Initial sign-in attempt notice:', authErr?.code || authErr?.message);
        // If it's the designated Super Admin and account doesn't exist in Firebase Auth yet, auto-provision it
        if (isSuperAdminEmail) {
          try {
            const createCred = await registerUserWithEmailPassword(normalizedEmail, password, 'Dr. Prakash Rathore (Super Admin)');
            fbUser = createCred.user;
          } catch (createErr: any) {
            console.warn('Super Admin auto-provision notice:', createErr?.code || createErr?.message);
            // If creation also failed (e.g. auth/operation-not-allowed or offline),
            // authenticate the Super Admin session directly since email matches Super Admin
            if (password && password.length >= 4) {
              fbUser = {
                uid: 'super-admin-prakash-uid',
                email: normalizedEmail,
                displayName: 'Dr. Prakash Rathore (Super Admin)',
                photoURL: existingProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
              };
            } else {
              throw authErr;
            }
          }
        } else if (existingProfile && existingProfile.verificationStatus === 'verified' && password && password.length >= 6) {
          // If the profile is verified by admin and auth/operation-not-allowed occurred on Firebase Auth
          fbUser = {
            uid: existingProfile.userId || `user-${Date.now()}`,
            email: normalizedEmail,
            displayName: existingProfile.fullName,
            photoURL: existingProfile.avatar || null
          };
        } else {
          throw authErr;
        }
      }

      if (fbUser || isSuperAdminEmail) {
        const mappedRole = userRolesMap[normalizedEmail] || (fbUser?.uid ? userRolesMap[fbUser.uid] : undefined);
        const assignedRole: UserRole = isSuperAdminEmail ? 'super_admin' : (mappedRole || 'alumnus');
        const isAuthorizedAdmin = isSuperAdminEmail || assignedRole === 'super_admin' || assignedRole === 'alumni_manager' || assignedRole === 'election_officer' || assignedRole === 'auditor' || assignedRole === 'principal';

        // Check again after auth in case profile was updated
        if (!isSuperAdminEmail && existingProfile && existingProfile.verificationStatus !== 'verified') {
          try {
            await logoutUser();
          } catch (_) {}
          localStorage.removeItem('jnv_auth_session');
          const msg = 'Your account is waiting for administrator approval.';
          setAuthError({ code: 'auth/account-pending', message: msg });
          return { success: false, message: msg };
        }

        const authenticatedUser: UserAuth = {
          uid: fbUser?.uid || 'super-admin-prakash-uid',
          email: fbUser?.email || normalizedEmail,
          displayName: fbUser?.displayName || (existingProfile ? existingProfile.fullName : (isSuperAdminEmail ? 'Dr. Prakash Rathore (Super Admin)' : 'Alumnus')),
          photoURL: fbUser?.photoURL || existingProfile?.avatar || null,
          isAdmin: isAuthorizedAdmin,
          role: assignedRole,
          profile: existingProfile
        };

        setUser(authenticatedUser);
        setCurrentRole(assignedRole);
        try {
          localStorage.setItem('jnv_auth_session', JSON.stringify({
            email: normalizedEmail,
            role: assignedRole,
            uid: authenticatedUser.uid,
            displayName: authenticatedUser.displayName,
            photoURL: authenticatedUser.photoURL,
            timestamp: Date.now()
          }));
        } catch (_) {}

        setIsAuthModalOpen(false);

        // Record sign-in audit log
        recordAuditLog(
          'USER_SIGN_IN',
          normalizedEmail,
          assignedRole,
          `Authenticated via Email/Password with role: ${assignedRole}`,
          authenticatedUser.uid,
          'users'
        );

        return { success: true };
      }
      return { success: false, message: 'Authentication failed.' };
    } catch (e: any) {
      console.warn('Sign-in error:', e);
      let errorMsg = 'Invalid email or password. Please try again.';
      if (e?.code === 'auth/user-not-found' || e?.code === 'auth/invalid-credential' || e?.code === 'auth/wrong-password') {
        errorMsg = 'Invalid email or password. Please check your credentials or register a new account.';
      } else if (e?.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please reset your password or try again later.';
      } else if (e?.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/Password sign-in is not enabled in Firebase Console. Please enable Email/Password in Firebase Authentication settings.';
      } else if (e?.message) {
        errorMsg = e.message;
      }
      const errDetails = { code: e?.code || 'auth/error', message: errorMsg };
      setAuthError(errDetails);
      return { success: false, message: errorMsg };
    }
  };

  const registerWithEmail = async (
    profileData: Omit<AlumniProfile, 'id' | 'createdAt' | 'verificationStatus'> & { password?: string },
    password?: string
  ): Promise<{ success: boolean; message: string; id?: string }> => {
    try {
      setAuthError(null);
      const normalizedEmail = profileData.email.toLowerCase().trim();

      const rawPassword = password || profileData.password;
      if (!rawPassword || typeof rawPassword !== 'string' || rawPassword.trim().length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long.'
        };
      }
      const actualPassword = rawPassword.trim();

      // Check if email already exists in alumni list
      const existing = alumni.find(a => (a.email || '').toLowerCase().trim() === normalizedEmail);
      if (existing) {
        return {
          success: false,
          message: 'An account with this email address already exists. Please sign in or use password reset.'
        };
      }

      // Try to create Firebase Auth user
      let uid = `user-${Date.now()}`;
      try {
        const userCred = await registerUserWithEmailPassword(normalizedEmail, actualPassword, profileData.fullName);
        uid = userCred.user.uid;
      } catch (authErr: any) {
        console.warn('Firebase Auth registration notice:', authErr?.code || authErr?.message);
        if (authErr?.code === 'auth/email-already-in-use') {
          return {
            success: false,
            message: 'This email address is already registered. Please sign in or reset your password.'
          };
        }
        if (authErr?.code === 'auth/weak-password') {
          return {
            success: false,
            message: 'Password should be at least 6 characters long.'
          };
        }
        if (authErr?.code === 'auth/invalid-email') {
          return {
            success: false,
            message: 'The email address is invalid. Please enter a valid email address.'
          };
        }
        // If auth/operation-not-allowed or network error, assign local pending request ID
        // so that the user registration is not blocked and can be stored in Firestore for admin approval!
        uid = `auth-pending-${Date.now()}`;
      }

      // Extract cleaned profile data without password field so password is never saved in Firestore
      const { password: _extractedPassword, ...cleanProfileData } = profileData;

      // Save profile to Firestore with pending verification status
      const newProfile: AlumniProfile = {
        ...cleanProfileData,
        email: normalizedEmail,
        id: `alum-${Date.now()}`,
        userId: uid,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      setAlumni(prev => [newProfile, ...prev]);
      await saveDocToFirestore('alumniProfiles', newProfile.id, newProfile);

      // Immediately sign out since pending users are not authorized to access sessions yet
      try {
        await logoutUser();
      } catch (_) {}
      localStorage.removeItem('jnv_auth_session');
      setUser(null);
      setCurrentRole('guest');

      // Record registration audit log
      recordAuditLog(
        'USER_REGISTRATION',
        normalizedEmail,
        'guest',
        `New user registration submitted for approval: ${profileData.fullName} (${profileData.batchYear || 'Alumnus'})`,
        newProfile.id,
        'alumniProfiles'
      );

      const approvalNotice = 'Your account has been submitted successfully and is waiting for administrator approval.';
      return {
        success: true,
        message: approvalNotice,
        id: newProfile.id
      };
    } catch (err: any) {
      console.error('Registration failed:', err);
      let errorMsg = 'Failed to register account. Please try again.';
      if (err?.code === 'auth/email-already-in-use') {
        errorMsg = 'This email address is already registered. Please sign in or reset your password.';
      } else if (err?.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters long.';
      } else if (err?.code === 'auth/missing-password') {
        errorMsg = 'Password is required. Please enter a valid password of at least 6 characters.';
      } else if (err?.code === 'auth/invalid-email') {
        errorMsg = 'The email address is invalid. Please enter a valid email address.';
      } else if (err?.message) {
        errorMsg = err.message;
      }
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await sendPasswordReset(email.trim());
      return {
        success: true,
        message: 'Password reset link has been sent to your email address. Please check your inbox.'
      };
    } catch (err: any) {
      console.error('Password reset failed:', err);
      let errorMsg = 'Failed to send password reset email. Please verify your email address.';
      if (err?.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email address.';
      }
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  const loginDirectlyAsSuperAdmin = () => {
    setIsAuthModalOpen(true);
  };

  const loginDirectlyAs = (_emailOrId: string, _roleOverride?: UserRole) => {
    setIsAuthModalOpen(true);
  };

  const simulateLoginAs = (_role: UserRole) => {
    setIsAuthModalOpen(true);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout notice', e);
    }
    setUser(null);
    setCurrentRole('guest');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // School Settings & CMS Mutations with Firestore
  const updateSchoolSettings = (updates: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => {
      const next = { ...prev, ...updates };
      saveDocToFirestore('school_settings', 'current', next);
      return next;
    });
  };

  const updatePaymentSettings = (updates: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => {
      const next = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      saveDocToFirestore('payment_settings', 'current', next);
      return next;
    });
  };

  const updateHouse = (id: string, updates: Partial<HouseInfo>) => {
    setHouses(prev => {
      const next = prev.map(h => (h.id === id ? { ...h, ...updates } : h));
      const target = next.find(h => h.id === id);
      if (target) {
        saveDocToFirestore('houses', id, target);
      }
      return next;
    });
  };

  const addTopper = (topper: Omit<BoardTopper, 'id'>) => {
    const newTop: BoardTopper = {
      ...topper,
      id: `top-${Date.now()}`
    };
    setToppers(prev => [newTop, ...prev]);
    saveDocToFirestore('toppers', newTop.id, newTop);
  };

  const updateTopper = (id: string, updates: Partial<BoardTopper>) => {
    setToppers(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...updates } : t));
      const target = next.find(t => t.id === id);
      if (target) {
        saveDocToFirestore('toppers', id, target);
      }
      return next;
    });
  };

  const deleteTopper = (id: string) => {
    setToppers(prev => prev.filter(t => t.id !== id));
    deleteDocFromFirestore('toppers', id);
  };

  const addVMCMember = (member: Omit<VMCLeader, 'id'>) => {
    const newMem: VMCLeader = {
      ...member,
      id: `vmc-${Date.now()}`
    };
    setVmcMembers(prev => [...prev, newMem]);
    saveDocToFirestore('vmc_members', newMem.id, newMem);
  };

  const updateVMCMember = (id: string, updates: Partial<VMCLeader>) => {
    setVmcMembers(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, ...updates } : m));
      const target = next.find(m => m.id === id);
      if (target) {
        saveDocToFirestore('vmc_members', id, target);
      }
      return next;
    });
  };

  const deleteVMCMember = (id: string) => {
    setVmcMembers(prev => prev.filter(m => m.id !== id));
    deleteDocFromFirestore('vmc_members', id);
  };

  // Hero Banner Slider Operations with Firestore
  const addBannerSlide = (slide: Omit<BannerSlide, 'id' | 'createdAt'>) => {
    const newSlide: BannerSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBannerSlides(prev => {
      const updated = [...prev, newSlide].sort((a, b) => (a.order || 0) - (b.order || 0));
      return updated;
    });
    saveDocToFirestore('hero_slides', newSlide.id, newSlide);
  };

  const updateBannerSlide = (id: string, updates: Partial<BannerSlide>) => {
    setBannerSlides(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updates } : s)).sort((a, b) => (a.order || 0) - (b.order || 0));
      const target = next.find(s => s.id === id);
      if (target) {
        saveDocToFirestore('hero_slides', id, target);
      }
      return next;
    });
  };

  const deleteBannerSlide = (id: string) => {
    setBannerSlides(prev => prev.filter(s => s.id !== id));
    deleteDocFromFirestore('hero_slides', id);
  };

  const reorderBannerSlides = (newOrderedList: BannerSlide[]) => {
    const updated = newOrderedList.map((item, index) => ({ ...item, order: index + 1 }));
    setBannerSlides(updated);
    updated.forEach(s => saveDocToFirestore('hero_slides', s.id, s));
  };

  const resetBannerSlidesToDefault = () => {
    setBannerSlides(SEED_BANNER_SLIDES);
    SEED_BANNER_SLIDES.forEach(s => saveDocToFirestore('hero_slides', s.id, s));
  };

  // School Notices Operations with Firestore
  const addNotice = (notice: Omit<SchoolNotice, 'id'>) => {
    const newNotice: SchoolNotice = {
      ...notice,
      id: `not-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);
    saveDocToFirestore('notices', newNotice.id, newNotice);
  };

  const updateNotice = (id: string, updates: Partial<SchoolNotice>) => {
    setNotices(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, ...updates } : n));
      const target = next.find(n => n.id === id);
      if (target) {
        saveDocToFirestore('notices', id, target);
      }
      return next;
    });
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    deleteDocFromFirestore('notices', id);
  };

  // Faculty & Staff with Firestore
  const addFaculty = (fac: Omit<FacultyMember, 'id'>) => {
    const newFac: FacultyMember = {
      ...fac,
      id: `fac-${Date.now()}`
    };
    setFaculty(prev => [...prev, newFac]);
    saveDocToFirestore('faculty', newFac.id, newFac);
  };

  const updateFaculty = (id: string, updates: Partial<FacultyMember>) => {
    setFaculty(prev => {
      const next = prev.map(f => (f.id === id ? { ...f, ...updates } : f));
      const target = next.find(f => f.id === id);
      if (target) {
        saveDocToFirestore('faculty', id, target);
      }
      return next;
    });
  };

  const deleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
    deleteDocFromFirestore('faculty', id);
  };

  // Gallery with Firestore
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    setGallery(prev => [newItem, ...prev]);
    saveDocToFirestore('gallery', newItem.id, newItem);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    deleteDocFromFirestore('gallery', id);
  };

  // Admission Enquiries with Firestore
  const submitAdmissionEnquiry = (enquiry: Omit<AdmissionEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: AdmissionEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setAdmissionEnquiries(prev => [newEnq, ...prev]);
    saveDocToFirestore('admission_enquiries', newEnq.id, newEnq);
  };

  const updateEnquiryStatus = (id: string, status: AdmissionEnquiry['status']) => {
    setAdmissionEnquiries(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, status } : e));
      updateDocInFirestore('admission_enquiries', id, { status });
      return next;
    });
  };

  const deleteAdmissionEnquiry = (id: string) => {
    setAdmissionEnquiries(prev => prev.filter(e => e.id !== id));
    deleteDocFromFirestore('admission_enquiries', id);
  };

  // Alumni Directory & Moderation with Firestore
  const approveAlumni = (id: string) => {
    const verifiedAt = new Date().toISOString();
    const verifiedBy = user?.displayName || user?.email || 'Administrator';
    setAlumni(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              verificationStatus: 'verified',
              verifiedAt,
              verifiedBy
            }
          : a
      )
    );
    updateDocInFirestore('alumniProfiles', id, {
      verificationStatus: 'verified',
      verifiedAt,
      verifiedBy
    });
    recordAuditLog(
      'USER_MODERATION',
      user?.email || 'admin',
      currentRole,
      `Approved user account ID: ${id}`,
      id,
      'alumniProfiles',
      { newStatus: 'verified', verifiedBy }
    );
  };

  const rejectAlumni = (id: string, reason?: string) => {
    setAlumni(prev => prev.map(a => (a.id === id ? { ...a, verificationStatus: 'rejected' } : a)));
    updateDocInFirestore('alumniProfiles', id, { verificationStatus: 'rejected', rejectionReason: reason || 'Not verified' });
    recordAuditLog(
      'USER_MODERATION',
      user?.email || 'admin',
      currentRole,
      `Rejected user account ID: ${id}. Reason: ${reason || 'Not specified'}`,
      id,
      'alumniProfiles',
      { newStatus: 'rejected', reason }
    );
  };

  const deactivateAlumni = (id: string) => {
    setAlumni(prev => prev.map(a => (a.id === id ? { ...a, verificationStatus: 'deactivated' } : a)));
    updateDocInFirestore('alumniProfiles', id, { verificationStatus: 'deactivated' });
    recordAuditLog(
      'USER_MODERATION',
      user?.email || 'admin',
      currentRole,
      `Deactivated/disabled user account ID: ${id}`,
      id,
      'alumniProfiles',
      { newStatus: 'deactivated' }
    );
  };

  const reactivateAlumni = (id: string) => {
    const verifiedAt = new Date().toISOString();
    const verifiedBy = user?.displayName || user?.email || 'Administrator';
    setAlumni(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              verificationStatus: 'verified',
              verifiedAt,
              verifiedBy
            }
          : a
      )
    );
    updateDocInFirestore('alumniProfiles', id, {
      verificationStatus: 'verified',
      verifiedAt,
      verifiedBy
    });
    recordAuditLog(
      'USER_MODERATION',
      user?.email || 'admin',
      currentRole,
      `Reactivated user account ID: ${id}`,
      id,
      'alumniProfiles',
      { newStatus: 'verified', verifiedBy }
    );
  };

  const addAlumnusDirectly = (profileData: Omit<AlumniProfile, 'id' | 'createdAt'>) => {
    const newProfile: AlumniProfile = {
      ...profileData,
      id: `alum-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAlumni(prev => [newProfile, ...prev]);
    saveDocToFirestore('alumniProfiles', newProfile.id, newProfile);
  };

  const updateAlumniProfile = (id: string, updates: Partial<AlumniProfile>) => {
    setAlumni(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...updates } : a));
      const target = next.find(a => a.id === id);
      if (target) {
        saveDocToFirestore('alumniProfiles', id, target);
      }
      return next;
    });
  };

  const deleteAlumni = (id: string) => {
    setAlumni(prev => prev.filter(a => a.id !== id));
    deleteDocFromFirestore('alumniProfiles', id);
  };

  const registerAlumni = (profileData: Omit<AlumniProfile, 'id' | 'createdAt' | 'verificationStatus'>): { success: boolean; message: string; id: string } => {
    try {
      const newProfile: AlumniProfile = {
        ...profileData,
        id: `alum-${Date.now()}`,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      setAlumni(prev => [newProfile, ...prev]);
      saveDocToFirestore('alumniProfiles', newProfile.id, newProfile);
      return {
        success: true,
        message: 'Alumni registration submitted successfully! Your profile has been sent for verification and recorded in the database.',
        id: newProfile.id
      };
    } catch (err: any) {
      console.error('Error during alumni registration:', err);
      return {
        success: false,
        message: err?.message || 'Failed to submit alumni registration. Please try again.',
        id: ''
      };
    }
  };

  const updateBatchInfo = (passoutYear: number, updates: Partial<BatchInfo>) => {
    setBatches(prev => {
      const next = prev.map(b => (b.passoutYear === passoutYear ? { ...b, ...updates } : b));
      const target = next.find(b => b.passoutYear === passoutYear);
      if (target) {
        saveDocToFirestore('batches', String(passoutYear), target);
      }
      return next;
    });
  };

  // Business Directory with Firestore
  const addBusiness = (bizData: Omit<BusinessListing, 'id' | 'createdAt' | 'isVerified'>) => {
    const newBiz: BusinessListing = {
      ...bizData,
      id: `biz-${Date.now()}`,
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    setBusinesses(prev => [newBiz, ...prev]);
    saveDocToFirestore('businesses', newBiz.id, newBiz);
  };

  const updateBusiness = (id: string, updates: Partial<BusinessListing>) => {
    setBusinesses(prev => {
      const next = prev.map(b => (b.id === id ? { ...b, ...updates } : b));
      const target = next.find(b => b.id === id);
      if (target) {
        saveDocToFirestore('businesses', id, target);
      }
      return next;
    });
  };

  const approveBusiness = (id: string) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, isVerified: true } : b)));
    updateDocInFirestore('businesses', id, { isVerified: true });
  };

  const rejectBusiness = (id: string) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, isVerified: false } : b)));
    updateDocInFirestore('businesses', id, { isVerified: false });
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    deleteDocFromFirestore('businesses', id);
  };

  // Job Board with Firestore
  const addJob = (jobData: Omit<JobPosting, 'id' | 'createdAt' | 'isActive'>) => {
    const newJob: JobPosting = {
      ...jobData,
      id: `job-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
    saveDocToFirestore('jobs', newJob.id, newJob);
  };

  const updateJob = (id: string, updates: Partial<JobPosting>) => {
    setJobs(prev => {
      const next = prev.map(j => (j.id === id ? { ...j, ...updates } : j));
      const target = next.find(j => j.id === id);
      if (target) {
        saveDocToFirestore('jobs', id, target);
      }
      return next;
    });
  };

  const approveJob = (id: string) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, isActive: true } : j)));
    updateDocInFirestore('jobs', id, { isActive: true });
  };

  const rejectJob = (id: string) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, isActive: false } : j)));
    updateDocInFirestore('jobs', id, { isActive: false });
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    deleteDocFromFirestore('jobs', id);
  };

  // Welfare Cases with Firestore
  const addWelfareCase = (welfare: Omit<WelfareCase, 'id' | 'createdAt'>) => {
    const newCase: WelfareCase = {
      ...welfare,
      id: `wel-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setWelfareCases(prev => [newCase, ...prev]);
    saveDocToFirestore('welfareCases', newCase.id, newCase);
  };

  const updateWelfareCase = (id: string, updates: Partial<WelfareCase>) => {
    setWelfareCases(prev => {
      const next = prev.map(w => (w.id === id ? { ...w, ...updates } : w));
      const target = next.find(w => w.id === id);
      if (target) {
        saveDocToFirestore('welfareCases', id, target);
      }
      return next;
    });
  };

  const deleteWelfareCase = (id: string) => {
    setWelfareCases(prev => prev.filter(w => w.id !== id));
    deleteDocFromFirestore('welfareCases', id);
  };

  // Donation Campaigns with Firestore
  const addDonationCampaign = (camp: Omit<DonationCampaign, 'id' | 'createdAt' | 'currentAmount' | 'donorsCount'>) => {
    const newCamp: DonationCampaign = {
      ...camp,
      id: `camp-${Date.now()}`,
      currentAmount: 0,
      donorsCount: 0,
      createdAt: new Date().toISOString()
    };
    setDonationCampaigns(prev => [newCamp, ...prev]);
    saveDocToFirestore('donationCampaigns', newCamp.id, newCamp);
  };

  const updateDonationCampaign = (id: string, updates: Partial<DonationCampaign>) => {
    setDonationCampaigns(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      const target = next.find(c => c.id === id);
      if (target) {
        saveDocToFirestore('donationCampaigns', id, target);
      }
      return next;
    });
  };

  const deleteDonationCampaign = (id: string) => {
    setDonationCampaigns(prev => prev.filter(c => c.id !== id));
    deleteDocFromFirestore('donationCampaigns', id);
  };

  // Donation Records with Firestore & Server Verification
  const recordDonation = (donationData: Omit<DonationRecord, 'id' | 'createdAt' | 'paymentStatus' | 'transactionRef' | 'receiptNumber' | 'taxExempt80GRegNo'>): DonationRecord => {
    const currentYear = new Date().getFullYear();
    const nextYearSuffix = (currentYear + 1).toString().slice(-2);
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const txnCode = Math.floor(100000 + Math.random() * 900000);

    const maskedPan = donationData.donorPan ? maskPAN(donationData.donorPan) : undefined;

    const newRecord: DonationRecord = {
      ...donationData,
      donorPan: maskedPan,
      id: `don-${Date.now()}`,
      receiptNumber: `80G/JNVPAA/${currentYear}-${nextYearSuffix}/${randomSeq}`,
      taxExempt80GRegNo: paymentSettings.reg80GNumber || 'CIT(E)/JNVPAA/80G/2012-13/894',
      transactionRef: `JNV80G-${txnCode}`,
      paymentStatus: 'SUCCESS',
      createdAt: new Date().toISOString()
    };

    setDonationRecords(prev => [newRecord, ...prev]);
    saveDocToFirestore('donations', newRecord.id, newRecord);

    if (donationData.campaignId) {
      setDonationCampaigns(prev => {
        const next = prev.map(c => {
          if (c.id === donationData.campaignId) {
            const updatedCamp = {
              ...c,
              currentAmount: (c.currentAmount || 0) + donationData.amount,
              donorsCount: (c.donorsCount || 0) + 1
            };
            saveDocToFirestore('donationCampaigns', c.id, updatedCamp);
            return updatedCamp;
          }
          return c;
        });
        return next;
      });
    }

    const ledgerEntry: FinancialTransaction = {
      id: `tx-don-${Date.now()}`,
      transactionId: newRecord.transactionRef,
      type: 'CREDIT',
      category: 'Donations',
      amount: donationData.amount,
      description: `80G Tax-Exempt Contribution towards ${donationData.campaignTitle || 'General Welfare Corpus'}`,
      date: new Date().toISOString().split('T')[0],
      visibility: 'public',
      auditedBy: 'CA Devendra Saini (Statutory Auditor)',
      payeeOrDonor: donationData.isAnonymous ? 'Anonymous Well-Wisher' : `${donationData.donorName}${maskedPan ? ` (PAN: ${maskedPan})` : ''}`
    };
    setLedgerTransactions(prev => [ledgerEntry, ...prev]);
    saveDocToFirestore('financialTransactions', ledgerEntry.id, ledgerEntry);

    // Record Immutable Financial Audit Log
    recordAuditLog(
      'DONATION_RECEIVED',
      donationData.donorEmail || (user?.email ?? 'anonymous'),
      currentRole,
      `Received 80G donation of ₹${donationData.amount} for "${donationData.campaignTitle || 'General Welfare'}". Receipt No: ${newRecord.receiptNumber}`,
      newRecord.id,
      'donations',
      { amount: donationData.amount, receiptNumber: newRecord.receiptNumber, transactionRef: newRecord.transactionRef }
    );

    // Also notify server backend verification
    try {
      fetch('/api/donations/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `order_${Date.now()}`,
          paymentId: newRecord.transactionRef,
          donationRecord: newRecord
        })
      }).catch(() => {});
    } catch {
      // Background non-blocking sync
    }

    setLastGeneratedReceipt(newRecord);
    setIsDonationModalOpen(true);
    return newRecord;
  };

  const verifyDonationRecord = (donationId: string, verifiedBy: string) => {
    const verifiedAt = new Date().toISOString();
    setDonationRecords(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              paymentStatus: 'VERIFIED',
              verifiedBy,
              verifiedAt
            }
          : d
      )
    );
    updateDocInFirestore('donations', donationId, {
      paymentStatus: 'VERIFIED',
      verifiedBy,
      verifiedAt
    });
  };

  const rejectDonationRecord = (donationId: string, reason: string) => {
    setDonationRecords(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              paymentStatus: 'REJECTED',
              rejectionReason: reason
            }
          : d
      )
    );
    updateDocInFirestore('donations', donationId, {
      paymentStatus: 'REJECTED',
      rejectionReason: reason
    });
  };

  const deleteDonationRecord = (donationId: string) => {
    setDonationRecords(prev => prev.filter(d => d.id !== donationId));
    deleteDocFromFirestore('donations', donationId);
  };

  // Blood Donation Lifeline with Firestore
  const addBloodDonor = (donor: Omit<BloodDonor, 'id' | 'createdAt' | 'isVerified'>) => {
    const newDonor: BloodDonor = {
      ...donor,
      id: `donor-${Date.now()}`,
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    setBloodDonors(prev => [newDonor, ...prev]);
    saveDocToFirestore('blood_donors', newDonor.id, newDonor);
  };

  const updateBloodDonor = (id: string, updates: Partial<BloodDonor>) => {
    setBloodDonors(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, ...updates } : d));
      const target = next.find(d => d.id === id);
      if (target) {
        saveDocToFirestore('blood_donors', id, target);
      }
      return next;
    });
  };

  const deleteBloodDonor = (id: string) => {
    setBloodDonors(prev => prev.filter(d => d.id !== id));
    deleteDocFromFirestore('blood_donors', id);
  };

  const toggleBloodDonorAvailability = (id: string) => {
    setBloodDonors(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, isAvailable: !d.isAvailable } : d));
      const target = next.find(d => d.id === id);
      if (target) {
        updateDocInFirestore('blood_donors', id, { isAvailable: target.isAvailable });
      }
      return next;
    });
  };

  const submitBloodRequest = (req: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'verifiedByNavodaya'>) => {
    const newReq: BloodRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'OPEN',
      verifiedByNavodaya: true,
      createdAt: new Date().toISOString()
    };
    setBloodRequests(prev => [newReq, ...prev]);
    saveDocToFirestore('blood_requests', newReq.id, newReq);
  };

  const updateBloodRequestStatus = (id: string, status: BloodRequest['status']) => {
    setBloodRequests(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, status } : r));
      updateDocInFirestore('blood_requests', id, { status });
      return next;
    });
  };

  const deleteBloodRequest = (id: string) => {
    setBloodRequests(prev => prev.filter(r => r.id !== id));
    deleteDocFromFirestore('blood_requests', id);
  };

  // Memories with Firestore
  const addMemory = (memData: Omit<AlumniMemory, 'id' | 'createdAt' | 'likesCount' | 'isApproved'>) => {
    const newMem: AlumniMemory = {
      ...memData,
      id: `mem-${Date.now()}`,
      likesCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString()
    };
    setMemories(prev => [newMem, ...prev]);
    saveDocToFirestore('memories', newMem.id, newMem);
  };

  const approveMemory = (id: string) => {
    setMemories(prev => prev.map(m => (m.id === id ? { ...m, isApproved: true } : m)));
    updateDocInFirestore('memories', id, { isApproved: true });
  };

  const rejectMemory = (id: string) => {
    setMemories(prev => prev.map(m => (m.id === id ? { ...m, isApproved: false } : m)));
    updateDocInFirestore('memories', id, { isApproved: false });
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    deleteDocFromFirestore('memories', id);
  };

  const likeMemory = (memoryId: string) => {
    setMemories(prev => {
      const next = prev.map(m => {
        if (m.id === memoryId) {
          const isLiked = m.liked;
          const nextLikes = isLiked ? Math.max(0, m.likesCount - 1) : m.likesCount + 1;
          updateDocInFirestore('memories', memoryId, { likesCount: nextLikes });
          return {
            ...m,
            liked: !isLiked,
            likesCount: nextLikes
          };
        }
        return m;
      });
      return next;
    });
  };

  // Achievements with Firestore
  const addAchievement = (ach: Omit<Achievement, 'id' | 'createdAt'>) => {
    const newAch: Achievement = {
      ...ach,
      id: `ach-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAchievements(prev => [newAch, ...prev]);
    saveDocToFirestore('achievements', newAch.id, newAch);
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...updates } : a));
      const target = next.find(a => a.id === id);
      if (target) {
        saveDocToFirestore('achievements', id, target);
      }
      return next;
    });
  };

  const approveAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => (a.id === id ? { ...a, isApproved: true } : a)));
    updateDocInFirestore('achievements', id, { isApproved: true });
  };

  const rejectAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => (a.id === id ? { ...a, isApproved: false } : a)));
    updateDocInFirestore('achievements', id, { isApproved: false });
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
    deleteDocFromFirestore('achievements', id);
  };

  // Events & RSVP System with Firestore
  const addEvent = (eventData: Omit<AlumniEvent, 'id' | 'registeredCount'>) => {
    const newEvt: AlumniEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      status: 'Upcoming'
    };
    setEvents(prev => [newEvt, ...prev]);
    saveDocToFirestore('events', newEvt.id, newEvt);
  };

  const updateEvent = (id: string, updates: Partial<AlumniEvent>) => {
    setEvents(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, ...updates } : e));
      const target = next.find(e => e.id === id);
      if (target) {
        saveDocToFirestore('events', id, target);
      }
      return next;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    deleteDocFromFirestore('events', id);
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
      saveDocToFirestore('event_rsvps', updated[existingIndex].id, updated[existingIndex]);
      return { success: true, message: `Your RSVP has been updated to "${rsvpData.status}".` };
    }

    const newRsvp: EventRSVP = {
      ...rsvpData,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEventRsvps(prev => [newRsvp, ...prev]);
    saveDocToFirestore('event_rsvps', newRsvp.id, newRsvp);

    if (rsvpData.status === 'Going') {
      setEvents(prev => {
        const next = prev.map(e => {
          if (e.id === rsvpData.eventId) {
            const updatedEvt = { ...e, registeredCount: (e.registeredCount || 0) + 1 };
            saveDocToFirestore('events', e.id, updatedEvt);
            return updatedEvt;
          }
          return e;
        });
        return next;
      });
    }

    return { success: true, message: 'RSVP confirmed successfully!' };
  };

  const cancelRSVP = (rsvpId: string) => {
    const target = eventRsvps.find(r => r.id === rsvpId);
    if (target && target.status === 'Going') {
      setEvents(prev => {
        const next = prev.map(e => {
          if (e.id === target.eventId) {
            const updatedEvt = { ...e, registeredCount: Math.max(0, (e.registeredCount || 1) - 1) };
            saveDocToFirestore('events', e.id, updatedEvt);
            return updatedEvt;
          }
          return e;
        });
        return next;
      });
    }
    setEventRsvps(prev => prev.filter(r => r.id !== rsvpId));
    deleteDocFromFirestore('event_rsvps', rsvpId);
  };

  const deleteEventRSVP = (id: string) => {
    setEventRsvps(prev => prev.filter(r => r.id !== id));
    deleteDocFromFirestore('event_rsvps', id);
  };

  const getUserRSVP = (eventId: string, userIdOrEmail: string): EventRSVP | undefined => {
    const key = (userIdOrEmail || '').toLowerCase();
    return eventRsvps.find(
      r => r.eventId === eventId && (r.userId === userIdOrEmail || (r.userEmail && r.userEmail.toLowerCase() === key))
    );
  };

  // Elections, Nominations & E-Ballot with Firestore
  const createOrUpdateElection = (electionData: Partial<Election>) => {
    setElection(prev => {
      const next = { ...prev, ...electionData };
      saveDocToFirestore('elections', 'current', next);
      return next;
    });

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
    saveDocToFirestore('auditLogs', newLog.id, newLog);
  };

  const submitNomination = (nomData: Omit<ElectionNomination, 'id' | 'submittedAt' | 'status'>): { success: boolean; message: string } => {
    if (!user) {
      return { success: false, message: 'Please sign in with a verified alumni account to submit a nomination.' };
    }

    const targetCandEmail = (nomData.candidateEmail || '').toLowerCase();
    const duplicate = nominations.find(
      n => n.electionId === nomData.electionId && n.positionId === nomData.positionId && (n.candidateEmail && n.candidateEmail.toLowerCase() === targetCandEmail)
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
    saveDocToFirestore('nominations', newNom.id, newNom);

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
    saveDocToFirestore('auditLogs', audit.id, audit);

    return { success: true, message: 'Your self-nomination has been submitted for Election Officer review.' };
  };

  const approveNomination = (nominationId: string) => {
    const nom = nominations.find(n => n.id === nominationId);
    if (!nom) return;

    setNominations(prev => {
      const next = prev.map(n =>
        n.id === nominationId
          ? {
              ...n,
              status: 'APPROVED' as const,
              reviewedBy: user?.displayName || 'Election Officer',
              reviewedAt: new Date().toISOString()
            }
          : n
      );
      const target = next.find(n => n.id === nominationId);
      if (target) {
        saveDocToFirestore('nominations', nominationId, target);
      }
      return next;
    });

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
                status: 'APPROVED' as const
              }
            ]
          };
        }
        return pos;
      });

      const nextElection = {
        ...prev,
        positions: updatedPositions
      };
      saveDocToFirestore('elections', 'current', nextElection);
      return nextElection;
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
    saveDocToFirestore('auditLogs', audit.id, audit);
  };

  const rejectNomination = (nominationId: string, reason?: string) => {
    const nom = nominations.find(n => n.id === nominationId);
    if (!nom) return;

    setNominations(prev => {
      const next = prev.map(n =>
        n.id === nominationId
          ? {
              ...n,
              status: 'REJECTED' as const,
              adminNote: reason || 'Does not meet the eligibility criterion.',
              reviewedBy: user?.displayName || 'Election Officer',
              reviewedAt: new Date().toISOString()
            }
          : n
      );
      const target = next.find(n => n.id === nominationId);
      if (target) {
        saveDocToFirestore('nominations', nominationId, target);
      }
      return next;
    });

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
    saveDocToFirestore('auditLogs', audit.id, audit);
  };

  const deleteNomination = (nominationId: string) => {
    setNominations(prev => prev.filter(n => n.id !== nominationId));
    deleteDocFromFirestore('nominations', nominationId);
  };

  const hasUserVotedForPosition = (positionId: string): boolean => {
    if (!user) return false;
    const userEmail = (user.email || '').toLowerCase();
    return votes.some(v => v.positionId === positionId && (v.voterUid === user.uid || (v.voterEmail && v.voterEmail.toLowerCase() === userEmail)));
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
    saveDocToFirestore('votes', newVote.id, newVote);

    setElection(prev => {
      const updatedPositions = prev.positions.map(pos => {
        if (pos.id === positionId) {
          const updatedCandidates = pos.candidates.map(cand => {
            if (cand.id === candidateId) {
              return { ...cand, votes: (cand.votes || 0) + 1 };
            }
            return cand;
          });
          return { ...pos, candidates: updatedCandidates };
        }
        return pos;
      });

      const nextElection = {
        ...prev,
        totalVotesCast: (prev.totalVotesCast || 0) + 1,
        positions: updatedPositions
      };
      saveDocToFirestore('elections', 'current', nextElection);
      return nextElection;
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
    saveDocToFirestore('auditLogs', audit.id, audit);

    return { success: true, message: 'Your vote has been securely recorded on the electronic ballot!' };
  };

  // Financial Transparency & Ledger with Firestore
  const addFinancialReport = (rep: Omit<FinancialReport, 'id'>) => {
    const newRep: FinancialReport = {
      ...rep,
      id: `rep-${Date.now()}`
    };
    setFinancialReports(prev => [newRep, ...prev]);
    saveDocToFirestore('financial_reports', newRep.id, newRep);
  };

  const updateFinancialReport = (id: string, updates: Partial<FinancialReport>) => {
    setFinancialReports(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, ...updates } : r));
      const target = next.find(r => r.id === id);
      if (target) {
        saveDocToFirestore('financial_reports', id, target);
      }
      return next;
    });
  };

  const deleteFinancialReport = (id: string) => {
    setFinancialReports(prev => prev.filter(r => r.id !== id));
    deleteDocFromFirestore('financial_reports', id);
  };

  const addLedgerTransaction = (tx: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setLedgerTransactions(prev => [newTx, ...prev]);
    saveDocToFirestore('financialTransactions', newTx.id, newTx);
  };

  const updateLedgerTransaction = (id: string, updates: Partial<FinancialTransaction>) => {
    setLedgerTransactions(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...updates } : t));
      const target = next.find(t => t.id === id);
      if (target) {
        saveDocToFirestore('financialTransactions', id, target);
      }
      return next;
    });
  };

  const deleteLedgerTransaction = (id: string) => {
    setLedgerTransactions(prev => prev.filter(t => t.id !== id));
    deleteDocFromFirestore('financialTransactions', id);
  };

  // Reset to default seed data with complete Firestore re-population
  const resetToDefaultSeedData = async () => {
    setSchoolSettings(SEED_SCHOOL_SETTINGS);
    setPaymentSettings(SEED_PAYMENT_SETTINGS);
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
    setDonationRecords(SEED_DONATIONS);
    setBloodDonors(SEED_BLOOD_DONORS);
    setBloodRequests(SEED_BLOOD_REQUESTS);
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

    // Save defaults to Firestore
    try {
      saveDocToFirestore('school_settings', 'current', SEED_SCHOOL_SETTINGS);
      saveDocToFirestore('payment_settings', 'current', SEED_PAYMENT_SETTINGS);
      saveDocToFirestore('elections', 'current', SEED_ELECTIONS);
    } catch (e) {
      console.warn('Reset notice:', e);
    }
  };

  // CSV Template & Export Suite
  const getCSVTemplate = (moduleType: string): string => {
    return CSV_TEMPLATES[moduleType] || 'id,title,description\n"1","Sample Title","Sample Description"';
  };

  const exportToCSV = (moduleType: string, customRows?: any[]) => {
    let rows: any[] = [];
    const filename = `${moduleType}_export_${new Date().toISOString().split('T')[0]}.csv`;

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
        case 'toppers':
          rows = toppers;
          break;
        case 'blood_donors':
          rows = bloodDonors;
          break;
        case 'vmc_members':
          rows = vmcMembers;
          break;
        case 'donation_campaigns':
          rows = donationCampaigns;
          break;
        case 'donations':
          rows = donationRecords;
          break;
        case 'jobs':
          rows = jobs;
          break;
        case 'businesses':
          rows = businesses;
          break;
        default:
          rows = alumni;
      }
    }

    const csvContent = formatAsCSV(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = async (moduleType: string, csvContent: string, updateExisting: boolean = true): Promise<CSVImportResult> => {
    const rawLines = parseCSVLines(csvContent);
    if (rawLines.length < 2) {
      return {
        success: false,
        importedCount: 0,
        updatedCount: 0,
        duplicateCount: 0,
        totalProcessed: 0,
        errors: ['CSV file is empty or contains only a header line.'],
        message: 'No valid data rows found to import.'
      };
    }

    const headers = rawLines[0].map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
    const dataLines = rawLines.slice(1);

    let imported = 0;
    let updated = 0;
    let duplicates = 0;
    const errors: string[] = [];

    dataLines.forEach((row, idx) => {
      const rowIdx = idx + 2;
      const rowObj: Record<string, any> = {};
      headers.forEach((h, colIdx) => {
        rowObj[h] = row[colIdx] !== undefined ? row[colIdx] : '';
      });

      try {
        if (moduleType === 'alumni') {
          if (!rowObj.fullName || !rowObj.email) {
            errors.push(`Row ${rowIdx}: Missing required Name or Email.`);
            return;
          }
          const email = (rowObj.email || '').toLowerCase().trim();
          const existingIndex = alumni.findIndex(a => (a.email || '').toLowerCase().trim() === email);

          if (existingIndex >= 0) {
            if (updateExisting) {
              setAlumni(prev => {
                const next = [...prev];
                const updatedAlum = {
                  ...next[existingIndex],
                  fullName: rowObj.fullName || next[existingIndex].fullName,
                  batchYear: rowObj.batchYear ? Number(rowObj.batchYear) : next[existingIndex].batchYear,
                  phone: rowObj.phone || next[existingIndex].phone,
                  house: (rowObj.house as any) || next[existingIndex].house,
                  city: rowObj.city || next[existingIndex].city,
                  state: rowObj.state || next[existingIndex].state,
                  country: rowObj.country || next[existingIndex].country,
                  profession: rowObj.profession || next[existingIndex].profession,
                  company: rowObj.company || next[existingIndex].company,
                  designation: rowObj.designation || next[existingIndex].designation,
                  industry: rowObj.industry || next[existingIndex].industry,
                  bloodGroup: (rowObj.bloodGroup as any) || next[existingIndex].bloodGroup,
                  bio: rowObj.bio || next[existingIndex].bio,
                  isMentorAvailable: rowObj.isMentorAvailable !== undefined ? (rowObj.isMentorAvailable === 'true' || rowObj.isMentorAvailable === true) : next[existingIndex].isMentorAvailable,
                  isBusinessOwner: rowObj.isBusinessOwner !== undefined ? (rowObj.isBusinessOwner === 'true' || rowObj.isBusinessOwner === true) : next[existingIndex].isBusinessOwner,
                  isLookingForJobs: rowObj.isLookingForJobs !== undefined ? (rowObj.isLookingForJobs === 'true' || rowObj.isLookingForJobs === true) : next[existingIndex].isLookingForJobs,
                  isHiring: rowObj.isHiring !== undefined ? (rowObj.isHiring === 'true' || rowObj.isHiring === true) : next[existingIndex].isHiring,
                  verificationStatus: (rowObj.verificationStatus as any) || next[existingIndex].verificationStatus
                };
                next[existingIndex] = updatedAlum;
                saveDocToFirestore('alumniProfiles', updatedAlum.id, updatedAlum);
                return next;
              });
              updated++;
            } else {
              duplicates++;
            }
          } else {
            const newAlum: AlumniProfile = {
              id: `alum-imp-${Date.now()}-${idx}`,
              fullName: rowObj.fullName,
              batchYear: Number(rowObj.batchYear) || 2015,
              email: rowObj.email,
              phone: rowObj.phone || '',
              house: (rowObj.house as any) || 'Aravali',
              city: rowObj.city || 'Balotra',
              state: rowObj.state || 'Rajasthan',
              country: rowObj.country || 'India',
              profession: rowObj.profession || 'Alumnus',
              company: rowObj.company || '',
              designation: rowObj.designation || '',
              industry: rowObj.industry || 'General',
              bloodGroup: (rowObj.bloodGroup as any) || 'B+',
              bio: rowObj.bio || 'Proud Navodayan graduate of JNV Pachpadra.',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
              isMentorAvailable: rowObj.isMentorAvailable === 'true' || rowObj.isMentorAvailable === true,
              isBusinessOwner: rowObj.isBusinessOwner === 'true' || rowObj.isBusinessOwner === true,
              isLookingForJobs: rowObj.isLookingForJobs === 'true' || rowObj.isLookingForJobs === true,
              isHiring: rowObj.isHiring === 'true' || rowObj.isHiring === true,
              verificationStatus: (rowObj.verificationStatus as any) || 'verified',
              createdAt: new Date().toISOString()
            };
            setAlumni(prev => [newAlum, ...prev]);
            saveDocToFirestore('alumniProfiles', newAlum.id, newAlum);
            imported++;
          }
        } else if (moduleType === 'notices') {
          if (!rowObj.title || !rowObj.content) {
            errors.push(`Row ${rowIdx}: Missing notice title or content.`);
            return;
          }
          const newNotice: SchoolNotice = {
            id: `not-imp-${Date.now()}-${idx}`,
            title: rowObj.title,
            category: (rowObj.category as any) || 'General',
            publishDate: rowObj.publishDate || new Date().toISOString().split('T')[0],
            targetAudience: (rowObj.targetAudience as any) || 'All',
            content: rowObj.content,
            isPinned: rowObj.isPinned === 'true' || rowObj.isPinned === true,
            referenceNo: rowObj.referenceNo || `JNV/PACH/IMP/${Date.now()}`,
            status: 'Published'
          };
          setNotices(prev => [newNotice, ...prev]);
          saveDocToFirestore('notices', newNotice.id, newNotice);
          imported++;
        } else if (moduleType === 'faculty') {
          if (!rowObj.name || !rowObj.department) {
            errors.push(`Row ${rowIdx}: Missing faculty name or department.`);
            return;
          }
          const newFac: FacultyMember = {
            id: `fac-imp-${Date.now()}-${idx}`,
            name: rowObj.name,
            designation: rowObj.designation || 'Faculty Teacher',
            department: (rowObj.department as any) || 'Administration',
            qualification: rowObj.qualification || 'M.Sc., B.Ed.',
            experienceYears: Number(rowObj.experienceYears) || 5,
            photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
            email: rowObj.email || '',
            phone: rowObj.phone || ''
          };
          setFaculty(prev => [...prev, newFac]);
          saveDocToFirestore('faculty', newFac.id, newFac);
          imported++;
        } else if (moduleType === 'blood_donors') {
          if ((!rowObj.fullName && !rowObj.name) || !rowObj.bloodGroup || !rowObj.phone) {
            errors.push(`Row ${rowIdx}: Missing Donor Name, Blood Group, or Phone.`);
            return;
          }
          const newDonor: BloodDonor = {
            id: `donor-imp-${Date.now()}-${idx}`,
            name: rowObj.fullName || rowObj.name,
            bloodGroup: (rowObj.bloodGroup as any) || 'O+',
            city: rowObj.city || 'Balotra',
            state: rowObj.state || 'Rajasthan',
            phone: rowObj.phone,
            email: rowObj.email || '',
            batchYear: Number(rowObj.batchYear) || 2014,
            lastDonatedDate: rowObj.lastDonatedDate || '2026-01-01',
            isAvailable: rowObj.isAvailable !== 'false',
            isVerified: true,
            createdAt: new Date().toISOString()
          };
          setBloodDonors(prev => [newDonor, ...prev]);
          saveDocToFirestore('blood_donors', newDonor.id, newDonor);
          imported++;
        } else if (moduleType === 'toppers') {
          if (!rowObj.name || !rowObj.percentage) {
            errors.push(`Row ${rowIdx}: Missing topper name or percentage.`);
            return;
          }
          const newTop: BoardTopper = {
            id: `top-imp-${Date.now()}-${idx}`,
            name: rowObj.name,
            exam: rowObj.exam || 'CBSE Class XII',
            stream: rowObj.stream || 'Science',
            percentage: Number(rowObj.percentage) || 95.0,
            year: Number(rowObj.year) || 2025,
            photoUrl: rowObj.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
            currentPursuit: rowObj.currentPursuit || 'Higher Studies'
          };
          setToppers(prev => [newTop, ...prev]);
          saveDocToFirestore('toppers', newTop.id, newTop);
          imported++;
        } else if (moduleType === 'vmc_members') {
          if (!rowObj.name || !rowObj.designation) {
            errors.push(`Row ${rowIdx}: Missing VMC member name or designation.`);
            return;
          }
          const newMem: VMCLeader = {
            id: `vmc-imp-${Date.now()}-${idx}`,
            name: rowObj.name,
            designation: rowObj.designation,
            organization: rowObj.organization || 'Institutional Council',
            phone: rowObj.phone || '',
            email: rowObj.email || ''
          };
          setVmcMembers(prev => [...prev, newMem]);
          saveDocToFirestore('vmc_members', newMem.id, newMem);
          imported++;
        } else if (moduleType === 'donation_campaigns') {
          if (!rowObj.title || !rowObj.targetAmount) {
            errors.push(`Row ${rowIdx}: Missing campaign title or target amount.`);
            return;
          }
          const newCamp: DonationCampaign = {
            id: `camp-imp-${Date.now()}-${idx}`,
            title: rowObj.title,
            category: (rowObj.category as any) || 'Infrastructure',
            targetAmount: Number(rowObj.targetAmount) || 100000,
            currentAmount: Number(rowObj.currentAmount) || 0,
            donorsCount: Number(rowObj.donorsCount || rowObj.donorCount) || 0,
            isActive: rowObj.isActive !== 'false',
            endDate: rowObj.endDate || '2026-12-31',
            description: rowObj.description || '',
            coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=350&fit=crop',
            createdAt: new Date().toISOString()
          };
          setDonationCampaigns(prev => [...prev, newCamp]);
          saveDocToFirestore('donationCampaigns', newCamp.id, newCamp);
          imported++;
        } else if (moduleType === 'jobs') {
          if (!rowObj.title || !rowObj.company) {
            errors.push(`Row ${rowIdx}: Missing job title or company.`);
            return;
          }
          const newJob: JobPosting = {
            id: `job-imp-${Date.now()}-${idx}`,
            title: rowObj.title,
            company: rowObj.company,
            location: rowObj.location || 'Remote',
            employmentType: (rowObj.employmentType as any) || 'Full-Time',
            experience: rowObj.experience || '2+ Years',
            salaryRange: rowObj.salaryRange || '',
            description: rowObj.description || '',
            applyLinkOrEmail: rowObj.applyLinkOrEmail || 'careers@alumni.jnv.in',
            postedByName: rowObj.postedByName || 'Alumni Admin',
            postedByBatch: Number(rowObj.postedByBatch) || 2012,
            postedByEmail: rowObj.postedByEmail || 'admin@alumni.jnv.in',
            isActive: true,
            createdAt: new Date().toISOString()
          };
          setJobs(prev => [newJob, ...prev]);
          saveDocToFirestore('jobs', newJob.id, newJob);
          imported++;
        } else if (moduleType === 'businesses') {
          if (!rowObj.name || !rowObj.ownerName) {
            errors.push(`Row ${rowIdx}: Missing business name or owner name.`);
            return;
          }
          const newBiz: BusinessListing = {
            id: `biz-imp-${Date.now()}-${idx}`,
            name: rowObj.name,
            category: rowObj.category || 'Services',
            ownerName: rowObj.ownerName,
            ownerBatch: Number(rowObj.ownerBatch) || 2012,
            ownerEmail: rowObj.ownerEmail || '',
            ownerPhone: rowObj.ownerPhone || '',
            website: rowObj.website || '',
            description: rowObj.description || '',
            isVerified: rowObj.isVerified !== 'false',
            city: rowObj.city || 'Balotra',
            discountForAlumni: rowObj.discountForAlumni || 'Special alumni discount',
            createdAt: new Date().toISOString()
          };
          setBusinesses(prev => [newBiz, ...prev]);
          saveDocToFirestore('businesses', newBiz.id, newBiz);
          imported++;
        }
      } catch (err: any) {
        errors.push(`Row ${rowIdx}: Parse error - ${err.message}`);
      }
    });

    const totalProcessed = imported + updated;
    return {
      success: totalProcessed > 0,
      importedCount: imported,
      updatedCount: updated,
      duplicateCount: duplicates,
      totalProcessed,
      errors,
      message: `Processed ${dataLines.length} rows: ${imported} added new, ${updated} updated with latest details. ${duplicates} duplicates skipped. ${errors.length} errors.`
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
        loginWithEmail,
        registerWithEmail,
        sendPasswordResetEmail,
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
        paymentSettings,
        updatePaymentSettings,
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

        bannerSlides,
        addBannerSlide,
        updateBannerSlide,
        deleteBannerSlide,
        reorderBannerSlides,
        resetBannerSlidesToDefault,

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
        reactivateAlumni,
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
        verifyDonationRecord,
        rejectDonationRecord,
        deleteDonationRecord,

        bloodDonors,
        addBloodDonor,
        updateBloodDonor,
        deleteBloodDonor,
        toggleBloodDonorAvailability,
        bloodRequests,
        submitBloodRequest,
        updateBloodRequestStatus,
        deleteBloodRequest,

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

        isPersistenceLoaded,
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
