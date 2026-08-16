import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Award,
  Search,
  BookOpen,
  Filter,
  Phone
} from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const FacultyView: React.FC = () => {
  const { faculty } = useData();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [facultySearch, setFacultySearch] = useState<string>('');

  const departments = [
    'All',
    'Administration',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Computer Science',
    'Social Science',
    'Languages',
    'Physical Education',
    'Art & Music'
  ];

  const filteredFaculty = faculty.filter(f => {
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    const matchesSearch =
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.designation.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.department.toLowerCase().includes(facultySearch.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="faculty-view-container"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Eminent Academic & Residential Mentors</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Faculty & Staff Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Our highly qualified, UGC/CBSE certified teachers and residential house masters are committed to 24/7 student mentoring, intellectual development, and pastoral welfare.
        </p>
      </div>

      {/* Search & Department Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty by name, department..."
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredFaculty.length}</strong> faculty members
          </div>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedDept === dept
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-amber-400/60 transition group shadow-xs"
          >
            <div className="flex items-start space-x-4">
              <ImageWithFallback
                src={f.photoUrl}
                alt={f.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-amber-300 shadow-2xs shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  {f.department}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">
                  {f.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{f.designation}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Qualification:</span>
                <span className="font-semibold text-slate-800 text-right">{f.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Teaching Exp:</span>
                <span className="font-semibold text-amber-800">{f.experienceYears}+ Years</span>
              </div>
              {f.email && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">Official Email:</span>
                  <a href={`mailto:${f.email}`} className="text-blue-700 hover:underline flex items-center space-x-1 font-mono text-[11px]">
                    <Mail className="w-3 h-3" />
                    <span>{f.email}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
