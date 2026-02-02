import React, { useMemo } from 'react';
import { ClassSession } from '../../domain/types';
import { X, Calendar, Clock, MapPin, User, BookOpen, GraduationCap, Star, Info } from 'lucide-react';
import { minutesToTime, formatDuration } from '../../utils/timeUtils';
import { getSectionTheme } from '../../utils/theme';

interface ClassDetailModalProps {
  session: ClassSession | null;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ session, onClose }) => {
  const theme = useMemo(() => session ? getSectionTheme(session.year, session.section) : getSectionTheme(1, 'A'), [session]);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-graphite-950/60 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Card Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-graphite-900 rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in-95 duration-300 border border-white/20 dark:border-graphite-800">

        {/* Dynamic Gradient Header Background */}
        <div className={`h-36 bg-gradient-to-r ${theme.gradient} relative overflow-hidden`}>
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-20 dark:opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.8) 0%, transparent 25%), radial-gradient(circle at 0% 100%, rgba(255,255,255,0.4) 0%, transparent 25%)',
            }}>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Floating Icon & Title */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white dark:bg-graphite-900 p-1.5 rounded-2xl shadow-xl">
              <div className={`bg-graphite-50 dark:bg-graphite-800 p-3.5 rounded-xl ${theme.primary} border border-graphite-100 dark:border-graphite-700`}>
                <GraduationCap size={32} />
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${theme.bg} ${theme.border} border text-[10px] font-bold ${theme.accent} uppercase tracking-widest shadow-sm`}>
                <Star size={10} fill="currentColor" /> {theme.name}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className={`flex items-center gap-2 ${theme.primary} font-bold text-xs tracking-widest uppercase mb-2`}>
              <BookOpen size={14} />
              <span>{session.subjectCode} • Year {session.year} • {session.section}</span>
            </div>
            <h2 className={`text-3xl font-serif font-bold text-graphite-900 dark:text-white leading-tight`}>
              {session.subjectName}
            </h2>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">

            <div className={`p-4 bg-graphite-50 dark:bg-graphite-900/50 rounded-2xl border border-graphite-100 dark:border-graphite-800 hover:${theme.border} transition-colors group`}>
              <div className="flex items-center gap-2 text-graphite-400 dark:text-graphite-500 mb-2">
                <User size={16} className={`group-hover:${theme.accent} transition-colors`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Professor</span>
              </div>
              <p className="font-serif font-bold text-graphite-800 dark:text-graphite-200 text-lg">{session.professor}</p>
            </div>

            <div className={`p-4 bg-graphite-50 dark:bg-graphite-900/50 rounded-2xl border border-graphite-100 dark:border-graphite-800 hover:${theme.border} transition-colors group`}>
              <div className="flex items-center gap-2 text-graphite-400 dark:text-graphite-500 mb-2">
                <MapPin size={16} className={`group-hover:${theme.accent} transition-colors`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
              </div>
              <p className="font-serif font-bold text-graphite-800 dark:text-graphite-200 text-lg">{session.room}</p>
            </div>

            <div className={`p-4 bg-graphite-50 dark:bg-graphite-900/50 rounded-2xl border border-graphite-100 dark:border-graphite-800 hover:${theme.border} transition-colors group`}>
              <div className="flex items-center gap-2 text-graphite-400 dark:text-graphite-500 mb-2">
                <Calendar size={16} className={`group-hover:${theme.accent} transition-colors`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Day</span>
              </div>
              <p className="font-serif font-bold text-graphite-800 dark:text-graphite-200 text-lg capitalize">{session.day.toLowerCase()}</p>
            </div>

            <div className={`p-4 bg-graphite-50 dark:bg-graphite-900/50 rounded-2xl border border-graphite-100 dark:border-graphite-800 hover:${theme.border} transition-colors group`}>
              <div className="flex items-center gap-2 text-graphite-400 dark:text-graphite-500 mb-2">
                <Clock size={16} className={`group-hover:${theme.accent} transition-colors`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-graphite-800 dark:text-graphite-200 text-lg">
                  {minutesToTime(session.startMinutes)}
                </span>
                <span className={`text-[10px] ${theme.accent} font-bold uppercase tracking-wide`}>
                  {formatDuration(session.durationMinutes)}
                </span>
              </div>
            </div>

          </div>

          <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
            <Info size={18} className={`${theme.accent} shrink-0 mt-0.5`} />
            <p className={`text-xs ${theme.secondary} leading-relaxed font-medium`}>
              Academic protocol requires attendance 5 minutes prior to session start.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};