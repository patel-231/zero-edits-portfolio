import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onExit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide administrator email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const adminAcc = StorageService.getAdminAccount();
      const isValidEmail = email.trim().toLowerCase() === adminAcc.email.toLowerCase();
      const isValidPassword = password === adminAcc.passwordHash;

      if (isValidEmail && isValidPassword) {
        StorageService.setAdminSession(true);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Access denied to YouTube Studio.');
      }
    }, 350);
  };

  const handleUseDemo = () => {
    const adminAcc = StorageService.getAdminAccount();
    setEmail(adminAcc.email);
    setPassword(adminAcc.passwordHash);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#212121] border border-[#303030] rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to YouTube</span>
        </button>

        {/* YouTube Studio Branding */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-8 h-6 fill-[#ff0000]" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4 3.1c-.3-1.2-1.2-2.1-2.4-2.4C22.9 0 14 0 14 0S5.1 0 3 .7C1.8 1 0.9 1.9.6 3.1 0 5.2 0 10 0 10s0 4.8.6 6.9c.3 1.2 1.2 2.1 2.4 2.4 2.1.7 11 .7 11 .7s8.9 0 11-.7c1.2-.3 2.1-1.2 2.4-2.4.6-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z" />
            <polygon points="11.2,14.3 18.5,10 11.2,5.7" fill="#ffffff" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            YouTube Studio
          </span>
        </div>

        <p className="text-xs text-neutral-400 mb-5">
          Sign in to manage channel videos, Shorts, comments, and client inquiries.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ompatel787877@gmail.com"
              className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#3f3f3f] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#3ea6ff]"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Studio Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 pr-10 bg-[#121212] border border-[#3f3f3f] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#3ea6ff] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-xl text-sm font-bold text-white bg-[#ff0000] hover:bg-[#cc0000] transition-colors shadow active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In to Studio'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#303030] text-center">
          <button
            type="button"
            onClick={handleUseDemo}
            className="text-xs text-neutral-400 hover:text-neutral-200 inline-flex items-center gap-1.5 underline decoration-neutral-600"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Click here to fill administrator credentials</span>
          </button>
          <p className="mt-1.5 text-[11px] text-neutral-400">
            Current Admin: <span className="text-white font-mono">ompatel787877@gmail.com</span>
          </p>
        </div>

      </div>
    </div>
  );
};
