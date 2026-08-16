import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { WelfareCase, DonationCampaign } from '../types';
import {
  HeartHandshake,
  AlertCircle,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Users,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export const WelfareTab: React.FC = () => {
  const {
    welfareCases,
    campaigns,
    contributeWelfare,
    setSelectedCampaignForDonation,
    setIsDonationModalOpen,
    user
  } = useData();

  const [activeWelfareCase, setActiveWelfareCase] = useState<WelfareCase | null>(null);
  const [welfareAmount, setWelfareAmount] = useState<number>(2100);
  const [welfareDonorName, setWelfareDonorName] = useState<string>(user?.displayName || '');
  const [welfareSuccessMessage, setWelfareSuccessMessage] = useState<string | null>(null);

  const handleWelfareContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWelfareCase || welfareAmount <= 0) return;

    contributeWelfare(activeWelfareCase.id, welfareAmount, welfareDonorName || 'Anonymous Navodayan');
    setWelfareSuccessMessage(`Thank you! Your contribution of ₹${(welfareAmount ?? 0).toLocaleString('en-IN')} has been recorded for ${activeWelfareCase.title}.`);
    
    setTimeout(() => {
      setActiveWelfareCase(null);
      setWelfareSuccessMessage(null);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Alumni Solidarity & Giving Desk</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              No Navodayan Left Behind.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
              JNV Pachpadra alumni fund empowers fellow alumni during critical medical emergencies and funds scholarships, smart classrooms, robotics labs, and sports kits for current students.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 text-center min-w-[200px]">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              100% Direct Impact
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">₹0 Admin Fees</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Audited by Chartered Accountants
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Emergency Welfare Cases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 animate-bounce" />
              <span>Urgent Alumni & Student Relief Cases</span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct emergency disbursements verified by the alumni medical board.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {welfareCases.map((wCase) => {
            const percent = Math.min(100, Math.round((wCase.amountRaised / wCase.amountRequired) * 100));

            return (
              <div
                key={wCase.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        wCase.urgency === 'Immediate'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {wCase.urgency} Priority
                    </span>

                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        wCase.status === 'Funded'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {wCase.status === 'Funded' ? '✓ Fully Funded' : 'Active Relief'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {wCase.title}
                  </h4>

                  <p className="text-xs text-amber-300 font-medium">
                    Beneficiary: {wCase.beneficiary}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {wCase.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Raised: ₹{(wCase.amountRaised ?? 0).toLocaleString('en-IN')}</span>
                      <span className="text-emerald-400">{percent}% (Goal: ₹{(wCase.amountRequired ?? 0).toLocaleString('en-IN')})</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Verified by footer */}
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified by: {wCase.verifiedBy}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setActiveWelfareCase(wCase)}
                    disabled={wCase.status === 'Funded'}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                      wCase.status === 'Funded'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{wCase.status === 'Funded' ? 'Goal Achieved' : 'Contribute to Case'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: School Infrastructure & Scholarship Campaigns */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Campus Development & Scholarship Campaigns</span>
          </h3>
          <p className="text-xs text-slate-400">
            Support long-term impact projects for current students of JNV Pachpadra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.currentAmount / camp.targetAmount) * 100));

            return (
              <div
                key={camp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
              >
                {camp.coverImage && (
                  <div className="h-40 w-full relative overflow-hidden">
                    <img
                      src={camp.coverImage}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-amber-400 border border-slate-700">
                      {camp.category}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {camp.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {camp.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">₹{(camp.currentAmount ?? 0).toLocaleString('en-IN')}</span>
                        <span className="text-amber-400">{percent}% of ₹{(camp.targetAmount ?? 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{camp.donorsCount || 0} Alumni Donors</span>
                        <span>Closes {camp.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedCampaignForDonation(camp);
                        setIsDonationModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Donate & Get 80G Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Welfare Contribution Direct Modal */}
      {activeWelfareCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Contribute to Emergency Relief</span>
            </h3>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
              <p className="font-semibold text-white">{activeWelfareCase.title}</p>
              <p className="text-amber-300">Beneficiary: {activeWelfareCase.beneficiary}</p>
              <p className="text-slate-400">UPI ID: <span className="text-slate-200 font-mono">{activeWelfareCase.upiId}</span></p>
              <p className="text-slate-400">Bank: <span className="text-slate-200 font-mono">{activeWelfareCase.bankDetails}</span></p>
            </div>

            {welfareSuccessMessage ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold text-center flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{welfareSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleWelfareContribute} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Batch
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Prakash Rathore (Batch 2008)"
                    value={welfareDonorName}
                    onChange={(e) => setWelfareDonorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 text-xs text-white rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Contribution Amount (INR)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[500, 1100, 2100, 5100].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setWelfareAmount(amt)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          welfareAmount === amt
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="100"
                    value={welfareAmount}
                    onChange={(e) => setWelfareAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 text-sm font-bold text-emerald-400 rounded-xl border border-slate-700"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveWelfareCase(null)}
                    className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Submit Donation (₹{welfareAmount})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
