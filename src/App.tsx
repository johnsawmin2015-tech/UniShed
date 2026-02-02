import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, GraduationCap, ShieldAlert, CheckCircle2, Sun, Moon, AlertOctagon, ChevronRight, LayoutDashboard, Clock, Activity, AlertTriangle, Maximize2, Minimize2, Database, WifiOff, BarChart3, Download, LogOut, Shield, User, LayoutGrid, Menu, X } from 'lucide-react';
import { AcademicYear, ClassSession, DayOfWeek, Section, ViewMode, ValidationResult, ViolationCategory } from './domain/types';
import { MOCK_SESSIONS } from './services/mockData';
import { api } from './services/api';
import { TimetableGrid } from './ui/components/TimetableGrid';
import { ClassModal } from './ui/components/ClassModal';
import { ClassDetailModal } from './ui/components/ClassDetailModal';
import { AnalyticsDashboard } from './ui/components/AnalyticsDashboard';
import { validateTimetable } from './domain/validation';
import { exportToCSV } from './utils/exportUtils';
import { SECTIONS_ORDER } from './constants';
import { getSectionTheme } from './utils/theme';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { AdminLogin } from './ui/pages/AdminLogin';
import { StudentLogin } from './ui/pages/StudentLogin';
import { Register } from './ui/pages/Register';

type AuthView = 'landing' | 'admin-login' | 'student-login' | 'register';

