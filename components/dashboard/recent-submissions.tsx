"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Submission } from "@/lib/types";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { CheckCircle2, XCircle, Clock, AlertTriangle, AlertCircle } from "lucide-react";

interface RecentSubmissionsProps {
  submissions: Submission[];
  limit?: number;
}

export function RecentSubmissions({ submissions, limit = 5 }: RecentSubmissionsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "power3.out"
      });
    });
    
    return () => ctx.revert();
  }, []);

  // Sort submissions by date (newest first) and take the most recent ones
  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, limit);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'Wrong Answer':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Time Limit Exceeded':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Runtime Error':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'Compilation Error':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Wrong Answer':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Time Limit Exceeded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Runtime Error':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Compilation Error':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'codeforces':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'leetcode':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'codechef':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card ref={cardRef} className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>
          Your latest problem submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSubmissions.map((submission) => (
            <div key={submission.id} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                {getStatusIcon(submission.status)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className="font-medium truncate">{submission.problemTitle}</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className={getPlatformColor(submission.platform)}>
                      {submission.platform}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2 mt-1">
                  <span>{submission.language}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{format(parseISO(submission.submissionDate), 'MMM dd, yyyy HH:mm')}</span>
                  {submission.executionTime && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>{submission.executionTime} ms</span>
                    </>
                  )}
                  {submission.memoryUsed && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>{submission.memoryUsed} KB</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {recentSubmissions.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No recent submissions found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}