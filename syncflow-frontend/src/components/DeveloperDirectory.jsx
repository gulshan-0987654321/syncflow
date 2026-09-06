import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { fetchDevelopersAPI } from '../api/client';
import {
  Video,
  Sparkles,
  Plus,
  ArrowRight,
  Copy,
  Check,
  Users,
  Search,
  Code2,
  Share2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function DeveloperDirectory({ onOpenAuth }) {
  const { currentUser, token } = useAuth();
  const { onlineUsers, createRoom, joinRoom, initiateCall, callStatus, callPartner } = useSocket();

  const [inputRoomId, setInputRoomId] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(true);

  // Load real registered members from MongoDB database
  useEffect(() => {
    const loadRegisteredMembers = async () => {
      if (!token) {
        setRegisteredMembers([]);
        return;
      }
      try {
        setLoading(true);
        const membersData = await fetchDevelopersAPI(token, { search: searchQuery });
        setRegisteredMembers(membersData || []);
      } catch (err) {
        console.warn('Registered members fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRegisteredMembers();
  }, [token, searchQuery]);

  // Handle Create Room
  const handleCreateRoom = () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    const newRoomCode = createRoom();
    setCreatedRoomCode(newRoomCode);
  };

  // Handle Join Room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    if (!inputRoomId.trim()) {
      alert('Please enter a Room Code to join!');
      return;
    }
    joinRoom(inputRoomId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Instant Real-Time Pair Programming</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Live Code & Video in{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Shared Rooms
          </span>
        </h1>
        <p className="text-sm text-slate-300">
          Create a private room, share your Room ID with a peer, and code together in real-time with
          built-in HD video calling!
        </p>
      </div>

      {/* Primary Room ID Control Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Card 1: Create New Room */}
        <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#1c2128] to-[#161b22] border border-indigo-500/30 hover:border-indigo-500/60 shadow-2xl flex flex-col justify-between space-y-6 transition duration-200">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Create a New Room</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate a unique Room ID. Share the code with your friend or teammate so they can join
              your live code editor and video session.
            </p>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Create Instant Room</span>
          </button>
        </div>

        {/* Card 2: Join Existing Room */}
        <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#1c2128] to-[#161b22] border border-[#30363d] hover:border-slate-500 shadow-2xl flex flex-col justify-between space-y-6 transition duration-200">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Join with Room ID</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have a Room Code from your peer? Enter it below to jump directly into their live coding
              session and video call.
            </p>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Room Code (e.g. SYNC-4821)"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl bg-[#0d1117] border border-[#30363d] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm font-mono text-white placeholder-slate-500 outline-none uppercase tracking-wider transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#21262d] hover:bg-[#30363d] text-white font-bold text-sm border border-[#30363d] hover:border-slate-500 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join Room</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>
          </form>
        </div>
      </div>

      {/* How it Works Quick Steps */}
      <div className="p-6 rounded-2xl bg-[#161b22]/60 border border-[#30363d] max-w-4xl mx-auto">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>How Room-Based Pair Programming Works</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
            <span className="text-indigo-400 font-bold text-sm">1. Create Room</span>
            <p className="text-slate-300">Click "Create Instant Room" to generate a Room ID.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
            <span className="text-purple-400 font-bold text-sm">2. Share Code</span>
            <p className="text-slate-300">Send the Room ID to your friend or teammate.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-1">
            <span className="text-emerald-400 font-bold text-sm">3. Pair & Video</span>
            <p className="text-slate-300">Both enter the shared room, write code & chat over video!</p>
          </div>
        </div>
      </div>

      {/* Dedicated Registered Members Section */}
      {currentUser && (
        <div className="max-w-4xl mx-auto space-y-4 pt-4 border-t border-[#30363d]">
          {/* Header Toggle */}
          <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Registered Members</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono">
                    {registeredMembers.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Connect & pair with real developers registered on SyncFlow
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input for registered members */}
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or skill..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setIsMembersOpen(!isMembersOpen)}
                className="p-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-400 hover:text-white transition"
              >
                {isMembersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Members List Grid (when open) */}
          {isMembersOpen && (
            <div className="animate-in fade-in space-y-4">
              {registeredMembers.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-300">
                    No other registered members found matching your search.
                  </p>
                  <p className="text-xs text-slate-400">
                    Click <strong>"Create Instant Room"</strong> above and share the Room ID with a friend to pair program!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {registeredMembers.map((member) => (
                    <div
                      key={member._id}
                      className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-slate-500 transition flex items-center justify-between gap-3 shadow-md group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={member.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.username}`}
                          alt={member.username}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#30363d] group-hover:ring-indigo-500/50 transition shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs text-white truncate group-hover:text-indigo-300 transition">
                            {member.fullName || member.username}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">@{member.username}</p>
                          <p className="text-[11px] text-indigo-400 truncate mt-0.5">
                            {member.skills?.slice(0, 2).join(', ') || 'Developer'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => initiateCall(member)}
                        className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition shrink-0 active:scale-95"
                        title={`Call @${member.username}`}
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
