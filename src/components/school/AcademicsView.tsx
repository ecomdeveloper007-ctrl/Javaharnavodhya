import React from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Cpu,
  GraduationCap,
  FlaskConical,
  Library,
  Languages
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const AcademicsView: React.FC = () => {
  const { toppers, schoolSettings } = useData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="academics-view-container"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>CBSE Affiliated Curriculum (Code: {schoolSettings.schoolCode || '1730058'})</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Academic Programs & Board Results
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Comprehensive, bilingual, STEM-focused curriculum at {schoolSettings.schoolName} following National Education Policy (NEP) guidelines with exceptional academic records across Class VI to XII.
        </p>
      </div>

      {/* Class Levels & Streams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold">
            VI-VIII
          </div>
          <h3 className="text-base font-bold text-slate-900">Middle School Stage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Foundational numeracy, bilingual literacy (Hindi, English & regional language), general science, social science, art, computer education, and yoga.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Continuous Comprehensive Evaluation (CCE)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Three-Language Formula</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
            IX-X
          </div>
          <h3 className="text-base font-bold text-slate-900">Secondary Stage (CBSE)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rigorous preparation for All India Secondary School Examination (AISSE). Includes Class IX national migration scheme to linked non-Hindi states.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Board Pass Record</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Integration Migration</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
            XI-XII
          </div>
          <h3 className="text-base font-bold text-slate-900">Senior Secondary Streams</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Science (Physics, Chemistry, Mathematics, Biology, Computer Science) and Humanities streams with specialized coaching for JEE, NEET, and CUET.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>IIT-JEE & NEET Mentorship</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Advanced Practical Labs</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Board Examination Results & Toppers */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">CBSE Board Merit Holders & Toppers</h2>
            <p className="text-xs text-slate-500">
              Outstanding student achievements in AISSE (Class X) and AISSCE (Class XII) examinations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toppers.map((topper) => (
            <div
              key={topper.id}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs"
            >
              <div className="relative">
                <ImageWithFallback
                  src={topper.photoUrl}
                  alt={topper.name}
                  className="w-full h-44 rounded-xl object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
                  {topper.percentage}%
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{topper.name}</h3>
                <p className="text-xs text-amber-800 font-semibold">{topper.exam} • {topper.stream}</p>
                <p className="text-[11px] text-slate-500 mt-1">{topper.currentPursuit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Laboratories & Technological Facilities */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">STEM & Digital Infrastructure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <FlaskConical className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Integrated Science Labs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with modern apparatus, digital microscopes, glassware, and safety equipment conforming to CBSE norms.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <Cpu className="w-6 h-6 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Computer & Robotics Center</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              40+ high performance workstations, fiber-optic internet, Python coding workshops, and basic robotics kits.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <Library className="w-6 h-6 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Automated Library & Reading Room</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digital cataloging, e-granhalaya software, national periodicals, competitive magazines, and fiction section.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
