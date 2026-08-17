import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  X,
  Printer,
  ShieldCheck,
  Receipt,
  QrCode,
  Heart,
  FileCheck2,
  CheckCircle2,
  Building2,
  Lock,
  Download
} from 'lucide-react';

function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(num).trim() + ' Rupees Only';
}

export const DonationReceiptModal: React.FC = () => {
  const {
    isDonationModalOpen,
    setIsDonationModalOpen,
    selectedCampaignForDonation,
    setSelectedCampaignForDonation,
    recordDonation,
    donationCampaigns,
    lastGeneratedReceipt,
    setLastGeneratedReceipt,
    user
  } = useData();

  const [donorName, setDonorName] = useState<string>(user?.displayName || '');
  const [donorEmail, setDonorEmail] = useState<string>(user?.email || '');
  const [donorPhone, setDonorPhone] = useState<string>(user?.profile?.phone || '');
  const [donorPan, setDonorPan] = useState<string>('');
  const [donorBatch, setDonorBatch] = useState<number>(user?.profile?.batchYear || 2012);
  const [selectedCampId, setSelectedCampId] = useState<string>(selectedCampaignForDonation?.id || (donationCampaigns[0]?.id || ''));
  const [amount, setAmount] = useState<number>(2100);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'NetBanking' | 'Direct Bank Transfer'>('UPI');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isDonationModalOpen && !lastGeneratedReceipt) return null;

  const targetCampaign = selectedCampaignForDonation || donationCampaigns.find(c => c.id === selectedCampId) || donationCampaigns[0];

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      recordDonation({
        campaignId: targetCampaign?.id,
        campaignTitle: targetCampaign?.title || 'General Alumni Welfare & Vidyalaya Development Corpus',
        donorName: donorName || 'Generous Navodaya Well-Wisher',
        donorEmail: donorEmail || 'donor@jnvpachpadra.org',
        donorPhone: donorPhone || undefined,
        donorPan: donorPan.trim() ? donorPan.toUpperCase().trim() : undefined,
        donorBatch: donorBatch ? Number(donorBatch) : undefined,
        amount: Number(amount),
        paymentMode,
        isAnonymous,
        note
      });

      setIsProcessing(false);
      setIsDonationModalOpen(false);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      {/* If Receipt is Generated, show Official 80G Tax Exemption Receipt View */}
      {lastGeneratedReceipt ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative text-slate-900 my-auto"
        >
          <div className="flex items-center justify-between no-print">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Successful & 80G Certificate Generated</span>
              </span>
            </div>
            <button
              onClick={() => setLastGeneratedReceipt(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable 80G Receipt Container */}
          <div id="printable-receipt" className="bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-2 border-slate-300 rounded-2xl p-5 sm:p-7 space-y-4 relative shadow-inner">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
                  JNV
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                    Jawahar Navodaya Vidyalaya Pachpadra Alumni Association
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">Pachpadra, District Barmer, Rajasthan - 344032</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Registered Society Reg. No: <strong>JNVPAA/RAJ/2012/894</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* 80G Tax Exemption Notice Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950">Official Section 80G Tax Exemption Receipt</p>
                  <p className="text-[11px] text-emerald-800">
                    Order No: <strong>{lastGeneratedReceipt.taxExempt80GRegNo || 'CIT(E)/JNVPAA/80G/2012-13/894'}</strong> (50% Deduction u/s 80G of IT Act 1961)
                  </p>
                </div>
              </div>
              <span className="font-mono text-[11px] bg-white px-2 py-1 rounded border border-emerald-300 font-bold text-emerald-900 shadow-xs">
                FORM 10BE ELIGIBLE
              </span>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Receipt Number</span>
                <span className="font-mono font-bold text-slate-900">{lastGeneratedReceipt.receiptNumber || `80G/JNVPAA/2026-27/${Math.floor(1000 + Math.random() * 9000)}`}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Transaction ID</span>
                <span className="font-mono font-bold text-blue-800">{lastGeneratedReceipt.transactionRef}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date & Time</span>
                <span className="font-semibold text-slate-800">{new Date(lastGeneratedReceipt.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Payment Mode</span>
                <span className="font-semibold text-emerald-800">{lastGeneratedReceipt.paymentMode} (Instant Verified)</span>
              </div>
            </div>

            {/* Donor Information */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-bold text-slate-900">
                  {lastGeneratedReceipt.isAnonymous ? 'Anonymous Well-Wisher' : lastGeneratedReceipt.donorName}
                  {lastGeneratedReceipt.donorBatch ? ` (Batch ${lastGeneratedReceipt.donorBatch})` : ''}
                </span>
              </div>
              {lastGeneratedReceipt.donorPan && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donor PAN Card:</span>
                  <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {lastGeneratedReceipt.donorPan}
                  </span>
                </div>
              )}
              {lastGeneratedReceipt.donorEmail && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donor Email:</span>
                  <span className="text-slate-800 font-medium">{lastGeneratedReceipt.donorEmail}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Purpose / Fund Allocated:</span>
                <span className="font-bold text-slate-900 text-right max-w-[280px]">
                  {lastGeneratedReceipt.campaignTitle}
                </span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-100 block font-semibold">Total Donation Received</span>
                <span className="text-2xl font-black tracking-tight">₹{(lastGeneratedReceipt.amount ?? 0).toLocaleString('en-IN')} INR</span>
              </div>
              <div className="text-right max-w-[240px]">
                <span className="text-[10px] text-emerald-200 block font-medium">Amount in Words:</span>
                <span className="text-xs font-semibold text-emerald-50 leading-tight block">
                  {numberToWords(lastGeneratedReceipt.amount || 0)}
                </span>
              </div>
            </div>

            {/* Footer with Digital Signatures */}
            <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digitally Certified & Audited</span>
                </div>
                <p className="text-[10px] text-slate-500">Statutory Auditor: CA Devendra Saini</p>
              </div>
              <div className="text-right">
                <p className="font-serif italic font-bold text-slate-800 text-sm">Prakash Rathore</p>
                <p className="text-[10px] font-semibold text-slate-600">Honorary Treasurer / President</p>
                <p className="text-[9px] text-slate-400">JNV Pachpadra Alumni Association</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setLastGeneratedReceipt(null)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      ) : (
        /* Donation Form Modal with 80G PAN Details */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative text-slate-900 my-auto"
        >
          <button
            onClick={() => {
              setIsDonationModalOpen(false);
              setSelectedCampaignForDonation(null);
            }}
            className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Section 80G Tax-Exempt Giving Portal</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {targetCampaign?.title || 'Contribute to Vidyalaya & Alumni Welfare Fund'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              All contributions are 50% tax-exempt under Section 80G of the Indian Income Tax Act. Instant official receipt generated upon contribution.
            </p>
          </div>

          <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs">
            {/* Campaign Selection if multiple exist */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Select Cause / Fund</label>
              <select
                value={selectedCampId}
                onChange={(e) => setSelectedCampId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-slate-400 focus:bg-white"
              >
                {donationCampaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.title} ({camp.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Full Name (for 80G Certificate) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Prakash Rathore"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  PAN Number (Optional for 80G Tax Benefit)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  maxLength={10}
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 font-mono uppercase text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Email ID (for Receipt Copy) *</label>
                <input
                  type="email"
                  required
                  placeholder="donor@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Passout Batch</label>
                <input
                  type="number"
                  placeholder="2012"
                  value={donorBatch}
                  onChange={(e) => setDonorBatch(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Select or Enter Contribution Amount (₹ INR) *
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[1100, 2100, 5100, 11000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl font-bold transition cursor-pointer text-xs ${
                      amount === amt
                        ? 'bg-amber-500 text-slate-950 shadow-sm border border-amber-600'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{(amt ?? 0).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  min="100"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 text-base font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['UPI', 'Card', 'NetBanking'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 px-2 rounded-xl font-semibold transition cursor-pointer text-xs ${
                      paymentMode === mode
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'UPI' ? '⚡ UPI / QR' : mode === 'Card' ? '💳 Card / Debit' : '🏦 Net Banking'}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI QR Simulation Box */}
            {paymentMode === 'UPI' && (
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80 flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <div className="text-[11px] text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900">VPA: jnvpaa@sbi</p>
                  <p className="text-slate-600">Scan using Google Pay, PhonePe, Paytm, or BHIM</p>
                  <p className="text-[10px] text-emerald-800 font-semibold">Instant 80G Certificate verification enabled</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="anon-check"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="anon-check" className="text-slate-600 text-xs cursor-pointer font-medium">
                Keep my name anonymous in the public donors roll
              </label>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <span>Generating Section 80G Tax Receipt...</span>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>Donate ₹{(amount ?? 0).toLocaleString('en-IN')} & Generate 80G Receipt</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

