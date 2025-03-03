"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { TagDistribution } from "@/components/dashboard/tag-distribution";
import { RecentSubmissions } from "@/components/dashboard/recent-submissions";
import { fetchAllPlatformStats, fetchAllDailyActivity, fetchTagStats, fetchSubmissions } from "@/lib/api";
import { PlatformStats, DailyActivity, TagStats, Submission } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [tagStats, setTagStats] = useState<TagStats[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, activities, tags, cfSubmissions, lcSubmissions, ccSubmissions] = await Promise.all([
          fetchAllPlatformStats(),
          fetchAllDailyActivity(),
          fetchTagStats(),
          fetchSubmissions('codeforces'),
          fetchSubmissions('leetcode'),
          fetchSubmissions('codechef')
        ]);
        
        setPlatformStats(stats);
        setActivities(activities);
        setTagStats(tags);
        setSubmissions([...cfSubmissions, ...lcSubmissions, ...ccSubmissions]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-lg" />
            ))
          ) : (
            platformStats.map((stats) => (
              <StatsCard key={stats.platform} stats={stats} />
            ))
          )}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <>
              <Skeleton className="h-[400px] rounded-lg col-span-2" />
              <Skeleton className="h-[400px] rounded-lg" />
            </>
          ) : (
            <>
              <ActivityChart activities={activities} />
              <TagDistribution tagStats={tagStats} />
            </>
          )}
        </div>
        
        {/* Recent Submissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <Skeleton className="h-[500px] rounded-lg col-span-2" />
          ) : (
            <RecentSubmissions submissions={submissions} />
          )}
        </div>
      </main>
    </div>
  );
}