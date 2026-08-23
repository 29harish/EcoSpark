import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { gardenItems, gardenRanks } from '@/data/mockData';
import {
  Sprout,
  Lock,
  Star,
  TreePine,
  Flower2,
  Bird,
  Sparkles,
  Cloud,
  Gift,
} from 'lucide-react';

type Tab = 'all' | 'tree' | 'flower' | 'animal' | 'decoration' | 'weather';

export function EcoGarden() {
  const { gardenLevel, gardenRank, level, xpInCurrentLevel, xpForNextLevel } = useApp();
  const [tab, setTab] = useState<Tab>('all');

  const currentRank = gardenRanks.find(r => r.name === gardenRank) || gardenRanks[0];
  const nextRank = gardenRanks.find(r => r.minLevel > level) || gardenRanks[gardenRanks.length - 1];
  const xpProgress = (xpInCurrentLevel / xpForNextLevel) * 100;

  const filteredItems = tab === 'all' ? gardenItems : gardenItems.filter(i => i.category === tab);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tree', label: 'Trees', icon: <TreePine className="w-4 h-4" /> },
    { id: 'flower', label: 'Flowers', icon: <Flower2 className="w-4 h-4" /> },
    { id: 'animal', label: 'Animals', icon: <Bird className="w-4 h-4" /> },
    { id: 'decoration', label: 'Decor', icon: <Gift className="w-4 h-4" /> },
    { id: 'weather', label: 'Weather', icon: <Cloud className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Eco Garden"
        icon={<TreePine className="w-5 h-5" />}
        subtitle="Your virtual world grows as you learn and act. Complete lessons and missions to unlock new items!"
      />

      {/* Garden scene — placeholder image for now. Drop a real image at
          public/garden-placeholder.jpg and it will show up here and on
          the Dashboard's garden preview automatically. */}
      <div className="mb-8 relative overflow-hidden rounded-3xl shadow-soft-lg animate-slide-up">
        <img
          src="/ecogarden.png"
          alt="Your eco garden"
          className="w-full h-[380px] md:h-[440px] object-cover"
        />

        {/* Garden info overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-3xl px-8 py-6 text-center shadow-soft-lg">
          <div className="text-6xl mb-2 inline-block">{currentRank.emoji}</div>
          <div className="text-2xl font-extrabold gradient-text">{gardenRank}</div>
          <div className="text-sm text-leaf-600/70 font-medium mt-1">Garden Level {gardenLevel}</div>
          <div className="mt-3 w-40 mx-auto">
            <div className="flex justify-between text-xs text-leaf-600/60 mb-1">
              <span>Lv {level}</span>
              <span>Lv {nextRank.minLevel}</span>
            </div>
            <ProgressBar value={xpProgress} gradient="from-leaf-400 to-lagoon-400" height="h-2" showGlow />
          </div>
          <div className="mt-2 text-xs text-leaf-600/60">Next: {nextRank.name}</div>
        </div>
      </div>

      {/* Rank progression */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {gardenRanks.map((rank, i) => {
          const isCurrent = rank.name === gardenRank;
          const isUnlocked = level >= rank.minLevel;
          return (
            <Card key={i} className={`p-5 text-center transition-all ${isCurrent ? 'ring-2 ring-leaf-400 shadow-soft-lg' : ''}`}>
              <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-40'}`}>{rank.emoji}</div>
              <div className={`font-extrabold ${isUnlocked ? 'text-leaf-800' : 'text-leaf-400'}`}>{rank.name}</div>
              <div className="text-xs text-leaf-600/60 mt-1">{rank.description}</div>
              <div className="mt-2">
                {isUnlocked ? (
                  <Badge variant="green" size="sm" icon={<Star className="w-3 h-3" />}>Unlocked</Badge>
                ) : (
                  <Badge variant="gray" size="sm" icon={<Lock className="w-3 h-3" />}>Lv {rank.minLevel}+</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Collection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-leaf-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sun-400" /> Your Collection
          </h3>
          <span className="text-sm text-leaf-600/60 font-medium">
            {gardenItems.filter(i => i.unlocked).length} / {gardenItems.length} unlocked
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                tab === t.id
                  ? 'bg-gradient-to-r from-leaf-500 to-lagoon-500 text-white shadow-soft'
                  : 'bg-white text-leaf-700 border border-leaf-100 hover:bg-leaf-50'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 text-center transition-all ${item.unlocked ? 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer' : 'opacity-50'}`}
            >
              <div className={`text-4xl mb-2 ${item.unlocked ? '' : 'grayscale'}`}>
                {item.unlocked ? item.emoji : '🔒'}
              </div>
              <div className={`text-xs font-bold ${item.unlocked ? 'text-leaf-800' : 'text-leaf-400'}`}>
                {item.name}
              </div>
              <div className="text-xs text-leaf-600/50 mt-1 leading-tight">
                {item.unlocked ? item.description : 'Locked'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
