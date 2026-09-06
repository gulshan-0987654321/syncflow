import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Code2,
  Video,
  Sparkles,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Play,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenProfile }) {
  const { currentUser, logout, login } = useAuth();
  const { onlineUsers, enterSandboxRoom, activeRoomId } = useSocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Demo accounts for instant multi-user simulation
  const handleQuickLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (err) {
      alert('Quick login error: ' + err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SyncFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Live Pair
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Peer Mentorship & Live Video Code Workspace
            </p>
          </div>
        </div>

        {/* Center Live Stats */}
        <div className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-full bg-[#0d1117] border border-[#30363d]">
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              <strong className="text-white">{onlineUsers.length || 1}</strong> Devs Online
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>WebRTC P2P</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Direct Code Sandbox Button */}
          {!activeRoomId && (
            <button
              onClick={enterSandboxRoom}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold transition shadow-sm hover:border-slate-500"
            >
              <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span>Solo Sandbox</span>
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Direct My Profile Nav Button */}
              <button
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] text-xs font-semibold transition hover:border-indigo-500/50"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>My Profile</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition"
                >
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={currentUser.username}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="block text-xs font-semibold text-white leading-tight">
                      {currentUser.fullName || currentUser.username}
                    </span>
                    <span className="block text-[10px] text-emerald-400">🟢 Available</span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[#30363d]">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-[#21262d] rounded-xl transition"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Edit My Profile & Skills</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-200 text-xs font-semibold border border-[#30363d] transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
