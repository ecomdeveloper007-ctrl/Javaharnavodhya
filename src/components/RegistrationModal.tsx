import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  X,
  Building,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  User,
  Droplet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { HouseType } from '../types';

export const RegistrationModal: React.FC = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, registerAlumni, user, setActiveTab, setActiveAlumniSubTab } = useData();
  const { isHindi } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [batchYear, setBatchYear] = useState<number>(2014);
  const [house, setHouse] = useState<HouseType>('Aravali');
  const [profession, setProfession] = useState('Software Engineer');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isMentorAvailable, setIsMentorAvailable] = useState(true);

  // Status & submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    batchYear: number;
    house: string;
    profession: string;
    city: string;
    email: string;
  } | null>(null);

  // Sync with current user when opening modal if empty
  useEffect(() => {
    if (isRegisterModalOpen && !isSubmitted) {
      if (user?.displayName && !fullName) {
        setFullName(user.displayName);
      }
      if (user?.email && !email) {
        setEmail(user.email);
      }
    }
  }, [isRegisterModalOpen, user, isSubmitted, fullName, email]);

  const resetForm = () => {
    setFullName(user?.displayName || '');
    setEmail(user?.email || '');
    setBatchYear(2014);
    setHouse('Aravali');
    setProfession('Software Engineer');
    setCompany('');
    setCity('Jaipur');
    setState('Rajasthan');
    setPhone('');
    setBloodGroup('O+');
    setLinkedinUrl('');
    setIsMentorAvailable(true);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setStatusMsg(null);
    setErrorMessage(null);
    setSubmittedData(null);
  };

  const handleClose = () => {
    setIsRegisterModalOpen(false);
    setTimeout(() => {
      resetForm();
    }, 200);
  };

  if (!isRegisterModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage(isHindi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage(isHindi ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = registerAlumni({
        fullName: trimmedName,
        email: trimmedEmail,
        batchYear,
        house,
        profession: profession.trim() || 'Professional',
        company: company.trim(),
        city: city.trim() || 'Jaipur',
        state: state.trim() || 'Rajasthan',
        phone: phone.trim(),
        bloodGroup,
        linkedinUrl: linkedinUrl.trim(),
        isMentorAvailable
      });

      setSubmittedData({
        fullName: trimmedName,
        batchYear,
        house,
        profession: profession.trim() || 'Professional',
        city: city.trim() || 'Jaipur',
        email: trimmedEmail
      });

      setIsSubmitted(true);
      setStatusMsg(
        res?.message ||
          (isHindi
            ? 'पूर्व छात्र पंजीकरण सफलतापूर्वक प्राप्त हुआ!'
            : 'Alumni registration submitted successfully!')
      );
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(
        err?.message ||
          (isHindi
            ? 'पंजीकरण सबमिट करते समय त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'An error occurred while submitting. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDirectory = () => {
    handleClose();
    setActiveTab('alumni');
    setActiveAlumniSubTab('directory');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl text-slate-900 my-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              <span>{isHindi ? 'पूर्व छात्र संगम पंजीकरण' : 'Alumni Registration'}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isSubmitted
                ? (isHindi ? 'पंजीकरण सफल! 🎉' : 'Registration Received! 🎉')
                : (isHindi ? 'ज.न.वि. पचपदरा पूर्व छात्र संजाल से जुड़ें' : 'Join the Navodaya Alumni Directory')}
            </h2>
            <p className="text-xs text-slate-600">
              {isSubmitted
                ? (isHindi
                    ? 'आपकी जानकारी सुरक्षित रूप से डेटाबेस में दर्ज कर ली गई है।'
                    : 'Your verified profile has been recorded in the Firestore database.')
                : (isHindi
                    ? 'बैचमेट्स से जुड़ने और डायरेक्टरी में शामिल होने के लिए विवरण दर्ज करें।'
                    : 'Submit your verified profile to connect with batchmates and receive voting rights.')}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close registration modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {isSubmitted && submittedData ? (
          <div className="space-y-5 py-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    {isHindi ? 'बधाई! आपका पंजीकरण दर्ज हो चुका है' : 'Congratulations! Profile Successfully Registered'}
                  </h3>
                  <p className="text-xs text-emerald-800">
                    {statusMsg || (isHindi ? 'आपका प्रोफ़ाइल डायरेक्टरी में जोड़ दिया गया है।' : 'Your profile is now in the alumni database.')}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white/90 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-slate-800 space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">{isHindi ? 'नाम:' : 'Name:'}</span>
                  <span className="font-bold text-slate-900">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">{isHindi ? 'बैच एवं सदन:' : 'Batch & House:'}</span>
                  <span className="font-bold text-slate-900">
                    {submittedData.batchYear} • {submittedData.house} House
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="text-slate-500 font-medium">{isHindi ? 'पेशा:' : 'Profession:'}</span>
                  <span className="font-semibold text-slate-900">{submittedData.profession}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">{isHindi ? 'ईमेल:' : 'Email:'}</span>
                  <span className="text-slate-700 font-mono text-[11px]">{submittedData.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-600 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {isHindi
                  ? 'आपकी जानकारी सुरक्षित रूप से संग्रहित है और पूर्व छात्र डायरेक्टरी में दिखाई देगी।'
                  : 'Your information is safely stored and searchable in the Alumni Directory and Batch Rosters.'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHindi ? 'अन्य पूर्व छात्र पंजीकृत करें' : 'Register Another Profile'}</span>
              </button>
              <button
                type="button"
                onClick={handleViewDirectory}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{isHindi ? 'डायरेक्टरी देखें' : 'View Alumni Directory'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'ईमेल पता *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'उत्तीर्ण वर्ष (Passout Batch) *' : 'Passout Batch *'}
                </label>
                <select
                  value={batchYear}
                  onChange={(e) => setBatchYear(Number(e.target.value))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  {Array.from({ length: 33 }, (_, i) => 1994 + i).map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'नवोदय सदन (House) *' : 'Navodaya House *'}
                </label>
                <select
                  value={house}
                  onChange={(e) => setHouse(e.target.value as HouseType)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value="Aravali">Aravali House</option>
                  <option value="Nilgiri">Nilgiri House</option>
                  <option value="Shivalik">Shivalik House</option>
                  <option value="Udaygiri">Udaygiri House</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'रक्त समूह (Blood Group)' : 'Blood Group'}
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'पेशा / पद' : 'Profession / Designation'}
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder={isHindi ? 'उदा. सॉफ्टवेयर इंजीनियर, डॉक्टर, प्राध्यापक' : 'e.g. Software Engineer, Doctor, IAS'}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'संस्थान / कंपनी / विभाग' : 'Organization / Firm / Department'}
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={isHindi ? 'उदा. एम्स जोधपुर, गूगल, राजस्थान सरकार' : 'e.g. AIIMS Jodhpur, Google, Govt'}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'वर्तमान शहर' : 'Current City'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={isHindi ? 'उदा. जयपुर / जोधपुर' : 'e.g. Jaipur / Jodhpur'}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'राज्य' : 'State'}
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder={isHindi ? 'उदा. राजस्थान' : 'e.g. Rajasthan'}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'फ़ोन / व्हाट्सएप' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                {isHindi ? 'लिंक्डइन प्रोफ़ाइल (वैकल्पिक)' : 'LinkedIn Profile (Optional)'}
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2.5 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isMentorAvailable}
                  onChange={(e) => setIsMentorAvailable(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span>
                  {isHindi
                    ? 'मैं वर्तमान जेएनवी छात्रों को मार्गदर्शन (JEE/NEET/करियर) देने के लिए इच्छुक हूँ।'
                    : 'I am willing to mentor current JNV students (JEE/NEET/Career Guidance)'}
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer font-medium disabled:opacity-50"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isHindi ? 'सबमिट हो रहा है...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>{isHindi ? 'पंजीकरण सबमिट करें' : 'Submit Registration'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

