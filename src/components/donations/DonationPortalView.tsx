import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Heart,
  ShieldCheck,
  Receipt,
  FileCheck2,
  TrendingUp,
  Users,
  Search,
  Printer,
  Sparkles,
  Download,
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  CreditCard,
  QrCode,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DonationCampaign, DonationRecord } from '../../types';

export const DonationPortalView: React.FC = () => {
  const {
    donationCampaigns,
    donationRecords,
    recordDonation,
    setIsDonationModalOpen,
    setSelectedCampaignForDonation,
    setLastGeneratedReceipt,
    user
  } = useData();
  const { isHindi } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchReceiptQuery, setSearchReceiptQuery] = useState<string>('');
  const [foundReceipt, setFoundReceipt] = useState<DonationRecord | null>(null);
  const [receiptSearchAttempted, setReceiptSearchAttempted] = useState<boolean>(false);

  // Quick Donation Form State
  const [quickCampId, setQuickCampId] = useState<string>(donationCampaigns[0]?.id || '');
  const [quickDonorName, setQuickDonorName] = useState<string>(user?.displayName || '');
  const [quickDonorEmail, setQuickDonorEmail] = useState<string>(user?.email || '');
  const [quickDonorPhone, setQuickDonorPhone] = useState<string>(user?.profile?.phone || '');
  const [quickDonorPan, setQuickDonorPan] = useState<string>('');
  const [quickBatch, setQuickBatch] = useState<number>(user?.profile?.batchYear || 2012);
  const [quickAmount, setQuickAmount] = useState<number>(2100);
  const [quickPaymentMode, setQuickPaymentMode] = useState<'UPI' | 'Card' | 'NetBanking' | 'Direct Bank Transfer'>('UPI');
  const [quickIsAnonymous, setQuickIsAnonymous] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filtered campaigns
  const categories = ['All', 'Scholarship', 'Infrastructure', 'Emergency', 'Sports', 'General'];
  const filteredCampaigns = donationCampaigns.filter(c => {
    return selectedCategory === 'All' || (c.category && c.category.toLowerCase() === selectedCategory.toLowerCase());
  });

  const totalFundsRaised = donationCampaigns.reduce((acc, c) => acc + c.currentAmount, 0);
  const totalTargetFunds = donationCampaigns.reduce((acc, c) => acc + c.targetAmount, 0);
  const totalDonorsCount = donationCampaigns.reduce((acc, c) => acc + c.donorsCount, 0) + donationRecords.length;

  const handleOpenDonateModal = (campaign: DonationCampaign) => {
    setSelectedCampaignForDonation(campaign);
    setIsDonationModalOpen(true);
  };

  const handleQuickDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAmount <= 0) return;

    setIsProcessing(true);
    const targetCamp = donationCampaigns.find(c => c.id === quickCampId) || donationCampaigns[0];

    setTimeout(() => {
      const receipt = recordDonation({
        campaignId: targetCamp?.id,
        campaignTitle: targetCamp?.title || 'General Alumni Welfare & Vidyalaya Development Corpus',
        donorName: quickDonorName || 'Generous Navodaya Well-Wisher',
        donorEmail: quickDonorEmail || 'donor@jnvpachpadra.org',
        donorPhone: quickDonorPhone || undefined,
        donorPan: quickDonorPan.trim() ? quickDonorPan.toUpperCase().trim() : undefined,
        donorBatch: quickBatch ? Number(quickBatch) : undefined,
        amount: Number(quickAmount),
        paymentMode: quickPaymentMode,
        isAnonymous: quickIsAnonymous,
        note: `Online 80G Contribution for ${targetCamp?.title}`
      });

      setIsProcessing(false);
    }, 800);
  };

  const handleSearchReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptSearchAttempted(true);
    const q = searchReceiptQuery.trim().toLowerCase();
    if (!q) {
      setFoundReceipt(null);
      return;
    }

    const match = donationRecords.find(r =>
      (r.transactionRef && r.transactionRef.toLowerCase().includes(q)) ||
      (r.receiptNumber && r.receiptNumber.toLowerCase().includes(q)) ||
      (r.donorPan && r.donorPan.toLowerCase() === q) ||
      (r.donorPhone && r.donorPhone.includes(q)) ||
      (r.donorEmail && r.donorEmail.toLowerCase() === q) ||
      (r.campaignTitle && r.campaignTitle.toLowerCase().includes(q)) ||
      (r.donorName && r.donorName.toLowerCase().includes(q))
    );

    setFoundReceipt(match || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. Header Banner with 80G Exemption Highlights */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-700">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Section 80G Tax Exemption Certified • 50% Tax Relief</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Reg. Society No: <strong>JNVPAA/RAJ/2012/894</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {isHindi ? 'ज.न.वि. पचपदरा पूर्व छात्र कल्याण एवं दान पोर्टल' : 'JNV Pachpadra Giving & 80G Donation Portal'}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Empower rural meritorious students with scholarships, smart digital classrooms, sports excellence programs, and emergency alumni relief. All contributions generate an <strong>instant government-compliant Section 80G Tax Exemption Receipt</strong> with Form 10BE filing eligibility.
              </p>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-2">
              <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                Tax Exemption Order No.
              </div>
              <div className="text-lg font-mono font-extrabold text-white">
                CIT(E)/JNVPAA/80G/2012-13/894
              </div>
              <p className="text-[11px] text-slate-300">
                Audited by Statutory Chartered Accountant CA Devendra Saini
              </p>
              <button
                onClick={() => {
                  setSelectedCampaignForDonation(donationCampaigns[0]);
                  setIsDonationModalOpen(true);
                }}
                className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>Make a Donation & Get 80G Receipt</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/80">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Total Funds Raised</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">₹{totalFundsRaised.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Active Giving Campaigns</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{donationCampaigns.length} Causes</span>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Generous Donors</span>
              <span className="text-xl sm:text-2xl font-black text-blue-400">{totalDonorsCount}+ Alumni</span>
            </div>
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">80G Receipts Generated</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">100% Instant</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid: Active Campaigns (Left) & Quick 80G Contribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Campaigns */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Vidyalaya & Welfare Causes</h2>
              <p className="text-xs text-slate-500">Select any dedicated campaign to direct your contribution</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCampaigns.map((campaign) => {
              const pct = Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100));
              return (
                <div
                  key={campaign.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {campaign.category}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {campaign.donorsCount} Donors
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {campaign.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-900 font-bold">
                          ₹{campaign.currentAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-500">
                          Goal: ₹{campaign.targetAmount.toLocaleString('en-IN')} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenDonateModal(campaign)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-amber-400" />
                      <span>Contribute & Get 80G Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Instant 80G Contribution Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-md space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Quick 80G Donation Desk</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Contribute in 30 Seconds</h3>
              <p className="text-xs text-slate-500">Get your official 80G receipt on screen instantly.</p>
            </div>

            <form onSubmit={handleQuickDonateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Cause</label>
                <select
                  value={quickCampId}
                  onChange={(e) => setQuickCampId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white font-medium"
                >
                  {donationCampaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narendra Bishnoi"
                  value={quickDonorName}
                  onChange={(e) => setQuickDonorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Email ID *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={quickDonorEmail}
                    onChange={(e) => setQuickDonorEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">PAN Card (80G)</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={quickDonorPan}
                    onChange={(e) => setQuickDonorPan(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 font-mono uppercase text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Amount (₹ INR)</label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {[1100, 2100, 5100].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setQuickAmount(amt)}
                      className={`py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                        quickAmount === amt
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-2xs border border-amber-600'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="100"
                    required
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 bg-slate-50 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'Card'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setQuickPaymentMode(m)}
                      className={`py-1.5 rounded-xl font-semibold transition cursor-pointer text-xs ${
                        quickPaymentMode === m
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {m === 'UPI' ? '⚡ UPI / QR' : '💳 Debit / Credit'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="quick-anon"
                  checked={quickIsAnonymous}
                  onChange={(e) => setQuickIsAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500"
                />
                <label htmlFor="quick-anon" className="text-slate-600 text-xs cursor-pointer">
                  Hide name on public donor roll
                </label>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Generating 80G Receipt...</span>
                ) : (
                  <>
                    <Receipt className="w-4 h-4" />
                    <span>Donate ₹{quickAmount.toLocaleString('en-IN')} & Get 80G Receipt</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 3. Search & Retrieve Past 80G Receipt Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Search & Retrieve Past 80G Receipt</span>
              </div>
              <p className="text-xs text-slate-500">
                Look up past donation certificates by PAN, Mobile, Email, or Transaction ID.
              </p>
            </div>

            <form onSubmit={handleSearchReceipt} className="flex gap-2">
              <input
                type="text"
                placeholder="PAN / Phone / Txn Ref..."
                value={searchReceiptQuery}
                onChange={(e) => setSearchReceiptQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Find
              </button>
            </form>

            {receiptSearchAttempted && (
              <div className="pt-2">
                {foundReceipt ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">Receipt Found!</span>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                        {foundReceipt.transactionRef}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900">
                      <strong>{foundReceipt.donorName}</strong> donated <strong>₹{foundReceipt.amount.toLocaleString('en-IN')}</strong> for {foundReceipt.campaignTitle}
                    </p>
                    <button
                      onClick={() => setLastGeneratedReceipt(foundReceipt)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print Official 80G Receipt</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>No record found matching "{searchReceiptQuery}". Please check your PAN, Phone, or Txn Ref.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Real-time Transparency Roll & 80G Compliance Facts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Recent Contributions Roll */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Recent 80G Donors Roll</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Public Transparency</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {donationRecords.length > 0 ? (
              donationRecords.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        {r.isAnonymous ? 'Anonymous Well-Wisher' : r.donorName}
                      </span>
                      {r.donorBatch && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                          Batch {r.donorBatch}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                      {r.campaignTitle}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700 block">
                      +₹{r.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setLastGeneratedReceipt(r)}
                      className="text-[10px] text-indigo-600 hover:underline font-semibold"
                    >
                      View 80G
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Be the first to contribute to our live campaigns today!
              </div>
            )}
          </div>
        </div>

        {/* Section 80G FAQ & Legal Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Section 80G Compliance & Tax FAQs</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">What tax deduction do I get under 80G?</h4>
              <p className="text-slate-600 text-[11px]">
                Under Section 80G of the Indian Income Tax Act 1961, 50% of the donated amount is eligible for tax deduction from your total taxable income.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Is PAN card required to claim 80G rebate?</h4>
              <p className="text-slate-600 text-[11px]">
                Yes, as per CBDT regulations, providing your PAN allows the Alumni Association to file your donation on Form 10BE so it pre-fills in your AIS/26AS.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Can corporate or overseas alumni donate?</h4>
              <p className="text-slate-600 text-[11px]">
                Yes, Indian debit/credit cards, UPI, and direct NEFT/RTGS bank transfers are supported. For foreign currency or CSR contributions, please write to us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
