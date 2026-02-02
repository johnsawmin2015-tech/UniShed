import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Shield, ArrowRight, Loader2, Lock, GraduationCap, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC<{ onStudentLoginClick: () => void }> = ({ onStudentLoginClick }) => {
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
            setError(res.error || 'Authentication failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-graphite-950 transition-colors duration-500">

            {/* Left Panel - Dark Authoritative Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-graphite-900">
                {/* Decorative gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-600/5 blur-3xl" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="relative z-20 flex flex-col justify-between p-16 w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-3 rounded-2xl shadow-lg shadow-amber-500/30 ring-1 ring-amber-400/30">
                            <Shield size={28} className="text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <span className="text-xl font-serif font-bold text-white tracking-tight">UniSched</span>
                            <span className="block text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Administrator</span>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-serif font-bold leading-tight text-white">
                            Command your institution's academic future.
                        </h1>
                        <p className="text-lg text-graphite-400 leading-relaxed">
                            Full administrative control over schedules, authorizations, and resource management. Enterprise-grade security for elite institutions.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-graphite-500">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium">System Operational</span>
                            </div>
                            <div className="flex items-center gap-2 text-graphite-500">
                                <KeyRound size={14} className="text-amber-600" />
                                <span className="text-xs font-medium">256-bit Encryption</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-graphite-600">
                        <span>© 2024 Premium Academic Suite</span>
                        <span className="h-1 w-1 rounded-full bg-graphite-700" />
                        <span>v2.4.0 (Enterprise)</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Admin Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 relative bg-graphite-950">
                <div className="absolute top-8 right-8">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                            <Shield size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-serif font-bold text-white">UniSched</span>
                            <span className="block text-[9px] font-bold text-amber-500 uppercase tracking-widest">Administrator</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Administrator Access</h2>
                        <p className="text-graphite-400">Enter your administrative credentials to access the control panel.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-950/50 border border-red-800/50 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-fade-in">
                            <Lock size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-graphite-500 uppercase tracking-wide">Admin Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-graphite-800 bg-graphite-900/50 text-white placeholder-graphite-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="admin@unisched.edu"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-graphite-500 uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-graphite-800 bg-graphite-900/50 text-white placeholder-graphite-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
                            ) : (
                                <>
                                    <Shield size={18} />
                                    Access Admin Portal
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-graphite-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-graphite-500">Not an administrator?</span>
                            <button
                                onClick={onStudentLoginClick}
                                className="font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                            >
                                <GraduationCap size={16} />
                                Student Portal
                            </button>
                        </div>
                    </div>

                    <div className="text-center text-xs text-graphite-600 space-y-1">
                        <p>Demo: <span className="font-mono text-graphite-500">admin@unisched.edu</span> / <span className="font-mono text-graphite-500">admin123</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
