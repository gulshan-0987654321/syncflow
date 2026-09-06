import { useState } from 'react';
import Navbar from './components/Navbar';
import DeveloperDirectory from './components/DeveloperDirectory';
import IncomingCallModal from './components/IncomingCallModal';
import PairProgrammingRoom from './components/PairProgrammingRoom';
import AuthModal from './components/AuthModal';
import MyProfileSection from './components/MyProfileSection';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';

function MainApp() {
  const { activeRoomId } = useSocket();
  const [authModalState, setAuthModalState] = useState({ isOpen: false, tab: 'login' });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col selection:bg-indigo-500/30">
      {/* Navbar */}
      <Navbar
        onOpenAuth={(tab) => setAuthModalState({ isOpen: true, tab })}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeRoomId ? (
          <PairProgrammingRoom />
        ) : (
          <DeveloperDirectory
            onOpenAuth={(tab) => setAuthModalState({ isOpen: true, tab })}
          />
        )}
      </main>

      {/* Global Modals */}
      <IncomingCallModal />

      <AuthModal
        isOpen={authModalState.isOpen}
        initialTab={authModalState.tab}
        onClose={() => setAuthModalState({ isOpen: false, tab: 'login' })}
      />

      <MyProfileSection
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
