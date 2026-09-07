import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
const rawApiUrl = import.meta.env.VITE_API_URL;
const defaultBackend = import.meta.env.PROD ? 'https://syncflow-backend-rf0d.onrender.com' : 'http://localhost:5000';

const SOCKET_SERVER_URL = (
  rawSocketUrl ||
  rawBackendUrl ||
  (rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : defaultBackend)
).replace(/\/+$/, '');

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [callPartner, setCallPartner] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'in_room'

  const socketRef = useRef(null);

  useEffect(() => {
    console.log(`⚡ Connecting Socket.IO to: ${SOCKET_SERVER_URL}`);
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`⚡ Connected to SyncFlow Socket.IO Server (ID: ${newSocket.id})`);
      if (currentUser && currentUser._id) {
        newSocket.emit('user_connected', currentUser);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.warn('⚠️ Socket.IO connection error:', err.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('⚡ Socket disconnected:', reason);
    });

    newSocket.on('online_users_list', (usersList) => {
      setOnlineUsers(usersList);
    });

    newSocket.on('incoming_call', (callData) => {
      console.log('📞 Received Incoming Call:', callData);
      setIncomingCall(callData);
    });

    newSocket.on('call_accepted', ({ roomId, receiver }) => {
      console.log('✅ Call accepted by peer:', receiver);
      setCallPartner(receiver);
      setActiveRoomId(roomId);
      setCallStatus('in_room');
    });

    newSocket.on('call_rejected', ({ reason }) => {
      alert(`Call Declined: ${reason}`);
      setCallStatus('idle');
      setCallPartner(null);
      setActiveRoomId(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Update socket whenever currentUser changes
  useEffect(() => {
    if (socket && currentUser && currentUser._id) {
      socket.emit('user_connected', currentUser);
    }
  }, [currentUser, socket]);

  // Create a new room with custom or random Room Code
  const createRoom = (customCode) => {
    const randomCode = `SYNC-${Math.floor(1000 + Math.random() * 9000)}`;
    const roomId = (customCode || randomCode).trim().toUpperCase();
    setActiveRoomId(roomId);
    setCallStatus('in_room');
    return roomId;
  };

  // Join an existing room via Room Code
  const joinRoom = (roomId) => {
    if (!roomId || !roomId.trim()) {
      alert('Please enter a valid Room Code');
      return false;
    }
    const cleanRoomId = roomId.trim().toUpperCase();
    setActiveRoomId(cleanRoomId);
    setCallStatus('in_room');
    return true;
  };

  const initiateCall = (targetUser) => {
    if (!socket || !currentUser) {
      alert('Please log in to start a call');
      return;
    }

    const roomId = `SYNC-${Math.floor(1000 + Math.random() * 9000)}`;
    setCallPartner(targetUser);
    setCallStatus('calling');

    socket.emit('initiate_call', {
      toUserId: targetUser._id,
      caller: currentUser,
      roomId,
    });
  };

  const acceptCall = () => {
    if (!incomingCall || !socket || !currentUser) return;

    const { caller, roomId } = incomingCall;
    setCallPartner(caller);
    setActiveRoomId(roomId);
    setCallStatus('in_room');

    socket.emit('accept_call', {
      toUserId: caller._id,
      roomId,
      receiver: currentUser,
    });

    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall || !socket) return;
    socket.emit('reject_call', {
      toUserId: incomingCall.caller._id,
      reason: 'User is busy or declined the call',
    });
    setIncomingCall(null);
  };

  const leaveRoom = () => {
    if (activeRoomId && socket && currentUser) {
      socket.emit('end_call_signal', {
        roomId: activeRoomId,
        fromUserId: currentUser._id,
      });
    }
    setActiveRoomId(null);
    setCallPartner(null);
    setCallStatus('idle');
  };

  const enterSandboxRoom = () => {
    const sandboxId = `SANDBOX-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveRoomId(sandboxId);
    setCallStatus('in_room');
    return sandboxId;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        incomingCall,
        activeRoomId,
        callPartner,
        setCallPartner,
        callStatus,
        createRoom,
        joinRoom,
        enterSandboxRoom,
        initiateCall,
        acceptCall,
        rejectCall,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
