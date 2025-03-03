// Platform types
export type Platform = 'codeforces' | 'leetcode' | 'codechef';

// User profile types
export interface UserProfile {
  username: string;
  platform: Platform;
  joinDate?: string;
  rating?: number;
  rank?: string;
  solvedCount?: number;
  contestsParticipated?: number;
  avatarUrl?: string;
}

// Problem types
export interface Problem {
  id: string;
  title: string;
  platform: Platform;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  url: string;
  solved: boolean;
  solvedDate?: string;
  rating?: number;
}

// Submission types
export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  platform: Platform;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  language: string;
  submissionDate: string;
  executionTime?: number;
  memoryUsed?: number;
}

// Contest types
export interface Contest {
  id: string;
  title: string;
  platform: Platform;
  startDate: string;
  endDate: string;
  participated: boolean;
  rank?: number;
  rating?: number;
  ratingChange?: number;
}

// Analytics types
export interface DailyActivity {
  date: string;
  problemsSolved: number;
  platform: Platform;
}

export interface PlatformStats {
  platform: Platform;
  totalSolved: number;
  rating?: number;
  rank?: string;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  streak: number;
}

export interface TagStats {
  tag: string;
  count: number;
  successRate: number;
}