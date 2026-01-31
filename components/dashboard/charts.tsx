'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { TimeSeriesData } from '@/lib/types';

interface RequestsChartProps {
  data: TimeSeriesData[];
}

export function RequestsChart({ data }: RequestsChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">AI Requests</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Allowed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Blocked</span>
            </div>
          </div>
        </div>
        <p className="text-2xl font-bold">284K</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                axisLine={{ stroke: 'oklch(0.25 0.02 260)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.14 0.01 260)',
                  border: '1px solid oklch(0.25 0.02 260)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="oklch(0.65 0.18 250)"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface BlockedByCategoryProps {
  data: TimeSeriesData[];
}

export function BlockedByCategory({ data }: BlockedByCategoryProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Blocked by Category</CardTitle>
        <p className="text-2xl font-bold">1,243</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                axisLine={{ stroke: 'oklch(0.25 0.02 260)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="date"
                tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.14 0.01 260)',
                  border: '1px solid oklch(0.25 0.02 260)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
              />
              <Bar dataKey="value" fill="oklch(0.55 0.22 25)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageByDepartmentProps {
  data: TimeSeriesData[];
}

const COLORS = [
  'oklch(0.65 0.18 250)',
  'oklch(0.55 0.22 160)',
  'oklch(0.70 0.18 85)',
  'oklch(0.55 0.22 25)',
  'oklch(0.60 0.15 280)',
  'oklch(0.50 0.15 200)',
];

export function UsageByDepartment({ data }: UsageByDepartmentProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Usage by Department</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-8">
          <div className="h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.14 0.01 260)',
                    border: '1px solid oklch(0.25 0.02 260)',
                    borderRadius: '8px',
                    color: 'oklch(0.95 0 0)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={item.date} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.date}</span>
                </div>
                <span className="font-medium text-foreground">
                  {(item.value / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RiskTrendProps {
  data: TimeSeriesData[];
}

export function RiskTrend({ data }: RiskTrendProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Risk Score Trend</CardTitle>
          <span className="text-xs text-accent">-34% this month</span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                axisLine={{ stroke: 'oklch(0.25 0.02 260)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 50]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.14 0.01 260)',
                  border: '1px solid oklch(0.25 0.02 260)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="oklch(0.55 0.22 160)"
                strokeWidth={2}
                dot={{ fill: 'oklch(0.55 0.22 160)', strokeWidth: 0, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
