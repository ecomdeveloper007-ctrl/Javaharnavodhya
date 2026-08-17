import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Heart,
  Droplet,
  Search,
  Filter,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Building2,
  Users,
  X,
  Share2,
  HeartHandshake,
  Activity,
  ArrowRight
} from 'lucide-react';
import { BloodGroup, BloodDonor, BloodRequest } from '../../types';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodDonationView: React.FC = () => {
  const {
    bloodDonors,
    bloodRequests,
    addBloodDonor,
    toggleBloodDonorAvailability,
    submitBloodRequest,
    updateBloodRequestStatus,
    user
  } = useData();
  const { isHindi } = useLanguage();

  // Filter state
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);

  // Modals state
  const [isRegisterDonorModalOpen, setIsRegisterDonorModalOpen] = useState<boolean>(false);
  const [isRequestBloodModalOpen, setIsRequestBloodModalOpen] = useState<boolean>(false);

  // Register Donor Form state
  const [donorName, setDonorName] = useState<string>(user?.displayName || '');
  const [donorBatch, setDonorBatch] = useState<number>(user?.profile?.batchYear || 2014);
  const [donorBloodGroup, setDonorBloodGroup] = useState<BloodGroup>('O+');
  const [donorPhone, setDonorPhone] = useState<string>(user?.profile?.phone || '');
  const [donorEmail, setDonorEmail] = useState<string>(user?.email || '');
  const [donorCity, setDonorCity] = useState<string>(user?.profile?.city || 'Barmer');
  const [donorState, setDonorState] = useState<string>('Rajasthan');
  const [donorCanTravel, setDonorCanTravel] = useState<boolean>(true);

  // Blood Request Form state
  const [reqPatientName, setReqPatientName] = useState<string>('');
  const [reqBloodGroup, setReqBloodGroup] = useState<BloodGroup>('B+');
  const [reqUnits, setReqUnits] = useState<number>(2);
  const [reqHospital, setReqHospital] = useState<string>('');
  const [reqCity, setReqCity] = useState<string>('Barmer');
  const [reqContactName, setReqContactName] = useState<string>(user?.displayName || '');
  const [reqContactPhone, setReqContactPhone] = useState<string>(user?.profile?.phone || '');
  const [reqUrgency, setReqUrgency] = useState<'NORMAL' | 'URGENT' | 'CRITICAL'>('URGENT');
  const [reqNotes, setReqNotes] = useState<string>('');

  // Filtering donors
  const uniqueCities = ['All', ...Array.from(new Set(bloodDonors.map(d => d.city).filter(Boolean)))];

  const filteredDonors = bloodDonors.filter(d => {
    const matchesGroup = selectedGroup === 'All' || d.bloodGroup === selectedGroup;
    const matchesCity = selectedCity === 'All' || (d.city && d.city.toLowerCase() === selectedCity.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      (d.fullName && d.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.city && d.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.bloodGroup && d.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.hospitalOrArea && d.hospitalOrArea.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvail = !onlyAvailable || d.isAvailable;
    return matchesGroup && matchesCity && matchesSearch && matchesAvail;
  });

  const activeRequests = bloodRequests.filter(r => r.status === 'OPEN');
  const fulfilledCount = bloodRequests.filter(r => r.status === 'FULFILLED').length;
  const availableDonorsCount = bloodDonors.filter(d => d.isAvailable).length;

  const handleRegisterDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorPhone) return;

    addBloodDonor({
      fullName: donorName,
      batchYear: donorBatch ? Number(donorBatch) : undefined,
      bloodGroup: donorBloodGroup,
      phone: donorPhone,
      email: donorEmail || undefined,
      city: donorCity,
      state: donorState,
      isAvailable: true,
      canTravelForEmergency: donorCanTravel
    });

    setIsRegisterDonorModalOpen(false);
  };

  const handleBloodRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPatientName || !reqContactPhone || !reqHospital) return;

    submitBloodRequest({
      patientName: reqPatientName,
      bloodGroup: reqBloodGroup,
      unitsNeeded: Number(reqUnits) || 1,
      hospitalName: reqHospital,
      city: reqCity,
      contactPerson: reqContactName,
      contactPhone: reqContactPhone,
      urgency: reqUrgency,
      additionalNotes: reqNotes || undefined
    });

    setIsRequestBloodModalOpen(false);
    // Reset form
    setReqPatientName('');
    setReqHospital('');
    setReqNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. Top Lifeline Banner */}
      <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-rose-800/60">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-bold">
              <Droplet className="w-4 h-4 text-rose-300 fill-rose-300 animate-pulse" />
              <span>{isHindi ? 'नवोदय रक्तदाता जीवनदान संजाल' : 'Navodaya Community Blood Lifeline Network'}</span>
            </div>
            <span className="text-xs font-medium text-rose-200">
              24x7 Emergency Navodaya Blood Coordination
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {isHindi ? 'रक्तदान महादान • नवोदयन साथी जीवन रक्षा संजाल' : 'Navodaya Blood Donors & Emergency SOS Portal'}
              </h1>
              <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed">
                Connect instantly with verified Navodaya alumni blood donors across Rajasthan, Delhi NCR, and nationwide in times of medical urgency. Post emergency blood requests or register yourself to save precious lives.
              </p>
            </div>

            {/* Quick Action CTA Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3 text-center">
              <div className="text-xs uppercase tracking-wider text-rose-200 font-bold">
                Emergency Blood Assistance
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsRequestBloodModalOpen(true)}
                  className="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Post SOS Request</span>
                </button>
                <button
                  onClick={() => setIsRegisterDonorModalOpen(true)}
                  className="py-2.5 px-2 bg-white hover:bg-rose-50 text-rose-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-rose-600" />
                  <span>Register as Donor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-rose-800/80">
            <div className="bg-rose-900/50 p-4 rounded-2xl border border-rose-800">
              <span className="text-[11px] text-rose-300 block font-medium">Registered Donors</span>
              <span className="text-xl sm:text-2xl font-black text-white">{bloodDonors.length} Verified</span>
            </div>
            <div className="bg-rose-900/50 p-4 rounded-2xl border border-rose-800">
              <span className="text-[11px] text-rose-300 block font-medium">Currently Available</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300">{availableDonorsCount} Ready</span>
            </div>
            <div className="bg-rose-900/50 p-4 rounded-2xl border border-rose-800">
              <span className="text-[11px] text-rose-300 block font-medium">Active SOS Cases</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">{activeRequests.length} Urgent</span>
            </div>
            <div className="bg-rose-900/50 p-4 rounded-2xl border border-rose-800">
              <span className="text-[11px] text-rose-300 block font-medium">Lives Supported</span>
              <span className="text-xl sm:text-2xl font-black text-rose-200">{fulfilledCount + 14}+ Cases</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Urgent Blood Requests (SOS Banner) */}
      {activeRequests.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-rose-600 text-white animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-rose-950">
                  🚨 Active Emergency Blood Requests ({activeRequests.length})
                </h3>
                <p className="text-xs text-rose-700">Immediate donor assistance needed. Please contact directly.</p>
              </div>
            </div>

            <button
              onClick={() => setIsRequestBloodModalOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              + Post New SOS
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-rose-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-full shadow-2xs">
                      Required: {req.bloodGroup} ({req.unitsNeeded} Units)
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                      req.urgency === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {req.urgency} Urgency
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{req.patientName}</h4>
                    <p className="text-xs text-slate-600 flex items-center space-x-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.hospitalName}, {req.city}</span>
                    </p>
                  </div>

                  {req.additionalNotes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                      "{req.additionalNotes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    Contact: <strong className="text-slate-800">{req.contactPerson}</strong>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {req.contactPhone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${req.contactPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.contactPerson)},%20I%20saw%20your%20emergency%20blood%20request%20for%20${encodeURIComponent(req.bloodGroup)}%20blood%20on%20JNV%20Lifeline.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                      title="WhatsApp Contact"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => updateBloodRequestStatus(req.id, 'FULFILLED')}
                      className="text-[10px] text-slate-500 hover:text-slate-800 underline px-1 cursor-pointer"
                      title="Mark as Fulfilled"
                    >
                      Fulfilled?
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Donors Directory & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Alumni Blood Donors Directory</h2>
            <p className="text-xs text-slate-500">Filter by blood group, district, and immediate readiness</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRegisterDonorModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Join as Blood Donor</span>
            </button>
          </div>
        </div>

        {/* Blood Group Filter Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedGroup('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedGroup === 'All'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Groups ({bloodDonors.length})
          </button>
          {BLOOD_GROUPS.map((grp) => {
            const count = bloodDonors.filter(d => d.bloodGroup === grp).length;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                  selectedGroup === grp
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Droplet className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>{grp}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search donor by name, city, batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white font-medium"
            >
              {uniqueCities.map(city => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Districts / Cities' : city}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end px-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Available Donors Only</span>
            </label>
          </div>
        </div>

        {/* Donors Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center text-rose-700 font-black text-sm shadow-2xs">
                      <Droplet className="w-3.5 h-3.5 fill-rose-600 mb-0.5" />
                      <span>{donor.bloodGroup}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{donor.fullName}</h4>
                      {donor.batchYear && (
                        <p className="text-[11px] text-slate-500 font-medium">Batch of {donor.batchYear}</p>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    donor.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {donor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{donor.city}, {donor.state || 'Rajasthan'}</span>
                  </div>
                  {donor.lastDonationDate && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Last Donated: {donor.lastDonationDate}</span>
                    </div>
                  )}
                  {donor.canTravelForEmergency && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Willing to travel for emergency cases</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                <a
                  href={`tel:${donor.phone}`}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Call Donor</span>
                </a>
                <a
                  href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(donor.fullName)},%20I%20got%20your%20contact%20via%20JNV%20Pachpadra%20Blood%20Lifeline%20Network.%20Are%20you%20available%20for%20${encodeURIComponent(donor.bloodGroup)}%20blood%20donation?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition"
                  title="WhatsApp Message"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Blood Compatibility Guide & Eligibility FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">Blood Group Compatibility Quick Guide</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-rose-700 block">O Negative (O-)</span>
              <span className="text-[11px] text-slate-500">Universal Red Cell Donor (Can give to all groups)</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-rose-700 block">AB Positive (AB+)</span>
              <span className="text-[11px] text-slate-500">Universal Recipient (Can receive from all groups)</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-rose-700 block">A+ / B+</span>
              <span className="text-[11px] text-slate-500">Can give to A+/AB+ or B+/AB+ respectively</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-black text-rose-700 block">Platelets Donation</span>
              <span className="text-[11px] text-slate-500">Can donate every 15 days for dengue / cancer relief</span>
            </div>
          </div>
        </div>

        <div className="bg-rose-50/50 border border-rose-200/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-rose-200 pb-3">
            <ShieldCheck className="w-4 h-4 text-rose-700" />
            <h3 className="text-base font-bold text-rose-950">Who Can Donate Blood?</h3>
          </div>

          <div className="space-y-2 text-xs text-rose-950">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Age between 18 and 65 years with weight ≥ 45 kg.</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hemoglobin level ≥ 12.5 g/dL.</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Gap of at least 3 months since last whole blood donation.</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No active viral infections, unmanaged diabetes, or major recent surgery.</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: REGISTER AS BLOOD DONOR */}
      <AnimatePresence>
        {isRegisterDonorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-slate-900"
            >
              <button
                onClick={() => setIsRegisterDonorModalOpen(false)}
                className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold mb-2 border border-rose-200">
                  <Droplet className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span>Navodaya Blood Lifeline Registration</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Register as a Blood Donor</h3>
                <p className="text-xs text-slate-500 mt-1">Your details will be listed to help fellow Navodayans in medical emergencies.</p>
              </div>

              <form onSubmit={handleRegisterDonorSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Patel"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Blood Group *</label>
                    <select
                      value={donorBloodGroup}
                      onChange={(e) => setDonorBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-slate-400"
                    >
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Passout Batch</label>
                    <input
                      type="number"
                      placeholder="2014"
                      value={donorBatch}
                      onChange={(e) => setDonorBatch(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    >
                    </input>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Contact Phone (Mobile) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barmer / Balotra"
                      value={donorCity}
                      onChange={(e) => setDonorCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="travel-check"
                    checked={donorCanTravel}
                    onChange={(e) => setDonorCanTravel(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="travel-check" className="text-slate-700 text-xs font-medium cursor-pointer">
                    I am willing to travel to nearby hospitals for emergency blood requirements
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Confirm & Join Lifeline Network
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: POST URGENT BLOOD SOS REQUEST */}
      <AnimatePresence>
        {isRequestBloodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-slate-900"
            >
              <button
                onClick={() => setIsRequestBloodModalOpen(false)}
                className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold mb-2 border border-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                  <span>Emergency Blood Assistance SOS</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Post Urgent Blood Requirement</h3>
                <p className="text-xs text-slate-500 mt-1">Broadcast requirement to all registered Navodaya donors in the region.</p>
              </div>

              <form onSubmit={handleBloodRequestSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. Kamala Devi"
                    value={reqPatientName}
                    onChange={(e) => setReqPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Blood Group *</label>
                    <select
                      value={reqBloodGroup}
                      onChange={(e) => setReqBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-slate-400"
                    >
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Units Needed *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={reqUnits}
                      onChange={(e) => setReqUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Urgency</label>
                    <select
                      value={reqUrgency}
                      onChange={(e) => setReqUrgency(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 text-rose-900 font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="URGENT">Urgent</option>
                      <option value="CRITICAL">Critical (Immediate)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Hospital & Ward *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AIIMS Jodhpur / District Hospital"
                      value={reqHospital}
                      onChange={(e) => setReqHospital(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jodhpur / Barmer"
                      value={reqCity}
                      onChange={(e) => setReqCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Attendant Name"
                      value={reqContactName}
                      onChange={(e) => setReqContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Contact Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={reqContactPhone}
                      onChange={(e) => setReqContactPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Additional Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Requirement within 4 hours for bypass surgery"
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Broadcast Emergency Blood SOS</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
