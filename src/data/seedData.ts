import {
  AlumniProfile,
  BatchInfo,
  BusinessListing,
  JobPosting,
  WelfareCase,
  DonationCampaign,
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
  RolePermission,
  PageContent,
  SchoolSettings,
  BoardTopper,
  VMCLeader,
  HouseInfo
} from '../types';

export const SEED_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'Jawahar Navodaya Vidyalaya, Pachpadra',
  cbseAffiliationNo: '1730058',
  schoolCode: '14002',
  foundedYear: 1993,
  tagline: 'Pragyanam Brahma - Nurturing Rural Talent, Inspiring National Excellence',
  tickerAnnouncement: '⚡ JNVST Class VI Entrance Registrations Open for 2026-27 | 🏆 100% Pass Percentage in CBSE Class X & XII Board Results | 🎓 Annual Alumni Global Convention scheduled for December',
  address: 'Post Pachpadra, Tehsil Pachpadra, District Barmer',
  district: 'Barmer',
  state: 'Rajasthan',
  pincode: '344032',
  phonePrimary: '+91 2986 222110',
  phoneSecondary: '+91 94140 12345',
  emailOfficial: 'jnvpachpadra-barmer@gov.in',
  emailAdmissions: 'admissions.jnvpachpadra@gmail.com',
  principalName: 'Shri Ram Kishore Meena',
  principalDesignation: 'Principal & Head of Institution',
  principalQualifications: 'M.Sc. (Physics), M.Ed., UGC-NET',
  principalMessage: 'Welcome to Jawahar Navodaya Vidyalaya, Pachpadra (Barmer). For over three decades, this sanctuary of learning in the heart of western Rajasthan has transformed the lives of talented rural youth, fostering academic excellence, national integration, and ethical leadership.',
  principalPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&h=600&fit=crop',
  heroHeadline: 'Nurturing Rural Talent, Inspiring National Excellence',
  heroSubheadline: 'Premier Autonomous Residential Co-Educational Institution',
  heroDescription: 'Jawahar Navodaya Vidyalaya, Pachpadra (District Barmer, Rajasthan) is dedicated to providing modern, high-quality, free residential education to talented rural children. Established in 1993 under Navodaya Vidyalaya Samiti, Ministry of Education, Govt. of India.',
  visionText: 'To provide high-quality modern education—including a strong component of culture, inculcation of values, awareness of the environment, adventure activities, and physical education—to talented children predominantly from rural areas without regard to their family’s socio-economic condition.',
  missionText: 'To serve in each district as a pace-setting institution, fostering national integration through 30% student migration between Hindi and non-Hindi speaking states, cultivating bilingual and multilingual competence, and equipping rural youth to compete with the best urban schools globally.',
  aboutOverview: 'Spread across 32 acres of serene, lush green expanse in Pachpadra, Barmer (Rajasthan), Jawahar Navodaya Vidyalaya is a premier co-educational residential school fully funded by the Ministry of Education, Government of India. Operating under the autonomous Navodaya Vidyalaya Samiti, the institution stands as an oasis of intellectual brilliance, social harmony, and holistic character building.',
  migrationPartnerJNV: 'JNV Rewa, Madhya Pradesh (Bhopal Region)',
  paceSettingActivities: 'Organizing inter-school science congresses, teacher development workshops for local rural schools, cleanliness & tree plantation drives, and disaster management drills.',
  campusAcres: 32,
  smartClassrooms: 18,
  scienceLabs: 4,
  libraryBooks: 8500,
  studentStrength: 540,
  migrationState: 'JNV Rewa (Madhya Pradesh)',
  jnvstExamDate: 'April 11, 2026',
  jnvstLastDate: 'September 15, 2025',
  lateralEntryStatus: 'Open for Class IX & XI',
  bankAccountName: 'JNV Pachpadra Alumni Welfare Association',
  bankName: 'State Bank of India',
  bankAccountNumber: '38920194820',
  bankIfsc: 'SBIN0031204',
  bankBranch: 'Pachpadra Town Branch',
  upiId: 'jnvpaa@sbi'
};

