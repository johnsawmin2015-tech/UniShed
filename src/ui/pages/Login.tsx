import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { GraduationCap, ArrowRight, Loader2, Lock } from 'lucide-react';

export const Login: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => {
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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="relative z-20 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
              <GraduationCap size={28} className="text-blue-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">UniSched</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-serif font-bold leading-tight">
              Academic excellence requires precise planning.
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed">
              Experience the next generation of university management. Secure, conflict-free scheduling for modern institutions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-blue-200/60">
            <span>© 2024 University Platform</span>
            <span className="h-1 w-1 rounded-full bg-blue-200/40"></span>
            <span>v2.4.0 (Stable)</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to access the portal.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <Lock size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="admin@uni.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Verifying...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Need an account?</span>
              <button 
                onClick={onRegisterClick} 
                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Register as Student
              </button>
            </div>
          </div>
          
          <div className="text-center text-xs text-slate-400 dark:text-slate-600">
            Demo Credentials: <span className="font-mono text-slate-500 dark:text-slate-500">admin@uni.edu</span> / <span className="font-mono text-slate-500 dark:text-slate-500">any-password</span>
          </div>
        </div>
      </div>
    </div>
  );
};