import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { updateUser } from './services/userService.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'https://syncflow-app.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
].filter(Boolean);

const corsOriginValidator = (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
    ) {
        return callback(null, origin);
    }
    return callback(null, origin);
};

const corsOptions = {
    origin: corsOriginValidator,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

// Socket.IO Setup with Production CORS
const io = new Server(httpServer, {
    maxHttpBufferSize: 2e7, // 20 MB for smooth drag & drop file sharing
    cors: corsOptions
});

app.get("/api/status", (req, res) => {
    res.send("Syncflow Backend is Running 🚀");
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'syncflow-backend', timestamp: new Date().toISOString() });
});

// Online Users Map: userId -> Set of socketIds
const onlineUsers = new Map();
// Socket to User map: socketId -> userId
const socketUserMap = new Map();
// Active Code Rooms: roomId -> { code, language, participants: Set }
const activeRooms = new Map();

io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // 1. User Online Status Tracking
    socket.on('user_connected', async (userData) => {
        if (!userData || (!userData._id && !userData.id)) return;
        const userId = (userData._id || userData.id).toString();

        socketUserMap.set(socket.id, userId);

        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // Join individual user room for direct signaling
        socket.join(`user_${userId}`);

        // Update database isOnline flag
        try {
            await updateUser(userId, { isOnline: true, availabilityStatus: 'available' });
        } catch (e) {
            console.error('Error updating user online status:', e.message);
        }

        // Broadcast list of online user IDs
        io.emit('online_users_list', Array.from(onlineUsers.keys()));
    });

    // 2. Call Signaling (1-Click Call)
    socket.on('initiate_call', ({ toUserId, caller, roomId }) => {
        console.log(`📞 Call initiated from ${caller.username} (${caller._id}) to ${toUserId}`);
        io.to(`user_${toUserId}`).emit('incoming_call', {
            caller,
            roomId,
            timestamp: Date.now()
        });
    });

    socket.on('accept_call', ({ toUserId, roomId, receiver }) => {
        console.log(`✅ Call accepted by ${receiver.username} for room ${roomId}`);
        io.to(`user_${toUserId}`).emit('call_accepted', {
            roomId,
            receiver
        });
    });

    socket.on('reject_call', ({ toUserId, reason }) => {
        console.log(`❌ Call rejected for user ${toUserId}`);
        io.to(`user_${toUserId}`).emit('call_rejected', {
            reason: reason || 'User declined the call'
        });
    });

    socket.on('end_call_signal', ({ roomId, fromUserId }) => {
        socket.to(roomId).emit('call_ended', { fromUserId });
    });

    // 3. WebRTC Direct P2P Media Signaling
    socket.on('webrtc_signal', ({ roomId, signal, toSocketId }) => {
        const signalType = signal?.type || (signal?.candidate ? 'candidate' : 'unknown');
        console.log(`📡 [WebRTC Signal] ${signalType} from ${socket.id} to ${toSocketId || roomId}`);
        if (toSocketId) {
            io.to(toSocketId).emit('webrtc_signal', {
                signal,
                fromSocketId: socket.id
            });
        } else if (roomId) {
            socket.to(roomId).emit('webrtc_signal', {
                signal,
                fromSocketId: socket.id
            });
        }
    });

    // 4. Collaborative Live Code Editor Events
    socket.on('join_code_room', ({ roomId, user }) => {
        socket.join(roomId);
        console.log(`👨‍💻 User ${user?.username || socket.id} (${socket.id}) joined code room: ${roomId}`);

        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, {
                code: `// 🚀 Welcome to SyncFlow Live Collaborative Workspace!\n// Start pair-programming in real-time.\n\nfunction solveProblem() {\n    console.log("Hello from SyncFlow Live Pair!");\n}\n\nsolveProblem();\n`,
                language: 'javascript',
                participants: new Map()
            });
        }

        const roomData = activeRooms.get(roomId);
        const participantInfo = { ...(user || {}), socketId: socket.id };
        roomData.participants.set(socket.id, participantInfo);

        // Send current room state to the newly joined user
        socket.emit('room_state', {
            code: roomData.code,
            language: roomData.language,
            participants: Array.from(roomData.participants.values())
        });

        // Notify others in room with full participant info including socketId
        socket.to(roomId).emit('user_joined_room', {
            user: participantInfo,
            socketId: socket.id,
            participants: Array.from(roomData.participants.values())
        });
    });

    socket.on('code_change', ({ roomId, code }) => {
        if (activeRooms.has(roomId)) {
            activeRooms.get(roomId).code = code;
        }
        console.log(`📝 Code change in ${roomId} by ${socket.id} (${code?.length || 0} bytes)`);
        socket.to(roomId).emit('code_change', { code });
    });

    socket.on('cursor_change', ({ roomId, position, user }) => {
        socket.to(roomId).emit('cursor_change', { position, user });
    });

    socket.on('language_change', ({ roomId, language }) => {
        if (activeRooms.has(roomId)) {
            activeRooms.get(roomId).language = language;
        }
        console.log(`🌐 Language change in ${roomId} to ${language} by ${socket.id}`);
        socket.to(roomId).emit('language_change', { language });
    });

    socket.on('code_output_sync', ({ roomId, output, isError }) => {
        socket.to(roomId).emit('code_output_sync', { output, isError });
    });

    socket.on('room_chat_message', ({ roomId, message }) => {
        io.to(roomId).emit('room_chat_message', message);
    });

    socket.on('room_file_share', ({ roomId, file }) => {
        console.log(`📁 File shared in ${roomId} by ${socket.id}: ${file?.name}`);
        io.to(roomId).emit('room_file_share', file);
    });

    socket.on('screen_share_status', ({ roomId, isSharing, user }) => {
        console.log(`🖥️ Screen share status in ${roomId}: ${isSharing} by ${user || socket.id}`);
        socket.to(roomId).emit('screen_share_status', { isSharing, user });
    });

    // 5. Disconnect Handling
    socket.on('disconnect', async () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
        const userId = socketUserMap.get(socket.id);
        socketUserMap.delete(socket.id);

        if (userId && onlineUsers.has(userId)) {
            const userSockets = onlineUsers.get(userId);
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
                try {
                    await updateUser(userId, { isOnline: false, availabilityStatus: 'offline' });
                } catch (e) {}
            }
            io.emit('online_users_list', Array.from(onlineUsers.keys()));
        }

        // Clean up rooms
        activeRooms.forEach((roomData, roomId) => {
            if (roomData.participants.has(socket.id)) {
                const leavingUser = roomData.participants.get(socket.id);
                roomData.participants.delete(socket.id);
                console.log(`🚪 User ${leavingUser?.username || socket.id} left room ${roomId}`);
                socket.to(roomId).emit('user_left_room', {
                    user: leavingUser,
                    socketId: socket.id,
                    participants: Array.from(roomData.participants.values())
                });
            }
        });
    });
});

// Serve Frontend Static assets in Production (if dist exists)
const possibleDistPaths = [
    path.resolve(__dirname, '../../syncflow-frontend/dist'),
    path.resolve(__dirname, '../dist'),
    path.resolve(__dirname, './dist')
];
const frontendDistPath = possibleDistPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || possibleDistPaths[0];
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
    // If request starts with /api or is a socket request, skip
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    res.send("Syncflow Backend is Running 🚀 (Build frontend to view UI)");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 SyncFlow Backend & Socket.IO running on port ${PORT}`);
});