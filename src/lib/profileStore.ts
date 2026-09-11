import type { AssessmentResult } from '@/data/assessment';
import type { UserProfile } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

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
};

function toUserProfile(row: ProfileRow): UserProfile {
  return {
    uid: row.firebase_uid,
    email: row.email,
    displayName: row.full_name,
    ecoLevel: row.eco_level,
    ecoScore: Number(row.eco_score) || 0,
    topicScores: row.topic_scores,
    strengths: row.strengths,
    knowledgeGaps: row.knowledge_gaps,
    recommendedTopics: row.knowledge_gaps,
    assessmentCompleted: Boolean(row.assessment_completed),
    assessmentCompletedAt: new Date().toISOString(),
  };
}

export async function loadProfile(uid: string): Promise<UserProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('firebase_uid', uid)
    .maybeSingle();

  if (error) throw error;
  return data ? toUserProfile(data as ProfileRow) : null;
}

export async function saveAssessmentProfile(
  profile: UserProfile,
  result: AssessmentResult,
) {
  if (!supabase) return profile;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      firebase_uid: profile.uid,
      email: profile.email,
      full_name: profile.displayName,
      eco_level: profile.ecoLevel,
      eco_score: profile.ecoScore,
      topic_scores: profile.topicScores,
      strengths: profile.strengths,
      knowledge_gaps: profile.knowledgeGaps,
      assessment_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'firebase_uid' })
    .select('*')
    .single();

  if (error) throw error;
  return toUserProfile(data as ProfileRow);
}
