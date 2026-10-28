import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const AuthModal = ({ onClose }) => {
  const { login, register, loginAsDemoUser, loginAsAdmin } = useAuth();
  const { success, error: toastError } = useToast();
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        success('Welcome back to The IMovies!');
      } else {
        await register(name, email, password, phone);
        success('Account created! Welcome aboard.');
      }
      onClose();
    } catch (err) {
      toastError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUserClick = async () => {
    setLoading(true);
    try {
      await loginAsDemoUser();
      success('Signed in as Elena Rostova (Demo User)');
      onClose();
    } catch (err) {
      toastError('Failed to sign in as demo user');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminClick = async () => {
    setLoading(true);
    try {
      await loginAsAdmin();
      success('Signed in as Marcus Vance (Admin Cinema Manager)');
      onClose();
    } catch (err) {
      toastError('Failed to sign in as admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-white">
            {mode === 'login' ? 'Sign In to The IMovies' : 'Create Your Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-neutral-950/60 border-b border-neutral-800/80">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick One-Click Test Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoUserClick}
              disabled={loading}
              className="py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium transition-colors text-center border border-neutral-700/60"
            >
              Demo User (Elena)
            </button>
            <button
              type="button"
              onClick={handleDemoAdminClick}
              disabled={loading}
              className="py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs text-amber-400 font-medium transition-colors text-center border border-amber-500/30"
            >
              Admin (Manager)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}
          </button>
        </form>

        <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 text-center text-xs text-neutral-400">
          {mode === 'login' ? (
            <>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-amber-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-amber-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
