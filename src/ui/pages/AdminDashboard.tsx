import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TimetableService } from '../../application/timetableService';
import { TimetableGrid } from '../components/TimetableGrid';
import { TimetableSession, DayOfWeek } from '../../domain/types';
import { DAYS } from '../../domain/rules';
import { ThemeToggle } from '../components/ThemeToggle';
import { Calendar, GraduationCap, LogOut, Plus, Clock, Users, MapPin, Search, ChevronDown, LayoutDashboard } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [sessions, setSessions] = useState<TimetableSession[]>([]);
  const [yearFilter, setYearFilter] = useState<number>(1);
  const [error, setError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    professor: '',
    room: '',
    day: 'Monday' as DayOfWeek,
    startTime: '09:00',
    endTime: '10:00'
  });

  const loadSessions = () => {
    const all = TimetableService.getAllSessions();
    setSessions(all);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = TimetableService.addSession({
      ...formData,
      yearGroup: yearFilter
    });

    if (result.success) {
      loadSessions();
      setFormData(prev => ({ ...prev, subject: '', room: '', professor: '' }));
    } else {
      setError(result.error || "Unknown error");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this class?")) {
      TimetableService.deleteSession(id);
      loadSessions();
    }
  };

  const filteredSessions = sessions.filter(s => s.yearGroup === yearFilter);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
             <GraduationCap size={20} strokeWidth={2.5} />
           </div>
           <div>
             <h1 className="text-lg font-serif font-bold tracking-tight leading-none">UniSched</h1>
             <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Admin Portal</span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
             <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
               {user?.name.charAt(0)}
             </div>
             <span className="text-xs font-medium text-slate-600 dark:text-slate-300 pr-2">{user?.name}</span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          
          <ThemeToggle />
          
          <button 
            onClick={logout} 
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Year Filter */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
              <LayoutDashboard size={18} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Academic Context</h3>
            </div>
            
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(y => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                    yearFilter === y 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Year {y}</span>
                  {yearFilter === y && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Add Class Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
            <div className="flex items-center gap-2 mb-5 text-indigo-600 dark:text-indigo-400">
              <Plus size={18} strokeWidth={3} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Schedule Session</h3>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subject</label>
                <input required type="text" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. CS101" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Users size={12}/> Prof.</label>
                   <input required type="text" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                     value={formData.professor} onChange={e => setFormData({...formData, professor: e.target.value})} placeholder="Dr. Name" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><MapPin size={12}/> Room</label>
                   <input required type="text" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                     value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="Lab 1" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Calendar size={12}/> Day</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                     value={formData.day} onChange={e => setFormData({...formData, day: e.target.value as DayOfWeek})}>
                     {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Clock size={12}/> Start</label>
                    <input type="time" required className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Clock size={12}/> End</label>
                    <input type="time" required className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                 </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase tracking-wide rounded-xl shadow-lg shadow-indigo-500/20 transition-all mt-2">
                Create Session
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col h-full">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-t-2xl border border-slate-200 dark:border-slate-800 border-b-0 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Timetable Overview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Managing Year {yearFilter} Curriculum</p>
            </div>
            <div className="flex gap-2">
               <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                  Live Mode
               </span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-b-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 min-h-[600px]">
            <TimetableGrid sessions={filteredSessions} onDelete={handleDelete} isAdmin={true} />
          </div>
        </div>

      </div>
    </div>
  );
};