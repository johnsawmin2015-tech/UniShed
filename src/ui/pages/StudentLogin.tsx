import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { GraduationCap, ArrowRight, Loader2, Lock, Shield, BookOpen, Calendar } from 'lucide-react';

export const StudentLogin: React.FC<{
    onRegisterClick: () => void;
    onAdminLoginClick: () => void;
}> = ({ onRegisterClick, onAdminLoginClick }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await login({ email, password });
        if (!res.success) {
            setError(res.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-ivory-50 dark:bg-graphite-950 transition-colors duration-500">

            {/* Left Panel - Warm Academic Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Warm gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-ivory-100 dark:from-graphite-900 dark:via-graphite-900 dark:to-amber-950/30" />

                {/* Decorative orbs */}
                <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-amber-200/40 dark:bg-amber-500/10 blur-3xl" />
                <div className="absolute bottom-40 left-10 w-[300px] h-[300px] rounded-full bg-amber-300/30 dark:bg-amber-600/10 blur-3xl" />

                {/* Academic image background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-5" />

                <div className="relative z-20 flex flex-col justify-between p-16 w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-3 rounded-2xl shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
                            <GraduationCap size={28} className="text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <span className="text-xl font-serif font-bold text-graphite-900 dark:text-white tracking-tight">UniSched</span>
                            <span className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">Student Portal</span>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-serif font-bold leading-tight text-graphite-900 dark:text-white">
                            Your academic journey, beautifully organized.
                        </h1>
                        <p className="text-lg text-graphite-600 dark:text-graphite-400 leading-relaxed">
                            Access your personalized timetable, stay on top of your classes, and never miss a lecture. Designed for the modern student.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-graphite-500 dark:text-graphite-400">
                                <BookOpen size={16} className="text-amber-600" />
                                <span className="text-sm font-medium">View Schedules</span>
                            </div>
                            <div className="flex items-center gap-2 text-graphite-500 dark:text-graphite-400">
                                <Calendar size={16} className="text-amber-600" />
                                <span className="text-sm font-medium">Export Calendar</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-graphite-500 dark:text-graphite-600">
                        <span>© 2024 Premium Academic Suite</span>
                        <span className="h-1 w-1 rounded-full bg-graphite-400 dark:bg-graphite-700" />
                        <span>v2.4.0</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Student Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 relative bg-white dark:bg-graphite-950">
                <div className="absolute top-8 right-8">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-serif font-bold text-graphite-900 dark:text-white">UniSched</span>
                            <span className="block text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Student Portal</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif font-bold text-graphite-900 dark:text-white tracking-tight">Welcome back</h2>
                        <p className="text-graphite-500 dark:text-graphite-400">Sign in to access your academic schedule.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                            <Lock size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-graphite-400 dark:text-graphite-500 uppercase tracking-wide">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-graphite-200 dark:border-graphite-800 bg-white dark:bg-graphite-900/50 text-graphite-900 dark:text-white placeholder-graphite-400 dark:placeholder-graphite-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="student@university.edu"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-graphite-400 dark:text-graphite-500 uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-graphite-200 dark:border-graphite-800 bg-white dark:bg-graphite-900/50 text-graphite-900 dark:text-white placeholder-graphite-400 dark:placeholder-graphite-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                            ) : (
                                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-graphite-100 dark:border-graphite-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-graphite-500 dark:text-graphite-400">Need an account?</span>
                            <button
                                onClick={onRegisterClick}
                                className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                            >
                                Register as Student
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={onAdminLoginClick}
                            className="text-xs text-graphite-400 dark:text-graphite-600 hover:text-graphite-600 dark:hover:text-graphite-400 transition-colors flex items-center gap-1.5"
                        >
                            <Shield size={12} />
                            Administrator Access
                        </button>
                    </div>

                    <div className="text-center text-xs text-graphite-400 dark:text-graphite-600 space-y-1">
                        <p>Demo: <span className="font-mono text-graphite-500">student@uni.edu</span> / <span className="font-mono text-graphite-500">any password</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