export const SEED_ALUMNI: AlumniProfile[] = [
  {
    id: 'alum-1',
    fullName: 'Dr. Prakash Rathore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    batchYear: 2008,
    house: 'Aravali',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    profession: 'Senior Cardiologist & Assistant Professor',
    company: 'SMS Medical College & Hospital',
    designation: 'MD, DM (Cardiology)',
    industry: 'Healthcare & Medicine',
    bio: 'Proud Navodayan from Aravali House, Batch 2008. Dedicated to rural healthcare accessibility and guiding Navodaya students for NEET-UG & PG medical careers.',
    linkedIn: 'https://linkedin.com/in/prakash-rathore-md',
    email: 'prakashinfosys1234@gmail.com',
    phone: '+91 98290 12345',
    bloodGroup: 'O+',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: false,
    verificationStatus: 'verified',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'alum-2',
    fullName: 'Sunita Choudhary, IAS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    batchYear: 2005,
    house: 'Nilgiri',
    city: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    profession: 'Civil Servant',
    company: 'Government of Rajasthan',
    designation: 'Special Secretary (Rural Development)',
    industry: 'Public Administration',
    bio: 'JNV Pachpadra batch of 2005. Cleared UPSC CSE in 2011. Passionate about women empowerment, rural education, and mentoring aspirants from underprivileged backgrounds.',
    linkedIn: 'https://linkedin.com/in/sunita-choudhary-ias',
    email: 'sunita.ias@rajasthan.gov.in',
    phone: '+91 94140 54321',
    bloodGroup: 'B+',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: false,
    verificationStatus: 'verified',
    createdAt: '2024-01-10T12:00:00Z'
  },
  {
    id: 'alum-3',
    fullName: 'Vikram Singh Shekhawat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    batchYear: 2012,
    house: 'Shivalik',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    profession: 'Staff Software Architect',
    company: 'Google Cloud India',
    designation: 'Tech Lead - Distributed Systems',
    industry: 'Information Technology',
    bio: 'IIT Bombay Alum, Shivalik House 2012. Mentoring Navodaya coders for JEE Advanced, ICPC, and FAANG tech interviews. Open to hiring interns & freshers.',
    linkedIn: 'https://linkedin.com/in/vikram-singh-jnv',
    website: 'https://vikramshekhawat.dev',
    email: 'vikram.shekhawat@google.com',
    phone: '+91 98450 88231',
    bloodGroup: 'AB+',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: true,
    verificationStatus: 'verified',
    createdAt: '2024-02-01T08:30:00Z'
  },
  {
    id: 'alum-4',
    fullName: 'Major Arvind Kumar Soni',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    batchYear: 2006,
    house: 'Udaygiri',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    profession: 'Indian Army Officer',
    company: 'Corps of Engineers',
    designation: 'Major, Sena Medal',
    industry: 'Defense & National Security',
    bio: 'NDA 118 Course, Udaygiri House Captain 2005-06. Guiding NDA / CDS / AFCAT aspirants across all Navodayas in Rajasthan.',
    linkedIn: 'https://linkedin.com/in/maj-arvind-soni',
    email: 'arvind.soni.army@nic.in',
    bloodGroup: 'A+',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: false,
    verificationStatus: 'verified',
    createdAt: '2024-02-10T14:20:00Z'
  },
  {
    id: 'alum-5',
    fullName: 'Pooja Vishnoi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    batchYear: 2015,
    house: 'Aravali',
    city: 'Barmer',
    state: 'Rajasthan',
    country: 'India',
    profession: 'Founder & Managing Director',
    company: 'Marwar Agro Greens & Solar Energy',
    designation: 'Co-Founder & CEO',
    industry: 'Renewable Energy & Agrotech',
    bio: 'Building green solar pumps and agrotech solutions in western Rajasthan. Offering 15% discount and priority vendor contracts for Navodaya alumni businesses.',
    linkedIn: 'https://linkedin.com/in/pooja-vishnoi-marwar',
    website: 'https://marwaragro.in',
    email: 'pooja@marwaragro.in',
    phone: '+91 94141 99221',
    bloodGroup: 'O-',
    isMentorAvailable: true,
    isBusinessOwner: true,
    isLookingForJobs: false,
    isHiring: true,
    verificationStatus: 'verified',
    createdAt: '2024-02-18T16:00:00Z'
  },
  {
    id: 'alum-6',
    fullName: 'Mahesh Bhati',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces',
    batchYear: 2018,
    house: 'Nilgiri',
    city: 'Pachpadra',
    state: 'Rajasthan',
    country: 'India',
    profession: 'Senior Refinery Operations Engineer',
    company: 'HPCL Rajasthan Refinery Ltd (HRRL Pachpadra)',
    designation: 'Process Automation Lead',
    industry: 'Petroleum & Energy',
    bio: 'Proud local alumnus working at the prestigious HRRL Refinery complex right next to our alma mater! Helping junior Navodayans with industrial training and internships.',
    linkedIn: 'https://linkedin.com/in/mahesh-bhati-hrrl',
    email: 'mahesh.bhati@hrrl.in',
    phone: '+91 96190 33412',
    bloodGroup: 'B+',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: false,
    verificationStatus: 'verified',
    createdAt: '2024-02-25T11:45:00Z'
  },
  {
    id: 'alum-7',
    fullName: 'Ananya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    batchYear: 2021,
    house: 'Shivalik',
    city: 'Pilani',
    state: 'Rajasthan',
    country: 'India',
    profession: 'Pre-Doctoral Researcher in AI',
    company: 'BITS Pilani',
    designation: 'Research Fellow',
    industry: 'Academia & AI Research',
    bio: 'Batch 2021 passout, currently working on Indic language LLMs. Mentoring current Class XI & XII students in Computer Science & Python.',
    email: 'ananya.ai@pilani.bits-pilani.ac.in',
    bloodGroup: 'A-',
    isMentorAvailable: true,
    isBusinessOwner: false,
    isLookingForJobs: false,
    isHiring: false,
    verificationStatus: 'pending',
    createdAt: '2024-03-01T09:10:00Z'
  },
  {
    id: 'alum-8',
    fullName: 'Devendra Kumar Saini',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    batchYear: 2010,
    house: 'Udaygiri',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    profession: 'Chartered Accountant & Tax Consultant',
    company: 'Saini & Associates CA Firm',
    designation: 'Senior Partner',
    industry: 'Finance & Auditing',
    bio: 'Auditor for alumni welfare trusts and helping alumni ventures in GST, startup funding, and financial compliance.',
    email: 'ca.devendra@sainica.com',
    phone: '+91 97840 55112',
    bloodGroup: 'O+',
    isMentorAvailable: true,
    isBusinessOwner: true,
    isLookingForJobs: false,
    isHiring: true,
    verificationStatus: 'verified',
    createdAt: '2024-01-28T15:30:00Z'
  }
];

export const SEED_BATCHES: BatchInfo[] = [
  {
    id: 'batch-2008',
    passoutYear: 2008,
    batchName: 'The Pioneers of 2008',
    coordinatorName: 'Dr. Prakash Rathore',
    coordinatorPhone: '+91 98290 12345',
    coordinatorEmail: 'prakashinfosys1234@gmail.com',
    description: 'The vibrant Class of 2008! Over 8 doctors, 14 engineers, 5 civil servants, and several entrepreneurs representing JNV Pachpadra globally.',
    batchPhoto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=350&fit=crop',
    totalStudents: 74,
    motto: 'Leading with integrity and giving back to our roots.',
    whatsappGroupLink: 'https://chat.whatsapp.com/JNV2008Pachpadra'
  },
  {
    id: 'batch-2012',
    passoutYear: 2012,
    batchName: 'Titan Class of 2012',
    coordinatorName: 'Vikram Singh Shekhawat',
    coordinatorPhone: '+91 98450 88231',
    coordinatorEmail: 'vikram.shekhawat@google.com',
    description: 'Gold standard in sports and academics with multiple IIT/NIT selections and house championship winners.',
    batchPhoto: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=350&fit=crop',
    totalStudents: 80,
    motto: 'United by friendship, driven by innovation.',
    whatsappGroupLink: 'https://chat.whatsapp.com/JNV2012Titans'
  },
  {
    id: 'batch-2015',
    passoutYear: 2015,
    batchName: 'Shining Batch of 2015',
    coordinatorName: 'Pooja Vishnoi',
    coordinatorPhone: '+91 94141 99221',
    coordinatorEmail: 'pooja@marwaragro.in',
    description: 'Trailblazers of social welfare, renewable energy, and regional chapter coordination across Rajasthan.',
    batchPhoto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=350&fit=crop',
    totalStudents: 78,
    motto: 'Empowering communities through purposeful action.',
    whatsappGroupLink: 'https://chat.whatsapp.com/JNV2015Rising'
  },
  {
    id: 'batch-2018',
    passoutYear: 2018,
    batchName: 'Millennium Achievers 2018',
    coordinatorName: 'Mahesh Bhati',
    coordinatorPhone: '+91 96190 33412',
    coordinatorEmail: 'mahesh.bhati@hrrl.in',
    description: 'Active campus volunteers maintaining strong connections with teachers and school laboratory upgrades.',
    batchPhoto: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=350&fit=crop',
    totalStudents: 82,
    motto: 'Always standing by Navodaya with pride.',
    whatsappGroupLink: 'https://chat.whatsapp.com/JNV2018Achievers'
  }
];

