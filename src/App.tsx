import { AppProvider, useApp } from '@/context/AppContext';
import { Assessment } from '@/pages/Assessment';
import { FeedbackProvider } from '@/components/ui/FeedbackToast';
import { PageTransition } from '@/components/ui/PageTransition';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnimatedBackground } from '@/components/decorations/AnimatedBackground';

import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { LearnHub } from '@/pages/LearnHub';
import { LessonExperience } from '@/pages/LessonExperience';
import { Quizzes } from '@/pages/Quizzes';
import { Missions } from '@/pages/Missions';
import { EcoGarden } from '@/pages/EcoGarden';
import { Leaderboard } from '@/pages/Leaderboard';
import { Challenges } from '@/pages/Challenges';
import { AIEcoGuide } from '@/pages/AIEcoGuide';
import { Rewards } from '@/pages/Rewards';
import { Profile } from '@/pages/Profile';

import Login from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';

function AppContent() {
  const { currentPage, user, authLoading } = useApp();

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

  const pageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;

      case 'learn':
        return <LearnHub />;

      case 'lesson':
        return <LessonExperience />;

      case 'quizzes':
        return <Quizzes />;

      case 'missions':
        return <Missions />;

      case 'garden':
        return <EcoGarden />;

      case 'leaderboard':
        return <Leaderboard />;

      case 'challenges':
        return <Challenges />;

      case 'ai-guide':
        return <AIEcoGuide />;

      case 'rewards':
        return <Rewards />;

      case 'profile':
        return <Profile />;
      
      case 'assessment':
        return <Assessment />;

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