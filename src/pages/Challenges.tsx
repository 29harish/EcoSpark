import { useState } from 'react';
import { Card, GradientCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { challenges as initialChallenges } from '@/data/mockData';
import { Swords, Users, Clock, Zap, CheckCircle2, PartyPopper } from 'lucide-react';

export function Challenges() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [joinedId, setJoinedId] = useState<string | null>(null);

  const handleJoin = (id: string) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: true } : c));
    setJoinedId(id);
    setTimeout(() => setJoinedId(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Challenges"
        icon={<Swords className="w-5 h-5" />}
        subtitle="Join school-wide and global challenges. Work together with other students for big rewards!"
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden animate-slide-up relative">
            {joinedId === challenge.id && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur rounded-3xl animate-pop-in">
                <div className="text-center">
                  <PartyPopper className="w-12 h-12 text-sun-400 mx-auto mb-2 animate-bounce-soft" />
                  <div className="text-xl font-extrabold gradient-text">Challenge Joined!</div>
                </div>
              </div>
            )}
            <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${challenge.color} flex items-center justify-center text-3xl shadow-soft flex-shrink-0`}>
                  {challenge.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-leaf-800">{challenge.title}</h3>
                  <p className="text-sm text-leaf-600/70 mt-1 leading-relaxed">{challenge.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-leaf-600/70"><Users className="w-4 h-4" /> {challenge.participants}</span>
                <span className="flex items-center gap-1.5 text-leaf-600/70"><Clock className="w-4 h-4" /> {challenge.daysLeft} days left</span>
                <Badge variant="gold" size="sm" icon={<Zap className="w-3 h-3" />}>+{challenge.xpReward} XP</Badge>
              </div>

              {challenge.joined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-leaf-600/60 mb-1">
                    <span>Your progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <ProgressBar value={challenge.progress} gradient="from-leaf-400 to-lagoon-400" />
                </div>
              )}

              <div className="mt-5">
                {challenge.joined ? (
                  <Button size="sm" fullWidth variant="outline" icon={<CheckCircle2 className="w-4 h-4" />}>
                    Joined — In Progress
                  </Button>
                ) : (
                  <Button size="sm" fullWidth onClick={() => handleJoin(challenge.id)} icon={<Swords className="w-4 h-4" />}>
                    Join Challenge
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
