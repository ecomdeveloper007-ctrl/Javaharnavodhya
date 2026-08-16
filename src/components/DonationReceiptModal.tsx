import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  X,
  Printer,
  ShieldCheck,
  Receipt,
  QrCode,
  Heart
} from 'lucide-react';

export const DonationReceiptModal: React.FC = () => {
  const {
    isDonationModalOpen,
    setIsDonationModalOpen,
    selectedCampaignForDonation,
    setSelectedCampaignForDonation,
    makeDonation,
    lastGeneratedReceipt,
    setLastGeneratedReceipt,
    user
  } = useData();

  const [donorName, setDonorName] = useState<string>(user?.displayName || '');
  const [donorEmail, setDonorEmail] = useState<string>(user?.email || '');
  const [donorBatch, setDonorBatch] = useState<number>(2012);
  const [amount, setAmount] = useState<number>(2100);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isDonationModalOpen && !lastGeneratedReceipt) return null;

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForDonation || amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      makeDonation({
        campaignId: selectedCampaignForDonation.id,
        campaignTitle: selectedCampaignForDonation.title,
        donorName: donorName || 'Generous Alumnus',
        donorEmail: donorEmail || 'alumni@jnvpachpadra.org',
        donorBatch: donorBatch,
        amount: Number(amount),
        paymentMode,
        isAnonymous,
        note
      });

      setIsProcessing(false);
      setIsDonationModalOpen(false);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      {/* If Receipt is Generated, show Receipt View */}
      {lastGeneratedReceipt ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative text-slate-900"
        >
          <button
            onClick={() => setLastGeneratedReceipt(null)}
            className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Printable Receipt Paper Container */}
          <div id="printable-receipt" className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-xs">
                  JNV
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">JNV Pachpadra Alumni Association</h3>
                  <p className="text-[10px] text-slate-500">Reg. Trust: JNVPAA/RAJ/2012/894 • Section 80G Tax Exempt</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                OFFICIAL RECEIPT
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Receipt Number:</span>
                <span className="font-mono font-semibold text-slate-900">{lastGeneratedReceipt.transactionRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-800">{new Date(lastGeneratedReceipt.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-semibold text-slate-900">
                  {lastGeneratedReceipt.isAnonymous ? 'Anonymous Donor' : lastGeneratedReceipt.donorName}
                  {lastGeneratedReceipt.donorBatch ? ` (Batch ${lastGeneratedReceipt.donorBatch})` : ''}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Campaign / Purpose:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[280px]">{lastGeneratedReceipt.campaignTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-blue-700">{lastGeneratedReceipt.paymentMode} (Instant Verified)</span>
              </div>
              <div className="flex justify-between py-2.5 bg-white px-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Amount Received:</span>
                <span className="text-base font-bold text-emerald-700">₹{(lastGeneratedReceipt.amount ?? 0).toLocaleString('en-IN')} INR</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Digitally signed by Association Treasurer</span>
              </span>
              <span className="text-amber-800 font-medium">Navodaya Vidyalaya Samiti</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setLastGeneratedReceipt(null)}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        </motion.div>
      ) : (
        /* Donation Form Modal */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl relative text-slate-900"
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
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
              <Heart className="w-3 h-3 fill-amber-600 text-amber-600" />
              <span>Alumni Giving Desk</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {selectedCampaignForDonation?.title || 'Contribute to Alumni Fund'}
            </h3>
          </div>

          <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name (for 80G Receipt)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Singh"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Passout Batch</label>
                <input
                  type="number"
                  placeholder="2012"
                  value={donorBatch}
                  onChange={(e) => setDonorBatch(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Contribution Amount (₹ INR)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[1100, 2100, 5100, 11000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl font-bold transition cursor-pointer ${
                      amount === amt
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{(amt ?? 0).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['UPI', 'Card', 'NetBanking'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 rounded-xl font-semibold transition cursor-pointer ${
                      paymentMode === mode
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'UPI' ? '⚡ UPI / QR' : mode === 'Card' ? '💳 Debit / Credit' : '🏦 Net Banking'}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI QR Simulation Box */}
            {paymentMode === 'UPI' && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p className="font-semibold text-slate-900">VPA: jnvpachpadra.alumni@sbi</p>
                  <p className="text-slate-500">Scan using GPay, PhonePe, Paytm, or BHIM</p>
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
                Keep my name anonymous in the public donors list
              </label>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <span>Generating 80G Receipt...</span>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>Confirm Donation of ₹{(amount ?? 0).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