export const SEED_NOTICES: SchoolNotice[] = [
  {
    id: 'not-1',
    title: 'Jawahar Navodaya Vidyalaya Selection Test (JNVST) 2026-27 Registration Open for Class VI',
    category: 'Admission',
    publishDate: '2026-08-10',
    isPinned: true,
    referenceNo: 'NVS/RO/JAIPUR/JNVST/2026/891',
    targetAudience: 'All',
    status: 'Published',
    content: 'Online applications are invited for admission to Class VI in Jawahar Navodaya Vidyalaya, Pachpadra (Dist. Barmer) through JNVST 2026-27. 75% seats are reserved for candidates from rural areas of Barmer district. Minimum 33% seats reserved for girls. No application fee. Apply online at navodaya.gov.in.'
  },
  {
    id: 'not-2',
    title: 'Schedule for CBSE Class X & XII Pre-Board Examination & Remedial Academic Sessions 2026',
    category: 'Examination',
    publishDate: '2026-08-05',
    isPinned: true,
    referenceNo: 'JNV/PACH/ACAD/2026/104',
    targetAudience: 'Students',
    status: 'Published',
    content: 'The first term Pre-Board examination for Classes X and XII Science & Commerce streams will commence from September 10, 2026. Special evening remedial doubt-clearing sessions in Physics, Chemistry, and Mathematics are scheduled daily in the Samsung Smart Classroom.'
  },
  {
    id: 'not-3',
    title: 'Tender Notice: Supply of Fresh Vegetables, Groceries & Milk for Vidyalaya Mess (Year 2026-27)',
    category: 'Tender',
    publishDate: '2026-07-28',
    isPinned: false,
    referenceNo: 'JNV/PACH/MESS/TENDER/2026/04',
    targetAudience: 'All',
    status: 'Published',
    content: 'Sealed tenders are invited from registered and reputed local suppliers for the supply of fresh fruits, vegetables, agmark certified groceries, and dairy for 550+ residential students for the academic session 2026-27. Last date for tender submission is August 25, 2026.'
  },
  {
    id: 'not-4',
    title: 'Grand Annual Alumni Homecoming & Silver Jubilee Meet 2026 - Registration Open',
    category: 'Alumni',
    publishDate: '2026-07-20',
    isPinned: true,
    referenceNo: 'JNVPAA/MEET/2026/01',
    targetAudience: 'Alumni',
    status: 'Published',
    content: 'The Executive Committee of JNV Pachpadra Alumni Association cordially invites all past students from batches 1995 through 2025 for the Grand Alumni Reunion on October 2, 2026. Kindly RSVP online on the portal.'
  },
  {
    id: 'not-5',
    title: 'National Science Exhibition & STEM Club Project Selection Results',
    category: 'Academic',
    publishDate: '2026-07-15',
    isPinned: false,
    referenceNo: 'JNV/PACH/STEM/2026/18',
    targetAudience: 'Students',
    status: 'Published',
    content: 'Heartiest congratulations to Class XI Science students for qualifying for the Regional Level Navodaya Science Congress with their project on "Automated Drip Irrigation with Solar Micro-Pumps for Thar Desert Farming".'
  }
];

export const SEED_FACULTY: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Shri Ram Kishore Meena',
    designation: 'Principal',
    department: 'Administration',
    qualification: 'M.Sc. (Physics), M.Ed., Gold Medalist',
    experienceYears: 26,
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    email: 'principal.jnvpachpadra@gmail.com',
    phone: '02988-223401',
    bio: 'Dedicated educationist with 26+ years of service in Navodaya Vidyalaya Samiti. Passionate about rural talent transformation, holistic residential education, and academic excellence.'
  },
  {
    id: 'fac-2',
    name: 'Shri Dinesh Chandra Sharma',
    designation: 'PGT Physics & Vice-Principal',
    department: 'Physics',
    qualification: 'M.Sc. (Physics), B.Ed., CSIR-NET',
    experienceYears: 18,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    email: 'dinesh.physics.jnv@gmail.com',
    bio: 'National Teacher Award nominee, mentoring students in Physics Olympiads, Robotics, and JEE Main & Advanced.'
  },
  {
    id: 'fac-3',
    name: 'Dr. Anita Choudhary',
    designation: 'PGT Chemistry',
    department: 'Chemistry',
    qualification: 'Ph.D. (Organic Chemistry), M.Sc., B.Ed.',
    experienceYears: 14,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
    email: 'anita.chem.jnv@gmail.com',
    bio: 'In-charge of Modern Chemical Laboratories and Eco-Club initiatives in Pachpadra.'
  },
  {
    id: 'fac-4',
    name: 'Shri Suresh Kumar Verma',
    designation: 'PGT Mathematics',
    department: 'Mathematics',
    qualification: 'M.Sc. (Applied Mathematics), B.Ed.',
    experienceYears: 16,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    email: 'suresh.maths.jnv@gmail.com',
    bio: 'Master trainer for CBSE Mathematics question bank and Vedic Mathematics workshop coordinator.'
  },
  {
    id: 'fac-5',
    name: 'Smt. Rekha Rajpurohit',
    designation: 'PGT Biology',
    department: 'Biology',
    qualification: 'M.Sc. (Botany), B.Ed.',
    experienceYears: 12,
    photoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&h=300&fit=crop',
    email: 'rekha.bio.jnv@gmail.com',
    bio: 'Guiding NEET-UG medical aspirants and supervisor of Botanical Garden on campus.'
  },
  {
    id: 'fac-6',
    name: 'Shri Gaurav Joshi',
    designation: 'PGT Computer Science & AI',
    department: 'Computer Science',
    qualification: 'MCA, M.Tech (CS), B.Ed.',
    experienceYears: 10,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    email: 'gaurav.cs.jnv@gmail.com',
    bio: 'In-charge of Computer Lab, Samsung Smart Class, AI Curriculum, and School Web Portal.'
  },
  {
    id: 'fac-7',
    name: 'Shri Bhanwar Lal Rathore',
    designation: 'Physical Education Teacher (PET)',
    department: 'Physical Education',
    qualification: 'M.P.Ed., NIS Coach (Athletics & Volleyball)',
    experienceYears: 20,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    email: 'pet.jnvpachpadra@gmail.com',
    bio: 'Trained over 40 National Navodaya Games Gold medalists in Volleyball, Athletics, and Kho-Kho.'
  }
];

