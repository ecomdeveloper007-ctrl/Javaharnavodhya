import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Shield,
  Heart,
  ExternalLink,
  Award,
  Languages
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setActiveAlumniSubTab, user, hasPermission } = useData();
  const { language, toggleLanguage, t, isHindi } = useLanguage();

  const isAuthorizedAdmin = user && (user.isAdmin || hasPermission('access_admin_portal') || user.email?.toLowerCase().trim() === 'prakashinfosys1234@gmail.com');

  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="Navodaya Vidyalaya Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className={`text-sm font-bold text-slate-900 tracking-tight ${isHindi ? 'font-devanagari font-extrabold' : 'uppercase'}`}>
                  {t.schoolName}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wider">
                  {isHindi ? 'पचपदरा, जिला बाड़मेर / बालोतरा, राजस्थान' : 'District Barmer / Balotra, Rajasthan'}
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              {isHindi
                ? 'शिक्षा मंत्रालय, भारत सरकार के अधीन एक स्वायत्त आवासीय संस्थान। 1993 से ग्रामीण प्रतिभाओं को समग्र व उत्कृष्ट शिक्षा प्रदान करने हेतु समर्पित।'
                : 'An autonomous institution under the Ministry of Education, Government of India. Dedicated to nurturing rural intelligence through holistic residential excellence since 1993.'}
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              {t.cbseAffiliation} • {t.schoolCode}
            </div>

            {/* Language Switcher in Footer */}
            <div className="pt-2">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-amber-400 text-slate-800 font-medium text-xs shadow-2xs transition cursor-pointer"
              >
                <Languages className="w-4 h-4 text-amber-600" />
                <span>
                  {isHindi ? '🌐 English Version' : '🇮🇳 हिन्दी (Devanagari) संस्करण'}
                </span>
              </button>
            </div>
          </div>

          {/* Col 2: School Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              {isHindi ? 'विद्यालय पोर्टल' : 'School Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.aboutSchool}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('principal')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.principalsDesk}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('academics')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.academics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('faculty')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.facultyStaff}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.admissions}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.noticesCirculars}
                </button>
              </li>
              {isAuthorizedAdmin && (
                <li>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-amber-800 hover:text-amber-950 font-bold transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Shield className="w-3 h-3 text-amber-600" />
                    <span>{t.masterAdminPortal}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Alumni Wing */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              {t.alumniHub}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('alumni');
                    setActiveAlumniSubTab('directory');
                  }}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.alumniDirectory}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('alumni');
                    setActiveAlumniSubTab('batches');
                  }}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.batchRosters}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('alumni');
                    setActiveAlumniSubTab('elections');
                  }}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.liveElections}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('alumni');
                    setActiveAlumniSubTab('jobs');
                  }}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.careersJobs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('financials')}
                  className="hover:text-slate-950 transition cursor-pointer"
                >
                  {t.financialTransparency}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              {t.contactUs}
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p>{isHindi ? 'ज.न.वि. पचपदरा, बाड़मेर / बालोतरा, राजस्थान – 344032' : 'JNV Pachpadra, Barmer / Balotra, Rajasthan – 344032'}</p>
              <p className="font-mono text-[11px]">{isHindi ? 'दूरभाष: +91 (02988) 261234' : 'Phone: +91 (02988) 261234'}</p>
              <p className="font-mono text-[11px]">{isHindi ? 'ईमेल: jnvpachpadra@gmail.com' : 'Email: jnvpachpadra@gmail.com'}</p>
              <div className="pt-2">
                <a
                  href="https://navodaya.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-slate-800 hover:text-slate-950 font-medium text-[11px]"
                >
                  <span>{isHindi ? 'नवोदय विद्यालय समिति मुख्य पोर्टल' : 'Navodaya Samiti Portal'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {isHindi ? 'जवाहर नवोदय विद्यालय, पचपदरा एवं पूर्व छात्र संघ। सर्वाधिकार सुरक्षित।' : 'Jawahar Navodaya Vidyalaya, Pachpadra & Alumni Association. All rights reserved.'}</p>
          <div className="flex items-center space-x-4">
            <span>{isHindi ? 'आधिकारिक संस्थान पोर्टल' : 'Official Portal'}</span>
            <span>•</span>
            <span>{isHindi ? '100% ऑडिटेड पारदर्शिता' : '100% Audited Transparency'}</span>
            <span>•</span>
            <span>{isHindi ? 'सीबीएसई संबद्ध' : 'CBSE Affiliated'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
