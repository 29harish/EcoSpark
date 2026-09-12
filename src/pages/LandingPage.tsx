import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import {
  Leaf,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Target,
  Sprout,
  Trophy,
  Flame,
  Lightbulb,
  Coins,
  Globe,
  BookOpen,
  ClipboardCheck,
  Award,
  TreePine,
  TrendingUp,
  Users,
  Instagram,
  Youtube,
  Facebook,
  Send,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = [
      'home',
      'how-it-works',
      'why-ecospark',
      'garden',
      'schools',
      'ai-eco-guide',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      // At the very top, Home is active.
      if (window.scrollY < 80) {
        setActiveSection('home');
        return;
      }

      for (let i = sections.length - 1; i >= 1; i--) {
        const section = document.getElementById(sections[i]);

        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nav now matches every section the scroll-spy tracks, so "Eco Garden"
  // and "AI Guide" are reachable instead of only found by scrolling past them.
  const navItems = [
    { label: 'Home', id: 'home', href: '#' },
    { label: 'How it Works', id: 'how-it-works', href: '#how-it-works' },
    { label: 'Features', id: 'why-ecospark', href: '#why-ecospark' },
    { label: 'Eco Garden', id: 'garden', href: '#garden' },
    { label: 'AI Guide', id: 'ai-eco-guide', href: '#ai-eco-guide' },
    { label: 'For Schools', id: 'schools', href: '#schools' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);

    // Smoothly scroll to real sections.
    if (id !== 'home') {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const { navigate } = useApp();

const handleStart = () => {
  navigate('signup');
};

const handleLogin = () => {
  navigate('login');
};

  const handleExplore = () => {
    onEnterApp();
    navigate('learn');
  };

  return (
    <div id="home" className="min-h-screen bg-cream-50 overflow-x-hidden">
      {/* ===== NAV BAR ===== */}
{/* ===== HEADER ===== */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-sky-50 to-sky-100 border-b border-white/60">
  <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">

    {/* ===== LOGO ===== */}
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-leaf-400 to-lagoon-500 flex items-center justify-center shadow-glow">
        <Leaf className="w-5 h-5 text-white" />
      </div>

      <div>
        <span className="text-xl font-extrabold gradient-text">
          EcoSpark
        </span>
        <p className="text-[9px] text-leaf-600/60 -mt-1">
          Learn · Play · Protect
        </p>
      </div>
    </div>

    {/* ===== NAVIGATION ===== */}
    
    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(item.id);
          }}
          className={`relative py-6 text-sm font-semibold transition-colors duration-200
            ${
              activeSection === item.id
                ? 'text-leaf-600 after:absolute after:left-0 after:right-0 after:bottom-3 after:h-[2px] after:bg-leaf-500'
                : 'text-gray-700 hover:text-leaf-500'
            }`}
        >
          {item.label}
        </a>
      ))}
    </div>

    {/* ===== ACTION BUTTONS ===== */}
    <div className="flex items-center gap-3 shrink-0">

      <button
        onClick={handleLogin}
        className="px-6 py-2.5 rounded-full bg-white
        border border-gray-200 text-sm font-bold text-gray-700
        shadow-sm hover:shadow-md hover:border-leaf-200
        transition-all"
      >
        Log In
      </button>

      <Button
        size="sm"
        onClick={handleStart}
        className="!px-6 !py-3 !rounded-full"
      >
        Get Started
      </Button>

    </div>

  </div>
</nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-leaf-50/60 via-cream-50 to-lagoon-50/40" />
        {/* Only one ambient glow now — the second (sun) blob was dropped so the
            "blurred circle behind everything" pattern doesn't repeat across sections. */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-leaf-200/30 rounded-full blur-3xl animate-float-slow" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="animate-slide-up text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-leaf-800">
              Learn.
              <br />
              Act.
              <br />
              Grow.
              <br />
            </h1>

            <p className="mt-6 text-lg md:text-xl text-leaf-600/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                EcoSpark turns environmental education into an interactive journey where students learn, complete real-world eco missions, earn rewards, and see their impact grow. 
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={handleStart} icon={<Sparkles className="w-5 h-5" />}>
                Start Your Eco Journey
              </Button>
              <Button size="lg" variant="outline" onClick={handleExplore} icon={<ArrowRight className="w-5 h-5" />}>
                Explore EcoSpark
              </Button>
            </div>
          </div>

          {/* Right: Dashboard preview */}
          <div className="relative animate-pop-in">
            <div className="relative">
              <div className="bg-white rounded-4xl shadow-soft-lg p-6 border border-leaf-100/50 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-leaf-100 flex items-center justify-center text-leaf-600">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-leaf-800">Welcome back!</div>
                      <div className="text-xs text-leaf-600/60">Level 10 · Earth Guardian</div>
                    </div>
                  </div>
                  <Badge variant="coral" icon={<Flame className="w-3 h-3" />}>12 day streak</Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-leaf-50 rounded-2xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-leaf-600">2,450</div>
                    <div className="text-xs text-leaf-600/60 font-medium">Total XP</div>
                  </div>
                  <div className="bg-sun-50 rounded-2xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-sun-600">340</div>
                    <div className="text-xs text-sun-600/60 font-medium">Eco Coins</div>
                  </div>
                  <div className="bg-lagoon-50 rounded-2xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-lagoon-600">#3</div>
                    <div className="text-xs text-lagoon-600/60 font-medium">School Rank</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-leaf-50 to-lagoon-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-leaf-700">Today's Mission</span>
                    <Badge variant="green">+30 XP</Badge>
                  </div>
                  <div className="text-sm text-leaf-600/70 mb-3">Use a reusable water bottle</div>
                  <ProgressBar value={75} gradient="from-leaf-400 to-lagoon-400" />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-gradient-to-r from-leaf-400 to-lagoon-400 rounded-xl p-2.5 text-center text-white text-sm font-bold flex items-center justify-center gap-1.5">
                    <Sprout className="w-4 h-4" /> Garden Lv 3
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-sun-400 to-coral-400 rounded-xl p-2.5 text-center text-white text-sm font-bold flex items-center justify-center gap-1.5">
                    <Trophy className="w-4 h-4" /> 6 Badges
                  </div>
                </div>
              </div>

              {/* Floating accent cards — kept here only. They used to repeat in the
                  AI Eco Guide section too; trimming that repeat keeps the motif
                  feeling like a hero highlight instead of a page-wide template. */}
              <div className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-soft-lg p-3 border border-leaf-100/50 animate-bounce-soft hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sun-100 flex items-center justify-center text-sun-600">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-leaf-800">+15 Coins!</div>
                    <div className="text-xs text-leaf-600/60">Mission complete</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-soft-lg p-3 border border-leaf-100/50 animate-float hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-leaf-100 flex items-center justify-center text-leaf-600">
                    <TreePine className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-leaf-800">Garden grew!</div>
                    <div className="text-xs text-leaf-600/60">New tree unlocked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

           {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-leaf-50/40 to-cream-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-leaf-900 flex items-center justify-center gap-3">
              How It Works🍃
             
            </h2>
            <p className="mt-3 text-lg ">
              Simple steps, big impact!
            </p>
          </div>

           <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-2">
            {[
              { image: '/learn.png', title: 'Learn', desc: 'Explore fun lessons on environmental topics.' },
              { image: '/quiz.png', title: 'Quiz', desc: 'Test your knowledge with interactive quizzes.' },
              { image: '/act.png', title: 'Act', desc: 'Complete eco-missions in your daily life.' },
              { image: '/rewards.png', title: 'Earn Rewards', desc: 'Earn EcoCoins, XP and amazing badges.' },
              { image: '/grow.png', title: 'Grow & Inspire', desc: 'Grow your garden and inspire others!' },
            ].map((step, i) => (
              <div key={i} className="flex items-center lg:items-start">
                <div className="group cursor-pointer flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-leaf-50 border border-leaf-100 overflow-hidden transition-all duration-300 ease-out group-hover:border-leaf-400 group-hover:shadow-glow group-hover:-translate-y-1">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-leaf-600 text-white text-xs font-extrabold flex items-center justify-center border-2 border-white shadow-soft transition-transform duration-300 group-hover:scale-110">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-leaf-900 transition-colors duration-300 group-hover:text-leaf-600">{i + 1}. {step.title}</h3>
                  <p className="mt-1 text-sm text-leaf-600/70 leading-relaxed max-w-[170px]">{step.desc}</p>
                </div>

                {i < 4 && (
                  <ArrowRight className="hidden lg:block w-6 h-6 text-leaf-300 mx-2 mt-11 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ===== WHY ECOSPARK ===== */}
<section id="why-ecospark" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-cream-50">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-50 border border-leaf-100 text-leaf-700 text-sm font-bold mb-5">
        <Sparkles className="w-4 h-4" />
        Why EcoSpark?
      </div>

      <h2 className="text-3xl md:text-5xl font-extrabold text-leaf-900">
        Learning about the planet
        <br />
        <span className="gradient-text">should be an experience.</span>
      </h2>

      <p className="mt-5 text-lg text-leaf-600/70 leading-relaxed">
        EcoSpark goes beyond traditional environmental education by
        combining learning, real-world action, rewards and community.
      </p>
    </div>

    {/* Feature Cards — dropped the "-right-8 -top-8" hover-scale decorative
        circle that was repeated identically in all 4 cards. It's the same
        blob motif as the hero/AI-guide glows; removing it here keeps that
        pattern from showing up a fourth and fifth time. */}
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

  {/* Learn */}
  <Card
    className="p-7 group text-center"
    hover
  >
    <div className="flex flex-col items-center">
      
      {/* Custom Image Icon */}
      <div className="w-24 h-24 mb-6 group-hover:scale-110 transition-transform duration-300">
        <img
          src="/learn-icon.png"
          alt="Learn Differently"
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-xl font-extrabold text-leaf-900 mb-3">
        Learn Differently
      </h3>

      <p className="text-sm text-leaf-600/70 leading-relaxed">
        Bite-sized interactive lessons make complex environmental
        concepts simple, visual and engaging.
      </p>
    </div>
  </Card>


  {/* Act */}
  <Card
    className="p-7 group text-center"
    hover
  >
    <div className="flex flex-col items-center">

      {/* Custom Image Icon */}
      <div className="w-24 h-24 mb-6 group-hover:scale-110 transition-transform duration-300">
        <img
          src="/act-icon.png"
          alt="Learn by Doing"
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-xl font-extrabold text-leaf-900 mb-3">
        Learn by Doing
      </h3>

      <p className="text-sm text-leaf-600/70 leading-relaxed">
        Turn knowledge into meaningful real-world eco missions
        that students can complete every day.
      </p>
    </div>
  </Card>


  {/* Impact */}
  <Card
    className="p-7 group text-center"
    hover
  >
    <div className="flex flex-col items-center">

      {/* Custom Image Icon */}
      <div className="w-24 h-24 mb-6 group-hover:scale-110 transition-transform duration-300">
        <img
          src="/impact-icon.png"
          alt="See Your Impact"
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-xl font-extrabold text-leaf-900 mb-3">
        See Your Impact
      </h3>

      <p className="text-sm text-leaf-600/70 leading-relaxed">
        Track your progress and discover how small actions can
        contribute to a healthier planet.
      </p>
    </div>
  </Card>


  {/* Community */}
  <Card
    className="p-7 group text-center"
    hover
  >
    <div className="flex flex-col items-center">

      {/* Custom Image Icon */}
      <div className="w-24 h-24 mb-6 group-hover:scale-110 transition-transform duration-300">
        <img
          src="/community-icon.png"
          alt="Learn Together"
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-xl font-extrabold text-leaf-900 mb-3">
        Learn Together
      </h3>

      <p className="text-sm text-leaf-600/70 leading-relaxed">
        Compete with friends and classmates through challenges,
        leaderboards and shared environmental goals.
      </p>
    </div>
  </Card>


    </div>
  </div>
</section>

          

      {/* ===== ECO GARDEN PREVIEW ===== */}
      <section id="garden" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
                            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-leaf-800">
                Grow your own <span className="gradient-text">Eco Garden</span>
              </h2>
              <p className="mt-4 text-lg text-leaf-600/70 leading-relaxed">
                Every lesson you complete and every mission you accomplish makes your virtual garden flourish. Watch trees grow, flowers bloom, and animals arrive as you learn.
              </p>

              <div className="mt-8">
                <Button size="lg" onClick={handleStart} icon={<Sprout className="w-5 h-5" />}>
                  Start Growing
                </Button>
              </div>
            </div>

            {/* Garden visual */}
            <div className="relative animate-pop-in">
              <div className="rounded-4xl shadow-soft-lg border border-leaf-100/50 relative overflow-hidden h-[400px]">
                <img
                  src="/ecogarden.png"
                  alt="Eco Garden"
                  className="w-full h-full object-cover"
                />

                
              </div>
            </div>
          </div>
        </div>
      </section>


{/* ===== FOR SCHOOLS ===== */}
<section
  id="schools"
  className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-leaf-50/40 to-cream-50"
>  <div className="max-w-7xl mx-auto">

    <div className="grid lg:grid-cols-2 gap-14 items-center">

      {/* Left - Dashboard Preview */}
      <div className="relative animate-pop-in order-2 lg:order-1">

        {/* Glow */}
        <div className="absolute inset-0 bg-leaf-300/20 blur-3xl rounded-full scale-90" />

        <div className="relative bg-white rounded-3xl border border-leaf-100 shadow-soft-lg p-5">

          {/* Fake Dashboard Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-leaf-500 font-semibold">
                TEACHER DASHBOARD
              </p>
              <h3 className="text-lg font-extrabold text-leaf-900">
                Class Overview
              </h3>
            </div>

            <div className="w-10 h-10 rounded-xl bg-leaf-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-leaf-600" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">

            <div className="rounded-2xl bg-leaf-50 p-4">
              <Users className="w-4 h-4 text-leaf-600 mb-2" />
              <p className="text-xl font-extrabold text-leaf-900">
                42
              </p>
              <p className="text-[11px] text-leaf-600/60">
                Students
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 p-4">
              <Target className="w-4 h-4 text-sky-600 mb-2" />
              <p className="text-xl font-extrabold text-leaf-900">
                18
              </p>
              <p className="text-[11px] text-leaf-600/60">
                Missions
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <TrendingUp className="w-4 h-4 text-amber-600 mb-2" />
              <p className="text-xl font-extrabold text-leaf-900">
                86%
              </p>
              <p className="text-[11px] text-leaf-600/60">
                Engagement
              </p>
            </div>

          </div>

          {/* Student Progress */}
          <div className="border border-leaf-100 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-leaf-900 text-sm">
                Class Progress
              </p>

              <span className="text-xs font-bold text-leaf-600">
                This Month
              </span>
            </div>

            {[
              { name: 'Climate Change', progress: 84 },
              { name: 'Recycling', progress: 72 },
              { name: 'Water Conservation', progress: 91 },
            ].map((item) => (
              <div key={item.name} className="mb-4 last:mb-0">

                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-leaf-700">
                    {item.name}
                  </span>

                  <span className="font-bold text-leaf-600">
                    {item.progress}%
                  </span>
                </div>

                <ProgressBar value={item.progress} />
              </div>
            ))}

          </div>

          {/* Bottom */}
          <div className="mt-4 flex items-center gap-3 bg-leaf-50 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Globe className="w-5 h-5 text-leaf-600" />
            </div>

            <div>
              <p className="text-xs text-leaf-600/60">
                Class Environmental Impact
              </p>
              <p className="font-extrabold text-leaf-900">
                128 eco actions completed
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Right - Content */}
      <div className="order-1 lg:order-2">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-leaf-100 text-leaf-700 text-sm font-bold mb-5 shadow-sm">
          <GraduationCap className="w-4 h-4" />
          For Schools & Colleges
        </div>

        {/* Heading emphasis varied here: underline accent instead of the
            gradient-text span used in the other three sections. */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-leaf-900 leading-tight">
          Bring environmental
          <br />
          <span className="relative inline-block">
            learning to your campus.
            <span className="absolute left-0 -bottom-1 w-full h-[6px] bg-leaf-200/70 -z-10 rounded-full" />
          </span>
        </h2>

        <p className="mt-5 text-lg text-leaf-600/70 leading-relaxed">
          EcoSpark gives educators the tools to turn sustainability
          education into engaging activities while tracking student
          participation and progress.
        </p>

        {/* Benefits — icon treatment swapped from filled circle to an
            outlined square so this section doesn't read as an identical
            reskin of the AI Eco Guide feature list below. */}
        <div className="mt-8 space-y-4">

          {[
            {
              icon: ClipboardCheck,
              title: 'Create & Assign Missions',
              desc: 'Give students meaningful environmental challenges.'
            },
            {
              icon: TrendingUp,
              title: 'Track Student Progress',
              desc: 'Monitor learning, participation and engagement.'
            },
            {
              icon: Award,
              title: 'Verify & Reward',
              desc: 'Review completed actions and reward participation.'
            },
            {
              icon: Globe,
              title: 'Measure Impact',
              desc: 'See the collective environmental contribution of your students.'
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl border-2 border-leaf-200 text-leaf-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-extrabold text-leaf-900">
                    {item.title}
                  </h3>

                  <p className="text-sm text-leaf-600/65 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

      </div>

    </div>
  </div>
</section>

{/* ===== AI ECO GUIDE ===== */}
<section
  id="ai-eco-guide"
  className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-cream-50 overflow-hidden"
>
  <div className="max-w-7xl mx-auto">

    <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

      {/* ===== LEFT: AI VISUAL ===== */}
      <div className="relative order-2 lg:order-1">

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 bg-leaf-200/40 rounded-full blur-3xl" />
        </div>

        {/* Main AI Card */}
        <div className="relative max-w-lg mx-auto">

          <div className="relative rounded-[2rem] bg-white border border-leaf-100 shadow-2xl p-8 md:p-10 overflow-hidden">

            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-leaf-50" />
            <div className="absolute -bottom-20 -left-16 w-44 h-44 rounded-full bg-lagoon-50" />

            <div className="relative flex flex-col items-center text-center">

              {/* AI Icon / Image */}
              <div className="relative mb-7">

                <div className="absolute inset-0 bg-leaf-200/40 rounded-full blur-xl scale-125" />

         <div className="relative w-64 h-64 mx-auto rounded-full bg-leaf-50 border-8 border-white shadow-xl overflow-hidden flex items-center justify-center">
  <img
    src="/ai-eco-guide.png"
    alt="AI Eco Guide"
    className="w-full h-full object-cover"
  />
</div>

                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-leaf-500" />
                </div>

              </div>

              {/* "AI-Powered" sparkles badge removed — "Meet Your Eco Guide"
                  badge on the right column already uses the same icon+pill
                  pattern, so this was a third repeat within one section. */}

              <h3 className="text-2xl md:text-3xl font-extrabold text-leaf-900">
                AI Eco Guide
              </h3>

              <p className="mt-3 text-sm md:text-base text-leaf-600/60 leading-relaxed max-w-sm">
                Your personal guide to understanding the planet,
                discovering better choices, and taking meaningful action.
              </p>

            </div>
          </div>

          {/* Floating badges removed here — this exact "small white pill
              popping outside the card corner" motif already appears twice
              in the hero, so it isn't repeated a third and fourth time. */}

        </div>
      </div>


      {/* ===== RIGHT: CONTENT ===== */}
      <div className="order-1 lg:order-2">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-50 border border-leaf-100 text-leaf-700 text-sm font-bold mb-6">
          <Sparkles className="w-4 h-4" />
          Meet Your Eco Guide
        </div>


        {/* Heading — bold solid color instead of gradient-text, for the
            same variation reason as the Schools section. */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-leaf-900 leading-tight">
          A little guidance
          <br />
          <span className="text-lagoon-600">
            can go a long way.
          </span>
        </h2>


        {/* Description */}
        <p className="mt-6 text-lg text-leaf-600/70 leading-relaxed max-w-xl">
          Meet your AI-powered environmental companion. Eco Guide
          helps students understand complex topics, discover
          sustainable choices and find meaningful ways to make a
          difference.
        </p>


        {/* Features */}
        <div className="mt-9 space-y-5">

          {/* Feature 1 */}
          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-xl bg-leaf-50 text-leaf-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-leaf-900">
                Understand anything
              </h3>

              <p className="mt-1 text-sm text-leaf-600/60 leading-relaxed">
                Get simple, student-friendly explanations for
                environmental concepts.
              </p>
            </div>

          </div>


          {/* Feature 2 */}
          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-xl bg-lagoon-50 text-lagoon-600 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-leaf-900">
                Discover better choices
              </h3>

              <p className="mt-1 text-sm text-leaf-600/60 leading-relaxed">
                Receive practical eco-friendly tips based on your
                interests and learning journey.
              </p>
            </div>

          </div>


          {/* Feature 3 */}
          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-xl bg-sun-50 text-sun-600 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-leaf-900">
                Know what to do next
              </h3>

              <p className="mt-1 text-sm text-leaf-600/60 leading-relaxed">
                Get guidance that connects what you learn with
                real-world environmental action.
              </p>
            </div>

          </div>

        </div>



      </div>

    </div>
  </div>
</section>

            {/* ===== FINAL CTA ===== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
           <div className="bg-leaf-50/60 border border-leaf-100 rounded-4xl px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <img
              src="/earth-mascot.png"
              alt="Happy Earth mascot"
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover flex-shrink-0"
            />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-extrabold text-leaf-900">
                Together, we can build a better planet.
              </h2>
              <p className="mt-1 text-leaf-600/70 flex items-center justify-center md:justify-start gap-1.5">
                Join EcoSpark today and start your green journey!
                <Leaf className="w-4 h-4 text-leaf-500" />
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleStart}
              
              className="flex-shrink-0 !rounded-full"
            >
              Get Started 🍃
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
    <footer className="relative overflow-hidden bg-[#004d3c] text-white">
    {/* Decorative leaves */}
    <div className="absolute -left-10 -top-10 opacity-20">
      <Leaf className="w-32 h-32 rotate-[-25deg]" />
    </div>

    <div className="absolute -right-8 bottom-[-15px] opacity-25">
      <Leaf className="w-40 h-40 rotate-[25deg]" />
    </div>

    <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative">
              <Leaf className="w-9 h-9 text-[#79c842]" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Eco<span className="text-[#8bd34f]">Spark</span>
              </h2>
              <p className="text-[10px] tracking-widest text-white/60">
                Learn · Play · Protect
              </p>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed max-w-xs mb-5">
            A gamified platform inspiring young minds to protect our planet.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
            >
              <Youtube className="w-4 h-4" />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="text-sm font-bold mb-4 text-white">
            Explore
          </h3>

          {/* Missions / Quizzes / Challenges used to point to a
              "#gamification" id that doesn't exist on the page — routed
              to the real sections that actually cover them instead. */}
          <div className="space-y-2.5">
            <a
              href="#how-it-works"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Lessons
            </a>

            <a
              href="#how-it-works"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Missions
            </a>

            <a
              href="#how-it-works"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Quizzes
            </a>

            <a
              href="#why-ecospark"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Challenges
            </a>

            <a
              href="#garden"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Eco Garden
            </a>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-sm font-bold mb-4 text-white">
            Company
          </h3>

          <div className="space-y-2.5">
            <a
              href="#"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              About Us
            </a>

            <a
              href="#"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Blog
            </a>

            <a
              href="#schools"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              For Schools
            </a>

            <a
              href="#"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-sm font-bold mb-4 text-white">
            Support
          </h3>

          <div className="space-y-2.5">
            <a
              href="#"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Help Center
            </a>

            <a
              href="#"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Terms of Use
            </a>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold mb-4 text-white">
            Stay Updated!
          </h3>

          <p className="text-sm text-white/65 leading-relaxed mb-4">
            Subscribe to get eco-tips, updates and exciting challenges.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center bg-white rounded-full p-1"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 px-4 py-2.5 text-xs text-gray-700 outline-none bg-transparent rounded-full"
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="w-9 h-9 shrink-0 rounded-full bg-[#39a94a] hover:bg-[#2d8f3d] flex items-center justify-center transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-white/60">
          © 2026 EcoSpark. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
  
</div>
);
}