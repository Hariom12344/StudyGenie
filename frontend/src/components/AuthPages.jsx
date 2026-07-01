import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { API } from '../services/api';

export default function AuthPages({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (isForgot) {
        const res = await API.auth.forgotPassword(email);
        setInfo(res.message);
        setIsForgot(false);
      } else if (isLogin) {
        const res = await API.auth.login(email, password);
        onLoginSuccess(res.user);
      } else {
        const res = await API.auth.register(name, email, password, role);
        setInfo('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate Google Login
      const mockGoogleUser = {
        id: 1,
        name: 'Google Student',
        email: 'google@gmail.com',
        role: 'Student',
        token: 'google_token'
      };
      localStorage.setItem('examace_token', 'google_token');
      localStorage.setItem('examace_user', JSON.stringify(mockGoogleUser));
      onLoginSuccess(mockGoogleUser);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-slate-900 via-primary-950 to-slate-950 text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]"></div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl relative z-10 border border-white/15">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-primary-500/20 rounded-2xl mb-2 border border-primary-500/30 shadow-lg glow-primary">
            <Sparkles className="h-8 w-8 text-primary-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
            ExamAce
          </h1>
          <p className="text-sm text-slate-400 mt-1">AI-Powered Preparation Platform</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}
        {info && (
          <div className="p-3 mb-4 text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-center">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          {!isLogin && !isForgot && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm transition-all"
              />
            </div>
          </div>

          {!isForgot && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm transition-all"
                />
              </div>
            </div>
          )}

          {!isLogin && !isForgot && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-heading">Designated Role</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {['Student', 'Teacher', 'Admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      role === r
                        ? 'bg-primary-500 border-primary-400 text-white shadow-md shadow-primary-500/20'
                        : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLogin && !isForgot && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setIsForgot(true); setError(''); }}
                className="text-xs text-primary-400 hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-650 to-indigo-650 hover:from-primary-500 hover:to-indigo-500 rounded-xl font-semibold text-sm shadow-xl flex items-center justify-center gap-2 hover-lift transition-all"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : isForgot ? (
              'Reset Password'
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900/60 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google Login button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google Workspace Account
        </button>

        {/* Footer Toggle */}
        <div className="text-center mt-6 text-xs text-slate-400">
          {isForgot ? (
            <button onClick={() => setIsForgot(false)} className="text-primary-400 hover:underline">
              Back to Login
            </button>
          ) : isLogin ? (
            <span>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-primary-400 hover:underline">
                Register now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => setIsLogin(true)} className="text-primary-400 hover:underline">
                Sign in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
