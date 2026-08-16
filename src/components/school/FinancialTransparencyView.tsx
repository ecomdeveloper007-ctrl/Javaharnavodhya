import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import {
  FileCheck,
  Download,
  ShieldCheck,
  Eye,
  TrendingUp,
  Search,
  Lock,
  Globe,
  DollarSign,
  PieChart,
  Filter
} from 'lucide-react';
import { FinancialReport, FinancialTransaction } from '../../types';

export const FinancialTransparencyView: React.FC = () => {
  const {
    financialReports,
    ledgerTransactions,
    user,
    exportToCSV,
    loginWithGoogle
  } = useData();

  const [activeTab, setActiveTab] = useState<'reports' | 'ledger'>('reports');
  const [selectedReportModal, setSelectedReportModal] = useState<FinancialReport | null>(null);
  const [txSearch, setTxSearch] = useState<string>('');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('All');
  const [txCategoryFilter, setTxCategoryFilter] = useState<string>('All');

  const publicReports = financialReports.filter(r => r.visibility === 'public' || Boolean(user));

  const totalCredits = ledgerTransactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = ledgerTransactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalCredits - totalDebits;

  const filteredTransactions = ledgerTransactions.filter(t => {
    // Visibility check
    if (t.visibility === 'alumni_only' && !user) return false;
    if (t.visibility === 'admin_only' && (!user || !user.isAdmin)) return false;

    const matchesSearch =
      t.description.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.payeeOrDonor && t.payeeOrDonor.toLowerCase().includes(txSearch.toLowerCase()));

    const matchesType = txTypeFilter === 'All' || t.type === txTypeFilter;
    const matchesCategory = txCategoryFilter === 'All' || t.category === txCategoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDownloadReport = (rep: FinancialReport) => {
    const textContent = `JAWAHAR NAVODAYA VIDYALAYA PACHPADRA ALUMNI ASSOCIATION\nSTATUTORY FINANCIAL & AUDIT REPORT\n\nTitle: ${rep.title}\nFinancial Year: ${rep.financialYear}\nCategory: ${rep.category}\nAuditor Name: ${rep.auditorName || 'Chartered Accountant'}\nTotal Amount Audited: INR ${rep.amountAudited?.toLocaleString('en-IN') || 'N/A'}\nPublished Date: ${rep.publishedDate}\n\nSUMMARY & AUDIT OBSERVATIONS:\n${rep.reportSummary}\n\nCertified & Audited under Indian Accounting Standards.`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Report_${rep.financialYear.replace('/', '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="financial-transparency-container"
    >
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Open Governance & 100% Audited Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Financial Transparency & Public Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Complete statutory compliance statements, annual balance sheets audited by Chartered Accountants, and real-time transaction ledger tracking every rupee utilized for school welfare and alumni development.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Statutory Audit Reports ({financialReports.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Line-by-Line Transaction Ledger ({ledgerTransactions.length})
          </button>
        </div>
      </div>

      {/* High Level Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Audited Receipts (Credits)</span>
          <div className="text-2xl font-bold text-emerald-700">
            ₹{(totalCredits ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Alumni donations, sponsorships & grants</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Disbursed (Debits)</span>
          <div className="text-2xl font-bold text-red-600">
            ₹{(totalDebits ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Smart labs, student scholarships, reunions</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Net Available Corpus</span>
          <div className="text-2xl font-bold text-amber-800">
            ₹{(netBalance ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Bank verified reserves with SBI Pachpadra</div>
        </div>
      </div>

      {/* TAB 1: STATUTORY AUDIT REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Annual Statutory Financial Reports</h2>
              <p className="text-xs text-slate-500">
                Audited statements approved by the Association Governing Body and external Chartered Accountants.
              </p>
            </div>
            <button
              onClick={() => exportToCSV('financial_reports')}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-800" />
              <span>Export Audit Index</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 hover:border-amber-400/60 transition flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                      FY {rep.financialYear}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rep.visibility === 'public'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {rep.visibility.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{rep.title}</h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {rep.reportSummary}
                  </p>

                  <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Auditor:</span>
                      <span className="font-semibold text-slate-800">{rep.auditorName}</span>
                    </div>
                    {rep.amountAudited != null && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Audited Amount:</span>
                        <span className="font-bold text-amber-800">
                          ₹{(rep.amountAudited ?? 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setSelectedReportModal(rep)}
                    className="text-xs text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Observations</span>
                  </button>

                  <button
                    onClick={() => handleDownloadReport(rep)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-800 rounded-xl transition border border-slate-200 cursor-pointer shadow-2xs"
                    title="Download Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTION LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Financial Ledger Entries</h2>
              <p className="text-xs text-slate-500">
                Itemized transaction record showing source, purpose, beneficiary, and audit clearance.
              </p>
            </div>
            <button
              onClick={() => exportToCSV('ledger')}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-800" />
              <span>Export Ledger to CSV</span>
            </button>
          </div>

          {!user && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center space-x-2 text-amber-800">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Showing public transactions. Sign in as verified alumnus for full detailed donor & recipient ledgers.</span>
              </div>
              <button
                onClick={loginWithGoogle}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shrink-0 cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search transaction description, ID, donor..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <select
              value={txTypeFilter}
              onChange={(e) => setTxTypeFilter(e.target.value)}
              className="bg-white text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none shadow-2xs"
            >
              <option value="All">All Types (Credit & Debit)</option>
              <option value="CREDIT">Credits (Income / Donations)</option>
              <option value="DEBIT">Debits (Expenses / Disbursements)</option>
            </select>

            <select
              value={txCategoryFilter}
              onChange={(e) => setTxCategoryFilter(e.target.value)}
              className="bg-white text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none shadow-2xs"
            >
              <option value="All">All Categories</option>
              <option value="Donations">Donations</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Events">Events</option>
              <option value="Welfare">Welfare</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Ref No. & Date</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Description & Payee/Donor</th>
                    <th className="p-3.5">Audited By</th>
                    <th className="p-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5">
                        <div className="font-mono text-slate-900 font-bold">{t.transactionId}</div>
                        <div className="text-[10px] text-slate-400">{t.date}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.type === 'CREDIT'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">{t.category}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{t.description}</div>
                        {t.payeeOrDonor && (
                          <div className="text-[11px] text-amber-800">
                            Donor / Payee: {t.payeeOrDonor}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-[11px] text-slate-500">{t.auditedBy || 'CA Verified'}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-sm">
                        <span className={t.type === 'CREDIT' ? 'text-emerald-800' : 'text-red-700'}>
                          {t.type === 'CREDIT' ? '+' : '-'}₹{(t.amount ?? 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  FY {selectedReportModal.financialYear}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedReportModal.title}</h3>
                <p className="text-xs text-slate-500">Auditor: {selectedReportModal.auditorName}</p>
              </div>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider">
                Auditor's Notes & Summary
              </h4>
              <p>{selectedReportModal.reportSummary}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => handleDownloadReport(selectedReportModal)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report Copy</span>
              </button>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
