import React, { useState, useEffect, useMemo } from 'react';
import { AcademicYear, ClassSession, DayOfWeek, Section, ViolationCategory } from '../../domain/types';
import { X, Sparkles, Loader2, Clock, MapPin, User, BookOpen, Calendar, Users, Wand2, Check, AlertCircle } from 'lucide-react';
import { DAYS_ORDER, SECTIONS_ORDER, MIN_CLASS_DURATION, MAX_CLASS_DURATION, DAY_START_MINUTES, DAY_END_MINUTES } from '../../constants';
import { timeToMinutes, minutesToTime, formatDuration } from '../../utils/timeUtils';
import { validateTimetable } from '../../domain/validation';
import { getSectionTheme } from '../../utils/theme';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: ClassSession) => void;
  initialData?: ClassSession | null;
  selectedYear: AcademicYear;
  selectedSection: Section;
  currentSessions: ClassSession[];
}

export const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, onSave, initialData, selectedYear, selectedSection, currentSessions }) => {
  const [formData, setFormData] = useState<Partial<ClassSession>>({
    subjectCode: '',
    subjectName: '',
    professor: '',
    room: '',
    day: DayOfWeek.MONDAY,
    section: Section.A,
    startMinutes: 9 * 60,
    durationMinutes: 60
  });

  const [startTimeStr, setStartTimeStr] = useState("09:00");
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);

  // Theme based on the form's selected year and section
  const theme = useMemo(() => getSectionTheme(selectedYear, selectedSection), [selectedYear, selectedSection]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStartTimeStr(minutesToTime(initialData.startMinutes));
    } else {
      setFormData({
        id: crypto.randomUUID(),
        subjectCode: '',
        subjectName: '',
        professor: '',
        room: '',
        year: selectedYear,
        section: selectedSection,
        day: DayOfWeek.MONDAY,
        startMinutes: 9 * 60,
        durationMinutes: 60
      });
      setStartTimeStr("09:00");
    }
    // Reset state on open
    setScheduleMessage(null);
    setScheduleStatus('idle');
  }, [initialData, isOpen, selectedYear, selectedSection]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as ClassSession,
      startMinutes: timeToMinutes(startTimeStr),
      year: selectedYear
    });
    onClose();
  };

  const findSlotForDuration = (
    duration: number,
    sessionsToCheck: ClassSession[]
  ): { found: boolean; day?: DayOfWeek; time?: number; failureStats: Record<string, number> } => {

    const step = 30; // 30 minute increments
    const searchDays = [...DAYS_ORDER];
    const failureStats: Record<string, number> = {
      [ViolationCategory.PROFESSOR]: 0,
      [ViolationCategory.ROOM]: 0,
      [ViolationCategory.OVERLAP]: 0,
      'OTHER': 0
    };

    const tempId = 'temp-check-candidate';

    for (const day of searchDays) {
      for (let time = DAY_START_MINUTES; time + duration <= DAY_END_MINUTES; time += step) {

        const tempSession: ClassSession = {
          ...(formData as ClassSession),
          id: tempId,
          day: day,
          startMinutes: time,
          year: selectedYear,
          durationMinutes: duration,
          room: formData.room || 'TBD',
          professor: formData.professor || 'TBD'
        };

        const validation = validateTimetable([...sessionsToCheck, tempSession]);

        const relevantViolations = validation.violations.filter(v =>
          v.relatedSessionIds.includes(tempId)
        );

        if (relevantViolations.length === 0) {
          return { found: true, day, time, failureStats };
        } else {
          const category = relevantViolations[0].category || 'OTHER';
          failureStats[category] = (failureStats[category] || 0) + 1;
        }
      }
    }
    return { found: false, failureStats };
  };

  const handleAutoSchedule = () => {
    setIsAutoScheduling(true);
    setScheduleStatus('idle');
    setScheduleMessage("Analyzing resource availability...");

    setTimeout(() => {
      const duration = formData.durationMinutes || 60;

      const otherSessions = initialData
        ? currentSessions.filter(s => s.id !== initialData.id)
        : currentSessions;

      let result = findSlotForDuration(duration, otherSessions);

      if (result.found && result.day && result.time) {
        setFormData(prev => ({ ...prev, day: result.day, startMinutes: result.time }));
        setStartTimeStr(minutesToTime(result.time));
        setScheduleStatus('success');
        setScheduleMessage(`Optimal slot found: ${result.day} at ${minutesToTime(result.time)}`);
      }
      else {
        const totalFailures = Object.values(result.failureStats).reduce((a, b) => a + b, 0);
        let primaryReason = "conflicts";

        if (result.failureStats[ViolationCategory.PROFESSOR] > totalFailures * 0.4) {
          primaryReason = "Professor is fully booked";
        } else if (result.failureStats[ViolationCategory.ROOM] > totalFailures * 0.4) {
          primaryReason = "Room is occupied";
        } else if (result.failureStats[ViolationCategory.OVERLAP] > totalFailures * 0.4) {
          primaryReason = "Student section has no gaps";
        }

        let alternativeFound = false;
        if (duration > 60) {
          const shorterDuration = Math.max(60, duration - 30);
          const shortResult = findSlotForDuration(shorterDuration, otherSessions);

          if (shortResult.found && shortResult.day && shortResult.time) {
            setFormData(prev => ({
              ...prev,
              day: shortResult.day,
              startMinutes: shortResult.time,
              durationMinutes: shorterDuration
            }));
            setStartTimeStr(minutesToTime(shortResult.time));
            setScheduleStatus('warning');
            setScheduleMessage(`No ${formatDuration(duration)} slot due to ${primaryReason}. Found ${formatDuration(shorterDuration)} slot on ${shortResult.day}.`);
            alternativeFound = true;
          }
        }

        if (!alternativeFound) {
          setScheduleStatus('error');
          setScheduleMessage(`Unable to schedule: ${primaryReason}. Try changing the day or resources.`);
        }
      }
      setIsAutoScheduling(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-graphite-950/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className={`relative bg-white dark:bg-graphite-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-graphite-200 dark:border-graphite-800 scale-100 animate-in fade-in zoom-in-95 duration-200`}>

        {/* Header */}
        <div className={`bg-white/80 dark:bg-graphite-900/80 backdrop-blur-md px-6 py-4 border-b border-graphite-100 dark:border-graphite-800 flex justify-between items-center sticky top-0 z-10`}>
          <div>
            <h3 className={`text-lg font-serif font-bold tracking-tight ${theme.primary}`}>
              {initialData ? 'Edit Session' : 'New Class Session'}
            </h3>
            <p className="text-xs text-graphite-500 dark:text-graphite-400 font-medium">Enter academic details below</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 text-graphite-400 ${theme.accentHover} dark:text-graphite-500 hover:bg-graphite-100 dark:hover:bg-graphite-800 rounded-full transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">

          {/* AI Auto-Scheduler Section */}
          <div className={`relative overflow-hidden ${theme.bg} border ${theme.border} rounded-2xl p-4 transition-all duration-300`}>
            {/* Ambient Background Glow */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${theme.gradient} opacity-10 blur-3xl rounded-full pointer-events-none`}></div>

            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`bg-white dark:bg-graphite-950 p-2.5 rounded-xl ${theme.primary} shadow-sm border border-white/50 dark:border-graphite-800`}>
                    {isAutoScheduling ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${theme.primary} flex items-center gap-2`}>
                      Smart Auto-Scheduler
                      {scheduleStatus === 'success' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Optimized</span>}
                    </div>
                    <div className={`text-[10px] ${theme.secondary} mt-0.5 max-w-[200px] leading-relaxed`}>
                      {isAutoScheduling
                        ? "Checking 100+ constraint permutations..."
                        : "Automatically finds conflict-free slots based on professor and room availability."}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoSchedule}
                  disabled={isAutoScheduling}
                  className={`group relative text-xs font-bold bg-white dark:bg-graphite-800 border ${theme.border} ${theme.primary} pl-3 pr-4 py-2 rounded-xl ${theme.accentHover} transition-all disabled:opacity-50 shadow-sm overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <span className="flex items-center gap-2 relative z-10">
                    {isAutoScheduling ? "Analyzing..." : <> <Wand2 size={14} /> Find Slot </>}
                  </span>
                </button>
              </div>

              {/* Status Feedback */}
              {(isAutoScheduling || scheduleMessage) && (
                <div className={`mt-2 text-[11px] font-medium px-3 py-2.5 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-1 ${isAutoScheduling ? 'bg-graphite-100 dark:bg-graphite-800 text-graphite-500' :
                    scheduleStatus === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' :
                      scheduleStatus === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800' :
                        'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800'
                  }`}>
                  <div className="shrink-0 mt-0.5">
                    {isAutoScheduling && <Loader2 size={12} className="animate-spin" />}
                    {scheduleStatus === 'success' && <Check size={12} />}
                    {(scheduleStatus === 'error' || scheduleStatus === 'warning') && <AlertCircle size={12} />}
                  </div>
                  <span className="leading-snug">{scheduleMessage}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Main Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Code</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400" />
                  <input
                    required
                    type="text"
                    placeholder="CS101"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none`}
                    value={formData.subjectCode}
                    onChange={e => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Room</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400" />
                  <input
                    required
                    type="text"
                    placeholder="Lab A"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none`}
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Subject Name</label>
              <input
                required
                type="text"
                placeholder="Introduction to Programming"
                className={`w-full px-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none`}
                value={formData.subjectName}
                onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
              />
            </div>

            {/* Prof & Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Professor</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400" />
                  <input
                    required
                    type="text"
                    placeholder="Dr. Smith"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none`}
                    value={formData.professor}
                    onChange={e => setFormData({ ...formData, professor: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Section</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400" />
                  <select
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none appearance-none`}
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value as Section })}
                  >
                    {SECTIONS_ORDER.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Day</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400" />
                  <select
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none appearance-none`}
                    value={formData.day}
                    onChange={e => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
                  >
                    {DAYS_ORDER.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">Start Time</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400" />
                  <input
                    type="time"
                    required
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-graphite-200 dark:border-graphite-700 bg-graphite-50 dark:bg-graphite-950 text-graphite-900 dark:text-white text-sm font-medium focus:ring-2 ${theme.ringFocus} focus:${theme.border} transition-all outline-none`}
                    value={startTimeStr}
                    onChange={e => setStartTimeStr(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-graphite-50 dark:bg-graphite-900/50 p-4 rounded-2xl border border-graphite-100 dark:border-graphite-800">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-wide">
                  Duration
                </label>
                <span className={`text-sm font-bold ${theme.primary}`}>{formData.durationMinutes} min</span>
              </div>
              <input
                type="range"
                min={MIN_CLASS_DURATION}
                max={MAX_CLASS_DURATION}
                step={15}
                className={`w-full ${theme.range} h-1.5 bg-graphite-200 dark:bg-graphite-700 rounded-lg appearance-none cursor-pointer`}
                value={formData.durationMinutes}
                onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              />
              <div className="flex justify-between text-[10px] text-graphite-400 font-medium uppercase tracking-wider">
                <span>1h</span>
                <span>1.5h</span>
                <span>2h</span>
                <span>2.5h</span>
                <span>3h</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-graphite-100 dark:border-graphite-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-graphite-500 dark:text-graphite-400 hover:bg-graphite-100 dark:hover:bg-graphite-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wide ${theme.solidBg} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-md transition-all border border-white/20`}
            >
              {initialData ? 'Update Session' : 'Confirm & Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};