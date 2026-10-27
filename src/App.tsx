import { useEffect, useRef, useState } from 'react';
import { Menu, User as UserIcon, LogOut } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import WelcomeScreen from '@/components/WelcomeScreen';
import SkillChallenges from '@/components/SkillChallenges';
import MySubmissions from '@/components/MySubmissions';
import TeacherReview from '@/components/TeacherReview';
import { SkillPassport } from '@/components/PlaceholderViews';
import { SubmissionProvider, useSubmissions } from '@/context/SubmissionContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { STORAGE_KEYS, loadJSON, saveJSON } from '@/lib/storage';
import { navItems, type ViewId } from '@/types/nav';
import { supabase } from '@/lib/supabase';

const VALID_VIEWS = navItems.map((n) => n.id);

const loadView = (): ViewId => {
  const raw = loadJSON<string | null>(STORAGE_KEYS.view, null);
  return raw && VALID_VIEWS.includes(raw as ViewId) ? (raw as ViewId) : 'dashboard';
};

function AppContent() {
  const [view, setView] = useState<ViewId>(() => loadView());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('khovera:welcome-complete'));
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { resetData } = useSubmissions();
  const { user, profile, signOut } = useAuth();
  const isHydrated = useRef(false);

  // Supabase Connection Verification
  useEffect(() => {
    async function testSupabaseConnection() {
      const { data, error } = await supabase.from('challenges').select('*');
      if (error) {
        console.error('Supabase Connection Error:', error.message);
      } else {
        console.log('✅ Supabase Connected Successfully! Challenges data:', data);
      }
    }
    testSupabaseConnection();
  }, []);

  useEffect(() => {
    if (isHydrated.current) {
      saveJSON(STORAGE_KEYS.view, view);
    } else {
      isHydrated.current = true;
    }
  }, [view]);

  const handleResetData = () => {
    const confirmed = window.confirm(
      'Reset all demo data? This will permanently remove your local demo submissions and saved page from this browser. This cannot be undone.'
    );
    if (!confirmed) return;
    resetData();
    setView('dashboard');
    setSidebarOpen(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => { localStorage.setItem('khovera:welcome-complete', 'true'); setShowWelcome(false); }} />;
  }

  return (
    <div className="app-layout">
      {/* Top Bar Navigation Actions */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f4f4f5', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {profile?.display_name || user.email}
            </span>
            <button
              onClick={signOut}
              title="Sign Out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <UserIcon size={16} />
            Sign In / Register
          </button>
        )}
      </div>

      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </button>

      <Sidebar
        current={view}
        onNavigate={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onResetData={handleResetData}
      />

      <main className="main-content">
        {view === 'dashboard' && <Dashboard />}
        {view === 'challenges' && <SkillChallenges />}
        {view === 'submissions' && <MySubmissions />}
        {view === 'review' && <TeacherReview />}
        {view === 'passport' && <SkillPassport />}
      </main>

      {/* Auth Modal Dialog */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubmissionProvider>
        <AppContent />
      </SubmissionProvider>
    </AuthProvider>
  );
}