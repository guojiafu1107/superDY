// User Types
export interface User {
  id: string;
  douyinOpenId: string;
  nickname: string;
  avatarUrl: string;
  planType: 'free' | 'pro' | 'team';
  subscriptionExpiresAt?: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  userId: string;
  douyinAccountId: string;
  accountNickname: string;
  followersCount: number;
  isPrimary: boolean;
}

// Trend Types
export interface TrendItem {
  id: string;
  title: string;
  category: string;
  hotValue: number;
  rank: number;
  isRising: boolean;
  tags: string[];
  coverUrl?: string;
  videoCount?: number;
  viewCount?: number;
  createdAt: string;
}

export interface VideoAnalysis {
  id: string;
  videoUrl: string;
  title: string;
  author: string;
  golden3Sec: {
    opening: string;
    copywriting: string;
    music: string;
    emotion: string;
  };
  rhythmCurve: Array<{ second: number; retentionRate: number }>;
  copyFeatures: {
    title: string;
    subtitleStyle: string;
    hashtags: string[];
    keywords: string[];
  };
  interactionTriggers: string[];
}

export interface Inspiration {
  id: string;
  userId: string;
  title: string;
  sourceUrl: string;
  category: string;
  tags: string[];
  notes?: string;
  analysis?: VideoAnalysis;
  thumbnailUrl?: string;
  createdAt: string;
}

// Script Types
export interface StyleProfile {
  userId: string;
  tags: string[];
  features: {
    sentenceLength: 'short' | 'medium' | 'long';
    toneWords: string[];
    jargonFrequency: 'low' | 'medium' | 'high';
    humorLevel: number;
    knowledgeDensity: number;
  };
}

export interface ScriptSegment {
  timeRange: string;
  content: string;
  visualDesc: string;
  duration: number;
}

export interface Script {
  id: string;
  userId: string;
  accountId?: string;
  inspirationId?: string;
  topic: string;
  duration: number;
  tone: string;
  targetAudience?: string;
  content: {
    hook: ScriptSegment;
    core: ScriptSegment[];
    cta: ScriptSegment;
  };
  variants?: ScriptVariant[];
  titles?: TitleSuggestion[];
  hashtags?: string[];
  status: 'draft' | 'complete' | 'archived';
  aiTaskId?: string;
  createdAt: string;
}

export interface ScriptVariant {
  id: string;
  type: 'different_opening' | 'different_angle' | 'different_tone';
  content: Script['content'];
  estimatedCompletionRate: number;
}

export interface TitleSuggestion {
  title: string;
  type: 'suspense' | 'number' | 'pain_point' | 'curiosity' | 'benefit';
  score: number;
}

// Publish Types
export interface PublishTask {
  id: string;
  userId: string;
  accountId: string;
  scriptId?: string;
  videoUrl?: string;
  title: string;
  hashtags: string[];
  scheduledAt: string;
  publishedAt?: string;
  douyinVideoId?: string;
  status: 'pending' | 'published' | 'failed' | 'paused';
  createdAt: string;
}

// Analytics Types
export interface DashboardOverview {
  followersCount: number;
  followersGrowth7d: number;
  totalPlays30d: number;
  avgEngagementRate: number;
}

export interface AudienceProfile {
  ageDistribution: Record<string, number>;
  genderRatio: { male: number; female: number };
  cityTiers: Record<string, number>;
  interestTags: Array<{ tag: string; percentage: number }>;
}

export interface VideoAnalytics {
  videoId: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  completionRateCurve: Array<{ second: number; rate: number }>;
  trafficSources: Record<string, number>;
  audienceProfile: AudienceProfile;
  hotComments: Array<{ word: string; count: number; sentiment: 'positive' | 'neutral' | 'negative' }>;
}

// API Response Types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
