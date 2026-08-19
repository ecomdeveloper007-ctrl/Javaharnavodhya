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
  RotateCcw,
  Lock,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { HouseType } from '../types';

export const RegistrationModal: React.FC = () => {
  const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    registerWithEmail,
    setIsAuthModalOpen,
    user
  } = useData();
  const { isHindi } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    batchYear: number;
    house: string;
    profession: string;
    city: string;
    email: string;
  } | null>(null);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMessage(isHindi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage(isHindi ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage(isHindi ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(isHindi ? 'पासवर्ड में कम से कम 6 अक्षर होने चाहिए।' : 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(isHindi ? 'पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते।' : 'Password and Confirm Password do not match.');
      return;
    }
    if (!trimmedPhone) {
      setErrorMessage(isHindi ? 'कृपया अपना मोबाइल नंबर दर्ज करें।' : 'Please enter your mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerWithEmail({
        email: trimmedEmail,
        password,
        fullName: trimmedName,
        batchYear,
        house,
        profession: profession.trim() || 'Professional',
        company: company.trim(),
        city: city.trim() || 'Jaipur',
        state: state.trim() || 'Rajasthan',
        phone: trimmedPhone,
        bloodGroup,
        linkedinUrl: linkedinUrl.trim(),
        isMentorAvailable
      });

      if (res.success) {
        setSubmittedData({
          fullName: trimmedName,
          batchYear,
          house,
          profession: profession.trim() || 'Professional',
          city: city.trim() || 'Jaipur',
          email: trimmedEmail
        });
        setIsSubmitted(true);
      } else {
        setErrorMessage(res.message);
      }
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

  const handleOpenLogin = () => {
    handleClose();
    setIsAuthModalOpen(true);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto ${isHindi ? 'font-devanagari' : ''}`}>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl text-slate-900 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              <span>{isHindi ? 'पूर्व छात्र पंजीकरण' : 'Alumni Registration'}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isSubmitted
                ? (isHindi ? 'पंजीकरण प्राप्त हुआ! ⏳' : 'Registration Submitted! ⏳')
                : (isHindi ? 'ज.न.वि. पचपदरा पूर्व छात्र संजाल से जुड़ें' : 'Create Alumni Account')}
            </h2>
            <p className="text-xs text-slate-600">
              {isSubmitted
                ? (isHindi
                    ? 'आपका खाता अनुमोदन की प्रतीक्षा कर रहा है।'
                    : 'Your account is in pending state awaiting administrator review.')
                : (isHindi
                    ? 'ईमेल व पासवर्ड के साथ खाता बनाएं। व्यवस्थापक द्वारा अनुमोदन के बाद लॉगिन उपलब्ध होगा।'
                    : 'Register with Email & Password. Account requires admin approval before login.')}
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

        {/* Success Confirmation View - Explicit Waiting for Approval Message */}
        {isSubmitted && submittedData ? (
          <div className="space-y-5 py-2">
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 font-bold" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-amber-950 leading-tight">
                    {isHindi
                      ? 'खाता सफलतापूर्वक सबमिट हुआ एवं व्यवस्थापक अनुमोदन की प्रतीक्षा में है'
                      : 'Account Submitted Successfully'}
                  </h3>
                  <p className="text-xs font-semibold text-amber-900 bg-amber-100/80 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                    "Your account has been submitted successfully and is waiting for administrator approval."
                  </p>
                </div>
              </div>

              {/* Status Note */}
              <div className="text-[11px] text-slate-700 space-y-1 pt-1 border-t border-amber-200">
                <p>
                  <strong>{isHindi ? 'खाता स्थिति:' : 'Account Status:'}</strong>{' '}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wide">
                    Pending Approval
                  </span>
                </p>
                <p className="text-slate-600">
                  {isHindi
                    ? 'व्यवस्थापक द्वारा सत्यापन के बाद आप अपने ईमेल और पासवर्ड से लॉगिन कर सकेंगे।'
                    : 'Once an administrator verifies and approves your account, you will be able to log in with your credentials.'}
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl p-3 text-xs text-slate-800 space-y-1 shadow-2xs border border-amber-200/70">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-medium">{isHindi ? 'नाम:' : 'Name:'}</span>
                  <span className="font-bold text-slate-900">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-medium">{isHindi ? 'ईमेल आईडी:' : 'User ID / Email:'}</span>
                  <span className="font-mono text-slate-700 text-[11px]">{submittedData.email}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-medium">{isHindi ? 'बैच एवं सदन:' : 'Batch & House:'}</span>
                  <span className="font-semibold text-slate-900">{submittedData.batchYear} • {submittedData.house}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-medium">{isHindi ? 'पेशा:' : 'Profession:'}</span>
                  <span className="text-slate-800">{submittedData.profession}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition cursor-pointer"
              >
                <span>{isHindi ? 'बंद करें' : 'Close'}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenLogin}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{isHindi ? 'साइन इन स्क्रीन पर जाएं' : 'Go to Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Basic Info */}
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
                  {isHindi ? 'ईमेल / यूज़र आईडी *' : 'User ID / Email *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-medium">
                    {isHindi ? 'पासवर्ड * (न्यूनतम 6 अक्षर)' : 'Password * (min 6 chars)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'पासवर्ड की पुष्टि करें *' : 'Confirm Password *'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Batch, House & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {isHindi ? 'उत्तीर्ण वर्ष (Batch) *' : 'Passout Batch *'}
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

            {/* Profession & Company */}
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

            {/* Location & Mobile */}
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
                  {isHindi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* LinkedIn */}
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

            {/* Mentor Checkbox */}
            <div className="pt-1">
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

            {/* Policy Note */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {isHindi
                  ? 'पंजीकरण के बाद आपका खाता "Pending Approval" स्थिति में रहेगा। व्यवस्थापक द्वारा स्वीकृत होने के उपरांत ही लॉगिन संभव होगा।'
                  : 'After submission, your account will be set to "Pending Approval". An administrator must approve your account before you can log in.'}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
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
                    <span>{isHindi ? 'खाता पंजीकरण सबमिट करें' : 'Submit Registration'}</span>
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


