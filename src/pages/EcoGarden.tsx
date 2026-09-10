import { useMemo, useState } from 'react';
import {
  Award,
  ArrowUpCircle,
  ChevronRight,
  Droplets,
  Hammer,
  Heart,
  Info,
  Leaf,
  Lock,
  Package,
  Plus,
  Recycle,
  Sparkles,
  Sun,
  TreePine,
  Trophy,
  Waves,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type Category = 'Biodiversity' | 'Water' | 'Waste' | 'Energy' | 'Soil';
type BuildCategory = Category | 'Decoration';
type GardenObject = {
  id: string;
  name: string;
  emoji: string;
  category: BuildCategory;
  x: number;
  y: number;
  level: number;
  health: number;
  description: string;
  cost: number;
};

const categoryMeta: Record<Category, { icon: React.ReactNode; color: string; bg: string }> = {
  Biodiversity: { icon: <TreePine className="h-4 w-4" />, color: '#2d8b55', bg: '#e3f5e5' },
  Water: { icon: <Droplets className="h-4 w-4" />, color: '#168da2', bg: '#def5f6' },
  Waste: { icon: <Recycle className="h-4 w-4" />, color: '#b2761b', bg: '#fff1d4' },
  Energy: { icon: <Sun className="h-4 w-4" />, color: '#d58118', bg: '#fff0c8' },
  Soil: { icon: <Leaf className="h-4 w-4" />, color: '#8a5734', bg: '#f7eadb' },
};
const decorationMeta = { icon: <Sparkles className="h-4 w-4" />, color: '#9c5e9d', bg: '#f6e6f4' };
const buildCategories: ('All' | BuildCategory)[] = ['All', 'Biodiversity', 'Water', 'Waste', 'Energy', 'Soil', 'Decoration'];
const getCategoryMeta = (category: BuildCategory) => category === 'Decoration' ? decorationMeta : categoryMeta[category];
const categoryLabel = (category: 'All' | BuildCategory) => category === 'Biodiversity' ? 'Nature' : category;

const buildables: Omit<GardenObject, 'id' | 'x' | 'y' | 'level'>[] = [
  { name: 'Native Tree', emoji: '🌳', category: 'Biodiversity', health: 5, description: 'A resilient home for birds and clean air.', cost: 100 },
  { name: 'Pollinator Garden', emoji: '🌻', category: 'Biodiversity', health: 4, description: 'A bright refuge for bees and butterflies.', cost: 65 },
  { name: 'Rainwater Harvesting', emoji: '🛖', category: 'Water', health: 6, description: 'Collects rain and keeps the pond thriving.', cost: 120 },
  { name: 'Recycling Station', emoji: '♻️', category: 'Waste', health: 5, description: 'Turns everyday sorting into a cleaner future.', cost: 100 },
  { name: 'Solar Lights', emoji: '🔆', category: 'Energy', health: 4, description: 'Lights the paths with sunshine, not pollution.', cost: 110 },
  { name: 'Compost Garden', emoji: '🌱', category: 'Soil', health: 5, description: 'Feeds rich soil with nature’s own cycle.', cost: 90 },
  { name: 'Garden Lantern', emoji: '🏮', category: 'Decoration', health: 0, description: 'A warm glow for evening garden walks.', cost: 45 },
];

const starterObjects: GardenObject[] = [
  { id: 'core', name: 'Eco Core', emoji: '🌿', category: 'Biodiversity', x: 49, y: 45, level: 2, health: 12, description: 'The living heart of your ecosystem.', cost: 0 },
  { id: 'house', name: 'Eco Cottage', emoji: '🏡', category: 'Soil', x: 23, y: 63, level: 1, health: 2, description: 'A cozy place to plan your next action.', cost: 0 },
  { id: 'pond', name: 'Living Pond', emoji: '💧', category: 'Water', x: 76, y: 65, level: 1, health: 7, description: 'A healthy home for tiny water life.', cost: 0 },
  { id: 'tree-1', name: 'Native Tree', emoji: '🌳', category: 'Biodiversity', x: 18, y: 24, level: 1, health: 5, description: 'A resilient home for birds and clean air.', cost: 80 },
  { id: 'tree-2', name: 'Native Tree', emoji: '🌳', category: 'Biodiversity', x: 82, y: 25, level: 1, health: 5, description: 'A resilient home for birds and clean air.', cost: 80 },
  { id: 'flowers', name: 'Wildflower Patch', emoji: '🌼', category: 'Biodiversity', x: 36, y: 74, level: 1, health: 3, description: 'Colorful flowers that welcome pollinators.', cost: 45 },
];

const plotPositions = [
  [35, 27], [64, 29], [31, 48], [68, 48], [47, 76], [60, 78], [84, 48],
];

function averageHealth(objects: GardenObject[]) {
  const scores = (Object.keys(categoryMeta) as Category[]).map((category) => {
    const contribution = objects.filter((item) => item.category === category).reduce((sum, item) => sum + item.health * item.level, 0);
    return Math.min(100, 55 + contribution * 2);
  });
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function objectEmoji(item: GardenObject) {
  if (item.level < 2) return item.emoji;
  if (item.name === 'Native Tree') return item.level >= 3 ? '🌲' : '🌳';
  if (item.name === 'Rainwater Harvesting') return item.level >= 3 ? '💧' : '🛖';
  if (item.name === 'Solar Lights') return item.level >= 3 ? '☀️' : '🔆';
  return item.emoji;
}

export function EcoGarden() {
  const { level, xp, coins, addXP, spendCoins } = useApp();
  const [objects, setObjects] = useState(starterObjects);
  const [selected, setSelected] = useState<GardenObject | null>(starterObjects[0]);
  const [buildMode, setBuildMode] = useState(false);
  const [category, setCategory] = useState<'All' | BuildCategory>('All');
  const [placing, setPlacing] = useState<typeof buildables[number] | null>(null);
  const [notice, setNotice] = useState('');

  const health = averageHealth(objects);
  const breakdown = useMemo(() => (Object.keys(categoryMeta) as Category[]).map((name) => ({
    name,
    value: Math.min(100, 55 + objects.filter((item) => item.category === name).reduce((sum, item) => sum + item.health * item.level, 0) * 2),
  })), [objects]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const upgrade = () => {
    if (!selected || selected.id === 'core') return;
    const cost = selected.level * 90;
    if (!spendCoins(cost)) {
      showNotice('You need more Eco Coins for this upgrade.');
      return;
    }
    setObjects((current) => current.map((item) => item.id === selected.id ? { ...item, level: item.level + 1 } : item));
    setSelected((current) => current ? { ...current, level: current.level + 1 } : current);
    addXP(25);
    showNotice(`${selected.name} grew to level ${selected.level + 1}! Eco Health improved.`);
  };

  const placeObject = (position: number) => {
    if (!placing) return;
    const [x, y] = plotPositions[position];
    if (objects.some((item) => item.x === x && item.y === y)) {
      showNotice('That plot is already occupied.');
      return;
    }
    if (!spendCoins(placing.cost)) {
      showNotice('Complete a lesson or mission to earn more Eco Coins.');
      return;
    }
    const newObject = { ...placing, id: `${placing.name}-${Date.now()}`, x, y, level: 1 };
    setObjects((current) => [...current, newObject]);
    setSelected(newObject);
    setPlacing(null);
    setBuildMode(false);
    addXP(40);
    showNotice(`${placing.name} added to your ecosystem!`);
  };

  const unlockedZones = [
    { name: 'Starter Garden', level: 1, health: 0, icon: '🌱', color: 'from-leaf-400 to-lagoon-500' },
    { name: 'Flower Meadow', level: 3, health: 62, icon: '🌼', color: 'from-sun-300 to-coral-400' },
    { name: 'Water Zone', level: 5, health: 68, icon: '💧', color: 'from-lagoon-300 to-blue-500' },
    { name: 'Forest Zone', level: 7, health: 74, icon: '🌲', color: 'from-leaf-500 to-leaf-800' },
    { name: 'Eco Village', level: 10, health: 82, icon: '🏘️', color: 'from-coral-300 to-leaf-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7ed] p-3 pb-10 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-600"><Sparkles className="h-4 w-4 text-sun-500" /> Your living ecosystem</div>
            <h1 className="text-3xl font-black tracking-tight text-leaf-950 sm:text-4xl">Eco Garden</h1>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/80 p-2 shadow-sm ring-1 ring-leaf-100">
            <div className="rounded-xl bg-leaf-50 px-3 py-2 text-center"><div className="text-[10px] font-bold uppercase text-leaf-500">Level</div><div className="font-black text-leaf-800">🌱 {level}</div></div>
            <div className="rounded-xl bg-sun-50 px-3 py-2 text-center"><div className="text-[10px] font-bold uppercase text-sun-600">Eco Coins</div><div className="font-black text-sun-700">🪙 {coins.toLocaleString()}</div></div>
            <div className="rounded-xl bg-lagoon-50 px-3 py-2 text-center"><div className="text-[10px] font-bold uppercase text-lagoon-600">XP</div><div className="font-black text-lagoon-700">{xp.toLocaleString()}</div></div>
          </div>
        </header>

        <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_300px]">
          <section className="relative min-h-[570px] overflow-hidden rounded-[2rem] border-[10px] border-[#d6bd83] bg-[#a7d474] shadow-[0_22px_55px_rgba(49,82,38,0.22)] sm:min-h-[650px]">
            <div className="absolute inset-0 garden-sky" />
            <div className="absolute inset-[9%] rounded-[45%] bg-[#8bc663] shadow-inner">
              <div className="absolute inset-[3%] rounded-[45%] border-2 border-dashed border-white/20" />
              <div className="absolute left-[12%] top-[12%] h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-[17%] right-[9%] h-32 w-32 rounded-full bg-lagoon-300/20 blur-2xl" />
              <div className="garden-path absolute left-[42%] top-0 h-full w-[17%] -rotate-[10deg]" />
              <div className="garden-path absolute left-0 top-[42%] h-[15%] w-full rotate-[4deg]" />
              <div className="absolute left-[5%] top-[5%] animate-drift text-xl opacity-70">☁️</div>
              <div className={`absolute right-[8%] top-[12%] animate-drift text-lg transition-opacity ${health >= 70 ? 'opacity-70' : 'opacity-20'}`} style={{ animationDelay: '2s' }}>🦋</div>
              <div className={`absolute bottom-[12%] left-[8%] animate-drift text-lg transition-opacity ${health >= 75 ? 'opacity-70' : 'opacity-20'}`} style={{ animationDelay: '4s' }}>🐝</div>
              <div className={`absolute left-[54%] top-[18%] animate-drift text-lg transition-opacity ${health >= 82 ? 'opacity-70' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>🐦</div>
              {buildMode && plotPositions.map(([x, y], index) => {
                const occupied = objects.some((item) => item.x === x && item.y === y);
                return <button key={`${x}-${y}`} onClick={() => placing ? placeObject(index) : showNotice('Choose an item from the build menu first.')} className={`build-plot absolute z-10 ${!occupied ? 'available' : 'occupied'} ${placing && !occupied ? 'cursor-pointer ring-4 ring-white/70' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} aria-label={`Build plot ${index + 1}`}>{occupied ? <Lock className="h-3 w-3" /> : <Plus className="h-4 w-4" />}</button>;
              })}
              {objects.map((item) => (
                <button key={item.id} onClick={() => setSelected(item)} className={`garden-object absolute z-20 -translate-x-1/2 -translate-y-1/2 ${selected?.id === item.id ? 'selected' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={`Inspect ${item.name}`}>
                  <span className={`object-glow category-${item.category.toLowerCase()}`} />
                  <span className="relative block text-4xl drop-shadow-md transition-transform sm:text-5xl">{objectEmoji(item)}</span>
                  {item.level > 1 && <span className="absolute -right-2 -top-2 rounded-full bg-white px-1.5 text-[10px] font-black text-leaf-700 shadow">L{item.level}</span>}
                </button>
              ))}
            </div>
            <div className="absolute left-5 top-5 rounded-2xl bg-white/85 px-4 py-3 shadow-lg backdrop-blur"><div className="flex items-center gap-2 text-xs font-bold text-leaf-600"><Heart className="h-4 w-4 fill-coral-400 text-coral-400" /> Eco Health</div><div className="mt-1 text-3xl font-black text-leaf-900">{health}%</div></div>
            {buildMode && <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-leaf-950/90 px-4 py-2 text-sm font-bold text-white shadow-xl">{placing ? `Tap a glowing plot to place ${placing.emoji}` : 'Build Mode: choose a plot or item'} <button onClick={() => { setPlacing(null); setBuildMode(false); }} className="rounded-full p-1 hover:bg-white/20"><X className="h-4 w-4" /></button></div>}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-leaf-100">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-black text-leaf-900">Eco Health</h2><Info className="h-4 w-4 text-leaf-400" /></div>
              <div className="mb-4 flex items-center gap-4"><div className="relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: `conic-gradient(#39a86b ${health * 3.6}deg, #edf4e7 0deg)` }}><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-black text-leaf-800">{health}</div></div><div><div className="font-black text-leaf-800">{health >= 80 ? 'Thriving habitat' : 'Growing habitat'}</div><div className="text-xs text-leaf-500">Keep learning to grow it!</div></div></div>
              <div className="space-y-2">{breakdown.map((item) => <div key={item.name}><div className="mb-1 flex justify-between text-xs font-bold text-leaf-700"><span className="flex items-center gap-1.5">{categoryMeta[item.name].icon}{item.name}</span><span>{item.value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-leaf-50"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, background: categoryMeta[item.name].color }} /></div></div>)}</div>
            </div>
            <div className="rounded-[1.5rem] bg-gradient-to-br from-[#193f33] to-[#176e6b] p-5 text-white shadow-lg"><div className="mb-2 flex items-center gap-2 text-sun-300"><Sparkles className="h-4 w-4" /><span className="text-xs font-black uppercase tracking-wider">Eco Core insight</span></div><p className="text-sm leading-relaxed text-white/85">Your garden is ready for more <strong className="text-white">biodiversity</strong>. Add a native tree to invite more wildlife.</p><button onClick={() => { setBuildMode(true); setCategory('Biodiversity'); }} className="mt-4 flex items-center gap-1 text-xs font-black text-sun-300">View recommendations <ChevronRight className="h-4 w-4" /></button></div>
            <div className="grid grid-cols-2 gap-3"><button onClick={() => { setBuildMode((current) => !current); setPlacing(null); }} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black text-white shadow-lg transition ${buildMode ? 'bg-coral-500 hover:bg-coral-600' : 'bg-leaf-600 hover:bg-leaf-700'}`}><Hammer className="h-4 w-4" /> {buildMode ? 'Exit Build' : 'Build'}</button><button onClick={() => showNotice('Your inventory is growing with every real-world action.')} className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-3 text-sm font-black text-leaf-700 shadow-sm ring-1 ring-leaf-100 transition hover:bg-leaf-50"><Package className="h-4 w-4" /> Inventory</button></div>
          </aside>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-leaf-100"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-black text-leaf-900">Grow your world</h2><p className="text-xs text-leaf-500">Unlock new zones as you learn and act.</p></div><Waves className="h-6 w-6 text-lagoon-500" /></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{unlockedZones.map((zone) => { const unlocked = level >= zone.level || health >= zone.health; return <div key={zone.name} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${zone.color} p-3 text-white ${!unlocked ? 'grayscale' : ''}`}><div className="text-2xl">{zone.icon}</div><div className="mt-2 text-xs font-black">{zone.name}</div><div className="text-[10px] text-white/75">{unlocked ? 'Unlocked' : `Lv ${zone.level} or ${zone.health}% health`}</div>{!unlocked && <Lock className="absolute right-3 top-3 h-3 w-3" />}</div>; })}</div></section>
          <section className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-leaf-100"><div className="mb-4 flex items-center justify-between"><h2 className="font-black text-leaf-900">Recent achievements</h2><Trophy className="h-5 w-5 text-sun-500" /></div><div className="flex items-center gap-3 rounded-2xl bg-sun-50 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun-200 text-xl">🌳</div><div className="flex-1"><div className="text-sm font-black text-leaf-800">Tree Planter</div><div className="text-xs text-leaf-500">Plant 10 trees · 4/10</div></div><Award className="h-5 w-5 text-sun-500" /></div><div className="mt-3 flex items-center gap-3 rounded-2xl bg-lagoon-50 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lagoon-200 text-xl">💧</div><div className="flex-1"><div className="text-sm font-black text-leaf-800">Water Guardian</div><div className="text-xs text-leaf-500">Complete water missions · 2/5</div></div><Droplets className="h-5 w-5 text-lagoon-500" /></div></section>
        </div>
      </div>

      {selected && <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-leaf-100 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"><button onClick={() => setSelected(null)} className="absolute right-4 top-4 text-leaf-400"><X className="h-4 w-4" /></button><div className="flex items-start gap-3"><div className="text-4xl">{objectEmoji(selected)}</div><div><div className="text-xs font-black uppercase tracking-wider" style={{ color: getCategoryMeta(selected.category).color }}>{selected.category}</div><h3 className="text-xl font-black text-leaf-900">{selected.name}</h3><p className="mt-1 text-xs leading-relaxed text-leaf-500">{selected.description}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-leaf-50 p-3 text-center"><div><div className="text-xs text-leaf-500">Level</div><div className="font-black text-leaf-800">{selected.level} / 3</div></div><div><div className="text-xs text-leaf-500">Eco contribution</div><div className="font-black text-leaf-800">+{selected.health * selected.level} {selected.category === 'Decoration' ? 'style' : 'health'}</div></div></div>{selected.id !== 'core' && selected.level < 3 && <button onClick={upgrade} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3 text-sm font-black text-white hover:bg-leaf-700"><ArrowUpCircle className="h-4 w-4" /> Upgrade to level {selected.level + 1} · 🪙 {selected.level * 90}</button>}{selected.level >= 3 && <div className="mt-3 rounded-xl bg-sun-50 py-2 text-center text-xs font-bold text-sun-700">Maximum level reached</div>}</div>}

      {buildMode && <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-leaf-200 bg-[#f9fcf3]/95 p-3 shadow-[0_-12px_35px_rgba(31,73,48,.18)] backdrop-blur-md"><div className="mx-auto max-w-[1100px]"><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-leaf-700"><Hammer className="h-4 w-4" /> Build Mode <span className="font-medium normal-case tracking-normal text-leaf-500">Select an item, then choose a glowing plot</span></div><button onClick={() => { setBuildMode(false); setPlacing(null); }} className="text-xs font-bold text-leaf-500 hover:text-leaf-800">Done</button></div><div className="flex gap-2 overflow-x-auto pb-1">{buildCategories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-black ${category === item ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-700 ring-1 ring-leaf-100'}`}>{categoryLabel(item)}</button>)}</div><div className="mt-2 flex gap-3 overflow-x-auto pb-1">{buildables.filter((item) => category === 'All' || item.category === category).map((item) => { const meta = getCategoryMeta(item.category); return <button key={item.name} onClick={() => { setPlacing(item); setSelected(null); }} className={`flex min-w-[190px] items-center gap-2 rounded-2xl bg-white p-2.5 text-left ring-1 transition ${placing?.name === item.name ? 'ring-2 ring-leaf-500' : 'ring-leaf-100 hover:ring-leaf-300'}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl" style={{ background: meta.bg }}>{item.emoji}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-black text-leaf-900">{item.name}</span><span className="mt-0.5 block text-[10px] font-bold text-sun-600">🪙 {item.cost}</span><span className="block text-[10px] font-bold" style={{ color: meta.color }}>{item.health ? `+${item.health} ${categoryLabel(item.category)}` : 'Decoration'}</span></span></button>; })}</div></div></div>}
      {notice && <div className="fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-full bg-leaf-950 px-5 py-3 text-sm font-bold text-white shadow-xl">{notice}</div>}
    </div>
  );
}
