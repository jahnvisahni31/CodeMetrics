import axios from 'axios';
import { Platform, UserProfile, Problem, Submission, Contest, DailyActivity, PlatformStats, TagStats } from './types';

// Mock data for development
const mockUserProfiles: Record<Platform, UserProfile> = {
  codeforces: {
    username: 'tourist',
    platform: 'codeforces',
    joinDate: '2009-02-15',
    rating: 3779,
    rank: 'Legendary Grandmaster',
    solvedCount: 1245,
    contestsParticipated: 78,
    avatarUrl: 'https://userpic.codeforces.org/422/title/1615719503.jpg',
  },
  leetcode: {
    username: 'leetcode_user',
    platform: 'leetcode',
    joinDate: '2018-05-22',
    rating: 2845,
    rank: 'Guardian',
    solvedCount: 987,
    contestsParticipated: 45,
    avatarUrl: 'https://assets.leetcode.com/users/leetcode_user/avatar_1584438416.png',
  },
  codechef: {
    username: 'codechef_star',
    platform: 'codechef',
    joinDate: '2015-11-03',
    rating: 2156,
    rank: '6★',
    solvedCount: 543,
    contestsParticipated: 32,
    avatarUrl: 'https://cdn.codechef.com/sites/default/files/uploads/pictures/codechef_default.png',
  },
};

// Mock problems data
const generateMockProblems = (platform: Platform, count: number): Problem[] => {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
  const tags = [
    'Arrays', 'Strings', 'Hash Table', 'Dynamic Programming', 'Math', 'Greedy',
    'Depth-First Search', 'Binary Search', 'Tree', 'Graph', 'Sorting', 'Backtracking'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${platform}-${i + 1}`,
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Problem ${i + 1}`,
    platform,
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      tags[Math.floor(Math.random() * tags.length)]
    ),
    url: `https://www.${platform}.com/problems/problem-${i + 1}`,
    solved: Math.random() > 0.4,
    solvedDate: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 10000000000).toISOString() : undefined,
    rating: Math.floor(Math.random() * 1000) + 800,
  }));
};

// Mock submissions data
const generateMockSubmissions = (platform: Platform, count: number): Submission[] => {
  const statuses: ('Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error')[] = 
    ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'];
  const languages = ['C++', 'Python', 'Java', 'JavaScript', 'Go'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${platform}-sub-${i + 1}`,
    problemId: `${platform}-${Math.floor(Math.random() * 50) + 1}`,
    problemTitle: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Problem ${Math.floor(Math.random() * 50) + 1}`,
    platform,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    language: languages[Math.floor(Math.random() * languages.length)],
    submissionDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    executionTime: Math.floor(Math.random() * 1000) + 10,
    memoryUsed: Math.floor(Math.random() * 10000) + 1000,
  }));
};

// Mock contests data
const generateMockContests = (platform: Platform, count: number): Contest[] => {
  return Array.from({ length: count }, (_, i) => {
    const startDate = new Date(Date.now() - Math.random() * 10000000000);
    const endDate = new Date(startDate.getTime() + (Math.random() * 5 + 1) * 3600000);
    const participated = Math.random() > 0.3;
    
    return {
      id: `${platform}-contest-${i + 1}`,
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Contest ${i + 1}`,
      platform,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      participated,
      rank: participated ? Math.floor(Math.random() * 10000) + 1 : undefined,
      rating: participated ? Math.floor(Math.random() * 3000) + 1000 : undefined,
      ratingChange: participated ? Math.floor(Math.random() * 200) - 100 : undefined,
    };
  });
};

// Mock daily activity data
const generateMockDailyActivity = (platform: Platform, days: number): DailyActivity[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    return {
      date: date.toISOString().split('T')[0],
      problemsSolved: Math.floor(Math.random() * 5),
      platform,
    };
  });
};

// Mock platform stats
const generateMockPlatformStats = (platform: Platform): PlatformStats => {
  return {
    platform,
    totalSolved: Math.floor(Math.random() * 1000) + 100,
    rating: Math.floor(Math.random() * 3000) + 1000,
    rank: platform === 'codeforces' 
      ? ['Newbie', 'Pupil', 'Specialist', 'Expert', 'Candidate Master', 'Master', 'International Master', 'Grandmaster', 'International Grandmaster', 'Legendary Grandmaster'][Math.floor(Math.random() * 10)]
      : platform === 'leetcode'
        ? ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Guardian'][Math.floor(Math.random() * 7)]
        : ['1★', '2★', '3★', '4★', '5★', '6★', '7★'][Math.floor(Math.random() * 7)],
    easyCount: Math.floor(Math.random() * 300) + 50,
    mediumCount: Math.floor(Math.random() * 200) + 30,
    hardCount: Math.floor(Math.random() * 100) + 10,
    streak: Math.floor(Math.random() * 30) + 1,
  };
};

// Mock tag stats
const generateMockTagStats = (count: number): TagStats[] => {
  const tags = [
    'Arrays', 'Strings', 'Hash Table', 'Dynamic Programming', 'Math', 'Greedy',
    'Depth-First Search', 'Binary Search', 'Tree', 'Graph', 'Sorting', 'Backtracking'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    tag: tags[i % tags.length],
    count: Math.floor(Math.random() * 100) + 10,
    successRate: Math.random() * 100,
  }));
};

// API functions
export const fetchUserProfile = async (platform: Platform, username: string): Promise<UserProfile> => {
  // In a real app, this would make an API call to the respective platform
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfiles[platform]);
    }, 500);
  });
};

export const fetchProblems = async (platform: Platform): Promise<Problem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockProblems(platform, 50));
    }, 700);
  });
};

export const fetchSubmissions = async (platform: Platform): Promise<Submission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockSubmissions(platform, 30));
    }, 600);
  });
};

export const fetchContests = async (platform: Platform): Promise<Contest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockContests(platform, 15));
    }, 800);
  });
};

export const fetchDailyActivity = async (platform: Platform): Promise<DailyActivity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockDailyActivity(platform, 30));
    }, 500);
  });
};

export const fetchPlatformStats = async (platform: Platform): Promise<PlatformStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockPlatformStats(platform));
    }, 400);
  });
};

export const fetchTagStats = async (): Promise<TagStats[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockTagStats(12));
    }, 600);
  });
};

export const fetchAllPlatformStats = async (): Promise<PlatformStats[]> => {
  const platforms: Platform[] = ['codeforces', 'leetcode', 'codechef'];
  const stats = await Promise.all(platforms.map(platform => fetchPlatformStats(platform)));
  return stats;
};

export const fetchAllDailyActivity = async (): Promise<DailyActivity[]> => {
  const platforms: Platform[] = ['codeforces', 'leetcode', 'codechef'];
  const activities = await Promise.all(platforms.map(platform => fetchDailyActivity(platform)));
  return activities.flat();
};