export const SEED_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Majestic Main Academic Block & Central Courtyard',
    category: 'Campus & Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=500&fit=crop',
    caption: 'The heart of JNV Pachpadra spanning 30+ acres with lush green trees, spacious classrooms, and library.',
    date: '2026-07-15'
  },
  {
    id: 'gal-2',
    title: 'Samsung Smart Classroom & Computer Laboratory',
    category: 'Academics & Labs',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop',
    caption: 'State-of-the-art interactive digital boards and 40 high-speed computers for AI, Coding & STEM experiments.',
    date: '2026-06-20'
  },
  {
    id: 'gal-3',
    title: 'Annual Inter-House Volleyball Championship',
    category: 'Sports & Yoga',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=500&fit=crop',
    caption: 'Thrilling tournament finals between Aravali and Nilgiri houses with enthusiastic cheering from students.',
    date: '2026-05-10'
  },
  {
    id: 'gal-4',
    title: 'Rajasthani Folk Dance & Cultural Performance at Annual Day',
    category: 'Cultural & Arts',
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&h=500&fit=crop',
    caption: 'Students showcasing rich Marwari cultural heritage in colorful traditional attire.',
    date: '2026-04-12'
  },
  {
    id: 'gal-5',
    title: 'Sunday Morning Mess Gathering & Nutritious Breakfast',
    category: 'Hostel Life',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=500&fit=crop',
    caption: 'The wholesome residential community atmosphere fostering life-long bonds of brotherhood and sisterhood.',
    date: '2026-03-25'
  },
  {
    id: 'gal-6',
    title: 'Alumni Felicitation Ceremony & Career Guidance Workshop',
    category: 'Alumni Meets',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop',
    caption: 'Senior alumni returning to mentor Class XII aspirants in civil services, engineering, and medicine.',
    date: '2026-02-14'
  }
];

export const SEED_FINANCIAL_REPORTS: FinancialReport[] = [
  {
    id: 'rep-2025',
    title: 'Annual Audited Financial Statement & Balance Sheet FY 2024-25',
    financialYear: '2024-2025',
    category: 'Annual Audit Report',
    reportSummary: 'Complete statutory audit conducted by M/s S.K. Rathi & Associates, Chartered Accountants. Covers government grant utilization, alumni development donations, mess account, and infrastructure repairs with zero adverse remarks.',
    fileUrl: '#',
    visibility: 'public',
    publishedDate: '2025-06-30',
    auditorName: 'M/s S.K. Rathi & Associates (Chartered Accountants, Reg. 014522C)',
    amountAudited: 4850000,
    status: 'Published'
  },
  {
    id: 'rep-welfare-2025',
    title: 'Alumni Association Emergency Medical & Student Welfare Fund Audit 2024-25',
    financialYear: '2024-2025',
    category: 'Alumni Welfare Statement',
    reportSummary: 'Detailed statement of ₹8.45 Lakhs raised and disbursed towards medical treatment of alumni families and competitive exam scholarships for current students.',
    fileUrl: '#',
    visibility: 'alumni_only',
    publishedDate: '2025-07-15',
    auditorName: 'CA Devendra Saini (Batch 2010)',
    amountAudited: 845000,
    status: 'Published'
  },
  {
    id: 'rep-2024',
    title: 'Statutory Utilization Certificate & Audit Statement FY 2023-24',
    financialYear: '2023-2024',
    category: 'Utilization Certificate',
    reportSummary: 'Certified report on campus solar installation, RO water plant maintenance, and smart classroom digital equipment procurement.',
    fileUrl: '#',
    visibility: 'public',
    publishedDate: '2024-06-25',
    auditorName: 'Govt. Local Fund Audit Department, Barmer',
    amountAudited: 4210000,
    status: 'Published'
  }
];

export const SEED_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    transactionId: 'TXN-2026-0801',
    type: 'CREDIT',
    category: 'Donations',
    amount: 100000,
    description: 'Contribution for Smart Class AI Lab computers by Batch 2012',
    date: '2026-08-01',
    visibility: 'public',
    auditedBy: 'CA Devendra Saini',
    payeeOrDonor: 'Batch 2012 Alumni Collective',
    receiptUrl: '#'
  },
  {
    id: 'tx-2',
    transactionId: 'TXN-2026-0805',
    type: 'DEBIT',
    category: 'Scholarship',
    amount: 35000,
    description: 'Scholarship fee grant for Class XII student qualifying for IIT JEE Super 30 coaching',
    date: '2026-08-05',
    visibility: 'alumni_only',
    auditedBy: 'CA Devendra Saini',
    payeeOrDonor: 'Allen Career Institute Jodhpur (Direct RTGS)',
    receiptUrl: '#'
  },
  {
    id: 'tx-3',
    transactionId: 'TXN-2026-0720',
    type: 'CREDIT',
    category: 'Donations',
    amount: 50000,
    description: 'Corpus donation for Alumni Health Insurance & Emergency Fund by Dr. Prakash Rathore',
    date: '2026-07-20',
    visibility: 'public',
    auditedBy: 'CA Devendra Saini',
    payeeOrDonor: 'Dr. Prakash Rathore (Batch 2008)',
    receiptUrl: '#'
  },
  {
    id: 'tx-4',
    transactionId: 'TXN-2026-0715',
    type: 'DEBIT',
    category: 'Campus Infrastructure',
    amount: 42000,
    description: 'Procurement of High-Resolution Projector and Sound System for Central Auditorium',
    date: '2026-07-15',
    visibility: 'alumni_only',
    auditedBy: 'VMC Sub-Committee',
    payeeOrDonor: 'Sony Electronics Jodhpur',
    receiptUrl: '#'
  },
  {
    id: 'tx-5',
    transactionId: 'TXN-2026-0610',
    type: 'CREDIT',
    category: 'Donations',
    amount: 75000,
    description: 'Silver Jubilee Grand Alumni Meet Registration Sponsorships',
    date: '2026-06-10',
    visibility: 'public',
    auditedBy: 'CA Devendra Saini',
    payeeOrDonor: 'Multiple Alumni Sponsors',
    receiptUrl: '#'
  }
];

