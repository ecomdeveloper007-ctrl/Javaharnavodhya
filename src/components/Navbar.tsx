import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { JNV_LOGO, handleLogoError } from '../assets/logo';
import {
  School,
  GraduationCap,
  Bell,
  Calendar,
  Image,
  BookOpen,
  Users,
  Phone,
  ShieldCheck,
  Search,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Award,
  DollarSign,
  Vote,
  Compass,
  Target,
  Sparkles,
  Layers,
  Globe2,
  Building2,
  History,
  Bot,
  Languages,
  Heart,
  HeartHandshake,
  Droplet,
  Receipt,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenAIChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIChat }) => {
  const { language, toggleLanguage, setLanguage, t, isHindi } = useLanguage();
  const {
    user,
    currentRole,
    hasPermission,
    loginWithGoogle,
    logout,
    activeTab,
    setActiveTab,
    activeAlumniSubTab,
    setActiveAlumniSubTab,
    setIsRegisterModalOpen,
    setIsAboutModalOpen,
    setIsAdminPanelOpen,
    setIsAuthModalOpen,
    searchQuery,
    setSearchQuery,
    notices
  } = useData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isAlumniDropdownOpen, setIsAlumniDropdownOpen] = useState(false);
  const [isMobileAboutExpanded, setIsMobileAboutExpanded] = useState(false);
  const [isMobileAlumniExpanded, setIsMobileAlumniExpanded] = useState(true);

  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const alumniDropdownRef = useRef<HTMLDivElement>(null);

  const pinnedNotice = notices.find(n => n.isPinned);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAboutDropdownOpen(false);
      }
      if (
        alumniDropdownRef.current &&
        !alumniDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAlumniDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (tab: string, alumniSubTab?: string) => {
    setActiveTab(tab);
    if (alumniSubTab) {
      setActiveAlumniSubTab(alumniSubTab);
    }
    setIsMobileMenuOpen(false);
    setIsAboutDropdownOpen(false);
    setIsAlumniDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Institutional Banner (Govt of India / NVS / CBSE) */}
      <div className="bg-slate-100/90 text-slate-600 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-800 font-semibold">{t.cbseAffiliation}</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600 hidden sm:inline">{t.schoolCode}</span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="text-slate-700 font-serif italic hidden md:inline">
            "{t.mottoPhrase}" ({isHindi ? 'सत्य, ज्ञान, चरित्र एवं सेवा' : 'Consciousness is Brahman'})
          </span>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {pinnedNotice && (
            <div
              onClick={() => handleNavClick('notices')}
              className="hidden lg:flex items-center space-x-1.5 text-slate-700 hover:text-slate-950 cursor-pointer bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs transition"
            >
              <Bell className="w-3 h-3 text-amber-600" />
              <span className="truncate max-w-xs">{pinnedNotice.title}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Dual Language Switcher Button (English / हिन्दी Devanagari) */}
            <button
              id="top-banner-lang-btn"
              onClick={toggleLanguage}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold rounded-lg transition flex items-center space-x-1.5 border border-slate-200 shadow-2xs cursor-pointer hover:border-amber-300 group"
              title={isHindi ? 'Switch to English' : 'हिंदी (देवनागरी) में देखें'}
            >
              <Languages className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
              <span className={isHindi ? 'font-sans font-bold text-amber-800' : 'font-devanagari font-bold text-amber-800'}>
                {language === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
              </span>
            </button>

            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-[10px] font-bold rounded-lg transition flex items-center space-x-1 border border-slate-200 shadow-xs cursor-pointer"
                title={t.aiAssistant}
              >
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.aiAssistant}</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('alumni', 'member_dashboard')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold rounded-lg transition flex items-center space-x-1 shadow-2xs cursor-pointer"
                  title="My Alumni Member Dashboard"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'मेरा डैशबोर्ड' : 'My Dashboard'}</span>
                </button>

                {(user.isAdmin || hasPermission('access_admin_portal') || user.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com') && (
                  <button
                    id="top-banner-map-btn"
                    onClick={() => handleNavClick('admin')}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 text-[10px] font-bold rounded-lg transition flex items-center space-x-1 border border-amber-300 shadow-2xs cursor-pointer"
                    title="Access Master Administrative Portal (MAP)"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t.adminPortal}</span>
                  </button>
                )}
                <div className="flex items-center space-x-1.5 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                    alt={user.displayName || 'User'}
                    className="w-4 h-4 rounded-full object-cover border border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[110px] truncate">
                    {user.displayName}
                  </span>
                  {user.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com' && (
                    <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1 rounded border border-amber-300 hidden md:inline">
                      Super Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-1 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                  title={t.signOut}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="top-banner-signin-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.signIn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Identity Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3.5 cursor-pointer group"
        >
          {/* Emblem */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-amber-200/80 p-1 flex items-center justify-center shadow-xs shrink-0 group-hover:border-amber-400 group-hover:shadow-md transition">
            <img
              src={JNV_LOGO}
              onError={handleLogoError}
              alt="Navodaya Vidyalaya Samiti Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700">
                {t.samitiName}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">• {t.ministryName}</span>
            </div>
            <h1 className={`text-base sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-amber-800 transition ${isHindi ? 'font-devanagari font-extrabold' : ''}`}>
              {t.schoolName}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {isHindi ? 'पचपदरा, जिला बाड़मेर / बालोतरा, राजस्थान (स्थापना 1993)' : 'Pachpadra, District Barmer / Balotra, Rajasthan (Est. 1993)'}
            </p>
          </div>
        </div>

        {/* Global Search & Action Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Language pill button in main header as well */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition cursor-pointer"
            title="Toggle Language"
          >
            <Languages className="w-4 h-4 text-amber-700" />
            <span>{isHindi ? 'English' : 'हिन्दी (Devanagari)'}</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 bg-slate-50 text-slate-900 text-xs pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>{t.registerAlumnus}</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-950 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 3. Primary Navigation Bar */}
      <nav className="bg-white border-t border-slate-200/90 shadow-xs relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hidden lg:flex items-center space-x-1 py-1 relative">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.home}
            </button>

            {/* About Dropdown & Pop-up Menu */}
            <div className="relative" ref={aboutDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsAboutDropdownOpen(!isAboutDropdownOpen);
                  setIsAlumniDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer ${
                  ['about', 'principal'].includes(activeTab) || isAboutDropdownOpen
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="About School, Vision & Governance"
                id="navbar-about-school-dropdown-btn"
                aria-expanded={isAboutDropdownOpen}
              >
                <span>{t.aboutSchool}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isAboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100"
                  >
                    <div className="px-3.5 pb-2 pt-1 flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isHindi ? 'विद्यालय परिचय एवं दृष्टि' : 'About School Overview'}
                      </div>
                      <span className="text-[9px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                        {isHindi ? 'स्था. 1993' : 'Est. 1993'}
                      </span>
                    </div>

                    {/* Quick Modal Trigger */}
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAboutDropdownOpen(false);
                          setIsAboutModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-900 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 font-semibold transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                          <span className="text-amber-950 font-bold">{isHindi ? 'त्वरित अवलोकन पॉप-अप' : 'Quick Overview Pop-up'}</span>
                        </div>
                        <span className="text-[10px] bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono uppercase shadow-2xs">
                          {isHindi ? 'संवाद' : 'Dialog'}
                        </span>
                      </button>
                    </div>

                    {/* Standard Sections */}
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('about')}
                        className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'about'
                            ? 'text-slate-900 bg-slate-100 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Target className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{isHindi ? 'दृष्टि, ध्येय एवं संकल्प' : 'Vision, Mission & Mandate'}</div>
                          <div className="text-[10px] text-slate-500">{isHindi ? 'संस्थान दर्शन एवं गौरवशाली विरासत' : 'Institutional Philosophy & Heritage'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('principal')}
                        className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'principal'
                            ? 'text-slate-900 bg-slate-100 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{t.principalsDesk}</div>
                          <div className="text-[10px] text-slate-500">{isHindi ? 'नेतृत्व, प्रबंध समिति एवं प्रेरणा' : 'Leadership, Advisory Board & Message'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('about')}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center space-x-2.5 cursor-pointer"
                      >
                        <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{isHindi ? '30% प्रवासन योजना (Migration)' : '30% Migration Scheme'}</div>
                          <div className="text-[10px] text-slate-500">{isHindi ? 'ज.न.वि. रीवा (म.प्र.) सहयोगी विद्यालय' : 'JNV Rewa (MP) Partner Vidyalaya'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('about')}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center space-x-2.5 cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{isHindi ? 'चार सदन व्यवस्था' : 'Four House System'}</div>
                          <div className="text-[10px] text-slate-500">{isHindi ? 'अरावली, नीलगिरी, शिवालिक, उदयगिरि' : 'Aravali, Nilgiri, Shivalik, Udaygiri'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('about')}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center space-x-2.5 cursor-pointer"
                      >
                        <History className="w-4 h-4 text-slate-500 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900">{isHindi ? 'इतिहास एवं उपलब्धियां' : 'History & Milestones'}</div>
                          <div className="text-[10px] text-slate-500">{isHindi ? '1993 से उत्कृष्टता का निरंतर सफर' : 'Founded 1993 to Center of Excellence'}</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavClick('academics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'academics'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.academics}
            </button>

            <button
              onClick={() => handleNavClick('faculty')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'faculty'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.facultyStaff}
            </button>

            <button
              onClick={() => handleNavClick('admissions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'admissions'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.admissions}
            </button>

            <button
              onClick={() => handleNavClick('notices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'notices'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.noticesCirculars}
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.schoolEvents}
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.photoGallery}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t.contactUs}
            </button>

            {/* INTEGRATED ALUMNI SECTION WING & MAP */}
            <div className="relative pl-2 ml-auto flex items-center space-x-2" ref={alumniDropdownRef}>
              <button
                id="main-nav-map-btn"
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 border cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.adminPortal}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAlumniDropdownOpen(!isAlumniDropdownOpen);
                  setIsAboutDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 border cursor-pointer ${
                  activeTab === 'alumni' || isAlumniDropdownOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                }`}
                aria-expanded={isAlumniDropdownOpen}
              >
                <GraduationCap className={`w-3.5 h-3.5 ${activeTab === 'alumni' || isAlumniDropdownOpen ? 'text-amber-400' : 'text-slate-700'}`} />
                <span>{t.alumniHub}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${activeTab === 'alumni' || isAlumniDropdownOpen ? 'text-slate-300' : 'text-slate-500'} transition-transform duration-200 ${isAlumniDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isAlumniDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 divide-y divide-slate-100"
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>{isHindi ? 'पूर्व छात्र संगम अनुभाग' : 'Alumni Hub Sections'}</span>
                      <span className="text-amber-600 font-mono">PAA</span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('alumni', 'member_dashboard')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'member_dashboard'
                            ? 'bg-amber-100 text-amber-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-bold leading-tight text-amber-950">{isHindi ? 'मेरा सदस्य डैशबोर्ड' : 'My Member Dashboard'}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{isHindi ? 'प्रोफ़ाइल, व्यवसाय, जॉब पोस्ट एवं 80G रसीदें' : 'Profile, businesses, jobs & 80G receipts'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'directory')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'directory'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.alumniDirectory}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'बैच-वार सत्यापित पूर्व छात्र खोजें' : 'Search verified alumni across batches'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'batches')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'batches'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.batchRosters}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? '1995 से 2026 तक के रिकॉर्ड' : '1995 to 2026 class records'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'events')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'events'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.reunionsEvents}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'परिसर मिलन एवं पंजीकरण' : 'Campus meets and registrations'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'elections')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'elections'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Vote className="w-4 h-4 text-rose-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.liveElections}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'पारदर्शी डिजिटल मतदान प्रक्रिया' : 'Democratic electronic voting ballot'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'financials')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'financials'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 text-teal-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.financialLedger}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'ऑडिटेड रसीदें एवं बैंक खाता' : 'Audited receipts & bank accounts'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'jobs')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'jobs'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Award className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.careersJobs}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'नौकरियां एवं पूर्व छात्र उद्यम' : 'Job postings and alumni enterprises'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('alumni', 'memories')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'alumni' && activeAlumniSubTab === 'memories'
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Image className="w-4 h-4 text-amber-600" />
                        <div>
                          <div className="font-semibold leading-tight">{t.memoriesWall}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'यादों की दीवार एवं पुराने चित्र' : 'Wall of fame and school photos'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('donations')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'donations' || (activeTab === 'alumni' && activeAlumniSubTab === 'welfare')
                            ? 'bg-amber-50 text-amber-950 font-bold'
                            : 'text-slate-700 hover:bg-amber-50/60 hover:text-amber-950'
                        }`}
                      >
                        <HeartHandshake className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold leading-tight text-amber-900">{isHindi ? 'पूर्व छात्र कल्याण निधि (Alumni Welfare Fund)' : 'Alumni Welfare Fund (80G)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'छात्रवृत्ति, आपातकालीन सहायता व 50% आयकर छूट' : '80G tax-exempt scholarships, medical relief & giving'}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleNavClick('blood-donation')}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 cursor-pointer ${
                          activeTab === 'blood-donation'
                            ? 'bg-rose-50 text-rose-950 font-bold'
                            : 'text-slate-700 hover:bg-rose-50/60 hover:text-rose-950'
                        }`}
                      >
                        <Droplet className="w-4 h-4 text-rose-600 fill-rose-500" />
                        <div>
                          <div className="font-semibold leading-tight text-rose-900">{isHindi ? 'नवोदय रक्तदाता जीवनदान संजाल' : 'Blood Lifeline & SOS Portal'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isHindi ? 'रक्तदाता सूची एवं आपातकालीन सहायता' : 'Donors Directory & Emergency Blood SOS'}</div>
                        </div>
                      </button>
                    </div>
                    {(user?.isAdmin || hasPermission('access_admin_portal') || user?.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com') && (
                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-3.5 py-2 text-xs text-amber-900 font-bold bg-amber-50 hover:bg-amber-100/80 rounded-lg flex items-center space-x-2 cursor-pointer transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          <span>{t.masterAdminPortal}</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto shadow-xl">
          {/* Mobile Language Switcher Row */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Language / भाषा:</span>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold transition cursor-pointer"
            >
              <Languages className="w-4 h-4 text-amber-700" />
              <span>{isHindi ? 'Switch to English' : '🇮🇳 हिन्दी (Devanagari)'}</span>
            </button>
          </div>

          <div className="pb-2 border-b border-slate-200">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
            />
          </div>

          {/* About School Section Accordion in Mobile */}
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => handleNavClick('about')}
                className="text-xs font-bold text-slate-900 hover:text-amber-800 text-left flex items-center space-x-1.5"
              >
                <School className="w-4 h-4 text-amber-600" />
                <span>{t.aboutSchool}</span>
              </button>
              <button
                onClick={() => setIsMobileAboutExpanded(!isMobileAboutExpanded)}
                className="text-xs text-slate-500 hover:text-slate-900 p-1"
                aria-label="Toggle About Submenu"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileAboutExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isMobileAboutExpanded && (
              <div className="grid grid-cols-1 gap-1 pt-1.5 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAboutModalOpen(true);
                  }}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-amber-900 bg-amber-100/50 hover:bg-amber-100 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isHindi ? 'त्वरित अवलोकन पॉप-अप' : 'Quick Overview Pop-up'}</span>
                  </span>
                  <span className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                    {isHindi ? 'संवाद' : 'DIALOG'}
                  </span>
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white"
                >
                  {isHindi ? 'दृष्टि, ध्येय एवं संकल्प' : 'Vision, Mission & Mandate'}
                </button>
                <button
                  onClick={() => handleNavClick('principal')}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white"
                >
                  {t.principalsDesk}
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white"
                >
                  {isHindi ? '30% प्रवासन योजना (Migration)' : '30% Migration Scheme'}
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white"
                >
                  {isHindi ? 'चार सदन व्यवस्था (Houses)' : 'Four House System'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavClick('principal')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.principalsDesk}
            </button>
            <button
              onClick={() => handleNavClick('academics')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.academics}
            </button>
            <button
              onClick={() => handleNavClick('faculty')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.facultyStaff}
            </button>
            <button
              onClick={() => handleNavClick('admissions')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.admissions}
            </button>
            <button
              onClick={() => handleNavClick('notices')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.noticesCirculars}
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.schoolEvents}
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.photoGallery}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {t.contactUs}
            </button>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-2.5 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => handleNavClick('alumni', 'directory')}
                className="text-xs font-bold text-amber-950 hover:text-amber-800 text-left flex items-center space-x-1.5 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>{t.alumniHub}</span>
              </button>
              <button
                onClick={() => setIsMobileAlumniExpanded(!isMobileAlumniExpanded)}
                className="text-xs text-amber-800 hover:text-amber-950 p-1 cursor-pointer"
                aria-label="Toggle Alumni Submenu"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileAlumniExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isMobileAlumniExpanded && (
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-amber-200/80">
                <button
                  onClick={() => handleNavClick('alumni', 'member_dashboard')}
                  className={`col-span-2 text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'member_dashboard'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span className="truncate">{isHindi ? 'मेरा सदस्य डैशबोर्ड (व्यवसाय/जॉब्स/रसीदें)' : 'My Member Dashboard (Post Business & Jobs)'}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'directory')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'directory'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{t.alumniDirectory}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'batches')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'batches'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{t.batchRosters}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'events')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'events'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">{t.reunionsEvents}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'elections')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'elections'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Vote className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate">{t.liveElections}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'financials')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'financials'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{t.financialLedger}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'jobs')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'jobs'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{t.careersJobs}</span>
                </button>
                <button
                  onClick={() => handleNavClick('alumni', 'memories')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alumni' && activeAlumniSubTab === 'memories'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Image className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{t.memoriesWall}</span>
                </button>
                <button
                  onClick={() => handleNavClick('donations')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'donations' || (activeTab === 'alumni' && activeAlumniSubTab === 'welfare')
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-white/80 text-amber-900 hover:bg-white'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{isHindi ? 'कल्याण निधि (80G)' : 'Alumni Welfare (80G)'}</span>
                </button>
                <button
                  onClick={() => handleNavClick('blood-donation')}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'blood-donation'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-white/80 text-rose-900 hover:bg-white'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span className="truncate">Blood SOS</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                {(user.isAdmin || hasPermission('access_admin_portal') || user.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com') && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{t.masterAdminPortal}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-rose-700 border border-slate-200 text-xs font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.signOut} ({user.displayName})</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.signIn}</span>
                </button>
                <button
                  onClick={() => {
                    setIsRegisterModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center cursor-pointer shadow-xs"
                >
                  {t.registerAlumnus}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

