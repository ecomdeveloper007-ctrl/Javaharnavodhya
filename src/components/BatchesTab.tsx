import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  GraduationCap,
  Users,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Calendar,
  Heart
} from 'lucide-react';

export const BatchesTab: React.FC = () => {
  const { batches, alumni, setActiveTab, setSearchQuery } = useData();
  const [selectedBatchYear, setSelectedBatchYear] = useState<number | 'ALL'>('ALL');

  const filteredBatches = selectedBatchYear === 'ALL'
    ? batches
    : batches.filter(b => b.passoutYear === selectedBatchYear);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-amber-400" />
              <span>Passout Batches & Hubs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Celebrating three decades of Navodaya legacy. Connect with your class coordinator and official batch groups.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Filter Year:</span>
            <select
              value={selectedBatchYear}
              onChange={(e) => setSelectedBatchYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-800 text-xs sm:text-sm text-white rounded-xl border border-slate-700"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.passoutYear}>
                  Batch {b.passoutYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBatches.map((batch) => {
          const batchAlumniCount = alumni.filter((a) => a.batchYear === batch.passoutYear).length;

          return (
            <div
              key={batch.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
            >
              {/* Batch Photo */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden group">
                <img
                  src={batch.batchPhoto}
                  alt={batch.batchName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow">
                      Batch of {batch.passoutYear}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1 shadow-sm">
                      {batch.batchName}
                    </h3>
                  </div>
                  <span className="text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 font-semibold">
                    {batch.totalStudents} Students
                  </span>
                </div>
              </div>

              {/* Batch Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {batch.description}
                  </p>

                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Batch Coordinator:</span>
                      <span className="font-semibold text-slate-200">{batch.coordinatorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Contact:</span>
                      <a
                        href={`tel:${batch.coordinatorPhone}`}
                        className="text-amber-400 font-semibold hover:underline flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{batch.coordinatorPhone}</span>
                      </a>
                    </div>
                    {batch.motto && (
                      <div className="pt-1 text-[11px] text-amber-300/90 italic border-t border-slate-700/60">
                        "{batch.motto}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Batch Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery(batch.passoutYear.toString());
                      setActiveTab('directory');
                    }}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>View {batchAlumniCount} Batchmates</span>
                  </button>

                  {batch.whatsappGroupLink && (
                    <a
                      href={batch.whatsappGroupLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Hub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