export const SEED_EVENTS: AlumniEvent[] = [
  {
    id: 'evt-1',
    title: 'Grand Annual Alumni Meet & Silver Jubilee 2026',
    category: 'Reunion',
    date: '2026-10-02',
    time: '09:00 AM - 06:00 PM IST',
    location: 'Main Auditorium & Amphitheatre, JNV Pachpadra Campus, Barmer',
    isOnline: false,
    isAlumniEvent: true,
    maxCapacity: 500,
    description: 'The signature homecoming gathering! Join 500+ Navodayans, respected retired and current teachers, cultural performances, Navodaya mess feast, and alumni awards gala.',
    registeredCount: 312,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=350&fit=crop',
    status: 'Upcoming'
  },
  {
    id: 'evt-2',
    title: 'Navodaya Tech & Startup Founders Webinar: From Pachpadra to Global Markets',
    category: 'Webinar',
    date: '2026-09-15',
    time: '06:00 PM - 07:30 PM IST',
    location: 'Google Meet / Live on YouTube',
    isOnline: true,
    isAlumniEvent: true,
    maxCapacity: 250,
    meetingLink: 'https://meet.google.com/jnv-pach-tech',
    description: 'Keynote by alumni tech leaders on how Navodaya hostel resilience helped them build high-growth startups and crack top engineering leadership roles.',
    registeredCount: 145,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=350&fit=crop',
    status: 'Upcoming'
  },
  {
    id: 'evt-3',
    title: 'Jaipur Chapter Dinner & Networking Evening',
    category: 'Chapter Meet',
    date: '2026-09-28',
    time: '07:30 PM IST',
    location: 'Rajasthan University Club Lawn, JLN Marg, Jaipur',
    isOnline: false,
    isAlumniEvent: true,
    maxCapacity: 120,
    description: 'Quarterly dinner meetup for all JNV Pachpadra alumni residing, studying, or working in Jaipur & NCR.',
    registeredCount: 88,
    image: 'https://images.unsplash.com/photo-1528605248656-1312a09cb32b?w=600&h=350&fit=crop',
    status: 'Upcoming'
  },
  {
    id: 'evt-4',
    title: 'Annual School Sports Meet & Athletics Championship 2026',
    category: 'Sports',
    date: '2026-11-14',
    time: '08:00 AM - 05:00 PM',
    location: 'School Sports Ground, JNV Pachpadra',
    isOnline: false,
    isAlumniEvent: false,
    description: 'Inter-house athletic events, sprint races, long jump, volleyball and tug-of-war championship.',
    registeredCount: 220,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=350&fit=crop',
    status: 'Upcoming'
  }
];

export const SEED_EVENT_RSVPS: EventRSVP[] = [
  {
    id: 'rsvp-1',
    eventId: 'evt-1',
    eventTitle: 'Grand Annual Alumni Meet & Silver Jubilee 2026',
    userId: 'alum-1',
    userEmail: 'prakashinfosys1234@gmail.com',
    userName: 'Dr. Prakash Rathore',
    userBatch: 2008,
    status: 'Going',
    guestCount: 2,
    phone: '+91 98290 12345',
    notes: 'Arriving by car from Jaipur on Oct 1 evening with batchmates.',
    createdAt: '2026-07-25T10:00:00Z'
  },
  {
    id: 'rsvp-2',
    eventId: 'evt-1',
    eventTitle: 'Grand Annual Alumni Meet & Silver Jubilee 2026',
    userId: 'alum-3',
    userEmail: 'vikram.shekhawat@google.com',
    userName: 'Vikram Singh Shekhawat',
    userBatch: 2012,
    status: 'Going',
    guestCount: 1,
    phone: '+91 98450 88231',
    notes: 'Looking forward to hosting the tech mentorship session.',
    createdAt: '2026-07-26T14:30:00Z'
  }
];

export const SEED_ELECTIONS: Election = {
  id: 'elec-2026',
  title: 'Executive Committee Elections 2026-2028',
  term: '2026 - 2028 (2 Years)',
  status: 'ACTIVE',
  startDate: '2026-08-01',
  endDate: '2026-09-01',
  totalVotesCast: 428,
  eligibilityNote: 'All registered and verified alumni from batches 1995-2024 are eligible to cast 1 vote per position.',
  positions: [
    {
      id: 'pos-1',
      title: 'President (JNVPAA)',
      description: 'Chief Executive officer representing the alumni body, coordinating with NVS HQ, and steering welfare programs.',
      eligibilityRequirement: 'Minimum 10 years post-passout experience with active alumni association membership.',
      candidates: [
        {
          id: 'cand-1',
          name: 'Dr. Prakash Rathore',
          batch: 2008,
          profession: 'Senior Cardiologist, SMS Medical College',
          city: 'Jaipur',
          manifesto: 'Focus on 100% digital transparency, creating ₹25 Lakh emergency healthcare corpus, and institutionalizing medical mentorship for school students.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
          votes: 246,
          status: 'APPROVED'
        },
        {
          id: 'cand-2',
          name: 'Kailash Chand Verma',
          batch: 2000,
          profession: 'Managing Partner, CA Firm',
          city: 'Mumbai',
          manifesto: 'Establish permanent registered alumni trust, setup Barmer city guest house for visiting alumni, and scale scholarship funds.',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop',
          votes: 182,
          status: 'APPROVED'
        }
      ]
    },
    {
      id: 'pos-2',
      title: 'General Secretary',
      description: 'Coordinates batch representatives, organizes annual meets, manages public relations and association chapters.',
      eligibilityRequirement: 'Minimum 5 years post-passout experience.',
      candidates: [
        {
          id: 'cand-3',
          name: 'Pooja Vishnoi',
          batch: 2015,
          profession: 'Founder, Marwar Agro Greens',
          city: 'Barmer',
          manifesto: 'Strengthening youth engagement, expanding alumni business discounts, and hosting quarterly regional sports tournaments.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
          votes: 280,
          status: 'APPROVED'
        },
        {
          id: 'cand-4',
          name: 'Mahesh Bhati',
          batch: 2018,
          profession: 'Operations Engineer, HRRL Refinery',
          city: 'Pachpadra',
          manifesto: 'Dedicated local campus liaison with current teachers and students, maintaining sports grounds and science clubs.',
          avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop',
          votes: 148,
          status: 'APPROVED'
        }
      ]
    }
  ]
};

