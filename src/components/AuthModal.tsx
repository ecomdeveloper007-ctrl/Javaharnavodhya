import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  LogIn,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  Sparkles,
  UserCheck,
  Vote,
  FileSpreadsheet,
  Users
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    loginDirectlyAsSuperAdmin,
    loginDirectlyAs,
    authError,
    setAuthError
  } = useData();
  const { t, isHindi } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isAuthModalOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.warn("Sign in popup error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentHost);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 ${isHindi ? 'font-devanagari' : ''}`}>
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>{isHindi ? 'विद्यालय पोर्टल में साइन इन करें' : 'Sign In to Vidyalaya Portal'}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isHindi ? 'ज.न.वि. पचपदरा पूर्व छात्र एवं संस्थान नेटवर्क' : 'JNV Pachpadra Alumni & Institutional Network'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setAuthError(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            id="close-auth-modal-btn"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active Error or Unauthorized Domain Notice */}
          {authError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900 text-sm">
                    {authError.isUnauthorizedDomain
                      ? isHindi ? 'फ़ायरबेस अधिकृत डोमेन सेटअप सूचना' : 'Firebase Authorized Domain Notice'
                      : isHindi ? 'साइन इन सूचना' : 'Sign-In Authentication Notice'}
                  </p>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {authError.isUnauthorizedDomain
                      ? isHindi
                        ? `गूगल फ़ायरबेस को इस प्रीव्यू होस्टिंग डोमेन को कंसोल की ऑथराइज़्ड डोमेन सूची में जोड़े जाने की आवश्यकता है। आप नीचे तुरंत 1-क्लिक सुपर एडमिन एक्सेस भी ले सकते हैं।`
                        : `Google Firebase requires this preview hosting domain to be registered in your Firebase Console's authorized domains list. You can also use 1-click Super Admin login below.`
                      : (authError.message || (isHindi ? 'पॉपअप विंडो बंद हो गई या अवरुद्ध हुई।' : 'Sign-in popup was cancelled or blocked.'))}
                  </p>
                </div>
              </div>

              {authError.isUnauthorizedDomain && (
                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">{isHindi ? 'वर्तमान ऐप डोमेन:' : 'Current App Domain:'}</span>
                    <button
                      onClick={handleCopyDomain}
                      className="flex items-center space-x-1 text-amber-800 hover:text-amber-900 font-semibold cursor-pointer"
                    >
                      {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDomain ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'डोमेन कॉपी करें' : 'Copy Domain')}</span>
                    </button>
                  </div>
                  <code className="block text-xs text-amber-900 font-mono break-all bg-amber-50/50 px-2.5 py-1.5 rounded border border-amber-200">
                    {currentHost}
                  </code>
                  <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                    <p className="font-semibold text-slate-800">{isHindi ? 'त्वरित 30 सेकंड प्रमाणीकरण:' : 'Quick 30-second authorization step:'}</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                      <li>{isHindi ? 'खोलें' : 'Open'} <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-800 underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-2.5 h-2.5" /></a></li>
                      <li><strong>Authentication</strong> → <strong>Settings</strong> → <strong>Authorized domains</strong></li>
                      <li>{isHindi ? 'Add domain पर क्लिक करें और ऊपर कॉपी किया गया डोमेन पेस्ट करें।' : 'Click Add domain and paste the copied domain above.'}</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary Google Sign In Action */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'गूगल के साथ सुरक्षित साइन इन करें' : 'Sign in with Google Account'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {isHindi
                    ? 'अपनी सत्यापित पूर्व छात्र प्रोफ़ाइल तक पहुँचने, ई-मतदान में भाग लेने और प्रशासनिक अनुमतियों के उपयोग हेतु साइन इन करें।'
                    : 'Authenticate securely to access your verified alumnus profile, participate in elections, and manage administrative settings.'}
                </p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                id="google-signin-popup-btn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-sm font-semibold">
                  {isLoading
                    ? (isHindi ? 'गूगल से कनेक्ट किया जा रहा है...' : 'Connecting to Google...')
                    : (isHindi ? 'गूगल खाते से जारी रखें' : 'Continue with Google')}
                </span>
              </button>
            </div>

            {/* Instant 1-Click Super Admin Access */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-900">
                    {isHindi ? 'सुपर एडमिन 1-क्लिक एक्सेस' : 'Super Admin 1-Click Instant Access'}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded-md">
                  {isHindi ? 'त्वरित प्रवेश' : 'Immediate Access'}
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {isHindi
                  ? 'डेवलपमेंट व एडमिनिस्ट्रेशन हेतु सीधे सुपर एडमिन (prakashinfosys1234@gmail.com) के रूप में तुरंत लॉगिन करें:'
                  : 'Instantly sign in as Super Admin (prakashinfosys1234@gmail.com) with full administrative authority:'}
              </p>
              <button
                onClick={loginDirectlyAsSuperAdmin}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer text-xs"
                id="super-admin-instant-btn"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isHindi
                    ? 'सुपर एडमिन के रूप में लॉगिन करें (prakashinfosys1234@gmail.com)'
                    : 'Sign In as Super Admin (prakashinfosys1234@gmail.com)'}
                </span>
              </button>
            </div>

            {/* Quick Role Tester Profiles */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  {isHindi ? 'त्वरित भूमिका परीक्षण (RBAC Sandbox)' : 'Quick Role Tester Profiles'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  onClick={() => loginDirectlyAs('sunita.ias@rajasthan.gov.in', 'alumni_manager')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition text-left cursor-pointer"
                  id="login-role-manager-btn"
                >
                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-blue-600" />
                    Dr. Sunita IAS
                  </p>
                  <p className="text-[10px] text-slate-600">{isHindi ? 'पूर्व छात्र प्रबंधक' : 'Alumni Manager'}</p>
                </button>

                <button
                  onClick={() => loginDirectlyAs('vikram.shekhawat@google.com', 'election_officer')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition text-left cursor-pointer"
                  id="login-role-election-btn"
                >
                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <Vote className="w-3 h-3 text-purple-600" />
                    Vikram Shekhawat
                  </p>
                  <p className="text-[10px] text-slate-600">{isHindi ? 'चुनाव अधिकारी' : 'Election Officer'}</p>
                </button>

                <button
                  onClick={() => loginDirectlyAs('rajesh.ca@audit.in', 'auditor')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition text-left cursor-pointer"
                  id="login-role-auditor-btn"
                >
                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    CA Rajesh Sharma
                  </p>
                  <p className="text-[10px] text-slate-600">{isHindi ? 'वित्तीय लेखा परीक्षक' : 'Auditor'}</p>
                </button>

                <button
                  onClick={() => loginDirectlyAs('alumni@jnv.in', 'alumnus')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition text-left cursor-pointer"
                  id="login-role-alumnus-btn"
                >
                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-amber-600" />
                    Ravi Sharma
                  </p>
                  <p className="text-[10px] text-slate-600">{isHindi ? 'सत्यापित पूर्व छात्र' : 'Verified Alumnus'}</p>
                </button>
              </div>
            </div>

            {/* Access & Role Hierarchy Note */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 text-slate-600">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'भूमिका-आधारित अभिगम नियंत्रण (RBAC)' : 'Role-Based Access Control'}</span>
              </div>
              <ul className="space-y-1.5 text-[11px] leading-relaxed text-slate-600 list-disc list-inside">
                <li>
                  <strong className="text-slate-800">{isHindi ? 'सुपर एडमिनिस्ट्रेटर:' : 'Super Administrator:'}</strong>{' '}
                  {isHindi ? 'प्रत्यक्ष रूप से' : 'Directly assigned to'}{' '}
                  <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">prakashinfosys1234@gmail.com</code>{' '}
                  {isHindi ? 'को पूर्ण प्रशासनिक विशेषाधिकारों के साथ सौंपा गया।' : 'with full administrative privileges.'}
                </li>
                <li>
                  <strong className="text-slate-800">{isHindi ? 'नामित समिति सदस्य:' : 'Assigned Committee Members:'}</strong>{' '}
                  {isHindi
                    ? 'विभिन्न भूमिकाएं (पूर्व छात्र प्रबंधक, चुनाव अधिकारी, वित्तीय लेखा परीक्षक) केवल सुपर एडमिन द्वारा अधिकृत व आवंटित की जाती हैं।'
                    : 'Roles (Alumni Manager, Election Officer, Financial Auditor) are authorized and assigned by the Super Admin.'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

