import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { AlumniProfile, HouseType } from '../types';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Droplet,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Shield,
  HelpCircle,
  X,
  MessageSquareShare
} from 'lucide-react';

export const DirectoryTab: React.FC = () => {
  const { alumni, searchQuery, setSearchQuery, setIsRegisterModalOpen } = useData();

  const [selectedHouse, setSelectedHouse] = useState<HouseType>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [onlyMentors, setOnlyMentors] = useState<boolean>(false);
  const [onlyHiring, setOnlyHiring] = useState<boolean>(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

  // Extract unique batches
  const availableBatches = useMemo(() => {
    const batches = Array.from(new Set(alumni.map((a) => Number(a.batchYear)))).sort((a, b) => Number(b) - Number(a));
    return batches;
  }, [alumni]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Filtered alumni list
  const filteredAlumni = useMemo(() => {
    return alumni.filter((alum) => {
      const q = searchQuery.toLowerCase().trim();

      // Check if user searched for "blood donor" or "blood"
      const isBloodSearch = q.includes('blood') || q.includes('donor');
      
      const matchesSearch =
        q === '' ||
        (isBloodSearch && alum.bloodGroup) ||
        alum.fullName.toLowerCase().includes(q) ||
        alum.profession.toLowerCase().includes(q) ||
        alum.company.toLowerCase().includes(q) ||
        alum.city.toLowerCase().includes(q) ||
        alum.state.toLowerCase().includes(q) ||
        alum.batchYear.toString().includes(q) ||
        (alum.house && alum.house.toLowerCase().includes(q)) ||
        (alum.bloodGroup && alum.bloodGroup.toLowerCase().includes(q));

      const matchesHouse = selectedHouse === 'All' || alum.house === selectedHouse;
      const matchesBatch = selectedBatch === 'All' || alum.batchYear.toString() === selectedBatch;
      const matchesBlood = selectedBloodGroup === 'All' || alum.bloodGroup === selectedBloodGroup;
      const matchesMentor = !onlyMentors || alum.isMentorAvailable;
      const matchesHiring = !onlyHiring || alum.isHiring;

      return matchesSearch && matchesHouse && matchesBatch && matchesBlood && matchesMentor && matchesHiring;
    });
  }, [alumni, searchQuery, selectedHouse, selectedBatch, selectedBloodGroup, onlyMentors, onlyHiring]);

  const getHouseBadgeColor = (house?: string) => {
    switch (house) {
      case 'Aravali':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Nilgiri':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Shivalik':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Udaygiri':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Alumni Directory & Network</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                {filteredAlumni.length} Navodayans Found
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search and connect with verified alumni across batches, professions, and locations.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="self-start md:self-auto flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join / Add My Profile</span>
          </button>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, role, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* House selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              School House
            </label>
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value as HouseType)}
              className="w-full px-3 py-2 bg-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="All">All Houses (4)</option>
              <option value="Aravali">Aravali House</option>
              <option value="Nilgiri">Nilgiri House</option>
              <option value="Shivalik">Shivalik House</option>
              <option value="Udaygiri">Udaygiri House</option>
            </select>
          </div>

          {/* Batch Year selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              Passout Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="All">All Batches</option>
              {availableBatches.map((year) => (
                <option key={year} value={year.toString()}>
                  Batch of {year}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              Blood Group (Emergency)
            </label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-red-300"
            >
              <option value="All">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  🩸 {bg} Donors
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary quick toggles */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Quick Filters:</span>
          </span>

          <button
            onClick={() => setOnlyMentors(!onlyMentors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              onlyMentors
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Available Mentors</span>
          </button>

          <button
            onClick={() => setOnlyHiring(!onlyHiring)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              onlyHiring
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Briefcase className="w-3 h-3 text-purple-400" />
            <span>Currently Hiring</span>
          </button>

          {(selectedHouse !== 'All' ||
            selectedBatch !== 'All' ||
            selectedBloodGroup !== 'All' ||
            onlyMentors ||
            onlyHiring ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedHouse('All');
                setSelectedBatch('All');
                setSelectedBloodGroup('All');
                setOnlyMentors(false);
                setOnlyHiring(false);
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline ml-auto font-medium cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Alumni Profiles Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Alumni Matched Your Filter</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Try adjusting your search criteria or register yourself if you are an alumnus of this batch!
          </p>
          <button
            onClick={() => {
              setSelectedHouse('All');
              setSelectedBatch('All');
              setSelectedBloodGroup('All');
              setOnlyMentors(false);
              setOnlyHiring(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl border border-slate-700"
          >
            View All Alumni
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlumni.map((alum) => (
            <div
              key={alum.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Avatar, Name & Batch */}
                <div className="flex items-start space-x-3.5">
                  <div className="relative">
                    <img
                      src={alum.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                      alt={alum.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-amber-500 transition"
                    />
                    {alum.verificationStatus === 'verified' && (
                      <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-slate-900" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-amber-300 transition">
                        {alum.fullName}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center space-x-1 text-[11px] bg-slate-800 text-amber-300 font-semibold px-2 py-0.5 rounded-md border border-slate-700">
                        <GraduationCap className="w-3 h-3" />
                        <span>Batch {alum.batchYear}</span>
                      </span>

                      {alum.house && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getHouseBadgeColor(
                            alum.house
                          )}`}
                        >
                          {alum.house}
                        </span>
                      )}

                      {alum.bloodGroup && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60">
                          🩸 {alum.bloodGroup}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profession & Company */}
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800 space-y-1">
                  <p className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{alum.profession}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 truncate pl-5">
                    {alum.company} {alum.designation ? `• ${alum.designation}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1 pl-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{alum.city}, {alum.state || alum.country}</span>
                  </p>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {alum.bio}
                </p>

                {/* Special Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {alum.isMentorAvailable && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                      ★ Open to Mentorship
                    </span>
                  )}
                  {alum.isHiring && (
                    <span className="text-[10px] bg-purple-500/10 text-purple-300 font-semibold px-2 py-0.5 rounded border border-purple-500/30">
                      ⚡ Hiring / Referrals
                    </span>
                  )}
                  {alum.isBusinessOwner && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                      💼 Business Founder
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
                <button
                  onClick={() => setSelectedAlumni(alum)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  View Full Profile
                </button>

                {alum.linkedIn && (
                  <a
                    href={alum.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {alum.phone && (
                  <a
                    href={`https://wa.me/${alum.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                    title="Connect on WhatsApp"
                  >
                    <MessageSquareShare className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alumni Detail Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative text-white">
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              <img
                src={selectedAlumni.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
                alt={selectedAlumni.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">{selectedAlumni.fullName}</h2>
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xs font-semibold text-amber-400">
                  {selectedAlumni.profession}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedAlumni.company} {selectedAlumni.designation ? `• ${selectedAlumni.designation}` : ''}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] font-semibold bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                    🎓 Batch {selectedAlumni.batchYear}
                  </span>
                  {selectedAlumni.house && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getHouseBadgeColor(selectedAlumni.house)}`}>
                      {selectedAlumni.house} House
                    </span>
                  )}
                  {selectedAlumni.bloodGroup && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      🩸 Blood: {selectedAlumni.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Alumnus</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedAlumni.bio}
              </p>
            </div>

            {/* Location & Industry */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Current Location</span>
                <span className="font-semibold text-slate-200 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedAlumni.city}, {selectedAlumni.state} ({selectedAlumni.country})</span>
                </span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Industry Domain</span>
                <span className="font-semibold text-slate-200">{selectedAlumni.industry || 'General'}</span>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Contact & Links</h4>
              <div className="space-y-2 text-xs">
                {selectedAlumni.email && (
                  <a
                    href={`mailto:${selectedAlumni.email}`}
                    className="flex items-center space-x-2 p-2.5 bg-slate-800 hover:bg-slate-750 rounded-xl border border-slate-700 text-slate-200 transition"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>{selectedAlumni.email}</span>
                  </a>
                )}

                {selectedAlumni.phone && (
                  <a
                    href={`tel:${selectedAlumni.phone}`}
                    className="flex items-center space-x-2 p-2.5 bg-slate-800 hover:bg-slate-750 rounded-xl border border-slate-700 text-slate-200 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{selectedAlumni.phone} (Click to Call)</span>
                  </a>
                )}

                {selectedAlumni.linkedIn && (
                  <a
                    href={selectedAlumni.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 bg-slate-800 hover:bg-blue-600/20 rounded-xl border border-slate-700 text-blue-300 transition"
                  >
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span>View LinkedIn Profile</span>
                  </a>
                )}

                {selectedAlumni.website && (
                  <a
                    href={selectedAlumni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-2.5 bg-slate-800 hover:bg-slate-750 rounded-xl border border-slate-700 text-slate-200 transition"
                  >
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>{selectedAlumni.website}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedAlumni(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
