import { useState } from 'react';
import { Card, GradientCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { useApp } from '@/context/AppContext';
import { rewards } from '@/data/mockData';
import { Gift, Coins, CheckCircle2, Lock, ShoppingBag, Star } from 'lucide-react';

export function Rewards() {
  const { coins, spendCoins } = useApp();
  const [purchased, setPurchased] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const handlePurchase = (id: string, cost: number, title: string) => {
    if (purchased.includes(id)) return;
    if (spendCoins(cost)) {
      setPurchased(prev => [...prev, id]);
      setToast(`Purchased ${title}! 🎉`);
      setTimeout(() => setToast(null), 2500);
    } else {
      setToast('Not enough Eco Coins!');
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Rewards"
        icon={<Gift className="w-5 h-5" />}
        subtitle="Spend your hard-earned Eco Coins on digital badges, garden themes, and even real-world items!"
      />

      {/* Balance banner */}
      <GradientCard gradient="from-sun-400 to-coral-400" className="p-6 mb-8 animate-slide-up">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">{coins}</div>
              <div className="text-sm text-white/80 font-medium">Your Eco Coins</div>
            </div>
          </div>
          <div className="text-white/80 text-sm font-medium">
            Earn more by completing missions and lessons!
          </div>
        </div>
      </GradientCard>

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-leaf-600 text-white rounded-2xl px-6 py-3 shadow-soft-lg animate-pop-in font-bold">
          {toast}
        </div>
      )}

      {/* Rewards grid */}
      {rewards.length === 0 ? (
        <Card className="p-10 text-center">
          <Gift className="w-12 h-12 text-leaf-200 mx-auto mb-3" />
          <h4 className="font-extrabold text-leaf-800">No rewards available</h4>
          <p className="text-sm text-leaf-600/60 mt-1">New items are added regularly — check back soon!</p>
        </Card>
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {rewards.map((reward) => {
          const isPurchased = purchased.includes(reward.id);
          const canAfford = coins >= reward.cost;

          return (
            <Card key={reward.id} className="overflow-hidden animate-slide-up group">
              <div className={`h-32 bg-gradient-to-br ${reward.color} relative flex items-center justify-center`}>
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{reward.emoji}</div>
                {isPurchased && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="gray" size="sm" className="!bg-white/80 !backdrop-blur !text-leaf-700">
                    {reward.category === 'real' ? 'Real Item' : reward.category === 'badge' ? 'Badge' : 'Digital'}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-leaf-800 mb-1">{reward.title}</h3>
                <p className="text-sm text-leaf-600/70 leading-relaxed mb-4">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-sun-500" />
                    <span className="font-extrabold text-sun-600">{reward.cost}</span>
                  </div>
                  {isPurchased ? (
                    <Badge variant="green" size="md" icon={<CheckCircle2 className="w-3 h-3" />}>Owned</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant={canAfford ? 'primary' : 'outline'}
                      disabled={!canAfford}
                      onClick={() => handlePurchase(reward.id, reward.cost, reward.title)}
                      icon={canAfford ? <ShoppingBag className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    >
                      {canAfford ? 'Redeem' : 'Locked'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
