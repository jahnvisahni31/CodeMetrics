"use client"
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsPage() {
  const containerRef = useRef(null);
  const [settings, setSettings] = useState({
    codeforces: "",
    leetcode: "",
    codechef: "",
    darkMode: false,
  });

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card ref={containerRef} className="w-full max-w-lg p-6 shadow-lg rounded-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Codeforces Username</label>
              <Input
                type="text"
                name="codeforces"
                value={settings.codeforces}
                onChange={handleChange}
                placeholder="Enter your Codeforces username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">LeetCode Username</label>
              <Input
                type="text"
                name="leetcode"
                value={settings.leetcode}
                onChange={handleChange}
                placeholder="Enter your LeetCode username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">CodeChef Username</label>
              <Input
                type="text"
                name="codechef"
                value={settings.codechef}
                onChange={handleChange}
                placeholder="Enter your CodeChef username"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <Switch
                name="darkMode"
                checked={settings.darkMode}
                onCheckedChange={() => setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
              />
            </div>
            <Button className="w-full mt-4">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}