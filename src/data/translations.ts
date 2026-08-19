export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Institutional
  schoolName: string;
  schoolSubName: string;
  ministryName: string;
  samitiName: string;
  cbseAffiliation: string;
  schoolCode: string;
  mottoPhrase: string;
  mottoMeaning: string;

  // Header & Nav
  home: string;
  aboutSchool: string;
  academics: string;
  admissions: string;
  facultyStaff: string;
  principalsDesk: string;
  noticesCirculars: string;
  schoolEvents: string;
  photoGallery: string;
  financialTransparency: string;
  contactUs: string;
  alumniHub: string;
  adminPortal: string;
  masterAdminPortal: string;
  signIn: string;
  signOut: string;
  registerAlumnus: string;
  aiAssistant: string;
  quickSearch: string;
  searchPlaceholder: string;
  allHouses: string;

  // Alumni Subsections
  alumniDirectory: string;
  batchRosters: string;
  reunionsEvents: string;
  liveElections: string;
  financialLedger: string;
  careersJobs: string;
  businessDirectory: string;
  memoriesWall: string;
  welfareAid: string;
  donationPortal: string;
  bloodDonationPortal: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  exploreAlumniNetwork: string;
  admissions2025: string;
  statAlumni: string;
  statBatches: string;
  statStudents: string;
  statPassRate: string;
  activeElections: string;
  welfareDisbursed: string;

  // Home School Highlights
  schoolOverviewTitle: string;
  schoolOverviewSubtitle: string;
  principalWelcomeTitle: string;
  readPrincipalMessage: string;
  latestAnnouncements: string;
  viewAllNotices: string;
  housesTitle: string;
  housesSubtitle: string;
  fourHousesDesc: string;
  campusFacilitiesTitle: string;
  campusFacilitiesSubtitle: string;

  // Common UI & Action Labels
  viewDetails: string;
  downloadPdf: string;
  verified: string;
  pending: string;
  allBatches: string;
  filterByBatch: string;
  filterByHouse: string;
  filterByProfession: string;
  filterByCity: string;
  voteNow: string;
  applyNow: string;
  donateNow: string;
  viewLedger: string;
  contactOffice: string;
  backToHome: string;
  languageToggle: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Brand & Institutional
    schoolName: "Jawahar Navodaya Vidyalaya, Pachpadra",
    schoolSubName: "District Barmer, Rajasthan (Ministry of Education, Govt. of India)",
    ministryName: "Ministry of Education, Govt. of India",
    samitiName: "Navodaya Vidyalaya Samiti (Jaipur Region)",
    cbseAffiliation: "CBSE Affiliation No: 1730058",
    schoolCode: "School Code: 14002",
    mottoPhrase: "प्रज्ञानं ब्रह्म",
    mottoMeaning: "Consciousness is Brahman — Truth, Excellence, Character",

    // Header & Nav
    home: "Home",
    aboutSchool: "About School",
    academics: "Academics",
    admissions: "Admissions",
    facultyStaff: "Faculty & Staff",
    principalsDesk: "Principal's Desk",
    noticesCirculars: "Notices & Tenders",
    schoolEvents: "School Events",
    photoGallery: "Photo Gallery",
    financialTransparency: "Financial Transparency",
    contactUs: "Contact Us",
    alumniHub: "Alumni Association",
    adminPortal: "Admin Portal",
    masterAdminPortal: "Master Admin Portal (MAP)",
    signIn: "Sign In",
    signOut: "Sign Out",
    registerAlumnus: "Register as Alumnus",
    aiAssistant: "AI Assistant",
    quickSearch: "Quick Search",
    searchPlaceholder: "Search alumni, faculty, notices, batches...",
    allHouses: "All Houses",

    // Alumni Subsections
    alumniDirectory: "Alumni Directory",
    batchRosters: "Batch Rosters",
    reunionsEvents: "Reunions & RSVPs",
    liveElections: "Live Elections",
    financialLedger: "Financial Ledger & Transparency",
    careersJobs: "Careers & Job Board",
    businessDirectory: "Alumni Businesses",
    memoriesWall: "Memories & Archive",
    welfareAid: "Alumni Welfare Fund",
    donationPortal: "Alumni Welfare Fund (80G)",
    bloodDonationPortal: "Blood Lifeline Network",

    // Hero Section
    heroBadge: "Excellence in Rural Education Since 1993",
    heroTitle1: "Nurturing Leaders,",
    heroTitle2: "Connecting Generations",
    heroSubtitle: "Welcome to the official institutional portal and verified alumni ecosystem of Jawahar Navodaya Vidyalaya Pachpadra, Barmer. Empowering over 1,500+ rural scholars across India and abroad.",
    exploreAlumniNetwork: "Explore Alumni Network",
    admissions2025: "Admissions & JNVST",
    statAlumni: "Registered Alumni",
    statBatches: "Graduated Batches",
    statStudents: "Enrolled Students",
    statPassRate: "CBSE Pass Rate",
    activeElections: "Live Elections",
    welfareDisbursed: "Welfare Support Disbursed",

    // Home School Highlights
    schoolOverviewTitle: "About JNV Pachpadra",
    schoolOverviewSubtitle: "A premier co-educational residential institution affiliated with CBSE, managed by Navodaya Vidyalaya Samiti under the Ministry of Education, Govt. of India.",
    principalWelcomeTitle: "Message from the Principal's Desk",
    readPrincipalMessage: "Read Full Message",
    latestAnnouncements: "Latest Notices & Circulars",
    viewAllNotices: "View All Announcements",
    housesTitle: "The Four Institutional Houses",
    housesSubtitle: "Fostering teamwork, leadership, and brotherhood through house competitions and residential life.",
    fourHousesDesc: "Aravali, Nilgiri, Shivalik, and Udaygiri houses build character and mutual respect among students from Class VI to XII.",
    campusFacilitiesTitle: "World-Class Campus Facilities",
    campusFacilitiesSubtitle: "Providing holistic environment for academic brilliance, sports, scientific research, and cultural development.",

    // Common UI & Action Labels
    viewDetails: "View Details",
    downloadPdf: "Download PDF",
    verified: "Verified",
    pending: "Pending",
    allBatches: "All Batches",
    filterByBatch: "Filter by Batch",
    filterByHouse: "Filter by House",
    filterByProfession: "Filter by Profession",
    filterByCity: "Filter by City",
    voteNow: "Vote in Election",
    applyNow: "Apply Now",
    donateNow: "Donate to Fund",
    viewLedger: "View Transparency Ledger",
    contactOffice: "Contact Vidyalaya Office",
    backToHome: "Back to Home",
    languageToggle: "हिन्दी"
  },

  hi: {
    // Brand & Institutional
    schoolName: "जवाहर नवोदय विद्यालय, पचपदरा",
    schoolSubName: "जिला बाड़मेर, राजस्थान (शिक्षा मंत्रालय, भारत सरकार)",
    ministryName: "शिक्षा मंत्रालय, भारत सरकार",
    samitiName: "नवोदय विद्यालय समिति (जयपुर संभाग)",
    cbseAffiliation: "सी.बी.एस.ई. संबद्धता क्रमांक: 1730058",
    schoolCode: "विद्यालय कोड: 14002",
    mottoPhrase: "प्रज्ञानं ब्रह्म",
    mottoMeaning: "प्रज्ञानं ब्रह्म — सत्य, ज्ञान, चरित्र एवं राष्ट्र सेवा",

    // Header & Nav
    home: "मुख्य पृष्ठ",
    aboutSchool: "विद्यालय परिचय",
    academics: "शैक्षणिक व्यवस्था",
    admissions: "प्रवेश विवरण (JNVST)",
    facultyStaff: "संकाय एवं शिक्षक",
    principalsDesk: "प्राचार्य का संदेश",
    noticesCirculars: "सूचना एवं निविदाएं",
    schoolEvents: "विद्यालयीय गतिविधियां",
    photoGallery: "चित्र दीर्घा",
    financialTransparency: "वित्तीय पारदर्शिता",
    contactUs: "संपर्क सूत्र",
    alumniHub: "पूर्व छात्र संगम (एलुमनाई)",
    adminPortal: "प्रशासन पोर्टल",
    masterAdminPortal: "मास्टर एडमिन पोर्टल (MAP)",
    signIn: "लॉग इन करें",
    signOut: "लॉग आउट",
    registerAlumnus: "पूर्व छात्र पंजीकरण",
    aiAssistant: "ए.आई. सहायक",
    quickSearch: "त्वरित खोज",
    searchPlaceholder: "पूर्व छात्र, शिक्षक, सूचना, बैच या वर्ष खोजें...",
    allHouses: "सभी सदन",

    // Alumni Subsections
    alumniDirectory: "पूर्व छात्र निर्देशिका",
    batchRosters: "बैच वार सूची",
    reunionsEvents: "पुनर्मिलन एवं कार्यक्रम",
    liveElections: "ऑनलाइन चुनाव (मतदान)",
    financialLedger: "वित्तीय बहीखाता एवं दान",
    careersJobs: "कैरियर एवं रोजगार मंच",
    businessDirectory: "पूर्व छात्र व्यापार डायरेक्टरी",
    memoriesWall: "यादें एवं पुरातन दीर्घा",
    welfareAid: "पूर्व छात्र कल्याण निधि (Alumni Welfare Fund)",
    donationPortal: "पूर्व छात्र कल्याण निधि (80G)",
    bloodDonationPortal: "रक्तदान जीवनदान नेटवर्क",

    // Hero Section
    heroBadge: "वर्ष 1993 से ग्रामीण प्रतिभाओं का पथ प्रदर्शक",
    heroTitle1: "प्रतिभाओं का संवर्धन,",
    heroTitle2: "पीढ़ियों का संगम",
    heroSubtitle: "जवाहर नवोदय विद्यालय पचपदरा, बाड़मेर के आधिकारिक संस्थान एवं सत्यापित पूर्व छात्र पोर्टल में आपका स्वागत है। देश-विदेश में कार्यरत 1,500+ नवोदियनों का सशक्त नेटवर्क।",
    exploreAlumniNetwork: "पूर्व छात्र नेटवर्क देखें",
    admissions2025: "प्रवेश एवं चयन परीक्षा",
    statAlumni: "पंजीकृत पूर्व छात्र",
    statBatches: "उत्तीर्ण बैच",
    statStudents: "अध्ययनरत विद्यार्थी",
    statPassRate: "CBSE परीक्षा परिणाम",
    activeElections: "सक्रिय चुनाव",
    welfareDisbursed: "कल्याणकारी सहायता वितरित",

    // Home School Highlights
    schoolOverviewTitle: "ज.न.वि. पचपदरा एक दृष्टि में",
    schoolOverviewSubtitle: "केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE) से संबद्ध सह-शिक्षा आवासीय उत्कृष्ट संस्थान, जो शिक्षा मंत्रालय, भारत सरकार के अधीन नवोदय विद्यालय समिति द्वारा संचालित है।",
    principalWelcomeTitle: "प्राचार्य की कलम से",
    readPrincipalMessage: "संपूर्ण संदेश पढ़ें",
    latestAnnouncements: "नवीनतम सूचनाएं एवं परिपत्र",
    viewAllNotices: "सभी सूचनाएं देखें",
    housesTitle: "चार प्रतिष्ठित सदन व्यवस्था",
    housesSubtitle: "सदन प्रतियोगिताओं और आवासीय सहजीवन के माध्यम से अनुशासन, नेतृत्व और भ्रातृत्व की भावना का विकास।",
    fourHousesDesc: "अरावली, नीलगिरी, शिवालिक और उदयगिरि सदन कक्षा 6 से 12वीं तक के छात्रों में सर्वांगीण विकास एवं चरित्र निर्माण करते हैं।",
    campusFacilitiesTitle: "आधुनिक विद्यालय परिसर एवं सुविधाएं",
    campusFacilitiesSubtitle: "शैक्षणिक उत्कृष्टता, खेलकूद, विज्ञान प्रयोगशालाओं एवं सांस्कृतिक विकास के लिए सर्वसुविधायुक्त आवासीय वातावरण।",

    // Common UI & Action Labels
    viewDetails: "विवरण देखें",
    downloadPdf: "पीडीएफ डाउनलोड",
    verified: "सत्यापित",
    pending: "प्रतीक्षारत",
    allBatches: "सभी बैच",
    filterByBatch: "बैच अनुसार खोजें",
    filterByHouse: "सदन अनुसार खोजें",
    filterByProfession: "व्यवसाय अनुसार खोजें",
    filterByCity: "शहर अनुसार खोजें",
    voteNow: "मतदान करें",
    applyNow: "आवेदन करें",
    donateNow: "कोष में सहयोग करें",
    viewLedger: "पारदर्शिता बहीखाता देखें",
    contactOffice: "विद्यालय कार्यालय से संपर्क",
    backToHome: "मुख्य पृष्ठ पर लौटें",
    languageToggle: "English"
  }
};
