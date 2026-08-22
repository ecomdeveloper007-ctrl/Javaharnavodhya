import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  CreditCard,
  Building,
  QrCode,
  ShieldCheck,
  Save,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Check,
  X,
  RotateCcw,
  Receipt,
  ExternalLink,
  Settings,
  HelpCircle,
  Lock,
  Globe,
  Sliders
} from 'lucide-react';
import { DonationRecord, PaymentSettings } from '../../types';

export const AdminPaymentSettings: React.FC = () => {
  const {
    paymentSettings,
    updatePaymentSettings,
    donationRecords,
    verifyDonationRecord,
    rejectDonationRecord,
    refundDonationRecord,
    updateDonationStatus,
    setLastGeneratedReceipt,
    exportToCSV,
    user
  } = useData();

  const [activeSubSection, setActiveSubSection] = useState<'gateway' | 'bank_upi' | 'limits_tax' | 'success_fail' | 'transactions'>('gateway');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Local state for settings form
  const [formData, setFormData] = useState<PaymentSettings>({
    ...paymentSettings
  });

  // Transaction ledger filters & modals
  const [searchTx, setSearchTx] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'REJECTED'>('ALL');
  const [selectedTx, setSelectedTx] = useState<DonationRecord | null>(null);
  const [refundNote, setRefundNote] = useState('');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [txToRefund, setTxToRefund] = useState<DonationRecord | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [txToReject, setTxToReject] = useState<DonationRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(formData);
    setSaveSuccessMsg('Alumni Welfare Payment Settings & Gateway configuration updated successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const filteredTransactions = donationRecords.filter(d => {
    const matchesSearch =
      !searchTx ||
      d.donorName.toLowerCase().includes(searchTx.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTx.toLowerCase()) ||
      d.receiptNumber.toLowerCase().includes(searchTx.toLowerCase()) ||
      (d.transactionRef && d.transactionRef.toLowerCase().includes(searchTx.toLowerCase())) ||
      (d.donorPan && d.donorPan.toLowerCase().includes(searchTx.toLowerCase())) ||
      (d.campaignTitle && d.campaignTitle.toLowerCase().includes(searchTx.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || d.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReceipt = (record: DonationRecord) => {
    setLastGeneratedReceipt(record);
  };

  const handleProcessRefund = () => {
    if (!txToRefund) return;
    refundDonationRecord(txToRefund.id, refundNote || 'Administrative refund processed.');
    setIsRefundModalOpen(false);
    setTxToRefund(null);
    setRefundNote('');
  };

  const handleProcessReject = () => {
    if (!txToReject) return;
    rejectDonationRecord(txToReject.id, rejectionReason || 'Transaction rejected by administrator.');
    setIsRejectModalOpen(false);
    setTxToReject(null);
    setRejectionReason('');
  };

  const totalCollected = donationRecords
    .filter(d => d.paymentStatus === 'VERIFIED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingAmount = donationRecords
    .filter(d => d.paymentStatus === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const refundedAmount = donationRecords
    .filter(d => d.paymentStatus === 'REFUNDED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6" id="admin-welfare-payment-settings">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              Financial Gateway & 80G Management
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Alumni Welfare Payment Settings</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Configure payment gateways (Razorpay, Cashfree, Stripe, PayU, PhonePe, UPI QR), official bank transfer coordinates, 80G tax certification, currency, and audit transaction records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportToCSV('donations')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Ledger CSV</span>
            </button>
          </div>
        </div>

        {/* Financial Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-teal-500/20">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-teal-400 font-semibold uppercase">Verified 80G Collections</div>
            <div className="text-xl font-black text-white mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{donationRecords.filter(d => d.paymentStatus === 'VERIFIED').length} receipts issued</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-amber-400 font-semibold uppercase">Pending Verification</div>
            <div className="text-xl font-black text-amber-300 mt-1">₹{pendingAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{donationRecords.filter(d => d.paymentStatus === 'PENDING').length} awaiting audit</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-rose-400 font-semibold uppercase">Refunded / Reversal</div>
            <div className="text-xl font-black text-rose-300 mt-1">₹{refundedAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{donationRecords.filter(d => d.paymentStatus === 'REFUNDED').length} entries refunded</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-indigo-400 font-semibold uppercase">Active Gateway</div>
            <div className="text-sm font-bold text-white mt-1 capitalize">{formData.activeGateway || 'Razorpay'} ({formData.gatewayMode || 'test'})</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">80G Benefit: {formData.taxBenefitPercentage || 50}%</div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-teal-500/20">
          {[
            { id: 'gateway', label: 'Payment Gateway & API Keys', icon: Sliders },
            { id: 'bank_upi', label: 'Bank Account & UPI QR', icon: Building },
            { id: 'limits_tax', label: '80G Tax & Transaction Limits', icon: ShieldCheck },
            { id: 'success_fail', label: 'Success / Failure & Webhooks', icon: Settings },
            { id: 'transactions', label: 'Audit Transactions & 80G Receipts', count: donationRecords.length, icon: Receipt }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id as any)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-teal-300' : 'bg-slate-700 text-teal-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. GATEWAY & API CONFIGURATION */}
      {activeSubSection === 'gateway' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Payment Gateway Integration & API Credentials</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure primary online payment provider for instant checkout, card processing, and UPI auto-settlement.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Gateway Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Gateway Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Active Payment Gateway
              </label>
              <select
                value={formData.activeGateway || 'razorpay'}
                onChange={e => setFormData({ ...formData, activeGateway: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="razorpay">Razorpay (India - Cards, UPI, NetBanking, Wallets)</option>
                <option value="cashfree">Cashfree Payments (Instant UPI & Auto-settlement)</option>
                <option value="stripe">Stripe (International Credit/Debit Cards)</option>
                <option value="payu">PayU India (Cards & UPI Gateway)</option>
                <option value="phonepe">PhonePe Payment Gateway</option>
                <option value="custom_upi">Direct UPI QR & Manual Verification Only</option>
              </select>
              <p className="text-[11px] text-slate-400">Selected gateway will process checkout donations in the welfare portal.</p>
            </div>

            {/* Environment Mode */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Gateway Environment Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gatewayMode: 'test' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                    formData.gatewayMode === 'test'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sandbox / Test Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gatewayMode: 'live' })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                    formData.gatewayMode === 'live'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production / Live Mode</span>
                </button>
              </div>
            </div>

            {/* Razorpay Credentials */}
            {formData.activeGateway === 'razorpay' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Razorpay Key ID (Client Key)
                  </label>
                  <input
                    type="text"
                    value={formData.razorpayKeyId || ''}
                    onChange={e => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                    placeholder="rzp_live_xxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Razorpay Key Secret
                  </label>
                  <input
                    type="password"
                    value={formData.razorpayKeySecret || ''}
                    onChange={e => setFormData({ ...formData, razorpayKeySecret: e.target.value })}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Razorpay Webhook Secret
                  </label>
                  <input
                    type="text"
                    value={formData.razorpayWebhookSecret || ''}
                    onChange={e => setFormData({ ...formData, razorpayWebhookSecret: e.target.value })}
                    placeholder="whsec_xxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </>
            )}

            {/* Cashfree Credentials */}
            {formData.activeGateway === 'cashfree' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Cashfree App ID
                  </label>
                  <input
                    type="text"
                    value={formData.cashfreeAppId || ''}
                    onChange={e => setFormData({ ...formData, cashfreeAppId: e.target.value })}
                    placeholder="CF_APP_ID_xxxxxxxx"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Cashfree Secret Key
                  </label>
                  <input
                    type="password"
                    value={formData.cashfreeSecretKey || ''}
                    onChange={e => setFormData({ ...formData, cashfreeSecretKey: e.target.value })}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </>
            )}

            {/* Stripe Credentials */}
            {formData.activeGateway === 'stripe' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Stripe Publishable Key
                  </label>
                  <input
                    type="text"
                    value={formData.stripePublishableKey || ''}
                    onChange={e => setFormData({ ...formData, stripePublishableKey: e.target.value })}
                    placeholder="pk_live_xxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    value={formData.stripeSecretKey || ''}
                    onChange={e => setFormData({ ...formData, stripeSecretKey: e.target.value })}
                    placeholder="sk_live_••••••••••••••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </>
            )}

            {/* PayU Credentials */}
            {formData.activeGateway === 'payu' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    PayU Merchant Key
                  </label>
                  <input
                    type="text"
                    value={formData.payuMerchantKey || ''}
                    onChange={e => setFormData({ ...formData, payuMerchantKey: e.target.value })}
                    placeholder="PayU Merchant Key"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    PayU Merchant Salt
                  </label>
                  <input
                    type="password"
                    value={formData.payuMerchantSalt || ''}
                    onChange={e => setFormData({ ...formData, payuMerchantSalt: e.target.value })}
                    placeholder="PayU Merchant Salt"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </>
            )}

            {/* PhonePe Credentials */}
            {formData.activeGateway === 'phonepe' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    PhonePe Merchant ID
                  </label>
                  <input
                    type="text"
                    value={formData.phonepeMerchantId || ''}
                    onChange={e => setFormData({ ...formData, phonepeMerchantId: e.target.value })}
                    placeholder="M22XXXXXXXXXX"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    PhonePe Salt Key
                  </label>
                  <input
                    type="password"
                    value={formData.phonepeSaltKey || ''}
                    onChange={e => setFormData({ ...formData, phonepeSaltKey: e.target.value })}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Enabled Payment Modes */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Enabled Payment Modes on Frontend
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enablePaymentGateway}
                  onChange={e => setFormData({ ...formData, enablePaymentGateway: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">Online Gateway (All in One)</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableUpi}
                  onChange={e => setFormData({ ...formData, enableUpi: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">UPI QR & Apps (BHIM, GPay)</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableBankTransfer}
                  onChange={e => setFormData({ ...formData, enableBankTransfer: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">Direct Bank NEFT/RTGS/IMPS</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableCards ?? true}
                  onChange={e => setFormData({ ...formData, enableCards: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">Debit / Credit Cards</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableNetbanking ?? true}
                  onChange={e => setFormData({ ...formData, enableNetbanking: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">Net Banking (50+ Banks)</span>
              </label>

              <label className="flex items-center space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableManualOther}
                  onChange={e => setFormData({ ...formData, enableManualOther: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-0 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <span className="text-xs font-semibold text-slate-200">Offline Cheque / Draft</span>
              </label>
            </div>
          </div>
        </form>
      )}

      {/* 2. BANK ACCOUNT & UPI QR CONFIGURATION */}
      {activeSubSection === 'bank_upi' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building className="w-4 h-4 text-teal-400" />
                <span>Official Association Bank Account & Dynamic UPI QR</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                These credentials appear on public donation forms and official 80G tax exemption receipts.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Bank & UPI Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Account Holder Name *</label>
              <input
                type="text"
                required
                value={formData.accountHolderName}
                onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Bank Name *</label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Account Number *</label>
              <input
                type="text"
                required
                value={formData.accountNumber}
                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">IFSC Code *</label>
              <input
                type="text"
                required
                value={formData.ifscCode}
                onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">SWIFT / BIC Code (for International Alumni)</label>
              <input
                type="text"
                value={formData.swiftCode || ''}
                onChange={e => setFormData({ ...formData, swiftCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Branch Name & Address</label>
              <input
                type="text"
                value={formData.branchName}
                onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Official UPI ID (VPA) *</label>
              <input
                type="text"
                required
                value={formData.upiId}
                onChange={e => {
                  const newUpi = e.target.value;
                  const newQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${encodeURIComponent(newUpi)}%26pn=JNV%20Pachpadra%20Alumni%20Association%26cu=INR`;
                  setFormData({ ...formData, upiId: newUpi, upiQrImageUrl: newQr });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">UPI QR Code Image URL</label>
              <input
                type="text"
                value={formData.upiQrImageUrl || ''}
                onChange={e => setFormData({ ...formData, upiQrImageUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Donation Helpdesk Email</label>
              <input
                type="email"
                value={formData.donationContactEmail}
                onChange={e => setFormData({ ...formData, donationContactEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Donation Helpdesk Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.donationContactPhone}
                onChange={e => setFormData({ ...formData, donationContactPhone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Payment Instructions for Donors</label>
              <textarea
                rows={3}
                value={formData.paymentInstructions}
                onChange={e => setFormData({ ...formData, paymentInstructions: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </form>
      )}

      {/* 3. 80G TAX, CURRENCY & LIMITS */}
      {activeSubSection === 'limits_tax' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Section 80G Tax Exemption & Transaction Limits</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set minimum/maximum donation boundaries and statutory 80G tax benefit parameters under Income Tax Act.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save 80G & Limit Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Default Currency</label>
              <select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="INR (₹)">Indian Rupee - INR (₹)</option>
                <option value="USD ($)">US Dollar - USD ($)</option>
                <option value="EUR (€)">Euro - EUR (€)</option>
                <option value="GBP (£)">British Pound - GBP (£)</option>
                <option value="AED (د.إ)">UAE Dirham - AED (د.إ)</option>
                <option value="CAD ($)">Canadian Dollar - CAD ($)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Minimum Donation Amount ({formData.currency})</label>
              <input
                type="number"
                min={1}
                value={formData.minDonationAmount}
                onChange={e => setFormData({ ...formData, minDonationAmount: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Maximum Donation Amount ({formData.currency})</label>
              <input
                type="number"
                min={100}
                value={formData.maxDonationAmount || 5000000}
                onChange={e => setFormData({ ...formData, maxDonationAmount: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Tax Exemption Percentage (80G Benefit %)</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.taxBenefitPercentage}
                  onChange={e => setFormData({ ...formData, taxBenefitPercentage: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <span className="absolute right-3 top-2 text-slate-400 font-bold text-sm">%</span>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">80G Registration / Order Number *</label>
              <input
                type="text"
                required
                value={formData.reg80GNumber}
                onChange={e => setFormData({ ...formData, reg80GNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-400">Printed on official computerized donor receipts for claiming income tax deduction.</p>
            </div>
          </div>
        </form>
      )}

      {/* 4. SUCCESS / FAILURE & WEBHOOKS */}
      {activeSubSection === 'success_fail' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Settings className="w-4 h-4 text-teal-400" />
                <span>Payment Success, Failure Redirection & Webhooks</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize redirection endpoints and donor messaging upon transaction success or failure.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Redirect Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Success Redirect URL</label>
              <input
                type="text"
                value={formData.successRedirectUrl || ''}
                onChange={e => setFormData({ ...formData, successRedirectUrl: e.target.value })}
                placeholder="/alumni/welfare?status=success"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Failure Redirect URL</label>
              <input
                type="text"
                value={formData.failureRedirectUrl || ''}
                onChange={e => setFormData({ ...formData, failureRedirectUrl: e.target.value })}
                placeholder="/alumni/welfare?status=failed"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Custom Payment Success Message</label>
              <textarea
                rows={2}
                value={formData.successCustomMessage || ''}
                onChange={e => setFormData({ ...formData, successCustomMessage: e.target.value })}
                placeholder="Thank you for your generous contribution to JNV Pachpadra Alumni Welfare. Your 80G tax receipt has been generated."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Custom Payment Failure Message</label>
              <textarea
                rows={2}
                value={formData.failureCustomMessage || ''}
                onChange={e => setFormData({ ...formData, failureCustomMessage: e.target.value })}
                placeholder="Your transaction could not be processed. If funds were debited, they will be reversed by your bank within 3-5 working days."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">Webhook Notification Endpoint</label>
              <input
                type="text"
                value={formData.webhookUrl || ''}
                onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://jnvpachpadra.org/api/donations/webhook"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </form>
      )}

      {/* 5. TRANSACTION AUDIT, VERIFICATION & 80G RECEIPTS */}
      {activeSubSection === 'transactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-teal-400" />
                <span>Welfare Payment Ledger, 80G Receipts & Refunds</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify pending transfers, review donor PANs, generate official receipts, and process refunds or cancellations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV('donations')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Search and Status Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by donor name, email, PAN, receipt no, UTR ref, campaign..."
                value={searchTx}
                onChange={e => setSearchTx(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="VERIFIED">Verified / Success (80G Issued)</option>
                <option value="PENDING">Pending Verification</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded / Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-3">Receipt / ID</th>
                  <th className="py-3 px-3">Donor Details</th>
                  <th className="py-3 px-3">Amount & Mode</th>
                  <th className="py-3 px-3">Campaign / Cause</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No payment transactions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <div className="font-mono text-teal-300 font-bold">{tx.receiptNumber}</div>
                        <div className="text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        {tx.transactionRef && (
                          <div className="text-[10px] text-slate-400 font-mono">Ref: {tx.transactionRef}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{tx.donorName}</div>
                        <div className="text-[11px] text-slate-400">{tx.donorEmail}</div>
                        {tx.donorPan && (
                          <div className="text-[10px] text-amber-400 font-mono font-semibold">PAN: {tx.donorPan}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-black text-white text-sm">₹{tx.amount.toLocaleString('en-IN')}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase font-semibold">
                          {tx.paymentMode}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-300 font-medium max-w-xs truncate">{tx.campaignTitle || 'General Welfare Fund'}</div>
                        <div className="text-[10px] text-teal-400 font-mono">80G Exemption: 50%</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.paymentStatus === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : tx.paymentStatus === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : tx.paymentStatus === 'REFUNDED'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {tx.paymentStatus}
                        </span>
                        {tx.rejectionReason && (
                          <div className="text-[10px] text-slate-400 mt-1 italic max-w-xs truncate">{tx.rejectionReason}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenReceipt(tx)}
                            className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition cursor-pointer"
                            title="View / Print Official 80G Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {tx.paymentStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => verifyDonationRecord(tx.id, user?.displayName || 'Super Admin')}
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition cursor-pointer"
                                title="Approve / Verify Payment & Issue 80G Receipt"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setTxToReject(tx);
                                  setIsRejectModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer"
                                title="Reject Payment"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {tx.paymentStatus === 'VERIFIED' && (
                            <button
                              onClick={() => {
                                setTxToRefund(tx);
                                setIsRefundModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition cursor-pointer"
                              title="Process Refund / Cancellation"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {isRefundModalOpen && txToRefund && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-purple-400">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Process Donation Refund</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to mark Receipt <span className="font-mono text-teal-300 font-bold">{txToRefund.receiptNumber}</span> of amount <span className="font-bold text-white">₹{txToRefund.amount.toLocaleString('en-IN')}</span> from <span className="text-white font-semibold">{txToRefund.donorName}</span> as <strong>REFUNDED</strong>.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Audit Reason / Bank Reversal Ref *</label>
              <textarea
                rows={2}
                required
                value={refundNote}
                onChange={e => setRefundNote(e.target.value)}
                placeholder="Reason for cancellation / refund bank reference..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsRefundModalOpen(false);
                  setTxToRefund(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessRefund}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && txToReject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <X className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Reject Payment Record</h3>
            </div>
            <p className="text-xs text-slate-300">
              Rejecting transaction <span className="font-mono text-rose-300">{txToReject.receiptNumber}</span> by <span className="text-white font-semibold">{txToReject.donorName}</span>.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Rejection Reason *</label>
              <input
                type="text"
                required
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR reference not matching bank statement..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setTxToReject(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
