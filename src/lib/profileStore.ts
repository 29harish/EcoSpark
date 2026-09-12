import type { AssessmentResult } from '@/data/assessment';
import type { UserProfile } from '@/context/AppContext';
import { apiRequest } from '@/lib/api';

export interface MissionSubmission {
  id: string;
  missionId: string;
  proofName: string;
  proofData?: string;
  note: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
}

export interface ProgressSnapshot {
  lessons: Array<{ id: string; completed: boolean }>;
  missions: Array<{
    id: string;
    progress: number;
    completed: boolean;
  }>;
  streak: number;
  lastActivityDate: string | null;
  impactScore: number;
}

export type LeaderboardSort =
  | 'xp'
  | 'impact'
  | 'coins'
  | 'lessons'
  | 'missions';

export interface LeaderboardEntry {
  uid: string;
  name: string;
  avatarUrl: string | null;
  xp: number;
  impactScore: number;
  ecoCoins: number;
  lessonsCompleted: number;
  missionsCompleted: number;
  rank: number;
  isCurrentUser: boolean;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  coinsSpent: number;
  status: 'completed' | 'cancelled';
  redeemedAt: string;
}

export async function loadLeaderboard(
  sort: LeaderboardSort = 'xp',
): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams({
    period: 'all-time',
    sort,
  });

  const response = await apiRequest(
    `/api/leaderboard?${params.toString()}`,
  );

  return (response.entries ?? []) as LeaderboardEntry[];
}

type ProfileRow = {
  firebase_uid: string;
  email: string | null;
  full_name: string | null;
  eco_level: string;
  eco_score: number;
  topic_scores: AssessmentResult['topicScores'];
  strengths: AssessmentResult['strengths'];
  knowledge_gaps: AssessmentResult['weakTopics'];
  assessment_completed: boolean;
  updated_at?: string;
  xp?: number;
  eco_coins?: number;
  impact_score?: number;
  lessons_completed?: number;
  missions_completed?: number;
  learning_progress?: number;
};

function toUserProfile(row: ProfileRow): UserProfile {
  const knowledgeGaps = row.knowledge_gaps ?? [];

  return {
    uid: row.firebase_uid,
    email: row.email,
    displayName: row.full_name,
    ecoLevel: row.eco_level,
    ecoScore: Number(row.eco_score) || 0,
    topicScores: row.topic_scores,
    strengths: row.strengths ?? [],
    knowledgeGaps,
    recommendedTopics: knowledgeGaps,
    assessmentCompleted: Boolean(row.assessment_completed),
    assessmentCompletedAt:
      row.updated_at ?? new Date().toISOString(),
    xp: Number(row.xp) || 0,
    ecoCoins: Number(row.eco_coins) || 0,
    impactScore: Number(row.impact_score) || 0,
    lessonsCompleted:
      Number(row.lessons_completed) || 0,
    missionsCompleted:
      Number(row.missions_completed) || 0,
    learningProgress:
      Number(row.learning_progress) || 0,
  };
}

export async function loadProfile(
  uid: string,
): Promise<UserProfile | null> {
  void uid;

  const response = await apiRequest('/api/profile');

  return response.profile
    ? toUserProfile(response.profile as ProfileRow)
    : null;
}

export async function saveAssessmentProfile(
  profile: UserProfile,
  result: AssessmentResult,
) {
  const response = await apiRequest('/api/profile', {
    method: 'PUT',
    body: JSON.stringify({
      full_name: profile.displayName,
      eco_level: profile.ecoLevel,
      eco_score: profile.ecoScore,
      topic_scores: profile.topicScores,
      strengths: profile.strengths,
      knowledge_gaps: result.recommendedTopics,
      assessment_completed: true,
    }),
  });

  return toUserProfile(response.profile as ProfileRow);
}

export async function saveReward(
  activity: 'lesson' | 'quiz' | 'mission',
  xp: number,
  coins: number,
) {
  const response = await apiRequest(
    '/api/profile/reward',
    {
      method: 'POST',
      body: JSON.stringify({
        activity,
        xp,
        coins,
      }),
    },
  );

  return response.profile;
}

export async function loadRewardRedemptions(): Promise<
  RewardRedemption[]
> {
  const response = await apiRequest(
    '/api/rewards/redemptions',
  );

  return (response.redemptions ?? []) as RewardRedemption[];
}

export async function redeemReward(
  rewardId: string,
) {
  const response = await apiRequest(
    '/api/rewards/redeem',
    {
      method: 'POST',
      body: JSON.stringify({
        rewardId,
      }),
    },
  );

  return response;
}

export async function loadMissionSubmissions(): Promise<
  MissionSubmission[]
> {
  const response = await apiRequest(
    '/api/missions/submissions',
  );

  return (response.submissions ??
    []) as MissionSubmission[];
}

export async function submitMissionProof(input: {
  missionId: string;
  proofName: string;
  proofData: string;
  note: string;
}): Promise<MissionSubmission> {
  const response = await apiRequest(
    '/api/missions/submissions',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );

  return response.submission as MissionSubmission;
}

export async function loadProgress(): Promise<ProgressSnapshot> {
  const response = await apiRequest('/api/progress');

  return response.progress as ProgressSnapshot;
}

export async function saveProgress(progress: {
  lessons: Array<{
    id: string;
    completed: boolean;
  }>;
  missions: Array<{
    id: string;
    progress: number;
    completed: boolean;
  }>;
}): Promise<ProgressSnapshot> {
  const response = await apiRequest(
    '/api/progress',
    {
      method: 'PUT',
      body: JSON.stringify(progress),
    },
  );

  return response.progress as ProgressSnapshot;
}

export async function spendCoins(amount: number) {
  const response = await apiRequest(
    '/api/profile/spend-coins',
    {
      method: 'POST',
      body: JSON.stringify({ amount }),
    },
  );

  return response.profile;
}