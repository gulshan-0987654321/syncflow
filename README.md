# ⚡ SyncFlow - Real-Time Collaborative Pair Programming & Video Signaling Platform

SyncFlow is a collaborative developer workspace that brings real-time code editing, live video/audio calling, instant screen sharing, and peer-to-peer file sharing directly into a single unified browser experience.

---

## 🌐 Live Application Link
- **Live Web App (Frontend)**: **[https://syncflow-app.vercel.app](https://syncflow-app.vercel.app)** 🚀
- **Live Backend API & Socket Server**: **[https://syncflow-1-shjr.onrender.com](https://syncflow-1-shjr.onrender.com)**
- **Health Endpoint**: **[https://syncflow-1-shjr.onrender.com/api/health](https://syncflow-1-shjr.onrender.com/api/health)**
- **GitHub Repository**: **[https://github.com/gulshan-0987654321/syncflow](https://github.com/gulshan-0987654321/syncflow)**

---

## ✨ Features

- **👨‍💻 Collaborative Code Editor**: Powered by Monaco Editor (VS Code core) with multi-language syntax highlighting, real-time sync across connected peers.
- **📹 Video & Voice Calling**: Low-latency peer-to-peer WebRTC calling with camera flip/toggle, mic mute controls, and intelligent fallback for devices without camera/mic.
- **🖥️ Screen Sharing**: 1-click HD screen sharing with integrated system audio broadcast and automatic revert to camera when stream ends.
- **📁 Drag & Drop File Sharing**: Drag any file or code snippet into Monaco editor to auto-load, or drop files (up to 20MB) into the Files panel to share instantly across room peers.
- **🔒 Flexible Authentication**: Simple signup and direct demo accounts with JWT token session handling.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Monaco Editor, Socket.IO Client, Simple-Peer (WebRTC)
- **Backend**: Node.js, Express, Socket.IO, Mongoose, JSONWebToken, Bcrypt
- **Database**: MongoDB Atlas

---

## 🛠️ Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gulshan-0987654321/syncflow.git
   cd syncflow
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   In `syncflow-backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start Development Servers**:
   ```bash
   # Backend
   npm run dev:backend

   # Frontend (in another terminal)
   npm run dev:frontend
   ```

---

## ☁️ Deployment

### Render (Recommended Full-Stack)
1. Push to GitHub.
2. Link your repository in Render Dashboard (`Web Service`).
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Add `MONGO_URI` and `JWT_SECRET` in Render Environment Variables.
