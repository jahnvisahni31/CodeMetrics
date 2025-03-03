"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { fetchUserProfile, fetchContests } from "@/lib/api";
import { UserProfile, Contest, Platform } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ArrowDown, ArrowUp, Calendar, Trophy, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import gsap from "gsap";

export default function Profile() {
  const [profiles, setProfiles] = useState<Record<Platform, UserProfile | null>>({
    codeforces: null,
    leetcode: null,
    codechef: null
  });
  const [contests, setContests] = useState<Record<Platform, Contest[]>>({
    codeforces: [],
    leetcode: [],
    codechef: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("codeforces");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const platforms: Platform[] = ["codeforces", "leetcode", "codechef"];
        
        // Fetch user profiles
        const profilePromises = platforms.map(platform => 
          fetchUserProfile(platform, platform === "codeforces" ? "tourist" : `${platform}_user`)
        );
        const profileResults = await Promise.all(profilePromises);
        
        const profilesMap: Record<Platform, UserProfile> = {
          codeforces: profileResults[0],
          leetcode: profileResults[1],
          codechef: profileResults[2]
        };
        
        // Fetch contests
        const contestPromises = platforms.map(platform => fetchContests(platform));
        const contestResults = await Promise.all(contestPromises);
        
        const contestsMap: Record<Platform, Contest[]> = {
          codeforces: contestResults[0],
          leetcode: contestResults[1],
          codechef: contestResults[2]
        };
        
        setProfiles(profilesMap);
        setContests(contestsMap);
        setLoading(false);
        
        // Animate profile card
        gsap.from(".profile-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
        
        // Animate contests with stagger
        gsap.from(".contest-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3
        });
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
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

  const getRatingChangeColor = (ratingChange: number | undefined) => {
    if (!ratingChange) return 'text-muted-foreground';
    return ratingChange > 0 ? 'text-green-500' : ratingChange < 0 ? 'text-red-500' : 'text-muted-foreground';
  };

  const getRatingChangeIcon = (ratingChange: number | undefined) => {
    if (!ratingChange) return null;
    return ratingChange > 0 ? <ArrowUp className="h-4 w-4" /> : ratingChange < 0 ? <ArrowDown className="h-4 w-4" /> : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <Tabs defaultValue="codeforces" className="mb-8" onValueChange={(value) => setSelectedPlatform(value as Platform)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
            <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
            <TabsTrigger value="codechef">CodeChef</TabsTrigger>
          </TabsList>
          
          {["codeforces", "leetcode", "codechef"].map((platform) => (
            <TabsContent key={platform} value={platform}>
              {loading ? (
                <>
                  <Skeleton className="h-[200px] rounded-lg mb-8" />
                  <Skeleton className="h-[400px] rounded-lg" />
                </>
              ) : (
                <>
                  {/* Profile Card */}
                  <Card className="mb-8 profile-card">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <Avatar className="h-24 w-24 border">
                          <AvatarImage src={profiles[platform as Platform]?.avatarUrl} alt={profiles[platform as Platform]?.username} />
                          <AvatarFallback>
                            <User className="h-12 w-12" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-2xl font-bold flex flex-col md:flex-row md:items-center gap-2">
                            {profiles[platform as Platform]?.username}
                            <Badge className={`${getPlatformColor(platform)} bg-transparent`}>
                              {profiles[platform as Platform]?.rank}
                            </Badge>
                          </h2>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-muted-foreground text-sm">Rating</div>
                              <div className="text-xl font-bold">{profiles[platform as Platform]?.rating || 'N/A'}</div>
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-muted-foreground text-sm">Problems Solved</div>
                              <div className="text-xl font-bold">{profiles[platform as Platform]?.solvedCount || 0}</div>
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-muted-foreground text-sm">Contests</div>
                              <div className="text-xl font-bold">{profiles[platform as Platform]?.contestsParticipated || 0}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {profiles[platform as Platform]?.joinDate ? format(parseISO(profiles[platform as Platform]?.joinDate || ''), 'MMMM yyyy') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Contests Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Contest History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {contests[platform as Platform].length > 0 ? (
                        <div className="space-y-4">
                          {contests[platform as Platform]
                            .filter(contest => contest.participated)
                            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                            .map((contest, index) => (
                              <div key={contest.id} className="contest-item flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                                <div>
                                  <h3 className="font-medium">{contest.title}</h3>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {format(parseISO(contest.startDate), 'MMM dd, yyyy')}
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4">
                                  {contest.rank && (
                                    <div className="bg-muted/50 px-3 py-1 rounded-md text-sm">
                                      <span className="text-muted-foreground">Rank:</span> #{contest.rank}
                                    </div>
                                  )}
                                  
                                  {contest.rating && (
                                    <div className="bg-muted/50 px-3 py-1 rounded-md text-sm">
                                      <span className="text-muted-foreground">Rating:</span> {contest.rating}
                                    </div>
                                  )}
                                  
                                  {contest.ratingChange !== undefined && (
                                    <div className={`bg-muted/50 px-3 py-1 rounded-md text-sm flex items-center gap-1 ${getRatingChangeColor(contest.ratingChange)}`}>
                                      <span className="text-muted-foreground">Change:</span>
                                      {getRatingChangeIcon(contest.ratingChange)}
                                      {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          No contest history available.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}