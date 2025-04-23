"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ChartComponentProps {
  stats: {
    tspStats: Array<{ name: string; count: number }>;
    lsaStats: Array<{ name: string; count: number }>;
    statusDistribution: Array<{ name: string; value: number }>;
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ChartComponent({ stats }: ChartComponentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">TSP Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.tspStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">LSA Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.lsaStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 md:col-span-2">
        <h3 className="text-lg font-medium mb-4">Status Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
