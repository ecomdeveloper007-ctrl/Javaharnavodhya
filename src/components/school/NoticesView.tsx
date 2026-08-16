import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import {
  Bell,
  Download,
  Search,
  Filter,
  FileText,
  Pin,
  Calendar,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices } = useData();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [audienceFilter, setAudienceFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<any | null>(null);

  const categories = ['All', 'Academic', 'Admission', 'General', 'Tender', 'Examination', 'Alumni'];

  const filteredNotices = notices.filter(n => {
    const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
    const matchesAudience = audienceFilter === 'All' || n.targetAudience === audienceFilter || n.targetAudience === 'All';
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.referenceNo && n.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesAudience && matchesSearch;
  });

  const handleDownloadNotice = (notice: any) => {
    const textContent = `JAWAHAR NAVODAYA VIDYALAYA, PACHPADRA (DISTT. BARMER)\nOFFICIAL CIRCULAR / NOTICE\n\nReference No: ${notice.referenceNo || 'N/A'}\nDate: ${notice.publishDate}\nCategory: ${notice.category}\nTarget Audience: ${notice.targetAudience}\n\nTITLE: ${notice.title}\n\n${notice.content}\n\nIssued by:\nOffice of the Principal\nJNV Pachpadra (Barmer)\n(Affiliated to CBSE, New Delhi)`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Notice_${notice.id}_${notice.publishDate}.txt`;
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
      id="notices-view-container"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Bell className="w-3.5 h-3.5" />
          <span>Official Circulars & News Bulletin</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Notices, Circulars & Tenders
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Stay updated with statutory announcements, exam timetables, admission alerts, procurement tenders, and administrative orders issued by the Principal's Office.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search circulars by keyword, reference no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none shadow-2xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none shadow-2xs"
            >
              <option value="All">Audience: All</option>
              <option value="Students">Students</option>
              <option value="Parents">Parents</option>
              <option value="Staff">Staff</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`bg-white border rounded-2xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
              n.isPinned
                ? 'border-amber-400/80 bg-gradient-to-r from-amber-50/60 via-white to-white'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {n.category}
                </span>

                {n.isPinned && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 flex items-center space-x-1">
                    <Pin className="w-3 h-3" />
                    <span>PINNED CIRCULAR</span>
                  </span>
                )}

                <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{n.publishDate}</span>
                </span>

                {n.referenceNo && (
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {n.referenceNo}</span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900">{n.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => setSelectedNoticeModal(n)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center space-x-1 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-blue-700" />
                <span>Read Full</span>
              </button>

              <button
                onClick={() => handleDownloadNotice(n)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                title="Download text copy"
              >
                <Download className="w-3.5 h-3.5 text-emerald-800" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Lightbox Modal */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {selectedNoticeModal.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedNoticeModal.title}</h3>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Published: {selectedNoticeModal.publishDate} • Ref: {selectedNoticeModal.referenceNo || 'N/A'}
                </div>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{selectedNoticeModal.content}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => handleDownloadNotice(selectedNoticeModal)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Official Copy</span>
              </button>
              <button
                onClick={() => setSelectedNoticeModal(null)}
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
