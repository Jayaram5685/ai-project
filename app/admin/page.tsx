"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/lib/auth-context";
import { getAuditStats, getAuditLogs } from "@/lib/audit-logger";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Shield,
  AlertTriangle,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboardPage() {
  const { user, allUsers, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ReturnType<typeof getAuditStats> | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
    if (!isLoading && user && user.role !== "admin" && user.role !== "compliance_officer") {
      router.push("/workspace");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user) {
      setStats(getAuditStats());
    }
  }, [user]);

  // Combine audit stats with registered users
  const registeredUsersWithStats = useMemo(() => {
    return allUsers.map(u => ({
      ...u,
      requestCount: u.totalRequests,
      blockedCount: u.blockedRequests,
      maskedCount: u.maskedRequests,
    }));
  }, [allUsers]);

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "compliance_officer")) {
    return null;
  }

  const complianceScore = Math.round(
    ((stats.allowedRequests + stats.maskedRequests) / stats.totalRequests) * 100
  );
  const blockRate = Math.round((stats.blockedRequests / stats.totalRequests) * 100);

  const decisionData = [
    { name: "Allowed", value: stats.allowedRequests, color: "#10b981" },
    { name: "Masked", value: stats.maskedRequests, color: "#f59e0b" },
    { name: "Blocked", value: stats.blockedRequests, color: "#ef4444" },
  ];

  const departmentData = Object.entries(stats.departmentUsage).map(([name, value]) => ({
    name,
    requests: value,
  }));

  const toolData = Object.entries(stats.toolUsage).map(([name, value]) => ({
    name,
    usage: value,
  }));

  const recentLogs = getAuditLogs({ limit: 5 });

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 pl-64">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Governance Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitor AI usage, compliance, and security across your organization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Activity className="h-3 w-3 mr-1" />
                System Healthy
              </Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Last 7 days
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total AI Requests</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalRequests}</p>
                    <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>+12% from last week</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className="text-3xl font-bold text-foreground">{complianceScore}%</p>
                    <Progress value={complianceScore} className="mt-2 h-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked Requests</p>
                    <p className="text-3xl font-bold text-foreground">{stats.blockedRequests}</p>
                    <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{blockRate}% block rate</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Registered Users</p>
                    <p className="text-3xl font-bold text-foreground">{allUsers.length}</p>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                      <Users className="h-4 w-4" />
                      <span>{registeredUsersWithStats.filter(u => u.totalRequests > 0).length} active</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Daily AI Activity</CardTitle>
                <CardDescription>Request decisions over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="allowed" name="Allowed" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="masked" name="Masked" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="blocked" name="Blocked" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Decision Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Request Decisions</CardTitle>
                <CardDescription>Distribution of security decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={decisionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {decisionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Department Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Usage by Department</CardTitle>
                <CardDescription>AI requests per department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#888" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="requests" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tool Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Tool Usage</CardTitle>
                <CardDescription>Popular AI tools by usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={toolData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#888" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="usage" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Users and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Registered Users */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>All employees with AI Shield accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {registeredUsersWithStats
                    .sort((a, b) => b.totalRequests - a.totalRequests)
                    .slice(0, 10)
                    .map((regUser, index) => (
                    <div key={regUser.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {regUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{regUser.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{regUser.role}</Badge>
                            <span className="text-xs text-muted-foreground">{regUser.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{regUser.totalRequests} requests</p>
                        <div className="flex items-center gap-2 text-xs">
                          {regUser.blockedRequests > 0 && (
                            <span className="text-red-400">{regUser.blockedRequests} blocked</span>
                          )}
                          {regUser.maskedRequests > 0 && (
                            <span className="text-yellow-400">{regUser.maskedRequests} masked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {registeredUsersWithStats.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No users registered yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest AI interactions across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <div
                        className={`mt-1 h-2 w-2 rounded-full ${
                          log.decision === "blocked"
                            ? "bg-red-400"
                            : log.decision === "masked"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">{log.userName}</p>
                          <Badge variant="outline" className="text-xs">
                            {log.toolName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{log.inputPreview}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Overview</CardTitle>
              <CardDescription>Current security posture and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-green-400">Low Risk</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.allowedRequests} requests processed without issues. Data protection policies are working effectively.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium text-yellow-400">Data Masked</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.maskedRequests} requests had sensitive data automatically masked before processing.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="font-medium text-red-400">Blocked</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.blockedRequests} requests blocked due to policy violations. Review for potential training needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
