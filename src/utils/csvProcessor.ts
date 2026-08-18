import { CSVImportResult } from '../types';

export const CSV_TEMPLATES: Record<string, string> = {
  alumni: `fullName,batchYear,email,phone,house,city,state,country,profession,company,designation,industry,bloodGroup,bio,isMentorAvailable,isBusinessOwner,isLookingForJobs,isHiring,verificationStatus
"Ravi Sharma",2012,"ravi.sharma@example.com","+91 9876543210","Aravali","Jaipur","Rajasthan","India","Software Architect","Infosys","Lead Architect","IT & Software","B+","Senior technology leader mentoring JNV students.",true,false,false,true,"verified"
"Dr. Sneha Rathore",2008,"sneha.rathore@medcare.org","+91 9823456789","Nilgiri","Jodhpur","Rajasthan","India","Cardiologist","AIIMS Jodhpur","Associate Professor","Healthcare","O+","Cardiology specialist offering medical guidance.",true,false,false,false,"verified"
"Prakash Gehlot",2015,"prakash.gehlot@marwarinfra.in","+91 9845123456","Shivalik","Balotra","Rajasthan","India","Civil Engineer & Entrepreneur","Marwar Infra Ltd","Director","Construction & Infrastructure","A+","Dedicated to regional development and alumni projects.",false,true,false,true,"verified"`,

  faculty: `name,designation,department,qualification,experienceYears,email,phone
"Dr. K.L. Sharma","PGT Physics","Physics","M.Sc. Physics, Ph.D., B.Ed.",16,"kl.physics@jnvpachpadra.edu.in","+91 9414123456"
"Smt. Ananya Trivedi","PGT Biology","Biology","M.Sc. Zoology, B.Ed., CTET",12,"ananya.biology@jnvpachpadra.edu.in","+91 9414234567"
"Shri R.K. Meena","TGT Mathematics","Mathematics","M.Sc. Mathematics, B.Ed.",8,"rk.maths@jnvpachpadra.edu.in","+91 9414345678"`,

  notices: `title,category,publishDate,targetAudience,content,isPinned,referenceNo
"Alumni Grand Reunion & AGM 2026","Alumni","2026-09-15","All","Notice is hereby given for the Annual General Meeting and Grand Reunion celebration at school campus. All alumni are cordially invited.",true,"JNV/PACH/ALUM/2026/102"
"JNVST Class VI Entrance Exam 2027 Admissions Open","Admissions","2026-08-20","Public","Navodaya Vidyalaya Samiti invites online applications for Jawahar Navodaya Vidyalaya Selection Test (JNVST) for Class VI admission.",true,"JNV/PACH/ADM/2026/45"
"Inter-House Athletics & Sports Championship Fixtures","Sports","2026-10-05","Students","Annual Inter-House Sports Championship scheduled from Oct 10 to 14. House captains to finalize team rosters by Oct 7.",false,"JNV/PACH/SPT/2026/18"`,

  events: `title,category,date,time,location,isOnline,isAlumniEvent,maxCapacity,description
"Silver Jubilee Batch Reunion (1998-2005)","Reunion","2026-12-25","10:00 AM IST","JNV Campus Auditorium",false,true,300,"Milestone silver jubilee batch reunion with school tour, cultural nostalgia and felicitations."
"Career Mentorship & Guidance Summit 2026","Career","2026-11-14","02:00 PM IST","Google Meet Virtual Hall",true,true,500,"Distinguished alumni panel interactive mentoring session for Class 10th to 12th students."
"Navodaya Sports Meet & Marathon 2026","Sports","2026-11-28","07:00 AM IST","Balotra Stadium",false,true,250,"Community marathon and alumni vs school students cricket and football tournament."`,

  ledger: `transactionId,type,category,amount,description,date,visibility,auditedBy,payeeOrDonor
"TXN-2026-0810","CREDIT","Donations",150000,"Smart Science Lab Equipment Grant","2026-08-10","public","CA R.K. Saini (FCA #087412)","Batch 2010 Alumni Trust"
"TXN-2026-0815","DEBIT","Student Welfare",45000,"Merit Scholarship Disbursements for 10 Students","2026-08-15","public","CA R.K. Saini (FCA #087412)","JNV Principal Office"
"TXN-2026-0820","CREDIT","Membership Fee",85000,"Annual PAA Lifetime Membership Collections","2026-08-20","public","CA R.K. Saini (FCA #087412)","General Alumni"`,

  financial_reports: `title,financialYear,category,reportSummary,visibility,auditorName,amountAudited
"Statutory Annual Audit Report FY 2025-26","2025-2026","Annual Audit Report","Comprehensive statutory audited statement of alumni association fund operations with zero non-compliances.","public","CA R.K. Saini (FCA #087412)",4850000
"Mid-Term Balance Sheet & Fund Utilization Q2","2025-2026","Balance Sheet","Half-yearly reviewed summary of receipts, bank balances, and welfare project disbursements.","public","Internal Audit Board",2400000`,

  toppers: `name,exam,stream,percentage,year,currentPursuit,photoUrl
"Priya Choudhary","CBSE Class XII","Science (PCM + CS)",98.4,2025,"B.Tech CSE at IIT Delhi","https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
"Rahul Soni","CBSE Class XII","Science (PCB + Biotech)",97.8,2025,"MBBS at AIIMS Jodhpur","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
"Vikas Patel","CBSE Class X AISSE","All Subjects",99.0,2025,"Class XI Science at JNV Pachpadra","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"`,

  blood_donors: `fullName,bloodGroup,city,state,phone,email,batchYear,lastDonatedDate,isAvailable,hospitalOrArea
"Amit Kumar","O+","Balotra","Rajasthan","+91 9414556677","amit.k@gmail.com",2014,"2026-05-10",true,"Balotra Civil Hospital"
"Deepak Jain","B+","Jodhpur","Rajasthan","+91 9414667788","deepak.j@gmail.com",2011,"2026-06-15",true,"AIIMS & MDM Hospital Jodhpur"
"Sunita Verma","AB+","Jaipur","Rajasthan","+91 9414778899","sunita.v@gmail.com",2016,"2026-04-20",true,"SMS Medical College Hospital Jaipur"`,

  vmc_members: `name,designation,organization,phone,email
"District Magistrate / Collector","Chairman VMC","Dist. Administration Balotra / Barmer","+91 2982 220001","dm-balotra@rajasthan.gov.in"
"Principal JNV Pachpadra","Member Secretary","JNV Pachpadra","+91 2988 222111","principal-jnvpachpadra@gov.in"
"Executive Engineer PWD","Member (Civil Works)","Public Works Department","+91 2988 222333","ee-pwd-balotra@rajasthan.gov.in"
"Chief Medical & Health Officer (CMHO)","Member (Health)","Medical & Health Services","+91 2988 222444","cmho-balotra@rajasthan.gov.in"`,

  donation_campaigns: `title,category,targetAmount,currentAmount,donorCount,status,endDate,description
"Digital Science Lab Modernization 2026","Infrastructure",500000,320000,45,"Active","2026-12-31","Equipping campus science labs with interactive digital screens, IoT robotics kits, and apparatus."
"Underprivileged Student Merit Scholarship 2026","Scholarship",300000,210000,28,"Active","2026-10-31","Providing higher education stipends and books for financially vulnerable meritorious graduates."
"Campus Solar Green Power Initiative","Campus Upgrades",450000,180000,34,"Active","2026-11-30","Installing 25kW rooftop solar panels for round-the-clock clean electricity in school hostels."`,

  jobs: `title,company,location,employmentType,experience,salaryRange,description,applyLinkOrEmail,postedByName,postedByBatch,postedByEmail
"Senior Full Stack Developer","TechVeda Labs","Remote / Bangalore","Full-Time","3-5 Years","18 - 25 LPA","Looking for React + Node.js engineer with microservices expertise.","careers@techvedalabs.com","Harish Sharma",2013,"harish@techvedalabs.com"
"Civil Site Engineer","Marwar Infra Ltd","Balotra / Barmer","Full-Time","2+ Years","6 - 9 LPA","Supervision of commercial and institutional construction projects.","apply@marwarinfra.in","Ramesh Patel",2010,"ramesh@marwarinfra.in"
"Marketing & Growth Specialist","EdTech Innovators","Jaipur / Hybrid","Full-Time","1-3 Years","5 - 8 LPA","B2B sales and academic institutional relationship management.","jobs@edtech.in","Kavita Bishnoi",2017,"kavita@edtech.in"`,

  businesses: `name,category,ownerName,ownerBatch,ownerEmail,ownerPhone,website,description,isVerified,city,discountForAlumni
"Marwar Solar & Green Energy","Renewable Energy","Suresh Gehlot",2009,"suresh@marwarsolar.in","+91 9829012345","https://marwarsolar.in","Rooftop solar installation & maintenance services.",true,"Balotra","10% discount on residential solar systems"
"Desert Oasis Organic Farms","Agriculture & Food","Manish Bishnoi",2012,"manish@desertoasis.in","+91 9829023456","https://desertoasis.in","Pure A2 Desi cow ghee, organic bajra & indigenous spices.",true,"Barmer","15% off for verified JNV Alumni"
"Balotra Diagnostics & PathLab","Healthcare","Dr. Pooja Sharma",2011,"pooja@balotradiagnostics.com","+91 9829034567","https://balotradiagnostics.com","NABL accredited automated pathology and radiology center.",true,"Balotra","20% concession on comprehensive health packages"`
};

export function parseCSVLines(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      currentVal = '';
      if (row.some(cell => cell.length > 0)) {
        result.push(row);
      }
      row = [];
    } else {
      currentVal += char;
    }
  }

  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(cell => cell.length > 0)) {
      result.push(row);
    }
  }

  return result;
}

export function formatAsCSV(rows: any[]): string {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]).filter(k => typeof rows[0][k] !== 'object' || rows[0][k] === null);
  const csvRows: string[] = [];
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  rows.forEach(item => {
    const row = headers.map(h => {
      const val = item[h];
      if (val === null || val === undefined) return '""';
      const cleanVal = String(val).replace(/"/g, '""');
      return `"${cleanVal}"`;
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}
