export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export type HouseType = 'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaygiri' | 'All';

export type UserRole = 'super_admin' | 'principal' | 'alumni_manager' | 'election_officer' | 'auditor' | 'alumnus' | 'guest';

export interface RolePermission {
  id: string;
  role: UserRole;
  name: string;
  permissions: string[];
  description: string;
}

export interface AlumniProfile {
  id: string;
  userId?: string;
  fullName: string;
  avatar?: string;
  batchYear: number; // e.g. 2012
  house?: 'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaygiri';
  city: string;
  state: string;
  country: string;
  profession: string;
  company: string;
  designation: string;
  industry: string;
  bio: string;
  linkedIn?: string;
  website?: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  isMentorAvailable: boolean;
  isBusinessOwner: boolean;
  isLookingForJobs: boolean;
  isHiring: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'deactivated';
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface BatchInfo {
  id: string;
  passoutYear: number;
  batchName: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail?: string;
  description: string;
  batchPhoto: string;
  totalStudents: number;
  motto: string;
  whatsappGroupLink?: string;
}

export interface BusinessListing {
  id: string;
  name: string;
  category: string;
  ownerName: string;
  ownerBatch: number;
  ownerEmail: string;
  ownerPhone: string;
  website?: string;
  description: string;
  isVerified: boolean;
  city: string;
  discountForAlumni?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Remote' | 'Internship';
  experience: string;
  salaryRange?: string;
  description: string;
  applyLinkOrEmail: string;
  postedByName: string;
  postedByBatch: number;
  postedByEmail: string;
  isActive: boolean;
  createdAt: string;
}

export interface WelfareCase {
  id: string;
  title: string;
  beneficiary: string;
  beneficiaryBatch?: number;
  urgency: 'Immediate' | 'High' | 'Normal';
  description: string;
  amountRequired: number;
  amountRaised: number;
  status: 'Active' | 'Funded' | 'Closed';
  verifiedBy: string;
  upiId: string;
  bankDetails: string;
  createdAt: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  category: 'Infrastructure' | 'Scholarship' | 'Emergency Welfare' | 'Alumni Meet' | 'Sports Kit';
  description: string;
  targetAmount: number;
  currentAmount: number;
  donorsCount: number;
  endDate: string;
  isActive: boolean;
  coverImage?: string;
  createdAt: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  batchYear: number;
  city: string;
  state: string;
  phone: string;
  email: string;
  lastDonatedDate?: string;
  isAvailable: boolean;
  isVerified: boolean;
  emergencyContactNote?: string;
  createdAt: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  city: string;
  contactPerson: string;
  contactPhone: string;
  urgency: 'Immediate' | 'Within 24 Hours' | 'Planned';
  status: 'OPEN' | 'FULFILLED' | 'CLOSED';
  verifiedByNavodaya: boolean;
  notes?: string;
  createdAt: string;
}

export type PaymentStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_VERIFIED'
  | 'FAILED'
  | 'REFUNDED'
  | 'SUCCESS'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED';

export type Compliance80GStatus =
  | 'NOT_APPLICABLE'
  | '80G_ELIGIBLE'
  | '80G_PROCESSED'
  | 'FORM_10BE_PENDING'
  | 'FORM_10BE_COMPLETED';

export interface DonationRecord {
  id: string;
  campaignId?: string;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
  maskedPan?: string;
  donorBatch?: number;
  amount: number;
  paymentMode: 'UPI' | 'Card' | 'NetBanking' | 'Direct Bank Transfer' | 'Cash / Cheque';
  transactionRef: string;
  receiptNumber: string;
  taxExempt80GRegNo: string;
  paymentStatus: PaymentStatus;
  compliance80GStatus?: Compliance80GStatus;
  complianceNotes?: string;
  isAnonymous: boolean;
  note?: string;
  receiptImageUrl?: string;
  rejectionReason?: string;
  paymentGatewayOrderId?: string;
  paymentGatewayPaymentId?: string;
  paymentGatewaySignature?: string;
  isVerifiedByGateway?: boolean;
  gatewayProvider?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface PaymentSettings {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode?: string;
  branchName: string;
  upiId: string;
  upiQrImageUrl?: string;
  paymentInstructions: string;
  donationContactEmail: string;
  donationContactPhone: string;
  currency: string;
  minDonationAmount: number;
  maxDonationAmount?: number;
  enableUpi: boolean;
  enableBankTransfer: boolean;
  enablePaymentGateway: boolean;
  enableCards?: boolean;
  enableNetbanking?: boolean;
  enableManualOther: boolean;
  reg80GNumber: string;
  taxBenefitPercentage: number;
  // Gateway configuration
  activeGateway?: 'razorpay' | 'cashfree' | 'stripe' | 'payu' | 'phonepe' | 'custom_upi';
  gatewayMode?: 'test' | 'live';
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayWebhookSecret?: string;
  cashfreeAppId?: string;
  cashfreeSecretKey?: string;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  payuMerchantKey?: string;
  payuMerchantSalt?: string;
  phonepeMerchantId?: string;
  phonepeSaltKey?: string;
  phonepeSaltIndex?: string;
  // Payment success & failure settings
  successRedirectUrl?: string;
  successCustomMessage?: string;
  failureRedirectUrl?: string;
  failureCustomMessage?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  platformFeePercentage?: number;
  updatedAt: string;
}

export type FinancialVisibility = 'public' | 'alumni_only' | 'admin_only';

export interface FinancialReport {
  id: string;
  title: string;
  financialYear: string;
  category: 'Annual Audit Report' | 'Balance Sheet' | 'Income & Expenditure' | 'Utilization Certificate' | 'Alumni Welfare Statement';
  reportSummary: string;
  fileUrl?: string;
  visibility: FinancialVisibility;
  publishedDate: string;
  auditorName: string;
  amountAudited?: number;
  status: 'Published' | 'Draft' | 'Archived';
}

export interface FinancialTransaction {
  id: string;
  transactionId: string;
  type: 'CREDIT' | 'DEBIT';
  category: 'Donations' | 'Welfare Disbursement' | 'Event Expense' | 'Scholarship' | 'Administrative' | 'Campus Infrastructure' | 'Student Assistance';
  amount: number;
  description: string;
  date: string;
  visibility: FinancialVisibility;
  auditedBy: string;
  payeeOrDonor?: string;
  receiptUrl?: string;
}

export interface SchoolNotice {
  id: string;
  title: string;
  category: 'General' | 'Academic' | 'Admission' | 'Tender' | 'Examination' | 'Press Release' | 'Alumni';
  publishDate: string;
  isPinned: boolean;
  attachmentUrl?: string;
  content: string;
  targetAudience: 'All' | 'Students' | 'Parents' | 'Staff' | 'Alumni';
  referenceNo?: string;
  status: 'Published' | 'Draft';
}

export interface AlumniEvent {
  id: string;
  title: string;
  category: 'Reunion' | 'Webinar' | 'Chapter Meet' | 'Sports' | 'Cultural' | 'Academic' | 'Celebration';
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  isAlumniEvent?: boolean;
  maxCapacity?: number;
  meetingLink?: string;
  description: string;
  registeredCount: number;
  image?: string;
  isRegistered?: boolean;
  status?: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface EventRSVP {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  userBatch?: number;
  status: 'Going' | 'Maybe' | 'Not Going';
  guestCount: number;
  notes?: string;
  phone?: string;
  createdAt: string;
}

export interface ElectionCandidate {
  id: string;
  name: string;
  batch: number;
  profession: string;
  city: string;
  manifesto: string;
  avatar: string;
  votes: number;
  email?: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface ElectionPosition {
  id: string;
  title: string;
  description: string;
  eligibilityRequirement?: string;
  candidates: ElectionCandidate[];
}

export interface ElectionNomination {
  id: string;
  electionId: string;
  positionId: string;
  positionTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  batch: number;
  profession: string;
  city: string;
  manifesto: string;
  avatar?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  adminNote?: string;
}

export interface ElectionVote {
  id: string;
  electionId: string;
  positionId: string;
  candidateId: string;
  voterUid: string;
  voterEmail: string;
  voterBatch: number;
  timestamp: string;
}

export interface ElectionAuditLog {
  id: string;
  electionId: string;
  action: 'ELECTION_CREATED' | 'NOMINATION_SUBMITTED' | 'NOMINATION_APPROVED' | 'NOMINATION_REJECTED' | 'VOTE_CAST' | 'ELECTION_CLOSED' | 'ELECTION_EDITED';
  actorName: string;
  actorEmail: string;
  details: string;
  timestamp: string;
}

export type SystemAuditAction =
  | 'login_access'
  | 'role_change'
  | 'user_moderation'
  | 'donation_created'
  | 'payment_verified'
  | 'receipt_generated'
  | 'compliance_update'
  | 'financial_change'
  | 'election_change'
  | 'cms_change'
  | 'bulk_import'
  | 'security_event';

export interface SystemAuditLog {
  id: string;
  action: SystemAuditAction;
  actorEmail: string;
  actorRole?: string;
  actorName?: string;
  targetId?: string;
  targetCollection?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface Election {
  id: string;
  title: string;
  term: string;
  status: 'UPCOMING' | 'ACTIVE' | 'CONCLUDED';
  startDate: string;
  endDate: string;
  totalVotesCast: number;
  positions: ElectionPosition[];
  eligibilityNote?: string;
}

export interface AlumniMemory {
  id: string;
  title: string;
  caption: string;
  year: number;
  house: 'Aravali' | 'Nilgiri' | 'Shivalik' | 'Udaygiri' | 'Campus';
  submittedByName: string;
  submittedByBatch: number;
  imageUrl: string;
  likesCount: number;
  isApproved: boolean;
  createdAt: string;
  liked?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  alumniName: string;
  batchYear: number;
  category: 'Civil Services' | 'Defense Forces' | 'Medical' | 'Engineering & Tech' | 'Entrepreneurship' | 'Sports' | 'Academia';
  description: string;
  award?: string;
  imageUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: 'Administration' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'Computer Science' | 'Social Science' | 'Hindi' | 'English' | 'Art & Music' | 'Physical Education';
  qualification: string;
  experienceYears: number;
  photoUrl: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus & Infrastructure' | 'Academics & Labs' | 'Sports & Yoga' | 'Cultural & Arts' | 'Hostel Life' | 'Alumni Meets' | 'Events';
  imageUrl: string;
  caption?: string;
  date: string;
}

export interface AdmissionEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  classSeeking: 'Class VI (JNVST)' | 'Class IX (Lateral Entry)' | 'Class XI (Lateral Entry)';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  gender: 'Boys' | 'Girls';
  ruralQuota: boolean;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface UserAuth {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  role?: UserRole;
  profile?: AlumniProfile;
}

export interface BoardTopper {
  id: string;
  name: string;
  exam: string;
  stream: string;
  percentage: number;
  year: number;
  photoUrl: string;
  currentPursuit: string;
}

export interface VMCLeader {
  id: string;
  name: string;
  designation: string;
  organization: string;
  phone?: string;
  email?: string;
}

export interface HouseInfo {
  id: string;
  name: HouseType;
  color: string;
  motto: string;
  points: number;
  description: string;
  houseMaster?: string;
  captain?: string;
}

export interface SchoolSettings {
  schoolName: string;
  cbseAffiliationNo: string;
  schoolCode: string;
  foundedYear: number;
  tagline: string;
  tickerAnnouncement: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  phonePrimary: string;
  phoneSecondary?: string;
  emailOfficial: string;
  emailAdmissions: string;
  principalName: string;
  principalDesignation: string;
  principalQualifications: string;
  principalMessage: string;
  principalPhoto: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  visionText?: string;
  missionText?: string;
  aboutOverview?: string;
  migrationPartnerJNV?: string;
  paceSettingActivities?: string;
  campusAcres: number;
  smartClassrooms: number;
  scienceLabs: number;
  libraryBooks: number;
  studentStrength: number;
  migrationState: string;
  jnvstExamDate: string;
  jnvstLastDate: string;
  lateralEntryStatus: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
  upiId: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  titleHindi?: string;
  subtitle: string;
  subtitleHindi?: string;
  badgeText?: string;
  badgeTextHindi?: string;
  imageUrl: string;
  ctaText?: string;
  ctaTextHindi?: string;
  ctaLink?: string; // Tab identifier like 'admissions', 'alumni', 'events', 'gallery', 'about', or custom URL
  secondaryCtaText?: string;
  secondaryCtaTextHindi?: string;
  secondaryCtaLink?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface CSVImportResult {
  success: boolean;
  importedCount: number;
  updatedCount: number;
  duplicateCount: number;
  totalProcessed: number;
  errors: string[];
  message: string;
}

