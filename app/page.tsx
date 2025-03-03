"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, BarChart2, Trophy, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      const heroTl = gsap.timeline();
      heroTl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      heroTl.from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");
      heroTl.from(".hero-buttons", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");
      
      // Features animation
      gsap.from(".feature-card", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%"
        }
      });
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-16 pb-24 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Master Competitive Programming with <span className="text-primary">CodeCracker</span>
          </h1>
          <p className="hero-description text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Track your progress across Codeforces, LeetCode, and CodeChef. Visualize your performance, analyze your strengths, and improve your competitive programming skills.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                <BarChart2 className="h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/problems">
                <Code2 className="h-5 w-5" />
                Explore Problems
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] -left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>
      
      {/* Features Section */}
      <div ref={featuresRef} className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need to Excel</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              CodeCracker provides all the tools you need to track and improve your competitive programming journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-card border rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Visualize your progress with interactive charts and graphs. Track your rating, solved problems, and more.
              </p>
              <Link href="/dashboard" className="text-primary font-medium inline-flex items-center hover:underline">
                View Analytics <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="feature-card bg-card border rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Problem Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Keep track of all problems you've solved across multiple platforms. Filter by difficulty, tags, and status.
              </p>
              <Link href="/problems" className="text-primary font-medium inline-flex items-center hover:underline">
                Explore Problems <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="feature-card bg-card border rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Contest History</h3>
              <p className="text-muted-foreground mb-4">
                Review your performance in past contests. Analyze your strengths and weaknesses to improve future results.
              </p>
              <Link href="/profile" className="text-primary font-medium inline-flex items-center hover:underline">
                View Profile <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Improve Your Skills?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start tracking your competitive programming journey today and see your progress over time.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}