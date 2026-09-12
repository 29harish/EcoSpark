import { AppProvider, useApp } from '@/context/AppContext';
import { FeedbackProvider } from '@/components/ui/FeedbackToast';
import { PageTransition } from '@/components/ui/PageTransition';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnimatedBackground } from '@/components/decorations/AnimatedBackground';

import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { LearnHub } from '@/pages/LearnHub';
import { LessonExperience } from '@/pages/LessonExperience';

import { Missions } from '@/pages/Missions';
import { Leaderboard } from '@/pages/Leaderboard';
import { AIEcoGuide } from '@/pages/AIEcoGuide';
import { Rewards } from '@/pages/Rewards';
import { Profile } from '@/pages/Profile';
import { Assessment } from '@/pages/Assessment';

import Login from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';

function AppContent() {
  const { currentPage, user, authLoading, navigate } = useApp();

  // Wait until Firebase tells us whether a user is logged in.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-leaf-200 border-t-leaf-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading EcoSpark...</p>
        </div>
      </div>
    );
  }

  // Public pages
if (currentPage === 'landing' && !user) {
  return <LandingPage onEnterApp={() => {}} />;
}
  if (currentPage === 'login') {
    return <Login />;
  }

  if (currentPage === 'signup') {
    return <Signup />;
  }

  // All remaining pages require authentication.
  if (!user) {
    return <LandingPage onEnterApp={() => {}} />;
  }

  // Assessment is rendered outside the app shell, so the navigation is hidden.
  // Returning users are routed to Dashboard by AppContext/Login; the route
  // remains mounted only long enough to show the current session's results.
  if (currentPage === 'assessment') {
    return (
      <div className="min-h-screen bg-cream-50">
        <PageTransition pageKey={currentPage}>
          <Assessment />
        </PageTransition>
      </div>
    );
  }

  const pageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;

      case 'learn':
        return <LearnHub />;

      case 'lesson':
        return <LessonExperience />;

      case 'missions':
        return <Missions />;

      case 'garden':
        return (
          <div className="min-h-screen p-6 md:p-10">
            <div className="mx-auto max-w-xl rounded-[32px] border border-leaf-100 bg-white/80 p-8 text-center shadow-soft backdrop-blur-sm">
              <div className="mb-4 text-5xl">🚧</div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-500">
                Coming soon
              </p>
              <h1 className="mt-3 text-3xl font-black text-leaf-800">
                Eco Garden
              </h1>
              <p className="mt-3 text-base text-leaf-600/70">
                This page is currently under development.
              </p>
              <button
                onClick={() => navigate('dashboard')}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-leaf-500 to-lagoon-500 px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:opacity-95"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        );

      case 'leaderboard':
        return <Leaderboard />;

      case 'ai-guide':
        return <AIEcoGuide />;

      case 'rewards':
        return <Rewards />;

      case 'profile':
        return <Profile />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground
        variant={currentPage === 'garden' ? 'garden' : 'default'}
      />

      <Sidebar />

      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <PageTransition pageKey={currentPage}>
          {pageContent()}
        </PageTransition>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <FeedbackProvider>
        <AppContent />
      </FeedbackProvider>
    </AppProvider>
  );
}

export default App;