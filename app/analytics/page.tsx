'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Legend,
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChartIcon,
  Activity,
  Users,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import {
  requestsOverTime,
  blockedByCategory,
  usageByDepartment,
} from '@/lib/mock-data';

const COLORS = [
  'oklch(0.65 0.18 250)',
  'oklch(0.55 0.22 160)',
  'oklch(0.70 0.18 85)',
  'oklch(0.55 0.22 25)',
  'oklch(0.60 0.15 280)',
  'oklch(0.50 0.15 200)',
];

const weeklyTrend = [
  { name: 'Mon', requests: 42000, blocked: 180, users: 2100 },
  { name: 'Tue', requests: 45000, blocked: 210, users: 2250 },
  { name: 'Wed', requests: 48000, blocked: 250, users: 2400 },
  { name: 'Thu', requests: 51000, blocked: 220, users: 2350 },
  { name: 'Fri', requests: 47000, blocked: 190, users: 2200 },
  { name: 'Sat', requests: 12000, blocked: 45, users: 450 },
  { name: 'Sun', requests: 8000, blocked: 30, users: 320 },
];

const toolUsage = [
  { name: 'ChatGPT', value: 45 },
  { name: 'GitHub Copilot', value: 30 },
  { name: 'Claude', value: 15 },
  { name: 'Other', value: 10 },
];

const riskDistribution = [
  { name: 'Low Risk', value: 78, color: 'oklch(0.55 0.22 160)' },
  { name: 'Medium Risk', value: 15, color: 'oklch(0.70 0.18 85)' },
  { name: 'High Risk', value: 5, color: 'oklch(0.55 0.22 25)' },
  { name: 'Critical', value: 2, color: 'oklch(0.45 0.25 25)' },
];

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header
          title="Analytics"
          subtitle="Comprehensive insights into AI usage and security metrics"
        />
        <div className="space-y-6 p-6">
          {/* Period Selector & Export */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select defaultValue="7d">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-chart-1/10 p-2">
                      <Activity className="h-5 w-5 text-chart-1" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">253K</p>
                      <p className="text-xs text-muted-foreground">Weekly Requests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <Shield className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1,125</p>
                      <p className="text-xs text-muted-foreground">Blocked Requests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingDown className="h-3 w-3" />
                    -8.3%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">2,847</p>
                      <p className="text-xs text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingUp className="h-3 w-3" />
                    +5.2%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-chart-3/10 p-2">
                      <AlertTriangle className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">0.44%</p>
                      <p className="text-xs text-muted-foreground">Block Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <TrendingDown className="h-3 w-3" />
                    -0.12%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Trend Chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Weekly Activity Trend</CardTitle>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-chart-1" />
                    <span className="text-muted-foreground">Requests (K)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">Blocked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Users</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                      axisLine={{ stroke: 'oklch(0.25 0.02 260)' }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
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
                      yAxisId="left"
                      type="monotone"
                      dataKey="requests"
                      stroke="oklch(0.65 0.18 250)"
                      strokeWidth={2}
                      fill="url(#colorRequests)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="blocked"
                      stroke="oklch(0.55 0.22 25)"
                      strokeWidth={2}
                      fill="transparent"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="users"
                      stroke="oklch(0.55 0.22 160)"
                      strokeWidth={2}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tool Usage */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-medium">AI Tool Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={toolUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {toolUsage.map((_, index) => (
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
                        formatter={(value) => [`${value}%`, 'Usage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {toolUsage.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-medium">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.14 0.01 260)',
                          border: '1px solid oklch(0.25 0.02 260)',
                          borderRadius: '8px',
                          color: 'oklch(0.95 0 0)',
                        }}
                        formatter={(value) => [`${value}%`, 'Requests']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Departments */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-medium">Usage by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageByDepartment} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                        axisLine={{ stroke: 'oklch(0.25 0.02 260)' }}
                        tickLine={false}
                        tickFormatter={(value) => `${value / 1000}K`}
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
                        formatter={(value) => [Number(value).toLocaleString(), 'Requests']}
                      />
                      <Bar dataKey="value" fill="oklch(0.65 0.18 250)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blocked Categories */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Blocked Requests by Data Category</CardTitle>
                <Badge variant="outline" className="border-destructive/30 text-destructive">
                  1,125 blocked this week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={blockedByCategory}>
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
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.14 0.01 260)',
                        border: '1px solid oklch(0.25 0.02 260)',
                        borderRadius: '8px',
                        color: 'oklch(0.95 0 0)',
                      }}
                    />
                    <Bar dataKey="value" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
