import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Share2
} from 'lucide-react';
import { AlumniEvent } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const SchoolEventsView: React.FC = () => {
  const { events, user, submitRSVP, getUserRSVP, cancelRSVP } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rsvpModalEvent, setRsvpModalEvent] = useState<AlumniEvent | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'Going' | 'Maybe' | 'Not Going'>('Going');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Reunion', 'Election', 'Webinar'];

  const filteredEvents = events.filter(e => {
    return selectedCategory === 'All' || e.category === selectedCategory;
  });

  const handleOpenRSVP = (evt: AlumniEvent) => {
    setRsvpModalEvent(evt);
    setFeedbackMsg(null);
    if (user) {
      const existing = getUserRSVP(evt.id, user.uid || user.email || '');
      if (existing) {
        setRsvpStatus(existing.status);
        setGuestCount(existing.guestCount);
        setPhone(existing.phone || '');
        setNotes(existing.notes || '');
      }
    }
  };

  const handleConfirmRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpModalEvent) return;

    if (!user) {
      setFeedbackMsg('Please sign in first to submit your RSVP.');
      return;
    }

    const res = submitRSVP({
      eventId: rsvpModalEvent.id,
      eventTitle: rsvpModalEvent.title,
      userId: user.uid,
      userName: user.displayName || 'Navodayan Alumnus',
      userEmail: user.email || 'alumni@jnv.in',
      userBatch: user.profile?.batchYear,
      status: rsvpStatus,
      guestCount,
      phone,
      notes
    });

    setFeedbackMsg(res.message);
    setTimeout(() => {
      if (res.success) {
        setRsvpModalEvent(null);
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      id="school-events-container"
    >
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-4 shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Institutional & Alumni Event Calendar</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          School Celebrations, Reunions & Meets
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Participate in annual school celebrations, inter-house sports meets, science exhibitions, and grand alumni reunions on the Pachpadra campus.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const userRsvp = user ? getUserRSVP(evt.id, user.uid || user.email || '') : undefined;

          return (
            <div
              key={evt.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-amber-400/60 transition flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="relative">
                  <ImageWithFallback
                    src={evt.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=350&fit=crop'}
                    alt={evt.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-amber-800 backdrop-blur-xs border border-amber-200 shadow-2xs">
                      {evt.category}
                    </span>
                    {evt.isAlumniEvent && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-slate-950 shadow-2xs">
                        ALUMNI EVENT
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Registered: <strong className="text-slate-900">{evt.registeredCount}</strong> / {evt.maxCapacity || '∞'}
                  </div>

                  {userRsvp ? (
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        RSVP: {userRsvp.status}
                      </span>
                      <button
                        onClick={() => handleOpenRSVP(evt)}
                        className="text-[11px] text-slate-500 hover:text-amber-800 underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenRSVP(evt)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                    >
                      RSVP / Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RSVP Modal Dialog */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  {rsvpModalEvent.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{rsvpModalEvent.title}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {rsvpModalEvent.date} • {rsvpModalEvent.time} • {rsvpModalEvent.location}
                </div>
              </div>
              <button
                onClick={() => setRsvpModalEvent(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {feedbackMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleConfirmRSVP} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Your RSVP Response</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Going', 'Maybe', 'Not Going'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRsvpStatus(st)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        rsvpStatus === st
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Number of Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs"
                  >
                    <option value={1}>1 (Self)</option>
                    <option value={2}>2 Persons</option>
                    <option value={3}>3 Persons</option>
                    <option value={4}>4+ (Family)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">WhatsApp / Contact No.</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Special Notes / Accommodation Request</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need campus guest house room, dietary requirements, etc."
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-2xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRsvpModalEvent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Confirm RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
