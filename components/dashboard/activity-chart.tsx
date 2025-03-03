"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyActivity } from "@/lib/types";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO, subDays } from "date-fns";

interface ActivityChartProps {
  activities: DailyActivity[];
  days?: number;
}

export function ActivityChart({ activities, days = 14 }: ActivityChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(chartRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out"
      });
    });
    
    return () => ctx.revert();
  }, []);

  // Process data for the chart
  const processData = () => {
    const today = new Date();
    const platforms = ['codeforces', 'leetcode', 'codechef'];
    
    // Create an array of the last 'days' days
    const dateArray = Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      return format(date, 'yyyy-MM-dd');
    });
    
    // Create a map of date to activities
    const activityMap = activities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          codeforces: 0,
          leetcode: 0,
          codechef: 0,
          total: 0,
        };
      }
      acc[date][activity.platform] = activity.problemsSolved;
      acc[date].total += activity.problemsSolved;
      return acc;
    }, {} as Record<string, any>);
    
    // Create the final data array with all dates
    return dateArray.map(date => {
      if (activityMap[date]) {
        return {
          date,
          ...activityMap[date],
        };
      }
      return {
        date,
        codeforces: 0,
        leetcode: 0,
        codechef: 0,
        total: 0,
      };
    });
  };

  const data = processData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{format(parseISO(label), 'MMM dd, yyyy')}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: {entry.value} problems
            </p>
          ))}
          <p className="font-semibold mt-1">
            Total: {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)} problems
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card ref={chartRef} className="col-span-2">
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
        <CardDescription>
          Problems solved in the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'dd MMM')}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="codeforces" name="Codeforces" stackId="a" fill="hsl(var(--chart-1))" />
              <Bar dataKey="leetcode" name="LeetCode" stackId="a" fill="hsl(var(--chart-2))" />
              <Bar dataKey="codechef" name="CodeChef" stackId="a" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}