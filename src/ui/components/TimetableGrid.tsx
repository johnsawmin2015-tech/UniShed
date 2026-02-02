import React, { useMemo } from 'react';
import { AcademicYear, ClassSession, DayOfWeek, Section, ViolationCategory, ViewMode } from '../../domain/types';
import { ClassCard, LunchBreakCard, EmptySlotCard } from './ClassCard';
import { getSectionTheme, getYearTheme } from '../../utils/theme';
import { Clock } from 'lucide-react';

interface TimetableGridProps {
  sessions: ClassSession[];
  year: AcademicYear;
  section: Section;
  viewMode: ViewMode;
  onAddClass: (day: DayOfWeek, startTime: number) => void;
  onEditClass: (session: ClassSession) => void;
  onDeleteClass: (id: string) => void;
  onViewClass: (session: ClassSession) => void;
  conflictMap: Map<string, ViolationCategory[]>;
  isCompact?: boolean;
}

const DAYS = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY];
const START_HOUR = 9;
const END_HOUR = 16;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  sessions,
  year,
  section,
  viewMode,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onViewClass,
  conflictMap,
  isCompact = false
}) => {
  const isAdmin = viewMode === 'ADMIN';
  const theme = getSectionTheme(year, section);

  // Helper to format time
  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  // Helper to check if a slot is lunch break
  const isLunchBreak = (hour: number) => hour === 12;

  // Find session for specific slot
  const getSessionForSlot = (day: DayOfWeek, hour: number) => {
    return sessions.find(s =>
      s.day === day &&
      Math.floor(s.startMinutes / 60) === hour &&
      s.year === year &&
      s.section === section
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Time Header Row */}
      <div className="grid grid-cols-6 border-b border-stone-200 dark:border-graphite-800 bg-white dark:bg-graphite-900/50 sticky top-0 z-20">
        <div className="p-4 flex items-center justify-center border-r border-graphite-100 dark:border-graphite-800/50">
          <Clock size={16} className="text-graphite-400" />
        </div>
        {DAYS.map(day => (
          <div key={day} className="p-3 text-center border-r border-graphite-100 dark:border-graphite-800/50 last:border-r-0">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              {day.substring(0, 3)}
            </span>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-ivory-50/50 dark:bg-graphite-950/20">
        {HOURS.map((hour, index) => {
          const isLunch = isLunchBreak(hour);
          const staggerClass = index < 5 ? `animate-slide-up stagger-${index + 1}` : 'animate-slide-up';

          return (
            <div key={hour} className={`grid grid-cols-6 min-h-[140px] border-b border-stone-200/60 dark:border-graphite-800/60 ${isCompact ? 'min-h-[100px]' : ''} ${isLunch ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''} ${staggerClass}`}>

              {/* Time Column */}
              <div className="relative border-r border-stone-200 dark:border-graphite-800 p-2 flex flex-col items-center justify-start pt-4 bg-white/40 dark:bg-graphite-900/40 backdrop-blur-sm">
                <span className="text-sm font-serif font-bold text-stone-700 dark:text-stone-300">
                  {formatTime(hour)}
                </span>
                <span className="text-[10px] text-graphite-400 mt-0.5 font-medium">
                  {formatTime(hour + 1)}
                </span>

                {/* Timeline connector */}
                {hour !== END_HOUR - 1 && (
                  <div className="absolute top-12 bottom-0 w-px bg-stone-100 dark:bg-graphite-800" />
                )}
              </div>

              {/* Day Columns */}
              {isLunch ? (
                // Locked Lunch Break Row spans all days
                <div className="col-span-5 p-2">
                  <LunchBreakCard isCompact={isCompact} />
                </div>
              ) : (
                DAYS.map((day) => {
                  const session = getSessionForSlot(day, hour);
                  const isWednesdayAfternoon = day === DayOfWeek.WEDNESDAY && hour >= 13;
                  const collisions = session ? conflictMap.get(session.id) : undefined;

                  return (
                    <div key={`${day}-${hour}`} className="relative p-2 border-r border-graphite-100/50 dark:border-graphite-800/50 last:border-r-0 group">
                      {isWednesdayAfternoon ? (
                        <div className="h-full rounded-xl border border-dashed border-graphite-200 dark:border-graphite-800 bg-graphite-50/50 dark:bg-graphite-900/30 flex items-center justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-graphite-300 transform -rotate-12 select-none">Free Study</span>
                        </div>
                      ) : session ? (
                        <ClassCard
                          session={session}
                          viewMode={viewMode}
                          onEdit={onEditClass}
                          onDelete={onDeleteClass}
                          onView={onViewClass}
                          violations={collisions}
                          isCompact={isCompact}
                        />
                      ) : (
                        isAdmin && (
                          <div className="h-full transition-opacity duration-200">
                            <EmptySlotCard onClick={() => onAddClass(day, hour)} isCompact={isCompact} />
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};