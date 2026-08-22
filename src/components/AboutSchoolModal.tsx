import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { JNV_LOGO, handleLogoError } from '../assets/logo';
import {
  X,
  Target,
  Compass,
  Sparkles,
  Layers,
  Globe2,
  Building2,
  ArrowRight,
  Trophy,
  Users,
  CheckCircle,
  BookOpen,
  History,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';

export const AboutSchoolModal: React.FC = () => {
  const {
    isAboutModalOpen,
    setIsAboutModalOpen,
    schoolSettings,
    houses,
    setActiveTab
  } = useData();
  const { t, isHindi } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'vision' | 'houses' | 'facilities' | 'migration'>('vision');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAboutModalOpen) {
        setIsAboutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAboutModalOpen, setIsAboutModalOpen]);

  if (!isAboutModalOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 ${isHindi ? 'font-devanagari' : ''}`}
      id="about-school-modal-backdrop"
      onClick={() => setIsAboutModalOpen(false)}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden relative text-slate-900"
        id="about-school-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img
                src={JNV_LOGO}
                onError={handleLogoError}
                alt="Navodaya Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase">
                  {isHindi ? 'संस्थान अवलोकन' : 'Institutional Overview'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  {isHindi ? 'सीबीएसई संबद्धता सं.:' : 'Affiliation No:'} {schoolSettings.cbseAffiliationNo || '1730058'}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">
                {isHindi ? `परिचय: ${schoolSettings.schoolName}` : `About ${schoolSettings.schoolName}`}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 transition cursor-pointer"
            title="Close Pop-up"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 overflow-x-auto shrink-0 gap-2 py-2">
          <button
            onClick={() => setActiveSubTab('vision')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'vision'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{isHindi ? 'दृष्टिकोण एवं लक्ष्य' : 'Vision & Mission'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('houses')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'houses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{isHindi ? 'चार सदन (Houses)' : 'Four Houses'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('facilities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'facilities'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'परिसर एवं प्रयोगशालाएं' : 'Campus & Labs'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('migration')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'migration'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{isHindi ? '30% माइग्रेशन योजना' : '30% Migration Scheme'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
              <div className="text-xl sm:text-2xl font-bold text-amber-700">
                {schoolSettings.campusAcres || 32} {isHindi ? 'एकड़' : 'Acres'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{isHindi ? 'विशाल हरित परिसर' : 'Campus Grounds'}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
              <div className="text-xl sm:text-2xl font-bold text-emerald-700">
                {schoolSettings.studentStrength || 540}+
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{isHindi ? 'अध्येता छात्र-छात्राएं' : 'Scholars'}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">100% {isHindi ? 'निःशुल्क' : 'Free'}</div>
              <div className="text-[11px] text-slate-500 font-medium">{isHindi ? 'शिक्षा, आवास व भोजन' : 'Education & Boarding'}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
              <div className="text-xl sm:text-2xl font-bold text-purple-700">
                {schoolSettings.smartClassrooms || 18}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">{isHindi ? 'स्मार्ट डिजिटल कक्षाएं' : 'Smart Digital Classrooms'}</div>
            </div>
          </div>

          {/* TAB 1: Vision & Mission */}
          {activeSubTab === 'vision' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {schoolSettings.aboutOverview ||
                    (isHindi
                      ? `पचपदरा, बाड़मेर (राजस्थान) में ${schoolSettings.campusAcres || 32} एकड़ के शांत परिसर में फैला जवाहर नवोदय विद्यालय, भारत सरकार के शिक्षा मंत्रालय के अधीन एक प्रमुख सह-शैक्षणिक आवासीय संस्थान है।`
                      : `Spread across ${schoolSettings.campusAcres || 32} acres of serene expanse in Pachpadra, Barmer (Rajasthan), Jawahar Navodaya Vidyalaya is a premier co-educational residential institution under the Ministry of Education, Govt. of India.`)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-2xl space-y-2.5">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <Target className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      {isHindi ? 'संस्थागत दृष्टिकोण (Vision)' : 'Institutional Vision'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {schoolSettings.visionText ||
                      (isHindi
                        ? 'मुख्य रूप से ग्रामीण क्षेत्रों के प्रतिभाशाली बच्चों को उनके परिवार की सामाजिक-आर्थिक स्थिति की परवाह किए बिना संस्कृति, मूल्यों और पर्यावरण जागरूकता सहित आधुनिक गुणवत्तापूर्ण शिक्षा प्रदान करना।'
                        : 'To provide high-quality modern education—including a strong component of culture, values, awareness of the environment, adventure activities, and physical education—to talented children predominantly from rural areas without regard to their family’s socio-economic condition.')}
                  </p>
                </div>

                <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-2xl space-y-2.5">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Compass className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      {isHindi ? 'संस्थागत मिशन (Mission)' : 'Institutional Mission'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {schoolSettings.missionText ||
                      (isHindi
                        ? 'बाड़मेर जिले में एक गति-निर्धारक (Pace-setting) संस्थान के रूप में कार्य करना, राष्ट्रीय एकता को बढ़ावा देना, और बहुभाषी क्षमता विकसित करते हुए ग्रामीण युवाओं को वैश्विक स्तर पर उत्कृष्टता हेतु तैयार करना।'
                        : 'To serve as a pace-setting institution in District Barmer, fostering national integration through 30% student migration between Hindi and non-Hindi speaking states, cultivating multilingual competence, and equipping rural youth to excel globally.')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start space-x-3">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{isHindi ? 'ग्रामीण प्रतिभा सशक्तिकरण' : 'Rural Talent Empowerment'}</h4>
                    <p className="text-[11px] text-slate-600">{isHindi ? '24x7 समग्र मार्गदर्शन के साथ सीबीएसई आवासीय शिक्षा।' : 'CBSE education with holistic 24x7 pastoral guidance.'}</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start space-x-3">
                  <Globe2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{isHindi ? 'राष्ट्रीय एकता' : 'National Integration'}</h4>
                    <p className="text-[11px] text-slate-600">{isHindi ? 'कक्षा 9 के प्रवासन के माध्यम से भाषाई व सांस्कृतिक सद्भाव।' : 'Linguistic harmony through Class IX migration.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Four Houses */}
          {activeSubTab === 'houses' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600">
                {isHindi
                  ? 'छात्रों में खेल भावना, अनुशासन और नेतृत्व कौशल विकसित करने हेतु आवासीय जीवन को भारत की चार प्रमुख पर्वत श्रृंखलाओं के नाम पर चार सदनों में विभाजित किया गया है:'
                  : "Residential life is divided into four houses named after India's iconic mountain ranges to promote sportsmanship and leadership."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {houses.map((h) => (
                  <div
                    key={h.id}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative overflow-hidden"
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
                        <h4 className="text-xs font-bold text-slate-900">{h.name} {isHindi ? 'सदन' : 'House'}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {h.points} {isHindi ? 'अंक' : 'Pts'}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800 italic">"{h.motto}"</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{h.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>{isHindi ? 'सदन प्रभारी:' : 'House Master:'} <strong className="text-slate-800">{h.houseMaster || 'N/A'}</strong></span>
                      <span>{isHindi ? 'कप्तान:' : 'Captain:'} <strong className="text-slate-800">{h.captain || 'N/A'}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Campus & Facilities */}
          {activeSubTab === 'facilities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'स्मार्ट डिजिटल क्लासरूम' : 'Smart Digital Classrooms'} ({schoolSettings.smartClassrooms || 18})</span>
                </div>
                <p className="text-[11px] text-slate-600">{isHindi ? 'इंटरैक्टिव स्मार्ट बोर्ड, हाई-स्पीड इंटरनेट एवं दीक्षा पोर्टल एकीकरण।' : 'Interactive boards, high-speed Wi-Fi, and DIKSHA portal integration.'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'अत्याधुनिक प्रयोगशालाएं' : 'Laboratories'} ({schoolSettings.scienceLabs || 4} {isHindi ? 'लैब्स' : 'Labs'})</span>
                </div>
                <p className="text-[11px] text-slate-600">{isHindi ? 'भौतिकी, रसायन विज्ञान, जीव विज्ञान और कंप्यूटर विज्ञान हेतु समर्पित लैब्स।' : 'Dedicated Physics, Chemistry, Biology, and Computer Science research labs.'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'छात्रावास एवं पौष्टिक भोजन' : 'Hostels & Nutritional Dining'}</span>
                </div>
                <p className="text-[11px] text-slate-600">{isHindi ? 'छात्र-छात्राओं के लिए पृथक हॉस्टल, सोलर वाटर हीटर और संतुलित मेस भोजन।' : 'Separate modern dormitories with solar heating and well-balanced meals.'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'केंद्रीय पुस्तकालय' : 'Central Library'} ({schoolSettings.libraryBooks || 8500}+ {isHindi ? 'पुस्तकें' : 'Books'})</span>
                </div>
                <p className="text-[11px] text-slate-600">{isHindi ? 'साहित्य, संदर्भ पुस्तकें और जेईई/नीट/यूपीएससी प्रतियोगी परीक्षाओं का समृद्ध संग्रह।' : 'Literature, reference material, and JEE/NEET/UPSC preparatory collections.'}</p>
              </div>
            </div>
          )}

          {/* TAB 4: 30% Migration Scheme */}
          {activeSubTab === 'migration' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="inline-flex items-center space-x-1.5 text-slate-900 text-xs font-bold">
                  <Globe2 className="w-4 h-4 text-blue-600" />
                  <span>{isHindi ? 'अंतर-राज्यीय सांस्कृतिक एवं शैक्षणिक प्रवासन योजना' : 'Inter-State Cultural & Academic Exchange'}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {isHindi
                    ? 'नवोदय की राष्ट्रीय एकता नीति के अंतर्गत कक्षा 9 के 30% विद्यार्थी एक शैक्षणिक वर्ष के लिए भिन्न भाषाई क्षेत्र के नवोदय विद्यालय में अध्ययन हेतु प्रवासन करते हैं।'
                    : 'Under the Navodaya national integration policy, 30% of Class IX students migrate for one academic year between Vidyalayas in different linguistic regions.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs">
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500">{isHindi ? 'संबद्ध भागीदार विद्यालय: ' : 'Partner School: '}</span>
                    <strong className="text-amber-800">{schoolSettings.migrationPartnerJNV || 'JNV Rewa (Madhya Pradesh)'}</strong>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500">{isHindi ? 'प्रवासन कक्षा: ' : 'Target Grade: '}</span>
                    <strong className="text-slate-900">{isHindi ? 'कक्षा IX (1 शैक्षणिक वर्ष)' : 'Class IX (1 Academic Year)'}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{isHindi ? 'ग्रामीण गति-निर्धारक (Pace-Setting) गतिविधियां' : 'Pace-Setting Rural Outreach'}</h4>
                <p className="text-[11px] text-slate-600">
                  {schoolSettings.paceSettingActivities ||
                    (isHindi
                      ? 'बाड़मेर जिले के स्थानीय ग्रामीण विद्यालयों के लिए विज्ञान संगोष्ठियां, शिक्षक विकास कार्यक्रम और अंतर-विद्यालयी खेलकूद प्रतियोगिताओं का आयोजन।'
                      : 'Conducting science congresses, teacher development programs, and inter-school sports for local rural schools in Barmer.')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            {isHindi ? 'जवाहर नवोदय विद्यालय, पचपदरा • बाड़मेर (राज.)' : 'Jawahar Navodaya Vidyalaya, Pachpadra • Barmer (Raj.)'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer shadow-2xs"
            >
              {isHindi ? 'बंद करें' : 'Close'}
            </button>
            <button
              onClick={() => {
                setIsAboutModalOpen(false);
                setActiveTab('about');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1.5"
            >
              <span>{isHindi ? 'पूर्ण संस्थान पृष्ठ देखें' : 'Explore Full Institutional Page'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
