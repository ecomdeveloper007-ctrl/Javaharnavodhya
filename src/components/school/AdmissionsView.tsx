import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Calendar,
  FileText,
  Users,
  Award
} from 'lucide-react';

export const AdmissionsView: React.FC = () => {
  const { submitAdmissionEnquiry } = useData();

  // Enquiry form state
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [classSeeking, setClassSeeking] = useState('Class VI');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [ruralQuota, setRuralQuota] = useState(true);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Interactive Eligibility Checker state
  const [dobYear, setDobYear] = useState('2014');
  const [dobMonth, setDobMonth] = useState('5');
  const [isRuralSchool, setIsRuralSchool] = useState('yes');
  const [passedClassV, setPassedClassV] = useState('yes');
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(dobYear, 10);
    // Age requirement for Class VI typically 10 to 12 years old as of May 1
    if (year >= 2013 && year <= 2015 && isRuralSchool === 'yes' && passedClassV === 'yes') {
      setEligibilityResult('ELIGIBLE: The candidate meets all age and rural schooling requirements for JNVST Class VI.');
    } else if (year < 2013 || year > 2015) {
      setEligibilityResult('AGE LIMIT: Candidate age must strictly fall between 10 and 12 years (Born between 01-05-2013 and 30-04-2015).');
    } else {
      setEligibilityResult('INELIGIBLE: Rural quota requires full-time continuous study in Classes III, IV, and V in recognized rural schools.');
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    submitAdmissionEnquiry({
      studentName,
      parentName,
      email: email || 'parent@jnv.in',
      phone,
      classSeeking,
      category,
      ruralQuota,
      message: message || `Enquiry for ${classSeeking} admission.`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStudentName('');
      setParentName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="admissions-view-container"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>JNV Selection Test (JNVST) • Academic Year 2026-27</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Admissions Guidelines & Eligibility
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Admission to Jawahar Navodaya Vidyalaya, Pachpadra is purely based on merit through the nationwide objective examination conducted by the Navodaya Vidyalaya Samiti.
        </p>
      </div>

      {/* Admission Quotas & Reservation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="text-2xl font-bold text-amber-800">75% Rural Quota</div>
          <h3 className="text-sm font-bold text-slate-900">Rural Candidates Reservation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            At least 75% of the total 80 seats in Class VI are strictly reserved for students who have studied in rural schools located in District Barmer.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="text-2xl font-bold text-emerald-800">33% Girls Quota</div>
          <h3 className="text-sm font-bold text-slate-900">Empowerment of Girl Child</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            One-third (33%) of the total seats are reserved for female candidates across all categories (General, SC, ST, OBC, and Divyangjan).
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="text-2xl font-bold text-blue-800">100% Free</div>
          <h3 className="text-sm font-bold text-slate-900">Zero Tuition / Boarding Fees</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Education, nutritious dining, boarding, school uniform, textbooks, stationery, and daily utility kits are provided completely free.
          </p>
        </div>
      </div>

      {/* Interactive Eligibility Checker */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Interactive JNVST Class VI Eligibility Tool</h2>
            <p className="text-xs text-slate-500">
              Instantly check if a candidate meets age, rural schooling, and category criteria for the entrance test.
            </p>
          </div>
        </div>

        <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 text-xs">
            <label className="text-slate-600 font-medium">Candidate Birth Year</label>
            <select
              value={dobYear}
              onChange={(e) => setDobYear(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800"
            >
              <option value="2012">2012</option>
              <option value="2013">2013 (Eligible)</option>
              <option value="2014">2014 (Eligible)</option>
              <option value="2015">2015 (Eligible)</option>
              <option value="2016">2016</option>
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-600 font-medium">School Location (Class 3-5)</label>
            <select
              value={isRuralSchool}
              onChange={(e) => setIsRuralSchool(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800"
            >
              <option value="yes">Recognized Rural School (Barmer)</option>
              <option value="no">Urban / Municipal School</option>
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-600 font-medium">Class V Enrolled Status</label>
            <select
              value={passedClassV}
              onChange={(e) => setPassedClassV(e.target.value)}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800"
            >
              <option value="yes">Currently Studying in Class V (2025-26)</option>
              <option value="no">Not enrolled in Class V</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Verify Eligibility
            </button>
          </div>
        </form>

        {eligibilityResult && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed font-medium ${
              eligibilityResult.startsWith('ELIGIBLE')
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {eligibilityResult}
          </div>
        )}
      </div>

      {/* JNVST Examination Pattern */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">JNVST Selection Test Exam Structure (Class VI)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Section / Subject</th>
                <th className="p-3.5">No. of Questions</th>
                <th className="p-3.5">Total Marks</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Medium of Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3.5 font-bold text-slate-900">1. Mental Ability Test (MAT)</td>
                <td className="p-3.5">40 Questions</td>
                <td className="p-3.5 font-semibold text-amber-800">50 Marks</td>
                <td className="p-3.5">60 Minutes</td>
                <td className="p-3.5">Non-verbal reasoning figures</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">2. Arithmetic Test</td>
                <td className="p-3.5">20 Questions</td>
                <td className="p-3.5 font-semibold text-amber-800">25 Marks</td>
                <td className="p-3.5">30 Minutes</td>
                <td className="p-3.5">Hindi / English / Regional</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">3. Language Test</td>
                <td className="p-3.5">20 Questions</td>
                <td className="p-3.5 font-semibold text-amber-800">25 Marks</td>
                <td className="p-3.5">30 Minutes</td>
                <td className="p-3.5">Comprehension passages</td>
              </tr>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="p-3.5">Total Composite Exam</td>
                <td className="p-3.5">80 Questions</td>
                <td className="p-3.5 text-emerald-800">100 Marks</td>
                <td className="p-3.5">2 Hours (120 Mins)</td>
                <td className="p-3.5">OMR Sheet Based</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Admission Enquiry Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Submit an Admission Enquiry or Callback Request
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Have questions regarding application dates, admit cards, or migration? Send us your query.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold">Enquiry Registered Successfully</h3>
            <p className="text-xs">
              Thank you for reaching out. Our admission counselor will review your submission and contact you on{' '}
              <strong>{phone}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEnquirySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Student's Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Shri Mohan Lal"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Mobile Contact No. *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Class Seeking Admission</label>
                <select
                  value={classSeeking}
                  onChange={(e) => setClassSeeking(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs"
                >
                  <option value="Class VI">Class VI (JNVST Entrance)</option>
                  <option value="Class IX">Class IX (Lateral Entry Test)</option>
                  <option value="Class XI">Class XI (Merit Stream Allotment)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Social Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Non-Creamy Layer)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium text-xs mb-1">Specific Query / Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about syllabus, syllabus languages, hostel arrangements, or document verification..."
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruralQuota}
                  onChange={(e) => setRuralQuota(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span>Student belongs to Rural Gram Panchayat in Barmer</span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Submit Admission Enquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};
