import React, { useState } from 'react';
import { useData } from '../context/DataContext';
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
  User
} from 'lucide-react';
import { HouseType } from '../types';

export const RegistrationModal: React.FC = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, registerAlumni, user } = useData();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [batchYear, setBatchYear] = useState<number>(2014);
  const [house, setHouse] = useState<HouseType>('Aravali');
  const [profession, setProfession] = useState('Software Engineer');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isMentorAvailable, setIsMentorAvailable] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isRegisterModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const res = registerAlumni({
      fullName,
      email,
      batchYear,
      house,
      profession,
      company,
      city,
      state,
      phone,
      linkedinUrl,
      isMentorAvailable
    });

    setStatusMsg(res.message);
    setTimeout(() => {
      setStatusMsg(null);
      setIsRegisterModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-xl text-slate-900">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Alumni Registration</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Join the Navodaya Alumni Directory</h2>
            <p className="text-xs text-slate-600">
              Submit your verified profile to connect with batchmates and receive voting rights.
            </p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
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
              <label className="block text-slate-700 font-medium mb-1">Passout Year *</label>
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
              <label className="block text-slate-700 font-medium mb-1">Navodaya House</label>
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
              <label className="block text-slate-700 font-medium mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Profession / Title</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Assistant Professor, Doctor, IAS"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Organization / Firm</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. AIIMS Jodhpur, Google, Govt"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Current City & State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Jodhpur, Rajasthan"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">LinkedIn Profile (Optional)</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isMentorAvailable}
                onChange={(e) => setIsMentorAvailable(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>I am willing to mentor current JNV students (JEE/NEET/Career Guidance)</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
