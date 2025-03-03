"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformStats } from "@/lib/types";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Code2, Award, Hash, Flame } from "lucide-react";

interface StatsCardProps {
  stats: PlatformStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      });
    });
    
    return () => ctx.revert();
  }, []);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'codeforces':
        return 'text-blue-500';
      case 'leetcode':
        return 'text-yellow-500';
      case 'codechef':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  const platformColor = getPlatformColor(stats.platform);
  
  return (
    <Card ref={cardRef} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Code2 className={`h-5 w-5 ${platformColor}`} />
          <span className="capitalize">{stats.platform}</span>
        </CardTitle>
        <CardDescription>
          Performance statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Problems Solved</span>
            <div className="flex items-center gap-1 mt-1">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.totalSolved}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Current Rating</span>
            <div className="flex items-center gap-1 mt-1">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.rating || 'N/A'}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Current Rank</span>
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-lg font-semibold ${platformColor}`}>{stats.rank || 'N/A'}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Current Streak</span>
            <div className="flex items-center gap-1 mt-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-semibold">{stats.streak} days</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">Difficulty Breakdown</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 rounded p-2">
              <div className="text-green-600 dark:text-green-400 font-medium">Easy</div>
              <div className="text-lg font-bold">{stats.easyCount}</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded p-2">
              <div className="text-yellow-600 dark:text-yellow-400 font-medium">Medium</div>
              <div className="text-lg font-bold">{stats.mediumCount}</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 rounded p-2">
              <div className="text-red-600 dark:text-red-400 font-medium">Hard</div>
              <div className="text-lg font-bold">{stats.hardCount}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}