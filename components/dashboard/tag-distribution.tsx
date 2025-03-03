"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagStats } from "@/lib/types";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface TagDistributionProps {
  tagStats: TagStats[];
}

export function TagDistribution({ tagStats }: TagDistributionProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(chartRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power3.out"
      });
    });
    
    return () => ctx.revert();
  }, []);

  // Sort tags by count in descending order and take top 8
  const topTags = [...tagStats]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-1) / 0.8)',
    'hsl(var(--chart-2) / 0.8)',
    'hsl(var(--chart-3) / 0.8)',
  ];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{data.tag}</p>
          <p>Problems: {data.count}</p>
          <p>Success Rate: {data.successRate.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card ref={chartRef}>
      <CardHeader>
        <CardTitle>Tag Distribution</CardTitle>
        <CardDescription>
          Most common problem categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topTags}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="tag"
              >
                {topTags.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}