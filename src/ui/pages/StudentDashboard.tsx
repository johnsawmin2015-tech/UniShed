import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TimetableService } from '../../application/timetableService';
import { TimetableGrid } from '../components/TimetableGrid';
import { TimetableSession } from '../../domain/types';
import { ThemeToggle } from '../components/ThemeToggle';
import { GraduationCap, LogOut, BookOpen, Clock, Info, CheckCircle2, ChevronDown } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(1);

  useEffect(() => {
    setSessions(TimetableService.getAllSessions());
  }, []);

  const filteredSessions = sessions.filter(s => s.yearGroup === selectedYear);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
             <GraduationCap size={20} strokeWidth={2.5} />
           </div>
           <div>
             <h1 className="text-lg font-serif font-bold tracking-tight leading-none">UniSched</h1>
             <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Student Portal</span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
             <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
               {user?.name.charAt(0)}
             </div>
             <span className="text-xs font-medium text-slate-600 dark:text-slate-300 pr-2">{user?.name}</span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          
          <ThemeToggle />
          
          <button 
            onClick={logout} 
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto w-full p-6 flex flex-col flex-1">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Academic Timetable</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Viewing schedule for <span className="font-bold text-slate-700 dark:text-slate-200">Year {selectedYear}</span></p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3">Context:</span>
             <div className="relative">
                <select 
                  className="bg-slate-50 dark:bg-slate-950 py-1.5 pl-3 pr-8 rounded-lg text-sm font-bold outline-none cursor-pointer appearance-none border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 min-h-[600px]">
           <TimetableGrid sessions={filteredSessions} isAdmin={false} />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} /> Notices
              </h3>
              <ul className="space-y-3">
                <li className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  Final exams begin on Dec 15th. Check your specific slots.
                </li>
                <li className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                  Library hours extended until 20:00 for study week.
                </li>
                <li className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                  Lunch break is strictly 12:00 - 13:00.
                </li>
              </ul>
            </div>
          </div>
          
           <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <BookOpen size={100} className="text-emerald-900 dark:text-emerald-400" />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-4">Student Profile</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-wide mb-1">Full Name</span>
                    <span className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-wide mb-1">Email Address</span>
                    <span className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-wide mb-1">Status</span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-200/50 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};