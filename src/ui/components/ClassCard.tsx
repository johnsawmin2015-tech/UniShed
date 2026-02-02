import React from 'react';
import { ClassSession, ViewMode, DayOfWeek, ViolationCategory, AcademicYear, Section } from '../../domain/types';
import { Clock, MapPin, User, AlertTriangle, ShieldAlert, Lock, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { getSectionTheme } from '../../utils/theme';

interface ClassCardProps {
  session: ClassSession;
  viewMode: ViewMode;
  onEdit?: (session: ClassSession) => void;
  onDelete?: (id: string) => void;
  onView?: (session: ClassSession) => void;
  violations?: ViolationCategory[];
  isCompact?: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  session,
  viewMode,
  onEdit,
  onDelete,
  onView,
  violations = [],
  isCompact = false
}) => {
  const isAdmin = viewMode === 'ADMIN';
  const theme = getSectionTheme(session.year, session.section);

  const hasViolations = violations.length > 0;
  const isCritical = violations.includes(ViolationCategory.OVERLAP) ||
    violations.includes(ViolationCategory.ROOM) ||
    violations.includes(ViolationCategory.PROFESSOR);

  // Custom height based on duration (60min = standard unit)
  const heightClass = session.durationMinutes > 60 ? 'h-full row-span-2' : 'h-full';

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(session);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(session.id);
  };

  // Explicit background logic to fix theme inheritance issues
  let bgClass = 'bg-white dark:bg-graphite-900 border-stone-200 dark:border-graphite-800 shadow-sm';
  if (isCritical) bgClass = 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900';
  else if (hasViolations) bgClass = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';

  const hoverClass = isCritical ? 'hover:border-red-300 dark:hover:border-red-700' :
    hasViolations ? 'hover:border-amber-300 dark:hover:border-amber-700' :
      'hover:shadow-luxury dark:hover:shadow-elevated-dark hover:border-amber-400/50 dark:hover:border-amber-600/50';

  return (
    <div
      onClick={() => onView?.(session)}
      className={`relative group flex flex-col ${heightClass} rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${isCompact ? 'p-2' : 'p-3'} 
        ${bgClass}
        ${hoverClass}
        animate-slide-up
        hover:-translate-y-0.5
      `}
    >
      {/* Accent strip on left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCritical ? 'bg-red-500' : hasViolations ? 'bg-amber-500' : `bg-gradient-to-b ${theme.gradient}`
        }`} />

      {/* Header */}
      <div className="flex justify-between items-start pl-2 mb-1">
        <div className="flex flex-col">
          {/* Explicit text color to ensure visibility against valid opaque backgrounds */}
          <span className={`font-bold ${isCompact ? 'text-xs' : 'text-sm'} text-stone-900 dark:text-stone-100 leading-tight`}>
            {session.subjectCode}
          </span>
          {!isCompact && (
            <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 line-clamp-1" title={session.subjectName}>
              {session.subjectName}
            </span>
          )}
        </div>

        {/* Alerts or Actions */}
        <div className="flex items-center gap-1">
          {isCritical && <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
          {!isCritical && hasViolations && <AlertTriangle size={14} className="text-amber-500" />}

          {isAdmin && (
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity ml-1 bg-white/80 dark:bg-black/50 rounded-lg p-1 backdrop-blur-sm shadow-sm border border-black/5">
              <button
                onClick={handleEditClick}
                className="p-1 hover:bg-amber-50 dark:hover:bg-amber-900/40 text-stone-400 hover:text-amber-600 rounded-md transition-colors"
                title="Edit Session"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/40 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                title="Cancel Session"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className={`flex flex-col gap-1 pl-2 mt-auto ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
          <MapPin size={isCompact ? 10 : 12} className={theme.accent} />
          <span className="font-medium truncate">{session.room}</span>
        </div>

        <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
          <User size={isCompact ? 10 : 12} className={theme.accent} />
          <span className="truncate">{session.professor}</span>
        </div>
      </div>

      {/* Hover Reveal Duration */}
      {!isCompact && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[9px] font-mono font-medium text-stone-400 bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
            {session.durationMinutes}m
          </span>
        </div>
      )}
    </div>
  );
};

export const LunchBreakCard: React.FC<{ isCompact?: boolean }> = ({ isCompact }) => (
  <div className={`relative flex items-center justify-center rounded-xl border border-dashed border-amber-200/50 dark:border-amber-800/30 lunch-stripe w-full h-full p-2 opacity-60 hover:opacity-100 transition-opacity`}>
    <div className="bg-white/80 dark:bg-graphite-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/50 flex items-center gap-2 shadow-sm">
      <Lock size={12} className="text-amber-500" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
        Lunch Break
      </span>
    </div>
  </div>
);

export const EmptySlotCard: React.FC<{ onClick?: () => void, isCompact?: boolean }> = ({ onClick, isCompact }) => (
  <div
    onClick={onClick}
    className="group h-full rounded-xl border border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-center transition-all hover:bg-ivory-100 dark:hover:bg-stone-800 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer"
  >
    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300 bg-white dark:bg-stone-700 p-1.5 rounded-full shadow-sm border border-amber-100 dark:border-amber-900/50">
      <Clock size={16} className="text-amber-500" />
    </div>
  </div>
);