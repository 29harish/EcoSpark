import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
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

function AppContent() {
  const { currentPage } = useApp();
  const [enteredApp, setEnteredApp] = useState(false);

  if (!enteredApp) {
    return <LandingPage onEnterApp={() => setEnteredApp(true)} />;
  }

  const pageContent = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'learn': return <LearnHub />;
      case 'lesson': return <LessonExperience />;
      case 'quizzes': return <Quizzes />;
      case 'missions': return <Missions />;
      case 'garden': return <EcoGarden />;
      case 'leaderboard': return <Leaderboard />;
      case 'challenges': return <Challenges />;
      case 'ai-guide': return <AIEcoGuide />;
      case 'rewards': return <Rewards />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground variant={currentPage === 'garden' ? 'garden' : 'default'} />
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
