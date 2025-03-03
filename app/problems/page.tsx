"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { fetchProblems } from "@/lib/api";
import { Problem, Platform } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("codeforces");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProblems = await Promise.all([
          fetchProblems("codeforces"),
          fetchProblems("leetcode"),
          fetchProblems("codechef")
        ]);
        
        const combinedProblems = allProblems.flat();
        setProblems(combinedProblems);
        setFilteredProblems(combinedProblems.filter(p => p.platform === selectedPlatform));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedPlatform]);

  useEffect(() => {
    // Filter problems based on search query, difficulty, and status
    const filtered = problems.filter(problem => {
      const matchesPlatform = problem.platform === selectedPlatform;
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "solved" && problem.solved) ||
                           (statusFilter === "unsolved" && !problem.solved);
      
      return matchesPlatform && matchesSearch && matchesDifficulty && matchesStatus;
    });
    
    setFilteredProblems(filtered);
  }, [problems, searchQuery, difficultyFilter, statusFilter, selectedPlatform]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Problems</h1>
        
        <Tabs defaultValue="codeforces" className="mb-8" onValueChange={(value) => setSelectedPlatform(value as Platform)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
            <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
            <TabsTrigger value="codechef">CodeChef</TabsTrigger>
          </TabsList>
          
          <TabsContent value="codeforces">
            <Card>
              <CardHeader>
                <CardTitle>Codeforces Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search problems by title or tag..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                        <SelectItem value="unsolved">Unsolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem) => (
                        <div key={problem.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            {problem.solved ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="font-medium truncate">{problem.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                                  {problem.difficulty}
                                </Badge>
                                {problem.rating && (
                                  <Badge variant="outline">
                                    Rating: {problem.rating}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {problem.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={problem.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Open problem</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No problems found matching your filters.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leetcode">
            <Card>
              <CardHeader>
                <CardTitle>LeetCode Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search problems by title or tag..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                        <SelectItem value="unsolved">Unsolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem) => (
                        <div key={problem.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            {problem.solved ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="font-medium truncate">{problem.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                                  {problem.difficulty}
                                </Badge>
                                {problem.rating && (
                                  <Badge variant="outline">
                                    Rating: {problem.rating}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {problem.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={problem.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Open problem</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No problems found matching your filters.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="codechef">
            <Card>
              <CardHeader>
                <CardTitle>CodeChef Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search problems by title or tag..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                        <SelectItem value="unsolved">Unsolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem) => (
                        <div key={problem.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            {problem.solved ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="font-medium truncate">{problem.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                                  {problem.difficulty}
                                </Badge>
                                {problem.rating && (
                                  <Badge variant="outline">
                                    Rating: {problem.rating}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {problem.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={problem.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Open problem</span>
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No problems found matching your filters.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}