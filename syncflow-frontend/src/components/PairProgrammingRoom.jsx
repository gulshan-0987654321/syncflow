import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Play,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Terminal,
  MessageSquare,
  Sparkles,
  Users,
  Copy,
  Check,
  Code2,
  UploadCloud,
  FileCode,
  FileText,
  Download,
  FolderUp,
  Maximize2,
  Minimize2,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  File as FileIcon,
  X,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

const LANGUAGE_TEMPLATES = {
  javascript: `// 🚀 JavaScript (ES6+ / Node.js) - SyncFlow Pair Session
// Solve problems together in real-time!

function solveTwoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log("Two Sum Indices:", solveTwoSum(nums, target));
`,
  typescript: `// 🔷 TypeScript - SyncFlow Real-Time Pair Session

interface User {
    id: string;
    name: string;
    skills: string[];
    isOnline: boolean;
}

function getDeveloperStatus(user: User): string {
    return \`Developer \${user.name} is \${user.isOnline ? '🟢 Available' : '⚪ Offline'} with skills: \${user.skills.join(', ')}\`;
}

const dev: User = {
    id: "dev_101",
    name: "Vishal",
    skills: ["React", "Node.js", "TypeScript"],
    isOnline: true,
};

console.log(getDeveloperStatus(dev));
`,
  python: `# 🐍 Python 3 - SyncFlow Pair Programming & DSA Session

def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len

test_str = "abcabcbb"
print(f"Longest non-repeating substring in '{test_str}':", length_of_longest_substring(test_str))
`,
  cpp: `// ⚡ C++ (C++20 / STL) - SyncFlow DSA Session
#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

// Two Sum in C++ with Hash Map O(N)
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    cout << "C++ Result: Indices [" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}
`,
  java: `// ☕ Java (OpenJDK) - SyncFlow Live Pair Programming
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = { 2, 7, 11, 15 };
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Java Solution: " + Arrays.toString(result));
    }
}
`,
  csharp: `// 🎯 C# (.NET) - SyncFlow Coding Workspace
using System;
using System.Collections.Generic;

class Program {
    static int[] TwoSum(int[] nums, int target) {
        Dictionary<int, int> map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (map.ContainsKey(complement)) {
                return new int[] { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return new int[0];
    }

    static void Main() {
        int[] result = TwoSum(new int[] { 2, 7, 11, 15 }, 9);
        Console.WriteLine($"C# Output: [{string.Join(", ", result)}]");
    }
}
`,
  go: `// 🐹 Go (Golang) - SyncFlow Pair Programming
package main

import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, found := seen[complement]; found {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    nums := []int{2, 7, 11, 15}
    target := 9
    result := twoSum(nums, target)
    fmt.Printf("Golang Result: %v\\n", result)
}
`,
  rust: `// 🦀 Rust - SyncFlow Pair Coding Session
use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Vec<usize> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&prev_index) = map.get(&complement) {
            return vec![prev_index, i];
        }
        map.insert(num, i);
    }
    vec![]
}

fn main() {
    let nums = vec![2, 7, 11, 15];
    let result = two_sum(&nums, 9);
    println!("Rust Result: {:?}", result);
}
`,
  sql: `-- 🗄️ SQL (PostgreSQL / MySQL) - SyncFlow Data Querying
-- Real-time collaborative database query designer

SELECT 
    u.id AS user_id,
    u.username,
    COUNT(s.id) AS total_pair_sessions,
    AVG(s.rating) AS avg_mentor_rating
FROM users u
LEFT JOIN pair_sessions s ON u.id = s.mentor_id
WHERE u.is_online = true
GROUP BY u.id, u.username
HAVING COUNT(s.id) >= 5
ORDER BY avg_mentor_rating DESC;
`,
  php: `<?php
// 🐘 PHP 8 - SyncFlow Pair Programming

function solveTwoSum(array $nums, int $target): array {
    $map = [];
    foreach ($nums as $i => $num) {
        $complement = $target - $num;
        if (isset($map[$complement])) {
            return [$map[$complement], $i];
        }
        $map[$num] = $i;
    }
    return [];
}

$nums = [2, 7, 11, 15];
$result = solveTwoSum($nums, 9);
echo "PHP Result: [" . implode(", ", $result) . "]\n";
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      text-align: center;
    }
    h1 { color: #818cf8; margin-top: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 SyncFlow Collaborative Canvas</h1>
    <p>Edit HTML, CSS, and JS live with your peer!</p>
  </div>
</body>
</html>
`,
};

