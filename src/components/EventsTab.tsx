import React from 'react';
import { useData } from '../context/DataContext';
import {
  Calendar,
  MapPin,
  Clock,
  Video,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const EventsTab: React.FC = () => {
  const { events, toggleEventRSVP } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Alumni Meets, Reunions & Webinars</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Homecomings at JNV Pachpadra campus, regional chapter dinners, and career webinars.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
          >
            {evt.image && (
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-slate-700">
                  {evt.category}
                </span>
                {evt.isOnline && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                    <Video className="w-3 h-3" />
                    <span>Online Webinar</span>
                  </span>
                )}
              </div>
            )}

            <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-white leading-snug">
                  {evt.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-200">{evt.date}</span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.time}</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-2 pt-0.5">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{evt.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1 font-semibold text-slate-300">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{evt.registeredCount} Navodayans Attending</span>
                  </span>
                </div>

                <button
                  onClick={() => toggleEventRSVP(evt.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    evt.isRegistered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {evt.isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Attending (RSVP Confirmed)</span>
                    </>
                  ) : (
                    <span>RSVP & Reserve My Seat</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
