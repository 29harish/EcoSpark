import { Button } from '@/components/ui/Button';
import { Card, GradientCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FloatingLeaves } from '@/components/decorations/FloatingLeaves';
import { categories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import {
  Leaf,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Target,
  Sprout,
  Trophy,
  Flame,
  Coins,
  Zap,
  Heart,
  Globe,
  Recycle,
  Droplets,
  Bird,
  Wind,
  Sun,
  Star,
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
  const { navigate } = useApp();

  const handleStart = () => {
    onEnterApp();
    navigate('dashboard');
  };

  const handleExplore = () => {
    onEnterApp();
    navigate('learn');
  };

  return (
    <div className="min-h-screen bg-cream-50 overflow-x-hidden">
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
    <div className="hidden lg:flex items-center gap-7 xl:gap-9">

      <a
        href="#"
        className="relative text-sm font-semibold text-leaf-600 py-6
        after:absolute after:left-0 after:right-0 after:bottom-3
        after:h-[2px] after:bg-leaf-500"
      >
        Home
      </a>

      <a
        href="#categories"
        className="text-sm font-semibold text-gray-700 hover:text-leaf-500 transition-colors"
      >
        Features
      </a>

      <a
        href="#how-it-works"
        className="text-sm font-semibold text-gray-700 hover:text-leaf-500 transition-colors"
      >
        How it Works
      </a>

      <a
        href="#"
        className="text-sm font-semibold text-gray-700 hover:text-leaf-500 transition-colors"
      >
        For Schools
      </a>

      <a
        href="#"
        className="text-sm font-semibold text-gray-700 hover:text-leaf-500 transition-colors"
      >
        About Us
      </a>

      <a
        href="#"
        className="text-sm font-semibold text-gray-700 hover:text-leaf-500 transition-colors"
      >
        Contact
      </a>

    </div>

    {/* ===== ACTION BUTTONS ===== */}
    <div className="flex items-center gap-3 shrink-0">

      <button
        onClick={() => onEnterApp()}
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
        <FloatingLeaves count={12} />
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-leaf-50/60 via-cream-50 to-lagoon-50/40" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-leaf-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-sun-200/20 rounded-full blur-3xl animate-float" />

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
              <span className="gradient-text">Make an Impact.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-leaf-600/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              EcoSpark makes environmental education fun with interactive lessons,
              real-world eco missions, rewards, and a virtual garden that grows
              with your progress.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={handleStart} icon={<Sparkles className="w-5 h-5" />}>
                Start Your Eco Journey
              </Button>
              <Button size="lg" variant="outline" onClick={handleExplore} icon={<ArrowRight className="w-5 h-5" />}>
                Explore EcoSpark
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-leaf-600/70">
              <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-coral-400" /> 100% Free</div>
              <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-sun-400" /> No downloads</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-lagoon-400" /> For students</div>
            </div>
          </div>

          {/* Right: Product preview */}
          <div className="relative animate-pop-in">
            <div className="relative">
              {/* Main preview card */}
              <div className="bg-white rounded-4xl shadow-soft-lg p-6 border border-leaf-100/50 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Mini dashboard preview */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-leaf-100 flex items-center justify-center text-xl">🐼</div>
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
                  <div className="flex-1 bg-gradient-to-r from-leaf-400 to-lagoon-400 rounded-xl p-2.5 text-center text-white text-sm font-bold">
                    🌱 Garden Lv 3
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-sun-400 to-coral-400 rounded-xl p-2.5 text-center text-white text-sm font-bold">
                    🏆 6 Badges
                  </div>
                </div>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-soft-lg p-3 border border-leaf-100/50 animate-bounce-soft hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sun-100 flex items-center justify-center text-lg">🪙</div>
                  <div>
                    <div className="text-xs font-bold text-leaf-800">+15 Coins!</div>
                    <div className="text-xs text-leaf-600/60">Mission complete</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-soft-lg p-3 border border-leaf-100/50 animate-float hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-leaf-100 flex items-center justify-center text-lg">🌳</div>
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
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="teal" size="md" icon={<Sparkles className="w-4 h-4" />}>How it Works</Badge>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-leaf-800">
              Learn <span className="gradient-text">→</span> Act <span className="gradient-text">→</span> Earn <span className="gradient-text">→</span> Grow <span className="gradient-text">→</span> Compete
            </h2>
            <p className="mt-4 text-lg text-leaf-600/70 max-w-2xl mx-auto">
              Five simple steps that turn learning into real-world impact
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <GraduationCap className="w-7 h-7" />, emoji: '', title: 'Learn', desc: 'Bite-sized interactive lessons on sustainability', color: 'from-leaf-400 to-lagoon-400' },
              { icon: <Target className="w-7 h-7" />, emoji: '', title: 'Act', desc: 'Complete real-world eco missions every day', color: 'from-lagoon-400 to-sky2-400' },
              { icon: <Coins className="w-7 h-7" />, emoji: '', title: 'Earn', desc: 'Gain XP and Eco Coins for every action', color: 'from-sun-400 to-coral-400' },
              { icon: <Sprout className="w-7 h-7" />, emoji: '', title: 'Grow', desc: 'Watch your virtual Eco Garden flourish', color: 'from-leaf-500 to-sun-400' },
              { icon: <Trophy className="w-7 h-7" />, emoji: '', title: 'Compete', desc: 'Climb the leaderboard with friends', color: 'from-coral-400 to-lavender-400' },
            ].map((step, i) => (
              <Card key={i} className="p-6 text-center relative animate-slide-up" hover>
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mx-auto mb-4 shadow-soft`}>
                  {step.icon}
                </div>
                <div className="text-3xl mb-2">{step.emoji}</div>
                <h3 className="text-lg font-extrabold text-leaf-800 mb-1">{step.title}</h3>
                <p className="text-sm text-leaf-600/70 leading-relaxed">{step.desc}</p>
                {i < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-leaf-300 text-2xl">→</div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-50 to-leaf-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="green" size="md" icon={<Globe className="w-4 h-4" />}>Learning Categories</Badge>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-leaf-800">
              Explore <span className="gradient-text">6 sustainability topics</span>
            </h2>
            <p className="mt-4 text-lg text-leaf-600/70 max-w-2xl mx-auto">
              From climate change to renewable energy — learn what matters for our planet
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <GradientCard
                key={cat.id}
                gradient={cat.gradient}
                className="p-6 animate-slide-up relative overflow-hidden group"
                hover
                onClick={() => { onEnterApp(); navigate('learn'); }}
              >
                <div className="absolute -top-4 -right-4 text-8xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  {cat.emoji}
                </div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{cat.emoji}</div>
                  <h3 className="text-xl font-extrabold mb-2">{cat.name}</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">{cat.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs font-bold">
                      {cat.lessonsCount} lessons
                    </span>
                    <span className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> Beginner-friendly
                    </span>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ECO GARDEN PREVIEW ===== */}
      <section id="garden" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <Badge variant="green" size="md" icon={<Sprout className="w-4 h-4" />}>Signature Feature</Badge>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-leaf-800">
                Grow your own <span className="gradient-text">Eco Garden</span>
              </h2>
              <p className="mt-4 text-lg text-leaf-600/70 leading-relaxed">
                Every lesson you complete and every mission you accomplish makes your virtual garden flourish. Watch trees grow, flowers bloom, and animals arrive as you learn.
              </p>

              <div className="mt-8 space-y-4">
                
              </div>

              <div className="mt-8">
                <Button size="lg" onClick={handleStart} icon={<Sprout className="w-5 h-5" />}>
                  Start Growing Your Garden
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

      {/* ===== GAMIFICATION ===== */}
      <section id="gamification" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-leaf-50/30 to-cream-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="gold" size="md" icon={<Trophy className="w-4 h-4" />}>Gamification</Badge>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-leaf-800">
              Learning that feels like <span className="gradient-text-warm">play</span>
            </h2>
            <p className="mt-4 text-lg text-leaf-600/70 max-w-2xl mx-auto">
              XP, streaks, badges, coins, and leaderboards keep students motivated and coming back
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="w-8 h-8" />, emoji: '⚡', title: 'XP & Levels', desc: 'Earn experience points from lessons and missions to level up', color: 'from-sun-400 to-coral-400' },
              { icon: <Flame className="w-8 h-8" />, emoji: '🔥', title: 'Daily Streaks', desc: 'Keep your streak alive by completing actions every day', color: 'from-coral-400 to-sun-500' },
              { icon: <Trophy className="w-8 h-8" />, emoji: '🏆', title: 'Leaderboards', desc: 'Compete with friends, school, and globally', color: 'from-sun-400 to-leaf-400' },
              { icon: <Coins className="w-8 h-8" />, emoji: '🪙', title: 'Eco Coins', desc: 'Spend coins on rewards and garden decorations', color: 'from-sun-400 to-sun-500' },
            ].map((item, i) => (
              <Card key={i} className="p-6 animate-slide-up" hover>
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-soft`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-extrabold text-leaf-800 mb-1">{item.title}</h3>
                <p className="text-sm text-leaf-600/70 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <GradientCard gradient="from-leaf-500 via-lagoon-500 to-leaf-600" className="p-12 md:p-16 text-center relative overflow-hidden">
            <FloatingLeaves count={6} />
            <div className="relative z-10">
              <div className="text-6xl mb-6 animate-bounce-soft">🌍</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Ready to spark change?
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Join thousands of students learning to protect our planet. Your eco journey starts with one lesson.
              </p>
              <Button
                size="lg"
                variant="accent"
                onClick={handleStart}
                icon={<Sparkles className="w-5 h-5" />}
                className="!text-lg !px-10 !py-5"
              >
                Start Your Eco Journey
              </Button>
              <div className="mt-6 flex items-center justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> Free forever</div>
                <div className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> No sign-up required</div>
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 50,000+ students</div>
              </div>
            </div>
          </GradientCard>
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

          <div className="space-y-2.5">
            <a
              href="#how-it-works"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Lessons
            </a>

            <a
              href="#gamification"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Missions
            </a>

            <a
              href="#gamification"
              className="block text-sm text-white/65 hover:text-white transition"
            >
              Quizzes
            </a>

            <a
              href="#gamification"
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
              href="#"
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