export const SEED_NOMINATIONS: ElectionNomination[] = [
  {
    id: 'nom-1',
    electionId: 'elec-2026',
    positionId: 'pos-1',
    positionTitle: 'President (JNVPAA)',
    candidateId: 'cand-1',
    candidateName: 'Dr. Prakash Rathore',
    candidateEmail: 'prakashinfosys1234@gmail.com',
    batch: 2008,
    profession: 'Senior Cardiologist, SMS Medical College',
    city: 'Jaipur',
    manifesto: 'Focus on 100% digital transparency, creating ₹25 Lakh emergency healthcare corpus, and institutionalizing medical mentorship for school students.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    status: 'APPROVED',
    submittedAt: '2026-07-10T09:00:00Z',
    reviewedBy: 'Chief Election Officer',
    reviewedAt: '2026-07-15T12:00:00Z'
  },
  {
    id: 'nom-2',
    electionId: 'elec-2026',
    positionId: 'pos-2',
    positionTitle: 'General Secretary',
    candidateId: 'cand-3',
    candidateName: 'Pooja Vishnoi',
    candidateEmail: 'pooja@marwaragro.in',
    batch: 2015,
    profession: 'Founder, Marwar Agro Greens',
    city: 'Barmer',
    manifesto: 'Strengthening youth engagement, expanding alumni business discounts, and hosting quarterly regional sports tournaments.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    status: 'APPROVED',
    submittedAt: '2026-07-12T11:30:00Z',
    reviewedBy: 'Chief Election Officer',
    reviewedAt: '2026-07-15T14:00:00Z'
  }
];

export const SEED_AUDIT_LOGS: ElectionAuditLog[] = [
  {
    id: 'aud-1',
    electionId: 'elec-2026',
    action: 'ELECTION_CREATED',
    actorName: 'Election Officer',
    actorEmail: 'election.officer@jnv.in',
    details: 'Election created for term 2026-2028 with 2 executive positions: President and General Secretary.',
    timestamp: '2026-07-01T10:00:00Z'
  },
  {
    id: 'aud-2',
    electionId: 'elec-2026',
    action: 'NOMINATION_APPROVED',
    actorName: 'Election Officer',
    actorEmail: 'election.officer@jnv.in',
    details: 'Nomination for Dr. Prakash Rathore approved for position: President.',
    timestamp: '2026-07-15T12:00:00Z'
  },
  {
    id: 'aud-3',
    electionId: 'elec-2026',
    action: 'NOMINATION_APPROVED',
    actorName: 'Election Officer',
    actorEmail: 'election.officer@jnv.in',
    details: 'Nomination for Pooja Vishnoi approved for position: General Secretary.',
    timestamp: '2026-07-15T14:00:00Z'
  }
];

export const SEED_MEMORIES: AlumniMemory[] = [
  {
    id: 'mem-1',
    title: 'Aravali House Inter-House Volleyball Champions Trophy 2007',
    caption: 'Unforgettable finals against Nilgiri! That intense third set went to 28-26 under the floodlights. Still remember our house master celebrating with jalebis at the mess!',
    year: 2007,
    house: 'Aravali',
    submittedByName: 'Dr. Prakash Rathore',
    submittedByBatch: 2008,
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop',
    likesCount: 64,
    isApproved: true,
    createdAt: '2024-01-22T10:00:00Z'
  },
  {
    id: 'mem-2',
    title: 'Morning Assembly Prayer & National Anthem in Winter Mist',
    caption: 'Gathering at 7:30 AM in freezing Pachpadra winter, reciting "स नो भद्राः क्रतवो यन्तु विश्वतः" and news headlines in English & Hindi.',
    year: 2011,
    house: 'Campus',
    submittedByName: 'Vikram Singh Shekhawat',
    submittedByBatch: 2012,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
    likesCount: 92,
    isApproved: true,
    createdAt: '2024-02-05T14:15:00Z'
  },
  {
    id: 'mem-3',
    title: 'Special Sunday Mess Feast: Puri, Chole & Gulab Jamun',
    caption: 'Nothing in this world can beat the taste of Sunday lunch in Navodaya mess. Everyone rushing with their stainless steel thalis after games period!',
    year: 2016,
    house: 'Campus',
    submittedByName: 'Mahesh Bhati',
    submittedByBatch: 2018,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
    likesCount: 118,
    isApproved: true,
    createdAt: '2024-02-18T18:00:00Z'
  },
  {
    id: 'mem-4',
    title: 'Shivalik House Drama Rehearsal for Annual Cultural Night',
    caption: 'Practicing Rajasthani folk drama and skits till 11 PM in the dining hall under the supervision of Sharma Sir.',
    year: 2014,
    house: 'Shivalik',
    submittedByName: 'Sunita Choudhary',
    submittedByBatch: 2005,
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&h=400&fit=crop',
    likesCount: 53,
    isApproved: true,
    createdAt: '2024-03-01T09:30:00Z'
  }
];

export const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'UPSC Civil Services Examination (AIR 34)',
    alumniName: 'Sunita Choudhary, IAS',
    batchYear: 2005,
    category: 'Civil Services',
    description: 'Secured All India Rank 34 in UPSC CSE, currently serving as Special Secretary in the Government of Rajasthan.',
    award: 'President of India Gold Medal in Lal Bahadur Shastri National Academy of Administration (LBSNAA)',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    isApproved: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ach-2',
    title: 'Sena Medal for Gallantry in Counter-Terrorist Operations',
    alumniName: 'Major Arvind Kumar Soni',
    batchYear: 2006,
    category: 'Defense Forces',
    description: 'Awarded Sena Medal by the President of India for exceptional bravery and leadership in tactical reconnaissance missions.',
    award: 'Sena Medal (Gallantry)',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    isApproved: true,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'ach-3',
    title: 'Global Young Innovator Award in Distributed Computing',
    alumniName: 'Vikram Singh Shekhawat',
    batchYear: 2012,
    category: 'Engineering & Tech',
    description: 'Pioneered zero-latency consensus algorithms used in mission-critical cloud databases at Google Cloud.',
    award: 'IEEE Outstanding Engineer Award 2024',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    isApproved: true,
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'ach-4',
    title: 'Marwar Desert Green Entrepreneur Award',
    alumniName: 'Pooja Vishnoi',
    batchYear: 2015,
    category: 'Entrepreneurship',
    description: 'Built solar micro-grids bringing sustainable irrigation to over 4,000 farmers in the Barmer-Thar belt.',
    award: 'Rajasthan State Renewable Energy Excellence Award',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    isApproved: true,
    createdAt: '2024-02-01T00:00:00Z'
  }
];

