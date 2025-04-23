"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChartComponent = dynamic(() => import("@/components/ui/chart-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
}) as unknown; // temporary type assertion to fix the props issue

interface Stats {
  totalTasks: number;
  resolvedTasks: number;
  pendingTasks: number;
  monthlyTasks: number;
  tspStats: Array<{ name: string; count: number }>;
  lsaStats: Array<{ name: string; count: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data) {
        throw new Error("No data received");
      }
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchStats();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-6xl container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Stats</h2>
        <a
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
        >
          Go to Dashboard
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Tasks
          </h3>
          <p className="text-2xl font-bold">{stats.totalTasks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Resolved
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.resolvedTasks}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendingTasks}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            This Month
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.monthlyTasks}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <ChartComponent stats={stats} />
    </div>
  );
}
