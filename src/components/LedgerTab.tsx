import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const LedgerTab: React.FC = () => {
  const { transactions } = useData();
  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');

  const totalCredits = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalCredits - totalDebits;

  const filteredTransactions = filterType === 'ALL'
    ? transactions
    : transactions.filter(t => t.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <ReceiptText className="w-6 h-6 text-amber-400" />
              <span>Public Financial Transparency Ledger</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Every single rupee contributed or disbursed is transparently audited by honorary CA alumni.
            </p>
          </div>

          <span className="inline-flex items-center space-x-1.5 text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-xl border border-blue-500/20 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Audited by K.C. Verma & Associates LLP</span>
          </span>
        </div>

        {/* Balance Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Inflow (Donations)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              ₹{(totalCredits ?? 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400">100% Tax-Exempt Receipts</span>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Outflow (Disbursed)</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400 mt-2">
              ₹{(totalDebits ?? 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400">Direct Welfare & Scholarships</span>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Reserve Corpus</span>
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              ₹{(netBalance ?? 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold">Available for Relief</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Type:</span>
        </span>
        {(['ALL', 'CREDIT', 'DEBIT'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterType === type
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {type === 'ALL' ? 'All Transactions' : type === 'CREDIT' ? 'Inflow (Credits)' : 'Outflow (Debits)'}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Tx ID / Date</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white font-semibold block">{tx.transactionId}</span>
                    <span className="text-[10px] text-slate-500">{tx.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium text-[11px] border border-slate-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 max-w-sm">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-sm">
                    {tx.type === 'CREDIT' ? (
                      <span className="text-emerald-400">+₹{(tx.amount ?? 0).toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-red-400">-₹{(tx.amount ?? 0).toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{tx.auditedBy}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
