import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  MapPin,
  School,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Vote,
  FileCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { SEED_TOPPERS } from '../../data/seedData';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const HomeView: React.FC = () => {
  const {
    notices,
    events,
    alumni,
    election,
    schoolSettings,
    toppers,
    setActiveTab,
    setActiveAlumniSubTab,
    setIsRegisterModalOpen,
    setIsAboutModalOpen,
    submitAdmissionEnquiry
  } = useData();
  const { t, isHindi } = useLanguage();

  const [quickStudentName, setQuickStudentName] = React.useState('');
  const [quickParentName, setQuickParentName] = React.useState('');
  const [quickPhone, setQuickPhone] = React.useState('');
  const [quickClass, setQuickClass] = React.useState('Class VI');
  const [quickSubmitted, setQuickSubmitted] = React.useState(false);

  const handleQuickEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickStudentName || !quickPhone) return;
    submitAdmissionEnquiry({
      studentName: quickStudentName,
      parentName: quickParentName || 'Parent / Guardian',
      email: 'parent@jnv.in',
      phone: quickPhone,
      classSeeking: quickClass,
      category: 'General',
      ruralQuota: true,
      message: `Quick enquiry submitted for ${quickClass} admission.`
    });
    setQuickSubmitted(true);
    setTimeout(() => {
      setQuickSubmitted(false);
      setQuickStudentName('');
      setQuickPhone('');
    }, 4000);
  };

  const pinnedNotices = notices.filter(n => n.isPinned);
  const upcomingEvents = events.slice(0, 3);
  const spotlightAlumni = alumni.slice(0, 4);

  return (
    <div className={`space-y-12 pb-16 ${isHindi ? 'font-devanagari' : ''}`} id="home-view-container">
      {/* Live Marquee Ticker Alert */}
      {schoolSettings.tickerNotice && (
        <div className="bg-amber-50/80 border-y border-amber-200/80 py-2.5 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
              {isHindi ? 'नवीनतम सूचना' : 'Notice'}
            </span>
            <div className="text-xs text-amber-950 font-medium truncate">
              {schoolSettings.tickerNotice}
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Showcase with Institutional Banner */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 shadow-xs">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Institutional Vision */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {isHindi
                    ? 'स्वायत्त सह-शिक्षा आवासीय संस्थान • शिक्षा मंत्रालय, भारत सरकार'
                    : 'Autonomous Residential Co-Educational Institution'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {isHindi
                  ? 'ग्रामीण प्रतिभाओं का संवर्धन, राष्ट्रीय उत्कृष्टता की प्रेरणा'
                  : schoolSettings.heroHeadline || 'Nurturing Rural Talent, Inspiring National Excellence'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {isHindi
                  ? `${t.schoolName} (जिला बाड़मेर / बालोतरा, राजस्थान) ग्रामीण अंचल के प्रतिभावान विद्यार्थियों को आधुनिक, गुणवत्तापूर्ण आवासीय शिक्षा निःशुल्क प्रदान करता है। नवोदय विद्यालय समिति, शिक्षा मंत्रालय (भारत सरकार) के अंतर्गत 1993 में स्थापित।`
                  : schoolSettings.heroSubheadline ||
                    `${schoolSettings.schoolName} (District Barmer / Balotra, Rajasthan) provides modern, high-quality residential education to talented rural children. Established in ${schoolSettings.establishedYear} under Navodaya Vidyalaya Samiti, Ministry of Education, Govt. of India.`}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isHindi ? 'जे.एन.वी.एस.टी. प्रवेश (2026-27)' : 'JNVST Admissions (2026-27)'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('about')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isHindi ? 'परिचय एवं संकल्प' : 'About & Vision'}</span>
                </button>

                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  title="Open Quick Overview Pop-up Dialog"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>{isHindi ? 'त्वरित परिचय' : 'Quick Overview'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('alumni');
                    setActiveAlumniSubTab('directory');
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 transition flex items-center space-x-2 cursor-pointer shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>{t.alumniHub}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {isHindi ? 'सीबीएसई उत्तीर्ण दर' : 'CBSE Pass Rate'}
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">30+ {isHindi ? 'एकड़' : 'Acres'}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {isHindi ? 'परिसर क्षेत्रफल' : 'Campus Area'}
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">1,800+</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {isHindi ? 'प्रतिष्ठित पूर्व छात्र' : 'Distinguished Alumni'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Notice Board & Live Alerts */}
            <div className="lg:col-span-5 space-y-4">
              {/* Notice Board Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                      <Bell className="w-4 h-4 text-amber-700" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isHindi ? 'आधिकारिक सूचना पट्ट' : 'Official Notice Board'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs text-slate-600 hover:text-slate-950 font-medium flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {notices.slice(0, 4).map((n) => (
                    <motion.div
                      key={n.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setActiveTab('notices')}
                      className="p-3 bg-white hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {n.category}
                        </span>
                        {n.isPinned && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            {isHindi ? 'नवीन' : 'NEW'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">{n.publishDate}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{n.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Live Election Alert Card */}
              {election.status === 'ACTIVE' && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setActiveTab('alumni');
                    setActiveAlumniSubTab('elections');
                  }}
                  className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 cursor-pointer hover:bg-amber-50 transition flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Vote className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-900">{election.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-200/80 text-amber-900 border border-amber-300">
                          {isHindi ? 'सक्रिय ई-मतदान' : 'ACTIVE E-BALLOT'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {isHindi
                          ? `${election.totalVotesCast} प्रमाणित मत दर्ज • अभी मतदान करें`
                          : `${election.totalVotesCast} certified votes cast • Participate now`}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Principal's Welcome & Institution Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Principal's Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop"
                alt="Principal Shri Ram Kishore Meena"
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {t.principalsDesk}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'श्री राम किशोर मीणा' : 'Shri Ram Kishore Meena'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'एम.एससी., एम.एड. • प्राचार्य, ज.न.वि. पचपदरा' : 'M.Sc., M.Ed. • Principal, JNV Pachpadra'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 mt-4 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {isHindi
                ? '"जवाहर नवोदय विद्यालय पचपदरा में हम शिक्षा को केवल एक डिग्री नहीं, बल्कि बौद्धिक चेतना, चरित्र निर्माण एवं सामाजिक दायित्व की जागृति मानते हैं। हमारा परिसर ग्रामीण अंचल की प्रतिभाओं को देश के भावी वैज्ञानिक, सिविल सेवक, शिक्षक एवं उद्यमी बनाने हेतु एक सशक्त मंच प्रदान करता है।"'
                : '"At JNV Pachpadra, we consider education not merely as a degree, but as an awakening of intellect, character, and social responsibility. Our campus provides a sanctuary for gifted rural youth to blossom into leaders, scientists, civil servants, and entrepreneurs."'}
            </p>

            <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                onClick={() => setActiveTab('principal')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center space-x-1 cursor-pointer"
              >
                <span>{isHindi ? 'पूर्ण संदेश एवं वीएमसी विवरण पढ़ें' : 'Read Full Message & VMC Details'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Academic Key Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <School className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {isHindi ? 'निःशुल्क आवासीय व्यवस्था' : 'Free Residential System'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'नामांकित सभी विद्यार्थियों के लिए निःशुल्क आवास, भोजन, गणवेश, पाठ्य-सामग्री एवं चिकित्सा सुविधा।'
                  : 'Free boarding, lodging, uniform, textbooks, stationery, and medical care for all enrolled students.'}
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {isHindi ? 'चार सदन प्रणाली' : 'Four-House Ethos'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'अरावली, नीलगिरि, शिवालिक एवं उदयगिरि सदन—खेल भावना, एकता और समग्र चरित्र निर्माण को बढ़ावा।'
                  : 'Aravali, Nilgiri, Shivalik & Udaygiri houses fostering sportsmanship, unity, and holistic character.'}
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {isHindi ? 'स्मार्ट STEM व डिजिटल लैब्स' : 'Smart STEM & Digital Labs'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'हाई-स्पीड इंटरनेट, स्मार्ट कक्षाएं एवं सुसज्जित भौतिकी, रसायन, जीवविज्ञान व कंप्यूटर प्रयोगशालाएं।'
                  : 'High-speed broadband, digital classrooms, modern Physics, Chemistry & Biology laboratory research.'}
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                {isHindi ? 'राष्ट्रीय प्रवासन योजना (30%)' : 'National Migration Scheme'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'राष्ट्रीय एकता को बढ़ावा देने हेतु कक्षा 9 के 30% विद्यार्थी गैर-हिन्दी भाषी राज्यों के नवोदय में अध्ययन करते हैं।'
                  : '30% of Class IX students migrate to partner JNVs in non-Hindi regions to foster national integration.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Academic Toppers Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'शैक्षणिक कीर्तिमान' : 'Academic Record'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isHindi ? 'सीबीएसई बोर्ड परीक्षा टॉपर (कक्षा 10 व 12)' : 'Recent CBSE Board Toppers (Class X & XII)'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('academics')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl border border-slate-200 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{isHindi ? 'संपूर्ण परिणाम' : 'Full Results'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEED_TOPPERS.map((topper) => (
              <motion.div
                key={topper.id}
                whileHover={{ y: -3 }}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition space-y-3 shadow-2xs"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={topper.photoUrl}
                    alt={topper.name}
                    className="w-full h-40 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white text-slate-900 border border-slate-200 text-[11px] font-bold shadow-xs">
                    {topper.percentage}%
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{topper.name}</h4>
                  <div className="text-xs text-slate-600 font-medium">{topper.exam} • {topper.stream}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{topper.currentPursuit}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Integrated Alumni Wing Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>{t.alumniHub}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isHindi ? 'प्रतिष्ठित पूर्व छात्र (Alumni Spotlight)' : 'Distinguished Alumni'}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {isHindi
                  ? 'सिविल सेवक, वैज्ञानिक, डॉक्टर, रक्षा अधिकारी एवं नवप्रवर्तक जो विश्व पटल पर ज.न.वि. पचपदरा का मान बढ़ा रहे हैं।'
                  : 'Civil servants, engineers, doctors, and innovators representing JNV Pachpadra across the globe.'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveTab('alumni');
                  setActiveAlumniSubTab('directory');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
              >
                {t.alumniDirectory}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spotlightAlumni.map((alum) => (
              <motion.div
                key={alum.id}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setActiveTab('alumni');
                  setActiveAlumniSubTab('directory');
                }}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer transition space-y-3 shadow-2xs"
              >
                <div className="flex items-center space-x-3">
                  <ImageWithFallback
                    src={alum.avatar}
                    alt={alum.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{alum.fullName}</h4>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {isHindi ? `बैच ${alum.batchYear}` : `Batch of ${alum.batchYear}`}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isHindi ? `${alum.house} सदन` : `${alum.house} House`}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-700">
                  <div className="font-medium">{alum.profession}</div>
                  <div className="text-[11px] text-slate-500 truncate">{alum.company || alum.city}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Quick Admission Enquiry & Helpline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {isHindi ? 'प्रवेश सत्र 2026-27' : 'Admissions 2026-27'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isHindi
                ? 'जवाहर नवोदय विद्यालय चयन परीक्षा (JNVST)'
                : 'Jawahar Navodaya Vidyalaya Selection Test (JNVST)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'कक्षा 6 में प्रवेश राष्ट्रीय स्तर की JNVST परीक्षा के माध्यम से होता है। बाड़मेर/बालोतरा जिले के ग्रामीण विद्यालयों के छात्रों के लिए 75% सीटें आरक्षित हैं, जिसमें 33% बालिकाओं के लिए आरक्षण शामिल है।'
                : 'Admission to Class VI is conducted through the national JNVST test. 75% of seats are reserved for students from rural schools in District Barmer/Balotra, with 33% reservation for girls.'}
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isHindi
                    ? 'पात्रता: जिले के मान्यता प्राप्त ग्रामीण विद्यालय में कक्षा 5 में नियमित अध्ययनरत'
                    : 'Eligibility: Currently enrolled in Class V in recognized rural school'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isHindi
                    ? 'शिक्षण, आवास, भोजन, गणवेश एवं परीक्षा का शून्य शुल्क (पूर्णतः निःशुल्क)'
                    : 'Zero tuition, boarding, lodging, or examination fees'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              {isHindi ? 'त्वरित प्रवेश पूछताछ फॉर्म' : 'Quick Admission Enquiry Form'}
            </h3>
            {quickSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs text-center font-medium">
                {isHindi
                  ? '✓ पूछताछ सफलतापूर्वक दर्ज हुई! हमारे प्रवेश समन्वयक शीघ्र आपसे संपर्क करेंगे।'
                  : '✓ Enquiry submitted successfully! Our admissions coordinator will reach out shortly.'}
              </div>
            ) : (
              <form onSubmit={handleQuickEnquiry} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      {isHindi ? 'विद्यार्थी का पूरा नाम' : "Student's Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={quickStudentName}
                      onChange={(e) => setQuickStudentName(e.target.value)}
                      placeholder={isHindi ? 'छात्र का नाम' : 'Student name'}
                      className="w-full bg-white text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      {isHindi ? 'अभिभावक का नाम' : "Parent's Name"}
                    </label>
                    <input
                      type="text"
                      value={quickParentName}
                      onChange={(e) => setQuickParentName(e.target.value)}
                      placeholder={isHindi ? 'माता/पिता का नाम' : 'Parent / Guardian'}
                      className="w-full bg-white text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      {isHindi ? 'संपर्क मोबाइल नंबर' : 'Contact Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      {isHindi ? 'प्रवेश हेतु कक्षा' : 'Class Seeking Admission'}
                    </label>
                    <select
                      value={quickClass}
                      onChange={(e) => setQuickClass(e.target.value)}
                      className="w-full bg-white text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 shadow-2xs"
                    >
                      <option value="Class VI">{isHindi ? 'कक्षा 6 (JNVST)' : 'Class VI (JNVST)'}</option>
                      <option value="Class IX">{isHindi ? 'कक्षा 9 (पार्श्व प्रवेश)' : 'Class IX (Lateral Entry)'}</option>
                      <option value="Class XI">{isHindi ? 'कक्षा 11 (संकाय चयन)' : 'Class XI (Stream Selection)'}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isHindi ? 'प्रवेश पूछताछ जमा करें' : 'Submit Admission Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
