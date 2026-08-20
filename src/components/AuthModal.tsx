import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  LogIn,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  GraduationCap,
  KeyRound,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithEmail,
    sendPasswordResetEmail,
    setIsRegisterModalOpen,
    authError,
    setAuthError
  } = useData();
  const { isHindi } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
    setStatusMessage(null);
    setResetSent(false);
    setPassword('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setStatusMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError({ code: 'auth/missing-email', message: isHindi ? 'कृपया अपना ईमेल दर्ज करें।' : 'Please enter your email.' });
      return;
    }
    if (!password) {
      setAuthError({ code: 'auth/missing-password', message: isHindi ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithEmail(trimmedEmail, password);
      if (res.success) {
        handleClose();
      } else if (res.message) {
        setStatusMessage(res.message);
      }
    } catch (err: any) {
      console.warn('Sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setStatusMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAuthError({ code: 'auth/missing-email', message: isHindi ? 'कृपया पासवर्ड रीसेट करने के लिए अपना ईमेल दर्ज करें।' : 'Please enter your email address for password reset.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPasswordResetEmail(trimmedEmail);
      if (res.success) {
        setResetSent(true);
        setStatusMessage(res.message);
      } else {
        setAuthError({ code: 'auth/reset-failed', message: res.message });
      }
    } catch (err: any) {
      setAuthError({ code: 'auth/reset-error', message: err?.message || 'Failed to send reset link.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    handleClose();
    setIsRegisterModalOpen(true);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 ${isHindi ? 'font-devanagari' : ''}`}>
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-900 relative my-auto">
        {/* Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-700 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img
                src="/logo.jpg"
                alt="Navodaya Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {mode === 'signin'
                  ? (isHindi ? 'पोर्टल में साइन इन करें' : 'Sign In to Portal')
                  : (isHindi ? 'पासवर्ड रीसेट करें' : 'Reset Password')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi ? 'ज.न.वि. पचपदरा नेटवर्क' : 'JNV Pachpadra Network'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            id="close-auth-modal-btn"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Error Message Display */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed font-medium">
                <p>{authError.message || (isHindi ? 'प्रमाणीकरण त्रुटि हुई।' : 'Authentication failed.')}</p>
              </div>
            </div>
          )}

          {/* Pending / Approval Notice / Status Banner */}
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-start space-x-2.5 ${
              resetSent
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}>
              {resetSent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 font-medium leading-relaxed">
                <p>{statusMessage}</p>
              </div>
            </div>
          )}

          {mode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-semibold">
                    {isHindi ? 'ईमेल पता / यूज़र आईडी' : 'User ID / Email Address'}
                  </label>
                  {email.toLowerCase().trim() === 'prakashinfosys1234@gmail.com' ? (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300">
                      👑 {isHindi ? 'सुपर एडमिन' : 'Super Administrator'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEmail('prakashinfosys1234@gmail.com')}
                      className="text-amber-800 hover:text-amber-950 font-medium text-[10px] hover:underline cursor-pointer"
                      title="Fill Super Admin ID"
                    >
                      {isHindi ? 'सुपर एडमिन आईडी' : 'Fill Super Admin ID'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. prakashinfosys1234@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 text-xs transition"
                    autoComplete="email"
                  />
                </div>
                {email.toLowerCase().trim() === 'prakashinfosys1234@gmail.com' && (
                  <p className="mt-1 text-[11px] text-amber-800 font-medium bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    {isHindi 
                      ? '✓ सुपर एडमिन खाता पहचाना गया। लॉगिन करने के लिए अपना पासवर्ड दर्ज करें।'
                      : '✓ Super Admin account recognized. Enter your password to access the Master Administrative Portal.'}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-semibold">
                    {isHindi ? 'पासवर्ड' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setAuthError(null);
                      setStatusMessage(null);
                    }}
                    className="text-amber-700 hover:text-amber-800 font-medium text-[11px] hover:underline cursor-pointer"
                  >
                    {isHindi ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 text-xs transition"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
                id="submit-email-login-btn"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isHindi ? 'सत्यापित किया जा रहा है...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{isHindi ? 'साइन इन करें' : 'Sign In'}</span>
                  </>
                )}
              </button>

              {/* Registration Notice / Trigger */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center space-y-2">
                <p className="text-slate-600 text-[11px] text-center">
                  {isHindi ? 'नया खाता बनाना चाहते हैं?' : "Don't have an approved alumni account?"}
                </p>
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isHindi ? 'नया पूर्व छात्र पंजीकरण करें' : 'Register New Alumni Account'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {isHindi
                  ? 'अपना पंजीकृत ईमेल पता दर्ज करें। हम आपके ईमेल पर सुरक्षित पासवर्ड रीसेट लिंक भेजेंगे।'
                  : 'Enter your registered email address below. We will send a secure password reset link to your inbox.'}
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {isHindi ? 'पंजीकृत ईमेल पता' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 text-xs transition"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setAuthError(null);
                    setStatusMessage(null);
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition cursor-pointer"
                >
                  {isHindi ? 'साइन इन पर लौटें' : 'Back to Sign In'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'रीसेट लिंक भेजें' : 'Send Reset Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Super Admin / Committee Info Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800">
                {isHindi ? 'सुरक्षित प्रमाणीकरण एवं अनुमोदन नीति' : 'Authentication & Approval Policy'}
              </span>
              <p className="leading-relaxed text-slate-600">
                {isHindi
                  ? 'नए पंजीकरण व्यवस्थापक अनुमोदन के बाद ही सक्रिय होते हैं। सुपर एडमिन खाता: prakashinfosys1234@gmail.com'
                  : 'New registrations require administrator approval before login is enabled.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

