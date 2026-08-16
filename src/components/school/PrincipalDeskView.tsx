import React from 'react';
import { UserCheck, Shield, Award, Users, BookOpen, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const PrincipalDeskView: React.FC = () => {
  const { schoolSettings, vmcMembers } = useData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="principal-desk-view-container"
    >
      {/* Principal's Message Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
            <ImageWithFallback
              src={schoolSettings.principalPhotoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop"}
              alt={`Principal ${schoolSettings.principalName}`}
              className="w-48 h-48 rounded-3xl object-cover border-4 border-amber-200 shadow-md"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{schoolSettings.principalName}</h2>
              <p className="text-xs text-amber-800 font-semibold">Principal, {schoolSettings.schoolName}</p>
              <p className="text-[11px] text-slate-500">M.Sc. (Physics), M.Ed., UGC-NET</p>
              {schoolSettings.principalEmail && (
                <p className="text-[10px] text-slate-400 font-mono mt-1">{schoolSettings.principalEmail}</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="inline-flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Quote className="w-4 h-4" />
              <span>Official Address</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome to {schoolSettings.schoolName}
            </h1>

            <div className="whitespace-pre-line leading-relaxed space-y-3 text-slate-600">
              {schoolSettings.principalMessage}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span>Warm regards,</span>
              <span className="font-serif italic text-amber-800 text-sm font-semibold">{schoolSettings.principalName}, Principal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vidyalaya Management Committee (VMC) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Vidyalaya Management Committee (VMC)</h2>
            <p className="text-xs text-slate-500">
              Constitutional body governing school administration under the chairmanship of District Collector, Barmer / Balotra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vmcMembers.map((vmc) => (
            <div
              key={vmc.id}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs"
            >
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                {vmc.designation}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{vmc.name}</h3>
              <p className="text-xs text-slate-500">{vmc.organization}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

