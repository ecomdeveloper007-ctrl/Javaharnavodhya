import React from 'react';
import { useData } from '../context/DataContext';
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Briefcase,
  Sparkles,
  MapPin,
  Search,
  Droplet
} from 'lucide-react';

export const HeroBanner: React.FC<{ onOpenAIChat: () => void }> = ({ onOpenAIChat }) => {
  const { alumni, batches, welfareCases, jobs, setActiveTab, setIsRegisterModalOpen, setSearchQuery } = useData();

  const totalRaised = welfareCases.reduce((acc, c) => acc + c.amountRaised, 0);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, intro & action triggers */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jawahar Navodaya Vidyalaya, Pachpadra • Barmer (Rajasthan)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              One Family, One Spirit <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Navodaya Forever.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Welcome to the official network of JNV Pachpadra alumni. Reconnect with batchmates, find career mentorship, support students & emergency alumni welfare, and celebrate Navodaya brotherhood across the globe.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center space-x-2"
                id="hero-join-network-btn"
              >
                <Users className="w-4 h-4" />
                <span>Join / Update Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('welfare')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer flex items-center space-x-2"
                id="hero-welfare-btn"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Alumni Giving & Welfare</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('directory');
                  setSearchQuery('Blood Donor');
                }}
                className="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-red-300 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center space-x-1.5"
                id="hero-blood-donor-btn"
              >
                <Droplet className="w-4 h-4 fill-red-500 text-red-500" />
                <span>Blood Donors</span>
              </button>

              <button
                onClick={onOpenAIChat}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center space-x-1.5"
                id="hero-ai-btn"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Search & Mentorship</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Network Metrics Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Community Vital Stats
                </span>
                <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time Active</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setActiveTab('directory')}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/70 hover:border-amber-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 text-slate-400 group-hover:text-amber-400 transition">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium">Registered Alumni</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1 group-hover:text-amber-300 transition">
                    {alumni.length}+
                  </p>
                  <span className="text-[10px] text-slate-400">Across 18+ Countries</span>
                </div>

                <div
                  onClick={() => setActiveTab('batches')}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/70 hover:border-blue-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 text-slate-400 group-hover:text-blue-400 transition">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-medium">Passout Batches</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1 group-hover:text-blue-300 transition">
                    {batches.length * 6}+
                  </p>
                  <span className="text-[10px] text-slate-400">1993 to Present</span>
                </div>

                <div
                  onClick={() => setActiveTab('welfare')}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/70 hover:border-emerald-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 text-slate-400 group-hover:text-emerald-400 transition">
                    <HeartHandshake className="w-4 h-4" />
                    <span className="text-xs font-medium">Welfare Raised</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    ₹{(totalRaised / 100000).toFixed(1)} Lakh+
                  </p>
                  <span className="text-[10px] text-slate-400">100% Transparent Ledger</span>
                </div>

                <div
                  onClick={() => setActiveTab('jobs')}
                  className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/70 hover:border-purple-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 text-slate-400 group-hover:text-purple-400 transition">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-medium">Active Opportunities</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1 group-hover:text-purple-300 transition">
                    {jobs.length} Open
                  </p>
                  <span className="text-[10px] text-slate-400">FAANG, Refinery & Govt</span>
                </div>
              </div>

              {/* Campus quote */}
              <div className="pt-2 border-t border-slate-700/70 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>JNV Campus, Pachpadra, Barmer</span>
                </span>
                <span className="text-amber-400/90 font-medium">4 Houses • 1 Tradition</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
