import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Coins, FileImage, Send, Target, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useApp } from '@/context/AppContext';
import { useFeedback } from '@/components/ui/FeedbackToast';
import { loadMissionSubmissions, submitMissionProof, type MissionSubmission } from '@/lib/profileStore';

export function Missions() {
  const { missions, completedMissions, user, impactScore } = useApp();
  const { showInfo } = useFeedback();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user) {
        if (active) setLoading(false);
        return;
      }

      try {
        const remote = await loadMissionSubmissions();
        if (active) {
          setSubmissions(remote);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Mission submissions are unavailable right now.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    const intervalId = window.setInterval(() => {
      void load();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [user]);

  const pendingIds = useMemo(() => new Set(submissions.filter((item) => item.status === 'pending').map((item) => item.missionId)), [submissions]);
  const verifiedIds = useMemo(() => new Set(submissions.filter((item) => item.status === 'verified').map((item) => item.missionId)), [submissions]);
  const selectedMission = missions.find((mission) => mission.id === selectedId) ?? null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Missions" icon={<Target className="w-5 h-5" />} subtitle="Turn learning into real-world impact. Submit proof and our team will verify your action." />
      <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">

        <Stat value={completedMissions + [...verifiedIds].filter((id) => !missions.some((mission) => mission.id === id && mission.completed)).length} label="Verified" />
        <Stat value={pendingIds.size} label="Pending review" />
        <Stat value={impactScore} label="Impact" />

      </div>
      {error && <Card className="p-4 mb-6 border-coral-200 bg-coral-50"><p className="text-sm text-coral-700">We could not refresh mission verification right now. Please try again shortly.</p></Card>}
      <div className="flex items-center justify-between mb-4"><h2 className="text-2xl font-extrabold text-leaf-800">Choose an action</h2><span className="text-sm text-leaf-600/60">{missions.length} missions</span></div>
      {loading ? <Card className="p-8 text-center text-leaf-600">Loading missions...</Card> : <div className="grid md:grid-cols-2 gap-5">{missions.map((mission) => {
        const submission = submissions.find((item) => item.missionId === mission.id && item.status !== 'rejected');
        const pending = submission?.status === 'pending';
        const verified = mission.completed || verifiedIds.has(mission.id);
        return <Card key={mission.id} className="p-5 relative overflow-hidden">
          <div className="flex items-start gap-4"><div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mission.color} flex items-center justify-center text-3xl shrink-0`}>{mission.emoji}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><Badge variant={mission.difficulty === 'Beginner' ? 'green' : mission.difficulty === 'Intermediate' ? 'gold' : 'coral'} size="sm">{mission.difficulty}</Badge>{mission.completed && <Badge variant="green" size="sm"><CheckCircle2 className="w-3 h-3" /> Verified</Badge>}{pending && <Badge variant="teal" size="sm"><Clock3 className="w-3 h-3" /> Pending</Badge>}</div><h3 className="font-extrabold text-leaf-800 mt-2">{mission.title}</h3><p className="text-sm text-leaf-600/70 mt-1">{mission.description}</p></div></div>
          <div className="flex gap-2 mt-4"><Badge variant="green" size="sm">+{mission.xpReward} XP</Badge><Badge variant="gold" size="sm"><Coins className="w-3 h-3" /> +{mission.coinReward}</Badge>{verified && <Badge variant="green" size="sm"><CheckCircle2 className="w-3 h-3" /> Rewarded</Badge>}</div>
          {mission.progress > 0 && !mission.completed && <div className="mt-4"><div className="flex justify-between text-xs text-leaf-600/60 mb-1"><span>Personal progress</span><span>{mission.progress}%</span></div><ProgressBar value={mission.progress} gradient="from-coral-400 to-sun-400" height="h-2" /></div>}
          <Button fullWidth size="sm" variant={verified || pending ? 'outline' : 'primary'} disabled={verified || pending} className="mt-5" onClick={() => setSelectedId(mission.id)} icon={pending ? <Clock3 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}>{verified ? 'Action verified' : pending ? 'Awaiting verification' : 'Submit proof'}</Button>
        </Card>;
      })}</div>}
      {selectedMission && <ProofDialog mission={selectedMission} onClose={() => setSelectedId(null)} onSubmitted={(submission) => { setSubmissions((current) => [...current.filter((item) => item.missionId !== submission.missionId), submission]); setSelectedId(null); }} showInfo={showInfo} />}
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return <Card className="p-4 sm:p-5 text-center"><div className="text-2xl sm:text-3xl font-extrabold text-leaf-600">{value}</div><div className="text-xs sm:text-sm text-leaf-600/60 font-medium mt-1">{label}</div></Card>;
}

function ProofDialog({ mission, onClose, onSubmitted, showInfo }: { mission: ReturnType<typeof useApp>['missions'][number]; onClose: () => void; onSubmitted: (submission: MissionSubmission) => void; showInfo: (message: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [proofData, setProofData] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const chooseFile = (next: File | undefined) => {
    if (!next) return;
    if (!next.type.startsWith('image/') || next.size > 200 * 1024) { showInfo('Please choose an image proof smaller than 200 KB.'); return; }
    setFile(next);
    const reader = new FileReader();
    reader.onload = () => setProofData(String(reader.result));
    reader.readAsDataURL(next);
  };
  const submit = async () => {
    if (!file || !proofData) { showInfo('Add a photo as proof before submitting.'); return; }
    setSaving(true);
    try {
      const submission = await submitMissionProof({ missionId: mission.id, proofName: file.name, proofData, note: note.trim() });
      onSubmitted(submission);
    } catch (error) {
      showInfo(error instanceof Error ? error.message : 'Unable to submit proof.');
    } finally { setSaving(false); }
  };
  return <div className="fixed inset-0 z-50 bg-leaf-950/30 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true"><Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-start"><div><p className="text-sm font-bold text-leaf-500">Mission instructions</p><h2 className="text-2xl font-extrabold text-leaf-800 mt-1">{mission.title}</h2></div><button onClick={onClose} className="text-leaf-500"><X className="w-5 h-5" /></button></div><p className="text-sm text-leaf-600/75 mt-4">{mission.description}</p><div className="bg-leaf-50 rounded-2xl p-4 mt-4 text-sm text-leaf-700"><p className="font-bold">How to complete it</p><p className="mt-1">Do the action safely, take a clear photo that shows the result, then tell us briefly what you did.</p></div><label className="block mt-5"><span className="text-sm font-bold text-leaf-700">Photo proof</span><input type="file" accept="image/*" className="block w-full mt-2 text-sm" onChange={(event) => chooseFile(event.target.files?.[0])} />{file && <span className="text-xs text-leaf-600/60 flex items-center gap-1 mt-2"><FileImage className="w-3 h-3" /> {file.name}</span>}</label><label className="block mt-4"><span className="text-sm font-bold text-leaf-700">What did you do? <span className="font-normal">(optional)</span></span><textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} rows={3} className="w-full mt-2 rounded-2xl border border-leaf-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-300" placeholder="Share a quick note..." /></label><Button fullWidth className="mt-5" disabled={saving} onClick={() => void submit()} icon={<Send className="w-4 h-4" />}>{saving ? 'Submitting...' : 'Submit for verification'}</Button></Card></div>;
}