const EXTENSION_TO_LANGUAGE = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  pyw: 'python',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  c: 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  java: 'java',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  php: 'php',
  html: 'html',
  htm: 'html',
  css: 'html',
  json: 'javascript',
  txt: 'javascript',
  md: 'javascript',
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function PairProgrammingRoom() {
  const { currentUser } = useAuth();
  const { socket, activeRoomId, callPartner, setCallPartner, leaveRoom } = useSocket();

  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'chat' | 'files'
  const [chatMessages, setChatMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Video & Screen Share Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peerIsSharingScreen, setPeerIsSharingScreen] = useState(null);
  const [theaterMode, setTheaterMode] = useState(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);

  // File Drag & Drop State
  const [isDraggingOverEditor, setIsDraggingOverEditor] = useState(false);
  const [isDraggingOverPanel, setIsDraggingOverPanel] = useState(false);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [toast, setToast] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const theaterVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const iceCandidatesQueue = useRef([]);
  const codeRef = useRef(code);
  const fileInputRef = useRef(null);
  const chatFileInputRef = useRef(null);

  // Toast Notification Helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Production-grade ICE servers with STUN + optional TURN via environment variables
  const getIceServers = useCallback(() => {
    const servers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ];

    const turnUrl = import.meta.env.VITE_TURN_URL;
    const turnUsername = import.meta.env.VITE_TURN_USERNAME;
    const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

    if (turnUrl) {
      const turnConfig = { urls: turnUrl };
      if (turnUsername) turnConfig.username = turnUsername;
      if (turnCredential) turnConfig.credential = turnCredential;
      servers.push(turnConfig);
      console.log('⚡ Using custom TURN server for WebRTC relay');
    }

    return servers;
  }, []);

  // Cleanup WebRTC Peer Connection
  const cleanupPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      console.log('🧹 Cleaning up RTCPeerConnection');
      try {
        peerConnectionRef.current.onicecandidate = null;
        peerConnectionRef.current.ontrack = null;
        peerConnectionRef.current.onconnectionstatechange = null;
        peerConnectionRef.current.oniceconnectionstatechange = null;
        peerConnectionRef.current.close();
      } catch (e) {}
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (theaterVideoRef.current && !isScreenSharing) {
      theaterVideoRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;
    iceCandidatesQueue.current = [];
    setHasRemoteVideo(false);
    setPeerIsSharingScreen(null);
  }, [isScreenSharing]);

  // Helper to attach local audio/video tracks to peer connection
  const addLocalTracksToPeer = useCallback((stream) => {
    if (!peerConnectionRef.current || !stream) return;
    const pc = peerConnectionRef.current;
    const senders = pc.getSenders();
    stream.getTracks().forEach((track) => {
      const alreadyAdded = senders.some((s) => s.track && s.track.id === track.id);
      if (!alreadyAdded) {
        try {
          pc.addTrack(track, stream);
          console.log(`📡 Local track added to PeerConnection: ${track.kind} (${track.id})`);
        } catch (e) {
          console.warn('Track add warning:', e.message);
        }
      }
    });
  }, []);

  // WebRTC Peer Connection Initializer
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      const state = peerConnectionRef.current.signalingState;
      if (state !== 'closed') {
        return peerConnectionRef.current;
      }
    }

    console.log('⚡ Creating new RTCPeerConnection with ICE servers');
    const pc = new RTCPeerConnection({
      iceServers: getIceServers(),
      iceCandidatePoolSize: 10,
    });

    peerConnectionRef.current = pc;

    // Attach local media tracks (screen share or camera/mic)
    const activeStream = screenStreamRef.current || localStreamRef.current;
    if (activeStream) {
      addLocalTracksToPeer(activeStream);
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket && activeRoomId) {
        console.log(`📡 Sending ICE Candidate: ${event.candidate.candidate?.slice(0, 30)}...`);
        socket.emit('webrtc_signal', {
          roomId: activeRoomId,
          signal: { type: 'candidate', candidate: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('📡 WebRTC remote track received:', event.track.kind, 'ID:', event.track.id);

      // Handle streams: some browsers supply event.streams[0], others supply isolated track
      let stream = event.streams && event.streams[0];
      if (!stream) {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }
        if (!remoteStreamRef.current.getTracks().some((t) => t.id === event.track.id)) {
          remoteStreamRef.current.addTrack(event.track);
        }
        stream = remoteStreamRef.current;
      } else {
        remoteStreamRef.current = stream;
      }

      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject !== stream) {
          remoteVideoRef.current.srcObject = stream;
        }
        remoteVideoRef.current.play().catch((err) => {
          console.warn('Remote video play warning:', err.message);
        });
      }

      if (theaterVideoRef.current && !isScreenSharing) {
        if (theaterVideoRef.current.srcObject !== stream) {
          theaterVideoRef.current.srcObject = stream;
        }
        theaterVideoRef.current.play().catch(() => {});
      }

      if (event.track.kind === 'video') {
        setHasRemoteVideo(true);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`📡 WebRTC Connection State: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        console.log('✅ WebRTC P2P Connection ESTABLISHED!');
        showToast('Connected to peer!', 'success');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.warn(`⚠️ WebRTC Connection state: ${pc.connectionState}`);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`📡 WebRTC ICE Connection State: ${pc.iceConnectionState}`);
    };

    return pc;
  }, [getIceServers, socket, activeRoomId, addLocalTracksToPeer, isScreenSharing, showToast]);

  // 1. Initialize WebRTC Media Stream (Camera & Mic with graceful fallbacks)
  useEffect(() => {
    let active = true;

    const startMedia = async () => {
      let stream = null;
      try {
        console.log('📷 Requesting camera & microphone access...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        console.log('✅ Camera & microphone acquired successfully');
      } catch (err) {
        console.warn('Camera+Mic not available, trying audio fallback:', err.name, err.message);
        if (err.name === 'NotAllowedError') {
          showToast('Camera/Mic permission denied. Please allow permissions in your browser.', 'error');
        } else if (err.name === 'NotFoundError') {
          showToast('No camera or microphone device found.', 'error');
        } else if (err.name === 'NotReadableError') {
          showToast('Camera or mic is currently busy in another app.', 'error');
        }

        try {
          // Fallback 1: Audio only
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          setIsVideoOff(true);
        } catch (audioErr) {
          console.warn('Audio fallback failed, trying video only:', audioErr.message);
          try {
            // Fallback 2: Video only
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setIsMuted(true);
          } catch (allErr) {
            console.warn('No media devices available or permissions denied:', allErr.message);
            showToast('Media permissions unavailable. Live code editor and chat remain fully active!', 'info');
          }
        }
      }

      if (!active) {
        if (stream) stream.getTracks().forEach((t) => t.stop());
        return;
      }

      if (stream) {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        addLocalTracksToPeer(stream);
      }

      setIsMediaReady(true);
    };

    startMedia();

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      cleanupPeerConnection();
    };
  }, [addLocalTracksToPeer, cleanupPeerConnection, showToast]);

  // 2. Socket Room Listeners for Real-Time Sync, File Sharing, Screen Sharing & WebRTC
  useEffect(() => {
    if (!socket || !activeRoomId || !isMediaReady) return;

    console.log(`⚡ Joining code room: ${activeRoomId}`);
    socket.emit('join_code_room', {
      roomId: activeRoomId,
      user: currentUser || { username: 'Guest' },
    });

    const handleConnect = () => {
      console.log('⚡ Socket reconnected. Re-joining room:', activeRoomId);
      socket.emit('join_code_room', {
        roomId: activeRoomId,
        user: currentUser || { username: 'Guest' },
      });
    };
    socket.on('connect', handleConnect);

    socket.on('room_state', (roomData) => {
      console.log('📋 Received room state:', roomData);
      if (roomData.code) {
        codeRef.current = roomData.code;
        setCode(roomData.code);
      }
      if (roomData.language) setLanguage(roomData.language);

      if (roomData.participants && roomData.participants.length > 0) {
        const otherParticipant = roomData.participants.find(
          (p) => p && (p._id !== currentUser?._id && p.id !== currentUser?.id && p.socketId !== socket.id)
        );
        if (otherParticipant && setCallPartner) {
          console.log('👤 Room partner detected from room state:', otherParticipant.username);
          setCallPartner(otherParticipant);
        }
      }
    });

    socket.on('code_change', ({ code: newCode }) => {
      if (newCode !== undefined && newCode !== codeRef.current) {
        console.log(`📝 Received remote code change (${newCode.length} chars)`);
        codeRef.current = newCode;
        setCode(newCode);
      }
    });

    socket.on('language_change', ({ language: newLang }) => {
      console.log(`🌐 Received remote language change: ${newLang}`);
      setLanguage(newLang);
    });

    socket.on('code_output_sync', ({ output: syncedOutput }) => {
      setOutput(syncedOutput);
      setActiveTab('terminal');
    });

    socket.on('room_chat_message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    // Handle real-time file sharing
    socket.on('room_file_share', (fileObj) => {
      setSharedFiles((prev) => [fileObj, ...prev]);
      showToast(`📁 ${fileObj.sender} shared "${fileObj.name}"!`, 'info');
    });

    // Handle screen share status changes
    socket.on('screen_share_status', ({ isSharing, user }) => {
      if (isSharing) {
        setPeerIsSharingScreen(user);
        showToast(`🖥️ ${user} started screen sharing!`, 'info');
      } else {
        setPeerIsSharingScreen(null);
        setTheaterMode(false);
        showToast(`🖥️ Screen sharing stopped by ${user}.`, 'info');
      }
    });

    // WebRTC Signaling Handlers
    socket.on('user_joined_room', async ({ user, socketId }) => {
      console.log('👋 User joined room:', user?.username, 'Socket:', socketId);
      showToast(`👋 ${user?.username || 'Peer'} joined workspace!`, 'info');
      if (user && setCallPartner) {
        setCallPartner(user);
      }

      try {
        const pc = createPeerConnection();
        console.log('⚡ Initiating WebRTC offer for newly joined peer');
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);
        socket.emit('webrtc_signal', {
          roomId: activeRoomId,
          toSocketId: socketId,
          signal: { type: 'offer', sdp: offer },
        });
        console.log('⚡ WebRTC offer sent successfully');
      } catch (err) {
        console.warn('WebRTC offer creation error:', err.message);
      }
    });

    socket.on('user_left_room', ({ user, socketId }) => {
      console.log('🚪 User left room:', user?.username, 'Socket:', socketId);
      showToast(`🚪 ${user?.username || 'Peer'} left the room.`, 'info');
      cleanupPeerConnection();
      if (setCallPartner) {
        setCallPartner(null);
      }
    });

    socket.on('webrtc_signal', async ({ signal, fromSocketId }) => {
      try {
        const pc = createPeerConnection();
        if (signal.type === 'offer') {
          console.log('⚡ Received WebRTC offer from:', fromSocketId);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

          // Drain queued ICE candidates
          while (iceCandidatesQueue.current.length > 0) {
            const cand = iceCandidatesQueue.current.shift();
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
              console.log('🧊 Added buffered ICE candidate to remote offer');
            } catch (e) {
              console.warn('Buffered candidate warning:', e.message);
            }
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc_signal', {
            roomId: activeRoomId,
            toSocketId: fromSocketId,
            signal: { type: 'answer', sdp: answer },
          });
          console.log('⚡ WebRTC answer sent back to:', fromSocketId);
        } else if (signal.type === 'answer') {
          console.log('⚡ Received WebRTC answer from:', fromSocketId);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

          // Drain queued ICE candidates
          while (iceCandidatesQueue.current.length > 0) {
            const cand = iceCandidatesQueue.current.shift();
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
              console.log('🧊 Added buffered ICE candidate to remote answer');
            } catch (e) {
              console.warn('Buffered candidate warning:', e.message);
            }
          }
        } else if (signal.type === 'candidate' && signal.candidate) {
          if (pc.remoteDescription && pc.remoteDescription.type) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
              console.log('🧊 Added incoming ICE candidate');
            } catch (e) {
              console.warn('Add ICE candidate warning:', e.message);
            }
          } else {
            console.log('🧊 Queuing incoming ICE candidate (remote description not set yet)');
            iceCandidatesQueue.current.push(signal.candidate);
          }
        }
      } catch (err) {
        console.warn('WebRTC signal handling error:', err.message);
      }
    });

    socket.on('call_ended', () => {
      alert('Your peer has ended the session.');
      leaveRoom();
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('room_state');
      socket.off('code_change');
      socket.off('language_change');
      socket.off('code_output_sync');
      socket.off('room_chat_message');
      socket.off('room_file_share');
      socket.off('screen_share_status');
      socket.off('user_joined_room');
      socket.off('user_left_room');
      socket.off('webrtc_signal');
      socket.off('call_ended');
    };
  }, [
    socket,
    activeRoomId,
    isMediaReady,
    createPeerConnection,
    cleanupPeerConnection,
    currentUser,
    leaveRoom,
    setCallPartner,
    showToast,
  ]);

  // Handle local code editor changes
  const handleEditorChange = (value) => {
    if (value === undefined || value === codeRef.current) {
      return;
    }

    codeRef.current = value;
    setCode(value);
    if (socket && activeRoomId) {
      socket.emit('code_change', {
        roomId: activeRoomId,
        code: value,
      });
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const template = LANGUAGE_TEMPLATES[newLang] || '// Start coding...';
    codeRef.current = template;
    setCode(template);

    if (socket && activeRoomId) {
      socket.emit('language_change', {
        roomId: activeRoomId,
        language: newLang,
      });
      socket.emit('code_change', {
        roomId: activeRoomId,
        code: template,
      });
    }
  };

  // Run Code in In-Browser Sandbox and broadcast output
  const handleRunCode = () => {
    setActiveTab('terminal');
    let logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')),
      error: (...args) => logs.push('❌ Error: ' + args.join(' ')),
      warn: (...args) => logs.push('⚠️ Warning: ' + args.join(' ')),
      info: (...args) => logs.push('ℹ️ ' + args.join(' ')),
    };

    if (language === 'javascript') {
      try {
        const runFunction = new Function('console', code);
        runFunction(customConsole);
        const resultOutput = logs.length > 0 ? logs.join('\n') : '▶ Code executed with return value 0.';
        setOutput(resultOutput);

        if (socket && activeRoomId) {
          socket.emit('code_output_sync', {
            roomId: activeRoomId,
            output: resultOutput,
            isError: false,
          });
        }
      } catch (err) {
        const errOutput = `❌ Execution Error:\n${err.message}`;
        setOutput(errOutput);
        if (socket && activeRoomId) {
          socket.emit('code_output_sync', {
            roomId: activeRoomId,
            output: errOutput,
            isError: true,
          });
        }
      }
    } else {
      const simulatedOutput = `[Simulated ${language.toUpperCase()} Runner]\n> Code evaluated successfully.\n> Ready for live peer review!`;
      setOutput(simulatedOutput);
      if (socket && activeRoomId) {
        socket.emit('code_output_sync', {
          roomId: activeRoomId,
          output: simulatedOutput,
          isError: false,
        });
      }
    }
  };

  // Synchronize Theater Video stream whenever Theater Mode or sharing changes
  useEffect(() => {
    if (theaterMode && theaterVideoRef.current) {
      if (isScreenSharing && screenStreamRef.current) {
        theaterVideoRef.current.srcObject = screenStreamRef.current;
      } else if (remoteStreamRef.current) {
        theaterVideoRef.current.srcObject = remoteStreamRef.current;
      }
      theaterVideoRef.current.play().catch(() => {});
    }
  }, [theaterMode, isScreenSharing, peerIsSharingScreen]);

  // --- SCREEN SHARE FEATURE ---
  const startScreenShare = async () => {
    try {
      let displayStream;
      try {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: true,
        });
      } catch (e) {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });
      }

      screenStreamRef.current = displayStream;
      setIsScreenSharing(true);

      const screenTrack = displayStream.getVideoTracks()[0];

      // Update local preview to screen share
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = displayStream;
      }
      if (theaterVideoRef.current) {
        theaterVideoRef.current.srcObject = displayStream;
      }

      // Replace track on WebRTC peer connection
      if (peerConnectionRef.current) {
        const pc = peerConnectionRef.current;
        const senders = pc.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
        if (videoSender && screenTrack) {
          console.log('🔄 Replacing video track with screen track on existing sender');
          await videoSender.replaceTrack(screenTrack);
        } else if (screenTrack) {
          try {
            console.log('➕ Adding screen track to peer connection and renegotiating');
            pc.addTrack(screenTrack, displayStream);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('webrtc_signal', {
              roomId: activeRoomId,
              signal: { type: 'offer', sdp: offer },
            });
          } catch (e) {
            console.warn('Track add error:', e.message);
          }
        }
      }

      // Broadcast screen share status
      if (socket && activeRoomId) {
        socket.emit('screen_share_status', {
          roomId: activeRoomId,
          isSharing: true,
          user: currentUser?.username || 'Dev',
        });
      }

      showToast('🖥️ Screen sharing active!');

      // When user clicks the native browser "Stop sharing" button
      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        console.warn('Screen share error:', err.message);
        showToast('Screen share error: ' + err.message, 'error');
      } else {
        console.log('User cancelled screen share prompt');
      }
    }
  };

  const stopScreenShare = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setIsScreenSharing(false);

    // Revert local preview back to camera
    if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;

      // Revert WebRTC sender track back to camera
      if (peerConnectionRef.current) {
        const cameraTrack = localStreamRef.current.getVideoTracks()[0];
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
        if (videoSender && cameraTrack) {
          console.log('🔄 Reverting screen track back to camera track');
          await videoSender.replaceTrack(cameraTrack);
        }
      }
    }

    // Broadcast screen share stopped
    if (socket && activeRoomId) {
      socket.emit('screen_share_status', {
        roomId: activeRoomId,
        isSharing: false,
        user: currentUser?.username || 'Dev',
      });
    }

    showToast('Screen sharing stopped.');
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  // --- MIC & CAMERA CONTROLS ---
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const newState = !audioTracks[0].enabled;
        audioTracks.forEach((t) => (t.enabled = newState));
        setIsMuted(!newState);
        showToast(newState ? '🎙️ Microphone unmuted' : '🔇 Microphone muted', 'info');
      } else {
        showToast('No microphone track available', 'error');
      }
    } else {
      showToast('Audio device not initialized', 'error');
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !videoTracks[0].enabled;
        videoTracks.forEach((t) => (t.enabled = newState));
        setIsVideoOff(!newState);
        showToast(newState ? '📷 Camera turned on' : '🚫 Camera turned off', 'info');
      } else {
        showToast('No camera track available', 'error');
      }
    } else {
      showToast('Video device not initialized', 'error');
    }
  };

  // --- FILE DRAG & DROP AND SHARING ---
  const handleFileShare = (file) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      showToast('File size exceeds 20MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const ext = file.name.split('.').pop().toLowerCase();
      const isCode = Boolean(EXTENSION_TO_LANGUAGE[ext]);

      const fileObj = {
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        ext,
        isCode,
        dataUrl: e.target.result,
        sender: currentUser?.username || 'Dev',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (socket && activeRoomId) {
        socket.emit('room_file_share', {
          roomId: activeRoomId,
          file: fileObj,
        });
      }

      setSharedFiles((prev) => [fileObj, ...prev]);
      showToast(`Uploaded "${file.name}" to shared files!`);
    };

    reader.readAsDataURL(file);
  };

  // Drag & drop onto Monaco Editor area
  const handleEditorDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverEditor(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const detectedLang = EXTENSION_TO_LANGUAGE[ext];

    // If it's a binary/image file, share in the Files tab instead
    if (!detectedLang && !file.type.startsWith('text/')) {
      handleFileShare(file);
      setActiveTab('files');
      showToast(`Shared "${file.name}" in Files tab (binary file).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const targetLang = detectedLang || 'javascript';
      codeRef.current = fileContent;
      setCode(fileContent);
      setLanguage(targetLang);

      if (socket && activeRoomId) {
        socket.emit('language_change', {
          roomId: activeRoomId,
          language: targetLang,
        });
        socket.emit('code_change', {
          roomId: activeRoomId,
          code: fileContent,
        });
      }

      // Also record in shared files
      handleFileShare(file);
      showToast(`📄 Loaded "${file.name}" (${targetLang}) into Editor and synced with peer!`);
    };
    reader.readAsText(file);
  };

  // Open a shared code file directly in the Monaco editor
  const openFileInEditor = (fileItem) => {
    if (!fileItem.dataUrl) return;
    try {
      const base64Data = fileItem.dataUrl.split(',')[1];
      const decodedText = atob(base64Data);
      const ext = fileItem.ext || fileItem.name.split('.').pop().toLowerCase();
      const detectedLang = EXTENSION_TO_LANGUAGE[ext] || 'javascript';

      codeRef.current = decodedText;
      setCode(decodedText);
      setLanguage(detectedLang);

      if (socket && activeRoomId) {
        socket.emit('language_change', {
          roomId: activeRoomId,
          language: detectedLang,
        });
        socket.emit('code_change', {
          roomId: activeRoomId,
          code: decodedText,
        });
      }
      showToast(`Loaded "${fileItem.name}" into Monaco Editor!`);
    } catch (err) {
      showToast('Failed to open file: ' + err.message, 'error');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !socket || !activeRoomId) return;

    const messageObj = {
      sender: currentUser?.username || 'Guest',
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('room_chat_message', {
      roomId: activeRoomId,
      message: messageObj,
    });
    setNewMsg('');
  };

  const copyRoomCode = () => {
    if (activeRoomId) {
      navigator.clipboard.writeText(activeRoomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-[#0d1117] overflow-hidden select-none">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                : toast.type === 'info'
                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Workspace Top Toolbar */}
      <div className="h-14 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between shrink-0 gap-2">
        {/* Left: Room Code Badge & Language Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-mono transition group"
            title="Click to copy Room Code"
          >
            <span className="text-slate-400">Room:</span>
            <span className="font-bold text-indigo-300 tracking-wider">{activeRoomId}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
            )}
          </button>

          {/* Multi-Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs font-semibold text-indigo-300 outline-none hover:border-indigo-500 transition cursor-pointer"
          >
            <option value="javascript">🟨 JavaScript (Node.js)</option>
            <option value="typescript">🔷 TypeScript</option>
            <option value="python">🐍 Python 3</option>
            <option value="cpp">⚡ C++ (GCC)</option>
            <option value="java">☕ Java (OpenJDK)</option>
            <option value="csharp">🎯 C# (.NET)</option>
            <option value="go">🐹 Go (Golang)</option>
            <option value="rust">🦀 Rust</option>
            <option value="sql">🗄️ SQL</option>
            <option value="php">🐘 PHP 8</option>
            <option value="html">🌐 HTML5 & CSS</option>
          </select>
        </div>

        {/* Center: Live Screen Share & Sync Status */}
        <div className="hidden lg:flex items-center gap-3">
          {(isScreenSharing || peerIsSharingScreen) && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="font-semibold">
                {isScreenSharing
                  ? 'You are Sharing Screen'
                  : `@${peerIsSharingScreen} is Sharing Screen`}
              </span>
              <button
                onClick={() => setTheaterMode(!theaterMode)}
                className="ml-1.5 underline hover:text-white flex items-center gap-1 font-bold text-[11px]"
              >
                {theaterMode ? 'Exit Theater' : 'Theater View'}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Monaco Sync & File Drop Active</span>
          </div>
        </div>

        {/* Right: Screen Share, Run Code & Leave Actions */}
        <div className="flex items-center gap-2">
          {/* Topbar Screen Share Quick Button */}
          <button
            onClick={toggleScreenShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition shadow-sm ${
              isScreenSharing
                ? 'bg-rose-600/20 text-rose-300 border-rose-500/40 hover:bg-rose-600/30'
                : 'bg-[#21262d] text-slate-300 border-[#30363d] hover:bg-[#30363d] hover:text-white'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <Monitor className={`w-3.5 h-3.5 ${isScreenSharing ? 'text-rose-400' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">
              {isScreenSharing ? 'Stop Screen' : 'Share Screen'}
            </span>
          </button>

          <button
            onClick={handleRunCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run</span>
          </button>

          <button
            onClick={leaveRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Center Editor Area (65% width or Theater Mode) */}
        <div
          className="flex-1 flex flex-col border-r border-[#30363d] bg-[#1e1e1e] relative overflow-hidden"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDraggingOverEditor(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDraggingOverEditor(false);
          }}
          onDrop={handleEditorDrop}
        >
          {/* Theater Mode View for Screen Sharing */}
          {theaterMode && (isScreenSharing || peerIsSharingScreen) && (
            <div className="h-2/3 bg-black border-b border-[#30363d] relative flex flex-col items-center justify-center">
              <div className="absolute top-2 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur border border-white/10 text-xs text-white">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {isScreenSharing ? 'Your Shared Screen' : `@${peerIsSharingScreen}'s Shared Screen`}
                </span>
              </div>
              <button
                onClick={() => setTheaterMode(false)}
                className="absolute top-2 right-3 z-10 px-2 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs text-slate-300 flex items-center gap-1"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Theater</span>
              </button>
              <video
                ref={theaterVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Monaco Editor Dropzone Indicator Overlay */}
          {isDraggingOverEditor && (
            <div className="absolute inset-0 z-40 bg-indigo-950/85 backdrop-blur-sm border-4 border-dashed border-indigo-500 rounded-lg flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150 pointer-events-none">
              <div className="p-4 rounded-full bg-indigo-600/30 border border-indigo-400/40 mb-3 shadow-lg shadow-indigo-500/30">
                <UploadCloud className="w-12 h-12 text-indigo-300 animate-bounce" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Drop Code File to Open in Monaco Editor
              </h2>
              <p className="text-xs text-indigo-200 mt-1.5 max-w-md">
                Language will be auto-detected and changes will sync live with your peer in real-time.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[11px] text-indigo-300/80 font-mono">
                <span>.js</span> • <span>.py</span> • <span>.cpp</span> • <span>.java</span> • <span>.ts</span> • <span>.go</span> • <span>.html</span> • <span>.sql</span>
              </div>
            </div>
          )}

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                lineNumbers: 'on',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Subtle Drop Hint footer */}
          <div className="h-6 px-3 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <UploadCloud className="w-3 h-3 text-indigo-400" />
              <span>Drag & drop code files anywhere onto the editor to load & sync</span>
            </div>
            <span>{language.toUpperCase()}</span>
          </div>
        </div>

        {/* Right Panel: Video Grid & Live Output / Chat / Files (35% width) */}
        <div className="w-80 lg:w-96 flex flex-col bg-[#161b22] shrink-0">
          {/* Video & Screen Share Containers */}
          <div className="p-3 border-b border-[#30363d] bg-[#0d1117] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Local Video / Local Screen Share */}
              <div className="relative aspect-video rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden shadow-inner flex items-center justify-center group">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full ${
                    isScreenSharing ? 'object-contain bg-black' : 'object-cover'
                  } ${isVideoOff && !isScreenSharing ? 'hidden' : 'block'}`}
                />
                {isVideoOff && !isScreenSharing && (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <VideoOff className="w-5 h-5" />
                    <span className="text-[10px]">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-white">
                    You ({currentUser?.username || 'Dev'})
                  </span>
                  {isScreenSharing && (
                    <span className="px-1 py-0.5 rounded bg-indigo-600/90 text-[9px] font-bold text-white">
                      Screen
                    </span>
                  )}
                </div>
                {isScreenSharing && (
                  <button
                    onClick={() => setTheaterMode(!theaterMode)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition"
                    title="Toggle Theater Mode"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Remote Peer Video / Screen Share */}
              <div className="relative aspect-video rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden shadow-inner flex items-center justify-center group">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${hasRemoteVideo ? 'block' : 'hidden'}`}
                />

                {!hasRemoteVideo && (
                  <>
                    {callPartner ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950/40 to-[#161b22] p-2 text-center">
                        <img
                          src={
                            callPartner.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={callPartner.username}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500 mb-1"
                        />
                        <span className="text-[11px] font-bold text-white leading-tight">
                          {callPartner.username}
                        </span>
                        <span className="text-[9px] text-emerald-400">Live Peer Connected</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-500 text-center p-2">
                        <Users className="w-5 h-5 text-slate-600" />
                        <span className="text-[10px]">Waiting for peer...</span>
                      </div>
                    )}
                  </>
                )}

                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-white">
                    {callPartner ? `@${callPartner.username}` : 'Peer'}
                  </span>
                  {peerIsSharingScreen && (
                    <span className="px-1 py-0.5 rounded bg-rose-600/90 text-[9px] font-bold text-white animate-pulse">
                      Screen
                    </span>
                  )}
                </div>

                {(hasRemoteVideo || peerIsSharingScreen) && (
                  <button
                    onClick={() => setTheaterMode(!theaterMode)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition"
                    title="Toggle Theater Mode"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* In-Call Controls Bar */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl border transition ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-[#21262d] text-slate-300 border-[#30363d] hover:bg-[#30363d]'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-2 rounded-xl border transition ${
                  isVideoOff
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-[#21262d] text-slate-300 border-[#30363d] hover:bg-[#30363d]'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

              {/* Screen Share Control Button */}
              <button
                onClick={toggleScreenShare}
                className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-[#21262d] text-slate-300 border-[#30363d] hover:bg-[#30363d] hover:text-white'
                }`}
                title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation: Terminal vs Chat vs Files */}
          <div className="flex border-b border-[#30363d] bg-[#161b22] px-2 pt-1">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'terminal'
                  ? 'text-indigo-400 border-indigo-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Output</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'chat'
                  ? 'text-indigo-400 border-indigo-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'files'
                  ? 'text-indigo-400 border-indigo-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <FolderUp className="w-3.5 h-3.5" />
              <span>Files {sharedFiles.length > 0 && `(${sharedFiles.length})`}</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 flex flex-col p-3 overflow-hidden">
            {/* 1. Terminal Output */}
            {activeTab === 'terminal' && (
              <div className="flex-1 flex flex-col bg-[#0d1117] rounded-xl border border-[#30363d] p-3 overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-[#30363d] pb-1.5 mb-2">
                  <span>Standard Output</span>
                  <span className="text-emerald-400">● Live Synced</span>
                </div>
                <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-slate-200">
                  {output || '> Click "▶ Run" to execute script and view output together.'}
                </div>
              </div>
            )}

            {/* 2. In-Call Chat with File Attachment */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
                  {chatMessages.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No messages yet. Send a message to your partner!
                    </p>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-bold text-indigo-300">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="text-slate-200">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 shrink-0">
                  {/* Hidden file input for chat */}
                  <input
                    type="file"
                    ref={chatFileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileShare(e.target.files[0]);
                        setActiveTab('files');
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => chatFileInputRef.current?.click()}
                    className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-300 transition"
                    title="Attach & Share File"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* 3. Drag & Drop Shared Files Panel */}
            {activeTab === 'files' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-3">
                {/* File Dropzone Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingOverPanel(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingOverPanel(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingOverPanel(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileShare(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                    isDraggingOverPanel
                      ? 'border-indigo-500 bg-indigo-500/20 scale-[1.01]'
                      : 'border-[#30363d] hover:border-indigo-500/50 bg-[#0d1117]/60'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileShare(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-indigo-400 mb-1.5 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-200">
                    Drag & drop file here to share
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    or click to browse from computer (max 20MB)
                  </p>
                </div>

                {/* Shared Files List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {sharedFiles.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      <FolderUp className="w-8 h-8 text-slate-600 mx-auto mb-1.5 opacity-50" />
                      <p>No files shared yet in this room.</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        Drop code files directly onto the editor or upload files here!
                      </p>
                    </div>
                  ) : (
                    sharedFiles.map((fileItem) => (
                      <div
                        key={fileItem.id}
                        className="p-2.5 rounded-xl bg-[#21262d] border border-[#30363d] text-xs hover:border-indigo-500/40 transition group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                              {fileItem.isCode ? (
                                <FileCode className="w-4 h-4" />
                              ) : (
                                <FileIcon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-semibold text-slate-200 truncate" title={fileItem.name}>
                                {fileItem.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {formatFileSize(fileItem.size)} • By {fileItem.sender} ({fileItem.time})
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* File Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <a
                            href={fileItem.dataUrl}
                            download={fileItem.name}
                            className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-[#0d1117] hover:bg-[#30363d] border border-[#30363d] text-[11px] font-medium text-slate-300 hover:text-white transition"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>

                          {fileItem.isCode && (
                            <button
                              onClick={() => openFileInEditor(fileItem)}
                              className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-[11px] font-medium text-indigo-300 hover:text-white transition"
                              title="Load this code into Monaco editor"
                            >
                              <Code2 className="w-3 h-3" />
                              <span>Open in Editor</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
