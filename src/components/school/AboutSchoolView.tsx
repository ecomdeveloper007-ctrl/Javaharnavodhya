import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import {
  Compass,
  History,
  Target,
  Shield,
  Award,
  Layers,
  MapPin,
  CheckCircle,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
  Globe2,
  HeartHandshake,
  Lightbulb,
  Building2,
  Calendar,
  Trophy,
  GraduationCap,
  FileText
} from 'lucide-react';

export const AboutSchoolView: React.FC = () => {
  const { schoolSettings, houses, setActiveTab } = useData();
  const [activeSection, setActiveSection] = useState<'all' | 'vision-mission' | 'houses' | 'infrastructure' | 'migration'>('all');

  const coreValues = [
    {
      title: 'Rural Talent Empowerment',
      desc: 'Identifying and nurturing bright rural minds by offering top-tier, fully residential CBSE education free of cost.',
      icon: Lightbulb
    },
    {
      title: 'National Integration',
      desc: 'Promoting national unity through the unique 30% student migration scheme across linguistic and cultural borders.',
      icon: Globe2
    },
    {
      title: 'Character & Value System',
      desc: 'Instilling moral integrity, ecological consciousness, secular ethics, and holistic 24x7 pastoral guidance.',
      icon: HeartHandshake
    },
    {
      title: 'Pace-Setting Leadership',
      desc: 'Serving as an educational lighthouse for neighboring rural schools through shared labs, sports meets, and faculty training.',
      icon: Trophy
    }
  ];

  const milestones = [
    {
      year: '1993',
      title: 'Foundation Stone Laid',
      desc: 'Inception of JNV Pachpadra in District Barmer, Rajasthan under the National Policy on Education (1986).'
    },
    {
      year: '1998',
      title: 'First Board Batch Milestone',
      desc: 'First Class X CBSE board examinations achieved 100% distinction results across western Rajasthan.'
    },
    {
      year: '2005',
      title: 'Senior Secondary Expansion',
      desc: 'Introduction of Senior Secondary Science & Commerce streams with dedicated Physics, Chemistry, and IT laboratories.'
    },
    {
      year: '2015',
      title: 'Digital & Smart Classrooms',
      desc: 'Deployment of high-speed broadband, multimedia smart classrooms, and modernized computer science labs.'
    },
    {
      year: 'Present',
      title: 'Premier Center of Excellence',
      desc: 'Over 1,800+ alumni serving globally across civil services, armed forces, medicine, engineering, and academia.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="about-school-view-container"
    >
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
            <History className="w-3.5 h-3.5 text-amber-700" />
            <span>Established in {schoolSettings.foundedYear || 1993} • Navodaya Vidyalaya Samiti</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              CBSE Affiliation: <strong className="text-slate-900">{schoolSettings.cbseAffiliationNo || '1730058'}</strong>
            </span>
            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              School Code: <strong className="text-slate-900">{schoolSettings.schoolCode || '14002'}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            About {schoolSettings.schoolName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            {schoolSettings.aboutOverview ||
              `Spread across ${schoolSettings.campusAcres || 32} acres of serene expanse in Pachpadra, Barmer / Balotra (Rajasthan), Jawahar Navodaya Vidyalaya is a premier co-educational residential school fully funded by the Ministry of Education, Government of India. Operating under the autonomous Navodaya Vidyalaya Samiti, the institution stands as an oasis of intellectual brilliance, social harmony, and holistic character building.`}
          </p>
        </div>

        {/* Quick Filter Section Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveSection('vision-mission')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'vision-mission'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Vision, Mission & Mandate
          </button>
          <button
            onClick={() => setActiveSection('houses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'houses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Four House System
          </button>
          <button
            onClick={() => setActiveSection('infrastructure')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'infrastructure'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Campus Facilities
          </button>
          <button
            onClick={() => setActiveSection('migration')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSection === 'migration'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Migration Scheme
          </button>
        </div>
      </div>

      {/* 2. Key Institutional Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center space-y-1 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {schoolSettings.campusAcres || 32} Acres
          </div>
          <div className="text-xs text-slate-500 font-medium">Campus Grounds</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center space-y-1 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {schoolSettings.studentStrength || 540}+
          </div>
          <div className="text-xs text-slate-500 font-medium">Residential Scholars</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center space-y-1 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            100% Free
          </div>
          <div className="text-xs text-slate-500 font-medium">Boarding, Lodging & Study</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center space-y-1 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {schoolSettings.smartClassrooms || 18} Smart
          </div>
          <div className="text-xs text-slate-500 font-medium">Digital Classrooms</div>
        </div>
      </div>

      {/* 3. Vision & Mission Cards (Core Spotlight) */}
      {(activeSection === 'all' || activeSection === 'vision-mission') && (
        <section className="space-y-6" id="vision-mission-section">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Institutional Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Our Vision, Mission & Core Values
            </h2>
            <p className="text-xs text-slate-600">
              Guiding principles framed by the National Education Policy and Navodaya Vidyalaya Samiti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xs relative overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">Guiding Light</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Institutional Vision</h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {schoolSettings.visionText ||
                  'To provide high-quality modern education—including a strong component of culture, inculcation of values, awareness of the environment, adventure activities, and physical education—to talented children predominantly from rural areas without regard to their family’s socio-economic condition.'}
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Excellence with Equity</span>
                <span>• NVS New Delhi</span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xs relative overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">Operational Mandate</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Institutional Mission</h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {schoolSettings.missionText ||
                  'To serve in each district as a pace-setting institution, fostering national integration through 30% student migration between Hindi and non-Hindi speaking states, cultivating bilingual and multilingual competence, and equipping rural youth to compete with the best urban schools globally.'}
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>National Integration & Pace-Setting</span>
                <span>• CBSE Affiliated</span>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Navodaya Philosophy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 hover:border-slate-300 transition shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{val.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Four Houses System with Dynamic Live Tally */}
      {(activeSection === 'all' || activeSection === 'houses') && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs" id="houses-system-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Residential Life & Pastoral Care
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                The Four Navodaya Houses
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Named after India's historic mountain ranges, our houses foster camaraderie, discipline, and healthy annual championship rivalry.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 shrink-0 font-medium">
              🏆 Annual Championship Trophy
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {houses.map((h) => (
              <div
                key={h.id}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative overflow-hidden shadow-2xs"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: h.color }}
                ></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: h.color }}
                    ></span>
                    <h3 className="text-sm font-semibold text-slate-900">{h.name} House</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    House
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-serif italic">"{h.motto}"</div>
                <p className="text-xs text-slate-600 leading-relaxed min-h-[3rem]">{h.description}</p>
                
                <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  {h.houseMaster && (
                    <div className="flex justify-between">
                      <span>House Master:</span>
                      <span className="text-slate-800 font-medium">{h.houseMaster}</span>
                    </div>
                  )}
                  {h.captain && (
                    <div className="flex justify-between">
                      <span>House Captain:</span>
                      <span className="text-slate-800 font-medium">{h.captain}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-mono pt-1 text-xs">
                    <span className="text-slate-500">Trophy Points:</span>
                    <span className="text-slate-900 font-bold">{h.points} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. National Integration & Migration Scheme Spotlight */}
      {(activeSection === 'all' || activeSection === 'migration') && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs" id="migration-scheme-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
                <Globe2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Special Navodaya Feature</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                National Integration & Student Migration Scheme
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                An important feature of the Navodaya Vidyalaya scheme is the migration of 30% of Class IX students for one academic year between Vidyalayas of different linguistic regions (Hindi and non-Hindi speaking states).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-slate-500">Migration Partner Vidyalaya</span>
                  <div className="text-sm font-semibold text-slate-900">
                    {schoolSettings.migrationPartnerJNV || schoolSettings.migrationState || 'JNV Rewa (Madhya Pradesh)'}
                  </div>
                  <p className="text-[11px] text-slate-500">Annual cross-cultural student exchange for Class IX scholars.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-semibold uppercase text-slate-500">Three-Language Formula</span>
                  <div className="text-sm font-semibold text-slate-900">Hindi, English & Regional Language</div>
                  <p className="text-[11px] text-slate-500">Promoting multilingual proficiency, cultural understanding and national cohesion.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-center shadow-2xs">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Pace-Setting Activities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {schoolSettings.paceSettingActivities ||
                  'JNV Pachpadra regularly conducts science exhibitions, sports meets, and faculty workshops for surrounding rural government schools in District Barmer.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. Campus Infrastructure Highlights */}
      {(activeSection === 'all' || activeSection === 'infrastructure') && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs" id="facilities-section">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Campus Amenities
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Campus Infrastructure & Facilities
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              32-Acre Residential Complex
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Smart Digital Classrooms ({schoolSettings.smartClassrooms || 18})</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipped with interactive digital smart boards, LCD projectors, high-speed Wi-Fi, and NCERT/DIKSHA digital lesson repositories.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Science & Computer Labs ({schoolSettings.scienceLabs || 4})</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern Physics, Chemistry, Biology, Mathematics, and Computer Science laboratories equipped for senior secondary research.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Residential Hostels & Mess</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Separate residential dormitories for boys and girls with 24/7 staff warden supervision, solar hot water, and nutritional dining.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sports Complex & Athletics</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard 400m running track, football stadium, synthetic volleyball and basketball courts, yoga hall, and table tennis.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Central Library ({schoolSettings.libraryBooks || 8500}+ Books)</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extensive collection of reference literature, competitive examination guides (NEET/JEE/UPSC), national dailies, and periodicals.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Campus Health & Wellness Infirmary</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-time resident staff nurse, emergency first-aid beds, regular specialist visits, and tie-up with Community Health Centre Pachpadra.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 7. Institutional Timeline / Heritage */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Institutional Heritage & Milestones
          </h2>
          <p className="text-xs text-slate-600">Three decades of academic distinction and nation building.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative shadow-2xs"
            >
              <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 font-mono text-xs font-semibold border border-slate-200">
                {m.year}
              </span>
              <h3 className="text-sm font-semibold text-slate-900">{m.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call-to-Action Link Strip */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Want to learn more or connect with our alumni?
          </h3>
          <p className="text-xs text-slate-600">
            Explore admission guidelines, principal message, or the global alumni network.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTab('principal')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer flex items-center space-x-1.5"
          >
            <span>Principal's Desk & VMC</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1.5"
          >
            <span>Admissions (JNVST)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
