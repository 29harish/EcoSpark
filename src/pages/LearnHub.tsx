import { useEffect, useState } from 'react';
import { Card, GradientCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { Clock, Star, CheckCircle2, Lock, Target, ArrowRight, BookOpen } from 'lucide-react';

export function LearnHub() {
  const { lessons, openLesson, completedLessons } = useApp();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredLessons = activeCategory
    ? lessons.filter(l => l.categoryId === activeCategory)
    : lessons;

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Learn"
        icon={<BookOpen className="w-5 h-5" />}
        subtitle="Explore sustainability through interactive lessons. Complete them to earn XP and grow your garden."
      />

      {/* Progress banner */}
      <GradientCard gradient="from-leaf-500 to-lagoon-500" className="p-6 mb-8 animate-slide-up">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">Your Learning Progress</h3>
            <p className="text-white/80 text-sm mt-1">You've completed {completedLessons} of {lessons.length} lessons</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-extrabold text-white">{Math.round((completedLessons / lessons.length) * 100)}%</div>
              <div className="text-xs text-white/70">Complete</div>
            </div>
            <div className="w-40">
              <ProgressBar value={(completedLessons / lessons.length) * 100} gradient="from-white to-sun-200" height="h-3" />
            </div>
          </div>
        </div>
      </GradientCard>

      {/* Category filters */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeCategory === null
                ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft'
                : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
            }`}
          >
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> All Topics
          </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-soft`
                  : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
              }`}
            >
              <span className="flex items-center gap-2">{cat.emoji} {cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category cards (when no filter) */}
      {!activeCategory && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {categories.map((cat, i) => {
            const catLessons = lessons.filter(l => l.categoryId === cat.id);
            const catCompleted = catLessons.filter(l => l.completed).length;
            return (
              <GradientCard
                key={cat.id}
                gradient={cat.gradient}
                className="p-6 animate-slide-up relative overflow-hidden group"
                hover
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="absolute -top-4 -right-4 text-8xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300">
                  {cat.emoji}
                </div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{cat.emoji}</div>
                  <h3 className="text-xl font-extrabold mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">{cat.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs font-bold">
                      {catCompleted}/{cat.lessonsCount} done
                    </span>
                  </div>
                  <div className="w-full">
                    <ProgressBar value={(catCompleted / cat.lessonsCount) * 100} gradient="from-white to-white" height="h-2" />
                  </div>
                </div>
              </GradientCard>
            );
          })}
        </div>
      )}

      {/* Lessons grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson, i) => (
          <Card
            key={lesson.id}
            className={`overflow-hidden animate-slide-up stagger-${Math.min(i + 1, 8)} group cursor-pointer ${lesson.completed ? 'ring-1 ring-leaf-200' : ''}`}
            hover
            onClick={() => openLesson(lesson.id)}
          >
            {/* Thumbnail */}
            <div className={`h-32 bg-gradient-to-br ${lesson.color} relative flex items-center justify-center`}>
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{lesson.emoji}</div>
              {lesson.completed && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center animate-pop-in">
                  <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <Badge variant="gray" size="sm" className="!bg-white/80 !backdrop-blur !text-leaf-700">
                  <Clock className="w-3 h-3" /> {lesson.duration} min
                </Badge>
              </div>
              {/* Status label */}
              <div className="absolute top-3 left-3">
                {lesson.completed ? (
                  <span className="bg-leaf-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : (
                  <span className="bg-white/90 backdrop-blur text-leaf-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Not Started
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={
                  lesson.difficulty === 'Beginner' ? 'green' :
                  lesson.difficulty === 'Intermediate' ? 'gold' : 'coral'
                } size="sm">
                  {lesson.difficulty}
                </Badge>
                <Badge variant="gold" size="sm">+{lesson.xpReward} XP</Badge>
              </div>
              <h3 className="font-extrabold text-leaf-800 mb-1 group-hover:text-leaf-600 transition-colors">{lesson.title}</h3>
              <p className="text-sm text-leaf-600/70 leading-relaxed line-clamp-2">{lesson.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-leaf-500 flex items-center gap-1 group-hover:text-leaf-600">
                  {lesson.completed ? 'Review lesson' : 'Start lesson'} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="flex items-center gap-1">
                  {lesson.slides.length > 0 && (
                    <span className="text-xs text-leaf-600/50 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {lesson.slides.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
