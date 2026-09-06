import { useSocket } from '../context/SocketContext';
import { PhoneCall, PhoneOff, Video, Sparkles } from 'lucide-react';

export default function IncomingCallModal() {
  const { incomingCall, acceptCall, rejectCall } = useSocket();

  if (!incomingCall) return null;

  const { caller } = incomingCall;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-[#1c2128] to-[#161b22] border border-indigo-500/40 shadow-2xl shadow-indigo-500/20 text-center space-y-6">
        {/* Animated Radar Pulse */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-purple-500/30 animate-pulse" />
          <img
            src={
              caller?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            }
            alt={caller?.username}
            className="relative z-10 w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500 shadow-xl"
          />
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Video className="w-3.5 h-3.5" />
            <span>Incoming Pair Coding Call</span>
          </div>
          <h2 className="text-2xl font-black text-white">{caller?.username}</h2>
          <p className="text-xs text-slate-300">
            is requesting a live pair-programming & video session with you!
          </p>
        </div>

        {/* Skills of Caller */}
        {caller?.skills && caller.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {caller.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full bg-[#21262d] text-indigo-300 border border-indigo-500/30 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {/* Decline Button */}
          <button
            onClick={rejectCall}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition flex items-center justify-center gap-2 hover:border-rose-500"
          >
            <PhoneOff className="w-4 h-4 text-rose-400" />
            <span>Decline</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={acceptCall}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 animate-bounce hover:animate-none"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Accept & Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}
