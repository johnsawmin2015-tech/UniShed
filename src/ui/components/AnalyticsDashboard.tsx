import React, { useMemo } from 'react';
import { ClassSession } from '../../domain/types';
import { Users, MapPin, TrendingUp, AlertTriangle, GraduationCap, Building2 } from 'lucide-react';
import { getSectionTheme } from '../../utils/theme';

interface AnalyticsDashboardProps {
    sessions: ClassSession[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ sessions }) => {
    // Use Year 5 (Royal) theme for the dashboard to give it a premium feel
    const theme = getSectionTheme(5, 'A');

    // 1. Calculate Professor Workload
    const profStats = useMemo(() => {
        const map = new Map<string, number>();
        sessions.forEach(s => {
            if (s.professor && s.professor !== 'TBD') {
                map.set(s.professor, (map.get(s.professor) || 0) + s.durationMinutes);
            }
        });
        // Convert to array and sort by hours descending
        return Array.from(map.entries())
            .map(([name, minutes]) => ({ name, hours: minutes / 60 }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 8); // Top 8 busiest
    }, [sessions]);

    // 2. Calculate Room Usage
    const roomStats = useMemo(() => {
        const map = new Map<string, number>();
        sessions.forEach(s => {
            if (s.room && s.room !== 'TBD') {
                map.set(s.room, (map.get(s.room) || 0) + s.durationMinutes);
            }
        });
        return Array.from(map.entries())
            .map(([name, minutes]) => ({ name, hours: minutes / 60 }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 8);
    }, [sessions]);

    const totalTeachingHours = sessions.reduce((acc, s) => acc + (s.durationMinutes / 60), 0);
    const totalProfessors = new Set(sessions.map(s => s.professor)).size;
    const totalRooms = new Set(sessions.map(s => s.room)).size;

    return (
        <div className="h-full overflow-y-auto p-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`bg-white dark:bg-graphite-900/50 p-5 rounded-2xl border ${theme.border} shadow-sm relative overflow-hidden group`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={14} className={theme.accent} />
                            <h4 className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-widest">Teaching Volume</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-serif font-bold ${theme.primary}`}>{totalTeachingHours.toFixed(1)}</span>
                            <span className="text-sm font-medium text-graphite-400">hours/week</span>
                        </div>
                    </div>
                    <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${theme.accent}`}>
                        <TrendingUp size={80} />
                    </div>
                </div>

                <div className={`bg-white dark:bg-graphite-900/50 p-5 rounded-2xl border ${theme.border} shadow-sm relative overflow-hidden group`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap size={14} className={theme.accent} />
                            <h4 className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-widest">Active Faculty</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-serif font-bold ${theme.primary}`}>{totalProfessors}</span>
                            <span className="text-sm font-medium text-graphite-400">members</span>
                        </div>
                    </div>
                    <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${theme.accent}`}>
                        <Users size={80} />
                    </div>
                </div>

                <div className={`bg-white dark:bg-graphite-900/50 p-5 rounded-2xl border ${theme.border} shadow-sm relative overflow-hidden group`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 size={14} className={theme.accent} />
                            <h4 className="text-xs font-bold text-graphite-500 dark:text-graphite-400 uppercase tracking-widest">Spaces Used</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-serif font-bold ${theme.primary}`}>{totalRooms}</span>
                            <span className="text-sm font-medium text-graphite-400">rooms</span>
                        </div>
                    </div>
                    <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${theme.accent}`}>
                        <MapPin size={80} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">

                {/* Professor Workload Chart */}
                <div className={`bg-white dark:bg-graphite-900/50 p-6 rounded-3xl border ${theme.border} shadow-lg shadow-black/5`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${theme.bgSubtle}`}>
                                <Users size={18} className={theme.accent} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-graphite-700 dark:text-graphite-200">Professor Workload</h3>
                        </div>
                        <span className={`text-[10px] ${theme.bgSubtle} ${theme.accent} px-3 py-1.5 rounded-full font-bold uppercase tracking-wider`}>Top 8 Busiest</span>
                    </div>

                    <div className="space-y-5">
                        {profStats.map((prof, idx) => {
                            const percentage = Math.min(100, (prof.hours / 20) * 100); // 20h benchmark
                            const isOverloaded = prof.hours > 18;

                            return (
                                <div key={prof.name} className="group">
                                    <div className="flex justify-between text-xs mb-2 font-medium">
                                        <span className="text-graphite-700 dark:text-graphite-300 font-bold">{prof.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            {isOverloaded && <AlertTriangle size={12} className="text-red-500" />}
                                            <span className={isOverloaded ? "text-red-600 dark:text-red-400 font-bold" : "text-graphite-500"}>
                                                {prof.hours.toFixed(1)}h
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-graphite-100 dark:bg-graphite-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverloaded ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Room Utilization Chart */}
                <div className={`bg-white dark:bg-graphite-900/50 p-6 rounded-3xl border ${theme.border} shadow-lg shadow-black/5`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${theme.bgSubtle}`}>
                                <MapPin size={18} className={theme.accent} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-graphite-700 dark:text-graphite-200">Room Utilization</h3>
                        </div>
                        <span className={`text-[10px] ${theme.bgSubtle} ${theme.accent} px-3 py-1.5 rounded-full font-bold uppercase tracking-wider`}>Weekly Hours</span>
                    </div>

                    <div className="space-y-5">
                        {roomStats.map((room) => {
                            const percentage = Math.min(100, (room.hours / 40) * 100);

                            return (
                                <div key={room.name} className="group">
                                    <div className="flex justify-between text-xs mb-2 font-medium">
                                        <span className="text-graphite-700 dark:text-graphite-300 font-bold">{room.name}</span>
                                        <span className="text-graphite-500">{room.hours.toFixed(1)}h</span>
                                    </div>
                                    <div className="h-2 w-full bg-graphite-100 dark:bg-graphite-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};