export const SEED_BUSINESSES: BusinessListing[] = [
  {
    id: 'biz-1',
    name: 'Marwar Agro Greens & Solar Technologies',
    category: 'Renewable Energy & Agriculture',
    ownerName: 'Pooja Vishnoi',
    ownerBatch: 2015,
    ownerEmail: 'pooja@marwaragro.in',
    ownerPhone: '+91 94141 99221',
    website: 'https://marwaragro.in',
    description: 'Turnkey solar water pumps, micro-irrigation systems, and desert agro-forestry solutions in western Rajasthan.',
    isVerified: true,
    city: 'Barmer / Balotra',
    discountForAlumni: '15% Off on Solar installations & free consultation',
    logoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&h=150&fit=crop',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'biz-2',
    name: 'Saini & Associates Chartered Accountants',
    category: 'Taxation, Audit & Legal',
    ownerName: 'Devendra Kumar Saini, FCA',
    ownerBatch: 2010,
    ownerEmail: 'ca.devendra@sainica.com',
    ownerPhone: '+91 97840 55112',
    description: 'Corporate taxation, GST filings, startup valuation, and NGO/Trust audits across Rajasthan & Gujarat.',
    isVerified: true,
    city: 'Ahmedabad / Jaipur',
    discountForAlumni: 'Free 1-on-1 ITR & Startup structuring session',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&h=150&fit=crop',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export const SEED_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer (Cloud & React/Node)',
    company: 'Marwar Tech Labs / Google Partner',
    location: 'Remote / Jaipur Hybrid',
    employmentType: 'Full-Time',
    experience: '3-6 Years',
    salaryRange: '₹14 - ₹22 LPA',
    description: 'Looking for talented engineers to build scalable SaaS products. Navodaya alumni candidates will be given direct fast-track technical interview rounds.',
    applyLinkOrEmail: 'careers@marwartech.io',
    postedByName: 'Vikram Singh Shekhawat',
    postedByBatch: 2012,
    postedByEmail: 'vikram.shekhawat@google.com',
    isActive: true,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'job-2',
    title: 'Operations & Process Safety Engineer',
    company: 'HPCL Rajasthan Refinery Ltd (HRRL)',
    location: 'Pachpadra (Barmer)',
    employmentType: 'Full-Time',
    experience: '2-5 Years',
    salaryRange: 'As per PSU Scale (E2/E3)',
    description: 'Exciting opportunities in modern refining and petrochemical units at Pachpadra.',
    applyLinkOrEmail: 'recruitment@hrrl.in',
    postedByName: 'Mahesh Bhati',
    postedByBatch: 2018,
    postedByEmail: 'mahesh.bhati@hrrl.in',
    isActive: true,
    createdAt: '2026-07-28T12:00:00Z'
  }
];

export const SEED_WELFARE_CASES: WelfareCase[] = [
  {
    id: 'wel-1',
    title: 'Emergency Medical Treatment Support for Senior Alumnus Family',
    beneficiary: 'Family of Late Ramesh Rathore',
    beneficiaryBatch: 2004,
    urgency: 'Immediate',
    description: 'Assistance for critical medical surgery and rehabilitation expenses for family of our respected 2004 alumnus.',
    amountRequired: 300000,
    amountRaised: 245000,
    status: 'Active',
    verifiedBy: 'Dr. Prakash Rathore (Welfare Chair)',
    upiId: 'jnvpachpadra.alumni@sbi',
    bankDetails: 'SBI Pachpadra, A/C: 39482019482, IFSC: SBIN0031234',
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'wel-2',
    title: 'Higher Education Scholarship for Merit Student (NEET Qualifier)',
    beneficiary: 'Student Suresh Meena (Class XII 2026)',
    beneficiaryBatch: 2026,
    urgency: 'Normal',
    description: 'Secured MBBS seat in Govt Medical College Barmer. Sponsoring hostel mess fees and medical textbook kit.',
    amountRequired: 120000,
    amountRaised: 120000,
    status: 'Funded',
    verifiedBy: 'Principal & Alumni Committee',
    upiId: 'jnvpachpadra.alumni@sbi',
    bankDetails: 'SBI Pachpadra, A/C: 39482019482, IFSC: SBIN0031234',
    createdAt: '2026-07-10T00:00:00Z'
  }
];

export const SEED_DONATION_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'camp-1',
    title: 'Silver Jubilee Alumni Corpus & Smart Science Center',
    category: 'Infrastructure',
    description: 'Upgrading the Physics, Chemistry, and AI laboratories with modern digital sensor kits and sponsoring 50 merit student scholarships.',
    targetAmount: 1500000,
    currentAmount: 980000,
    donorsCount: 164,
    endDate: '2026-10-02',
    isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=350&fit=crop',
    createdAt: '2026-06-01T00:00:00Z'
  }
];

