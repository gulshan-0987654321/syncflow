import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  Plus,
  ChevronRight,
} from 'lucide-react';

const SUGGESTED_SKILLS = ['C++', 'Java', 'Python', 'React', 'Node.js', 'DSA', 'TypeScript', 'DevOps'];

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, register, sendVerificationOtp, verifyEmailOtp } = useAuth();
  const [tab, setTab] = useState(initialTab); // 'register' | 'login'

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['React', 'Node.js', 'Python', 'C++']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google Account Picker State
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('syncflow_saved_google_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [showAddOtherAccount, setShowAddOtherAccount] = useState(true);
  const [otherEmailInput, setOtherEmailInput] = useState('');

  // Email Verification Screen State
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [pendingAvatar, setPendingAvatar] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (isVerifyingOtp && resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isVerifyingOtp, resendCountdown]);

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // 1. User Touches/Clicks their Google Email -> Sends Verification Code & Opens Verification Step
  const handleTouchSelectGoogleAccount = async (account) => {
    const selectedEmail = account.email.trim().toLowerCase();
    const selectedName = account.name || selectedEmail.split('@')[0];
    const selectedAvatar = account.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedEmail}`;

    setError(null);
    setLoading(true);

    try {
      // Remember selected account in storage
      const updatedList = [
        { email: selectedEmail, name: selectedName, avatar: selectedAvatar },
        ...savedAccounts.filter((a) => a.email.toLowerCase() !== selectedEmail),
      ].slice(0, 5);

      setSavedAccounts(updatedList);
      localStorage.setItem('syncflow_saved_google_accounts', JSON.stringify(updatedList));

      // Request 6-digit verification code from backend
      const res = await sendVerificationOtp(selectedEmail);

      setPendingEmail(selectedEmail);
      setPendingName(selectedName);
      setPendingAvatar(selectedAvatar);
      setDemoOtpHint(res.otp || '');
      setOtpCode(res.otp || ''); // auto-fill for frictionless UX
      setIsGooglePickerOpen(false);
      setIsVerifyingOtp(true);
      setResendCountdown(60);
    } catch (err) {
      console.error('Account Selection Error:', err);
      setError(err.message || 'Failed to select Google account.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Verification Code & Complete Login
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formattedName = pendingName || pendingEmail.split('@')[0];

      await verifyEmailOtp({
        email: pendingEmail,
        otp: otpCode.trim(),
        name: formattedName,
        avatar: pendingAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${pendingEmail}`,
        skills: selectedSkills,
      });

      setIsVerifyingOtp(false);
      onClose();
    } catch (err) {
      console.error('OTP Verification Error:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Standard Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both your email and password.');
      }
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl p-6 md:p-8 space-y-6">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#21262d] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Google Account Selection & Verification</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {isVerifyingOtp
              ? 'Verify Your Email'
              : isGooglePickerOpen
              ? 'Choose Google Account'
              : tab === 'register'
              ? 'Create your Account'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isVerifyingOtp
              ? `Verification code sent to ${pendingEmail}`
              : isGooglePickerOpen
              ? 'Touch your Google email to select and verify it'
              : 'Sign in to access your collaborative coding workspace'}
          </p>
        </div>

        {/* 1. OTP VERIFICATION SCREEN */}
        {isVerifyingOtp ? (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 animate-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold text-white">{pendingEmail}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifyingOtp(false);
                    setIsGooglePickerOpen(true);
                  }}
                  className="text-indigo-400 hover:underline text-[11px]"
                >
                  Change Account
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>Enter 6-Digit Verification Code:</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] focus:border-indigo-500 text-center font-mono text-xl tracking-[0.4em] text-white outline-none transition"
                />
              </div>

              {/* Developer Helper Box with OTP Hint */}
              {demoOtpHint && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Your Verification OTP:</span>
                  </span>
                  <span className="font-mono font-bold text-sm bg-emerald-500/20 px-2 py-0.5 rounded-lg text-emerald-200 tracking-widest">
                    {demoOtpHint}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Verify Email & Log In'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                disabled={resendCountdown > 0 || loading}
                onClick={() => handleTouchSelectGoogleAccount({ email: pendingEmail, name: pendingName, avatar: pendingAvatar })}
                className="text-xs text-slate-400 hover:text-white transition disabled:opacity-50 inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{resendCountdown > 0 ? `Resend Code in ${resendCountdown}s` : 'Resend Verification Code'}</span>
              </button>
            </div>
          </form>
        ) : isGooglePickerOpen ? (
          /* 2. GOOGLE ACCOUNT SELECTION LIST */
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs font-bold text-slate-200">Touch an account to sign in:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGooglePickerOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* List of Touch-to-Select Google Accounts */}
              <div className="space-y-2">
                {savedAccounts.map((acc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTouchSelectGoogleAccount(acc)}
                    disabled={loading}
                    className="w-full p-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] hover:border-indigo-500/80 active:scale-[0.98] flex items-center gap-3 transition text-left group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img
                      src={acc.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${acc.email}`}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{acc.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 transition" />
                  </button>
                ))}

                {/* Option to Add Another Account */}
                {!showAddOtherAccount ? (
                  <button
                    type="button"
                    onClick={() => setShowAddOtherAccount(true)}
                    className="w-full p-3 rounded-xl bg-[#161b22]/50 hover:bg-[#161b22] border border-dashed border-[#30363d] hover:border-slate-500 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-indigo-400" />
                    <span>Use another Google account</span>
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTouchSelectGoogleAccount({
                        email: otherEmailInput,
                        name: otherEmailInput.split('@')[0],
                      });
                    }}
                    className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5 animate-in fade-in"
                  >
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Enter another Gmail address:
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="your.email@gmail.com"
                      value={otherEmailInput}
                      onChange={(e) => setOtherEmailInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddOtherAccount(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !otherEmailInput}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? 'Sending...' : 'Select & Verify'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 3. MAIN LOGIN / SIGN UP VIEW */
          <div className="space-y-4">
            {/* Google One-Click Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsGooglePickerOpen(true);
                  setError(null);
                }}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-[#30363d] w-full" />
                <span className="bg-[#161b22] px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider absolute">
                  or with email & password
                </span>
              </div>
            </div>

            {/* Switcher Tabs */}
            <div className="flex rounded-xl bg-[#0d1117] p-1 border border-[#30363d]">
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  tab === 'register'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  tab === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
            </div>

            {/* Error Alert Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                if (tab === 'register') {
                  e.preventDefault();
                  handleTouchSelectGoogleAccount({ email, name: username });
                } else {
                  handleLoginSubmit(e);
                }
              }}
              className="space-y-3.5"
            >
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Name / Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Your Name"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {tab === 'login' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Skills Picker on Sign Up */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Primary Skills
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition flex items-center gap-1 ${
                            isSelected
                              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                              : 'bg-[#0d1117] text-slate-400 border-[#30363d] hover:text-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>
                  {loading
                    ? 'Processing...'
                    : tab === 'register'
                    ? 'Verify Email & Create Account'
                    : 'Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