const App: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin, isStudent } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  // Auth view state (for unauthenticated users)
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Application State ---
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(AcademicYear.YEAR_1);
  const [selectedSection, setSelectedSection] = useState<Section>(Section.A);
  const [viewMode, setViewMode] = useState<ViewMode>('ADMIN');
  const [isCompact, setIsCompact] = useState(false);

  // Database Connectivity State
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [isLoading, setIsLoading] = useState(true);

  // Theme derived from selected year AND section
  const theme = useMemo(() => getSectionTheme(selectedYear, selectedSection), [selectedYear, selectedSection]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [viewingSession, setViewingSession] = useState<ClassSession | null>(null);

  // Set view mode based on role when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setViewMode(isAdmin ? 'ADMIN' : 'STUDENT');
    }
  }, [isAuthenticated, isAdmin]);

  // Initial Data Fetch
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSessions();
      setSessions(data);
      setDbStatus('connected');
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock data.");
      setSessions(MOCK_SESSIONS);
      setDbStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Domain Logic ---
  const validationResult: ValidationResult = useMemo(() => {
    return validateTimetable(sessions);
  }, [sessions]);

  const conflictMap = useMemo(() => {
    const map = new Map<string, ViolationCategory[]>();
    validationResult.violations.forEach(v => {
      v.relatedSessionIds.forEach(id => {
        const existing = map.get(id) || [];
        if (!existing.includes(v.category)) {
          existing.push(v.category);
        }
        map.set(id, existing);
      });
    });
    return map;
  }, [validationResult]);

  const visibleSessions = useMemo(() => {
    return sessions.filter(s => s.year === selectedYear && s.section === selectedSection);
  }, [sessions, selectedYear, selectedSection]);

  const stats = useMemo(() => {
    const totalClasses = visibleSessions.length;
    const totalHours = visibleSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60;

    const visibleIds = new Set(visibleSessions.map(s => s.id));
    const activeViolations = validationResult.violations.filter(v =>
      v.relatedSessionIds.some(id => visibleIds.has(id))
    );

    const criticalErrors = activeViolations.filter(v => v.type === 'ERROR').length;
    const warnings = activeViolations.filter(v => v.type === 'WARNING').length;

    return {
      totalClasses,
      totalHours: totalHours.toFixed(1),
      activeViolations,
      criticalErrors,
      warnings
    };
  }, [visibleSessions, validationResult]);

  // --- Handlers ---
  const handleAddClass = (day?: DayOfWeek) => {
    setEditingSession(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (session: ClassSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleViewClass = (session: ClassSession) => {
    setViewingSession(session);
  };

  const handleSaveSession = async (session: ClassSession) => {
    if (dbStatus === 'connected') {
      try {
        if (editingSession) {
          await api.updateSession(session);
        } else {
          await api.createSession(session);
        }
        await loadData();
      } catch (e) {
        alert("Error saving to database. Please check connection.");
        return;
      }
    } else {
      if (editingSession) {
        setSessions(prev => prev.map(s => s.id === session.id ? session : s));
      } else {
        setSessions(prev => [...prev, session]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClass = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this class?")) {
      if (dbStatus === 'connected') {
        try {
          await api.deleteSession(id);
          await loadData();
        } catch (e) {
          alert("Error deleting from database.");
        }
      } else {
        setSessions(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const handleExport = () => {
    if (viewMode === 'REPORTS') {
      exportToCSV(sessions, `UniSched_Full_Report_${new Date().toISOString().slice(0, 10)}`);
    } else {
      exportToCSV(visibleSessions, `Year${selectedYear}_Sec${selectedSection}_Schedule`);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      setAuthView('landing');
    }
  };

  // --- Render Auth Views ---
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-graphite-950 via-graphite-900 to-graphite-950 flex items-center justify-center p-8">
          {/* ... Landing Page Content same as before ... */}
          {/* Re-implementing simplified for brevity if needed or copy full content. I will copy full content for safety. */}
          <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-600/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-4 rounded-2xl shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/30">
                <GraduationCap size={40} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-serif font-bold text-white tracking-tight">UniSched</h1>
                <p className="text-amber-500 text-sm font-bold uppercase tracking-[0.3em]">Premium Academic Suite</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-serif text-white">Welcome</h2>
              <p className="text-graphite-400 text-lg max-w-md mx-auto">
                Enterprise-grade academic scheduling for elite institutions. Please select your portal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setAuthView('admin-login')}
                className="group p-8 bg-graphite-900/50 hover:bg-graphite-900 border border-graphite-800 hover:border-amber-700/50 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-500/10 group-hover:bg-amber-500/20 p-3 rounded-xl transition-colors">
                    <Shield size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Administrator</h3>
                    <p className="text-graphite-500 text-sm">Full system control</p>
                  </div>
                </div>
                <p className="text-graphite-400 text-sm leading-relaxed">
                  Manage schedules, authorize changes, and control academic resources.
                </p>
              </button>

              <button
                onClick={() => setAuthView('student-login')}
                className="group p-8 bg-graphite-900/50 hover:bg-graphite-900 border border-graphite-800 hover:border-amber-600/50 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-500/10 group-hover:bg-amber-500/20 p-3 rounded-xl transition-colors">
                    <GraduationCap size={28} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Student</h3>
                    <p className="text-graphite-500 text-sm">View schedules</p>
                  </div>
                </div>
                <p className="text-graphite-400 text-sm leading-relaxed">
                  Access your timetable, filter by year and class, export calendar.
                </p>
              </button>
            </div>
            <p className="text-graphite-600 text-xs">© 2024 Premium Academic Suite • v2.4.0 (Enterprise)</p>
          </div>
        </div>
      );
    }
    if (authView === 'admin-login') return <AdminLogin onStudentLoginClick={() => setAuthView('student-login')} />;
    if (authView === 'student-login') return <StudentLogin onRegisterClick={() => setAuthView('register')} onAdminLoginClick={() => setAuthView('admin-login')} />;
    if (authView === 'register') return <Register onLoginClick={() => setAuthView('student-login')} />;
  }

  // --- Main Dashboard ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50 dark:bg-graphite-950 text-graphite-500">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          {/* ... loading spinner ... */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-4 rounded-2xl shadow-lg shadow-amber-500/20">
            <GraduationCap size={48} className="text-white" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-graphite-400">Loading Academic Suite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-ivory-50 dark:bg-graphite-950 text-graphite-900 dark:text-ivory-100 transition-colors duration-500">
      <header className={`sticky top-0 z-40 w-full bg-white/90 dark:bg-graphite-900/90 backdrop-blur-xl border-b px-6 py-3 flex items-center justify-between shadow-sm transition-colors duration-300 ${theme.border}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className={`bg-gradient-to-br ${theme.gradient} text-white p-2.5 rounded-xl shadow-lg ${theme.shadow} ring-1 ring-white/20 transition-all duration-500`}>
            <GraduationCap size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900 dark:text-white tracking-tight leading-none">UniSched</h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${theme.accent}`}>
              {isAdmin ? 'Administrator' : 'Student Portal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors ${dbStatus === 'connected'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            : 'bg-stone-100 dark:bg-graphite-900 text-stone-500 border-stone-200 dark:border-graphite-800'
            }`}>
            {dbStatus === 'connected' ? <Database size={12} /> : <WifiOff size={12} />}
            {dbStatus === 'connected' ? 'Connected' : 'Offline Mode'}
          </div>

          {isAdmin && (
            <div className="bg-stone-100 dark:bg-stone-900 rounded-lg p-1 flex gap-1 border border-stone-200 dark:border-stone-800">
              {/* Updated Buttons with High Contrast Active State */}
              <button
                onClick={() => setViewMode('ADMIN')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all duration-300 flex items-center gap-1.5 ${viewMode === 'ADMIN'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
              >
                <LayoutGrid size={14} />
                Admin
              </button>
              <button
                onClick={() => setViewMode('STUDENT')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all duration-300 ${viewMode === 'STUDENT'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('REPORTS')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all duration-300 flex items-center gap-1.5 ${viewMode === 'REPORTS'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
              >
                <BarChart3 size={14} />
                Analytics
              </button>
            </div>
          )}

          <div className="h-6 w-px bg-graphite-200 dark:bg-graphite-700" />

          <div className="hidden md:flex items-center gap-2 text-sm">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-xs`}>
              {user?.name.charAt(0)}
            </div>
            <span className="text-graphite-600 dark:text-graphite-400 font-medium">{user?.name}</span>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 transition-all rounded-lg active:scale-95 hover:bg-graphite-100 dark:hover:bg-graphite-800 ${theme.accent}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-graphite-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {viewMode !== 'REPORTS' && (
          <>
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-fade-in"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Sidebar (Responsive) */}
            <aside className={`
              fixed md:relative inset-y-0 left-0 z-50 w-80 bg-white dark:bg-graphite-900 border-r border-graphite-200 dark:border-graphite-800 flex flex-col overflow-y-auto shrink-0 transition-transform duration-300 ease-out
              ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
            `}>
              {/* Mobile Close Button */}
              <div className="md:hidden p-4 flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-graphite-400 hover:bg-graphite-100 dark:hover:bg-graphite-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 pb-4">
                <div className={`flex items-center gap-2 mb-4 ${theme.accent}`}>
                  <LayoutDashboard size={14} />
                  <label className="text-xs font-bold uppercase tracking-widest text-graphite-400 dark:text-graphite-500">Academic Context</label>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((year) => {
                    const yearTheme = getSectionTheme(year, selectedSection);
                    const isSelected = selectedYear === year;
                    return (
                      <button key={year} onClick={() => setSelectedYear(year as AcademicYear)}
                        className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 ${isSelected
                          ? `${yearTheme.bg} ${yearTheme.bgDark} ${yearTheme.border} shadow-sm` // Assuming valid theme
                          : 'bg-transparent border-transparent hover:bg-graphite-50 dark:hover:bg-graphite-800 text-graphite-500 dark:text-graphite-400'
                          }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-serif font-bold transition-all duration-300 ${isSelected
                          ? `bg-gradient-to-br ${yearTheme.gradient} text-white shadow-md`
                          : 'bg-graphite-100 dark:bg-graphite-800 text-graphite-400 dark:text-graphite-500 group-hover:bg-white dark:group-hover:bg-graphite-700'
                          }`}>
                          {year}
                        </div>
                        <div className="text-left flex-1">
                          <span className={`block text-sm font-bold ${isSelected ? 'text-graphite-900 dark:text-white' : 'text-graphite-600 dark:text-graphite-400'}`}>
                            {yearTheme.name}
                          </span>
                          <span className={`block text-[10px] ${isSelected ? yearTheme.accent : 'text-graphite-400 dark:text-graphite-600'}`}>Year {year}</span>
                        </div>
                        {isSelected && <ChevronRight size={14} className={yearTheme.accent} />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <div className="flex p-1 bg-graphite-50 dark:bg-graphite-800 rounded-lg border border-graphite-100 dark:border-graphite-700">
                    {SECTIONS_ORDER.map(section => {
                      const sectionTheme = getSectionTheme(selectedYear, section);
                      return (
                        <button
                          key={section}
                          onClick={() => setSelectedSection(section)}
                          className={`flex-1 py-2 rounded-md text-xs uppercase tracking-wider font-bold transition-all duration-300 ${selectedSection === section
                            ? `bg-white dark:bg-graphite-800 ${sectionTheme.accent} shadow-sm border border-stone-200 dark:border-graphite-700`
                            : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-graphite-800'
                            }`}
                        >
                          Section {section}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-graphite-100 dark:border-graphite-800 my-2" />

              {/* Stats ... (keeping original layout but ensuring colors work) */}
              <div className="p-6 pt-4">
                {/* ... same stats code ... */}
                <div className={`flex items-center gap-2 mb-4 ${theme.accent}`}>
                  <Activity size={14} />
                  <label className="text-xs font-bold uppercase tracking-widest text-graphite-400 dark:text-graphite-500">Metrics</label>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`bg-white dark:bg-graphite-800 p-4 rounded-xl border ${theme.cardBorder} shadow-sm relative overflow-hidden group animate-slide-up stagger-1`}>
                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${theme.accent}`}>
                      <GraduationCap size={36} />
                    </div>
                    <span className="text-[10px] font-bold text-graphite-400 uppercase tracking-wider block mb-1">Classes</span>
                    <span className={`text-2xl font-serif font-bold ${theme.accent}`}>{stats.totalClasses}</span>
                  </div>
                  <div className={`bg-white dark:bg-graphite-800 p-4 rounded-xl border ${theme.cardBorder} shadow-sm relative overflow-hidden group animate-slide-up stagger-2`}>
                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${theme.accent}`}>
                      <Clock size={36} />
                    </div>
                    <span className="text-[10px] font-bold text-graphite-400 uppercase tracking-wider block mb-1">Hours</span>
                    <span className={`text-2xl font-serif font-bold ${theme.accent}`}>{stats.totalHours}</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border transition-all duration-300 ${stats.criticalErrors > 0
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
                  : stats.warnings > 0
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
                    : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stats.criticalErrors > 0 ? 'text-red-700 dark:text-red-300'
                      : stats.warnings > 0 ? 'text-amber-700 dark:text-amber-300'
                        : 'text-emerald-700 dark:text-emerald-300'
                      }`}>
                      Schedule Health
                    </span>
                    {stats.criticalErrors > 0 ? <AlertOctagon size={14} className="text-red-500" />
                      : stats.warnings > 0 ? <AlertTriangle size={14} className="text-amber-500" />
                        : <CheckCircle2 size={14} className="text-emerald-500" />
                    }
                  </div>
                  <div className="space-y-1.5">
                    {stats.criticalErrors === 0 && stats.warnings === 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">No conflicts detected</p>
                    )}
                    {stats.criticalErrors > 0 && (
                      <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {stats.criticalErrors} Critical
                      </div>
                    )}
                    {stats.warnings > 0 && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {stats.warnings} Warnings
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {stats.activeViolations.length > 0 && (
                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                  <h4 className="text-[10px] font-bold text-graphite-400 dark:text-graphite-600 uppercase tracking-widest mb-3">Active Alerts</h4>
                  <div className="space-y-2">
                    {stats.activeViolations.slice(0, 5).map((violation, idx) => {
                      const isCritical = violation.type === 'ERROR';
                      return (
                        <div key={idx} className={`flex gap-2 p-3 rounded-lg border ${isCritical
                          ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
                          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
                          }`}>
                          <ShieldAlert size={12} className={`shrink-0 mt-0.5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                          <p className="text-[10px] text-graphite-600 dark:text-graphite-300 font-medium leading-relaxed">{violation.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </>
        )}
        <section className="flex-1 bg-ivory-50 dark:bg-graphite-950 p-6 md:p-8 overflow-hidden flex flex-col relative">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none -mr-48 -mt-48 opacity-20 dark:opacity-10 transition-colors duration-700 ${theme.blob}`} />

          <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
                    {viewMode === 'REPORTS' ? 'Analytics Dashboard' : `Year ${selectedYear}`}
                  </h2>
                  {viewMode !== 'REPORTS' && (
                    <>
                      <span className={`text-2xl font-light ${theme.secondary}`}>/</span>
                      <span className={`text-xl md:text-2xl font-serif font-bold ${theme.accent}`}>Section {selectedSection}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-graphite-500 dark:text-graphite-400 font-medium mt-1 max-w-md">
                  {viewMode === 'ADMIN' ? 'Manage schedules, allocate resources, and optimize slots.' :
                    viewMode === 'REPORTS' ? 'Visualize utilization and optimization metrics.' :
                      'Viewing your academic timetable.'}
                </p>
              </div>

              <div className="flex gap-3">
                {viewMode !== 'REPORTS' && (
                  <button
                    onClick={() => setIsCompact(!isCompact)}
                    className={`flex items-center gap-2 bg-white dark:bg-graphite-800 border ${theme.border} text-graphite-700 dark:text-graphite-300 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-graphite-50 dark:hover:bg-graphite-700 transition-all shadow-sm`}
                  >
                    {isCompact ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  </button>
                )}

                <button
                  onClick={handleExport}
                  className={`flex items-center gap-2 bg-white dark:bg-graphite-800 border ${theme.border} text-graphite-700 dark:text-graphite-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-graphite-50 dark:hover:bg-graphite-700 transition-all shadow-sm`}
                >
                  <Download size={16} />
                  Export
                </button>

                {viewMode === 'ADMIN' && (
                  <button
                    onClick={() => handleAddClass()}
                    className={`flex items-center gap-2 bg-gradient-to-r ${theme.gradient} text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg ${theme.shadow} hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all`}
                  >
                    <Calendar size={16} />
                    New Session
                  </button>
                )}
              </div>
            </div>

            <div className={`flex-1 bg-white/60 dark:bg-graphite-900/60 backdrop-blur-sm rounded-2xl shadow-lg border ${theme.cardBorder} overflow-hidden flex flex-col transition-all duration-500`}>
              {viewMode === 'REPORTS' ? <AnalyticsDashboard sessions={sessions} /> :
                <TimetableGrid
                  sessions={sessions}
                  year={selectedYear}
                  section={selectedSection}
                  viewMode={viewMode}
                  onAddClass={handleAddClass}
                  onEditClass={handleEditClass}
                  onDeleteClass={handleDeleteClass}
                  onViewClass={handleViewClass}
                  conflictMap={conflictMap}
                  isCompact={isCompact}
                />
              }
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSession}
        initialData={editingSession}
        selectedYear={selectedYear}
        selectedSection={selectedSection}
        currentSessions={sessions}
      />
      <ClassDetailModal
        session={viewingSession}
        onClose={() => setViewingSession(null)}
      />
    </div>
  );
};

export default App;