export const SEED_ROLES_PERMISSIONS: RolePermission[] = [
  {
    id: 'role-superadmin',
    role: 'super_admin',
    name: 'Super Administrator',
    description: 'Full unrestricted system access to all school and alumni modules, RBAC roles, databases, financial ledgers, and CSV operations.',
    permissions: [
      'manage_website',
      'manage_notices',
      'manage_events',
      'manage_alumni',
      'manage_elections',
      'manage_finances',
      'manage_faculty',
      'manage_gallery',
      'manage_roles',
      'manage_inquiries',
      'csv_import_export'
    ]
  },
  {
    id: 'role-principal',
    role: 'principal',
    name: 'Principal / School Admin',
    description: 'Manages school website content, admissions, notices, faculty, gallery, and school events.',
    permissions: [
      'manage_website',
      'manage_notices',
      'manage_events',
      'manage_faculty',
      'manage_gallery',
      'manage_inquiries'
    ]
  },
  {
    id: 'role-alumni-mgr',
    role: 'alumni_manager',
    name: 'Alumni Association Lead',
    description: 'Approves alumni registrations, manages batches, alumni events, jobs, and memories.',
    permissions: [
      'manage_alumni',
      'manage_events',
      'manage_gallery',
      'csv_import_export'
    ]
  },
  {
    id: 'role-election-officer',
    role: 'election_officer',
    name: 'Chief Election Officer',
    description: 'Creates elections, approves/rejects candidate nominations, certifies voter rolls, and manages live ballot tallies.',
    permissions: [
      'manage_elections',
      'view_election_audit'
    ]
  },
  {
    id: 'role-auditor',
    role: 'auditor',
    name: 'Financial Auditor',
    description: 'Uploads statutory audit reports, manages financial ledger records and transparency disclosures.',
    permissions: [
      'manage_finances',
      'csv_import_export'
    ]
  },
  {
    id: 'role-alumnus',
    role: 'alumnus',
    name: 'Verified Alumnus',
    description: 'Can vote in elections, self-nominate, RSVP to alumni events, view detailed financial ledgers, and connect in directory.',
    permissions: [
      'vote_elections',
      'nominate_election',
      'rsvp_events',
      'view_alumni_ledger',
      'post_memories'
    ]
  }
];

export const SEED_ADMISSION_ENQUIRIES: AdmissionEnquiry[] = [
  {
    id: 'enq-1',
    studentName: 'Rahul Choudhary',
    parentName: 'Hanuman Ram Choudhary',
    email: 'hanuman.barmer@gmail.com',
    phone: '+91 94142 88190',
    classSeeking: 'Class VI (JNVST)',
    category: 'OBC',
    gender: 'Boys',
    ruralQuota: true,
    message: 'Currently studying in Class 5 in Govt Primary School, Balotra. Need guidance on JNVST exam syllabus and preparation materials.',
    status: 'New',
    createdAt: '2026-08-12T10:30:00Z'
  },
  {
    id: 'enq-2',
    studentName: 'Priya Meena',
    parentName: 'Mohan Lal Meena',
    email: 'priya.meena.study@gmail.com',
    phone: '+91 98291 44321',
    classSeeking: 'Class IX (Lateral Entry)',
    category: 'ST',
    gender: 'Girls',
    ruralQuota: true,
    message: 'Seeking information about vacant seats in Class IX lateral entry test for girls hostel.',
    status: 'Contacted',
    createdAt: '2026-08-11T14:15:00Z'
  }
];

export const SEED_HOUSES = [
  {
    id: 'house-aravali',
    name: 'Aravali',
    color: '#3b82f6',
    motto: 'Arise, Awake, and Stop Not Till the Goal is Reached',
    points: 1450,
    description: 'Named after India’s oldest mountain range, symbolizing resilience, endurance, and unyielding fortitude in academics and athletics.'
  },
  {
    id: 'house-nilgiri',
    name: 'Nilgiri',
    color: '#10b981',
    motto: 'Truth Alone Triumphs',
    points: 1520,
    description: 'Named after the Blue Mountains of Southern India, representing ecological harmony, wisdom, and intellectual pursuit.'
  },
  {
    id: 'house-shivalik',
    name: 'Shivalik',
    color: '#ef4444',
    motto: 'Valor and Dedication',
    points: 1390,
    description: 'Named after the outer Himalayan range, signifying youthful vigor, sporting brilliance, and steadfast discipline.'
  },
  {
    id: 'house-udaygiri',
    name: 'Udaygiri',
    color: '#f59e0b',
    motto: 'Lead Us from Darkness to Light',
    points: 1480,
    description: 'Named after the sunrise mountain, embodying enlightenment, leadership, creativity, and cultural vibrancy.'
  }
];

export const SEED_TOPPERS = [
  {
    id: 'top-1',
    name: 'Vikram Singh Rajpurohit',
    exam: 'CBSE AISSCE Class XII',
    stream: 'Science (PCM + CS)',
    percentage: 98.4,
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    currentPursuit: 'B.Tech Computer Science at IIT Bombay (AIR 214)'
  },
  {
    id: 'top-2',
    name: 'Pooja Choudhary',
    exam: 'CBSE AISSCE Class XII',
    stream: 'Science (PCB + Bio)',
    percentage: 97.8,
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    currentPursuit: 'MBBS at AIIMS New Delhi (NEET AIR 89)'
  },
  {
    id: 'top-3',
    name: 'Kailash Meena',
    exam: 'CBSE AISSE Class X',
    stream: 'All Subjects Merit',
    percentage: 99.2,
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    currentPursuit: 'Class XI Science Stream (NTSE Scholar)'
  },
  {
    id: 'top-4',
    name: 'Deepika Soni',
    exam: 'CBSE AISSCE Class XII',
    stream: 'Humanities & Economics',
    percentage: 97.2,
    year: 2024,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    currentPursuit: 'B.A. (Hons) Economics at St. Stephen\'s College, Delhi'
  }
];

export const SEED_VMC_MEMBERS = [
  {
    id: 'vmc-1',
    name: 'District Collector & Magistrate, Barmer',
    designation: 'Chairman, VMC',
    organization: 'Indian Administrative Service (IAS)'
  },
  {
    id: 'vmc-2',
    name: 'Chief Medical & Health Officer (CMHO)',
    designation: 'Member (Health & Hygiene)',
    organization: 'Medical & Health Services, Barmer'
  },
  {
    id: 'vmc-3',
    name: 'Executive Engineer, CPWD / PWD',
    designation: 'Member (Works & Infrastructure)',
    organization: 'Public Works Department, Rajasthan'
  },
  {
    id: 'vmc-4',
    name: 'Principal, Govt PG College, Balotra',
    designation: 'Member (Higher Education)',
    organization: 'College Education Dept., Rajasthan'
  },
  {
    id: 'vmc-5',
    name: 'District Education Officer (DEO Secondary)',
    designation: 'Member (School Education)',
    organization: 'Secondary Education, Barmer'
  },
  {
    id: 'vmc-6',
    name: 'Shri Ram Kishore Meena (Principal, JNV)',
    designation: 'Member Secretary',
    organization: 'Navodaya Vidyalaya Samiti'
  }
];

