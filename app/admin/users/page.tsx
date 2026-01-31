"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { getAuditLogs } from "@/lib/audit-logger";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Search, Users, Shield, Settings, Eye, Lock, Unlock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock user data
const mockUsers = [
  {
    id: "usr_001",
    name: "Sarah Chen",
    email: "admin@company.com",
    role: "admin" as UserRole,
    department: "IT Security",
    riskScore: 5,
    totalRequests: 45,
    blockedRequests: 0,
    lastActive: new Date("2026-01-30"),
    aiToolsAccess: [
      { toolId: "text-gen", allowed: true, maxLevel: "restricted" },
      { toolId: "code-assist", allowed: true, maxLevel: "restricted" },
      { toolId: "summarizer", allowed: true, maxLevel: "restricted" },
      { toolId: "analytics", allowed: true, maxLevel: "restricted" },
    ],
  },
  {
    id: "usr_002",
    name: "John Smith",
    email: "employee@company.com",
    role: "employee" as UserRole,
    department: "Marketing",
    riskScore: 25,
    totalRequests: 120,
    blockedRequests: 8,
    lastActive: new Date("2026-01-31"),
    aiToolsAccess: [
      { toolId: "text-gen", allowed: true, maxLevel: "internal" },
      { toolId: "code-assist", allowed: false, maxLevel: "public" },
      { toolId: "summarizer", allowed: true, maxLevel: "internal" },
      { toolId: "analytics", allowed: false, maxLevel: "public" },
    ],
  },
  {
    id: "usr_003",
    name: "Emily Davis",
    email: "manager@company.com",
    role: "manager" as UserRole,
    department: "Engineering",
    riskScore: 15,
    totalRequests: 89,
    blockedRequests: 3,
    lastActive: new Date("2026-01-31"),
    aiToolsAccess: [
      { toolId: "text-gen", allowed: true, maxLevel: "confidential" },
      { toolId: "code-assist", allowed: true, maxLevel: "confidential" },
      { toolId: "summarizer", allowed: true, maxLevel: "confidential" },
      { toolId: "analytics", allowed: true, maxLevel: "internal" },
    ],
  },
  {
    id: "usr_004",
    name: "Michael Brown",
    email: "compliance@company.com",
    role: "compliance_officer" as UserRole,
    department: "Legal & Compliance",
    riskScore: 10,
    totalRequests: 67,
    blockedRequests: 1,
    lastActive: new Date("2026-01-30"),
    aiToolsAccess: [
      { toolId: "text-gen", allowed: true, maxLevel: "restricted" },
      { toolId: "code-assist", allowed: false, maxLevel: "public" },
      { toolId: "summarizer", allowed: true, maxLevel: "restricted" },
      { toolId: "analytics", allowed: true, maxLevel: "restricted" },
    ],
  },
  {
    id: "usr_005",
    name: "Alex Johnson",
    email: "alex.j@company.com",
    role: "employee" as UserRole,
    department: "Sales",
    riskScore: 35,
    totalRequests: 156,
    blockedRequests: 12,
    lastActive: new Date("2026-01-31"),
    aiToolsAccess: [
      { toolId: "text-gen", allowed: true, maxLevel: "internal" },
      { toolId: "code-assist", allowed: false, maxLevel: "public" },
      { toolId: "summarizer", allowed: true, maxLevel: "internal" },
      { toolId: "analytics", allowed: false, maxLevel: "public" },
    ],
  },
  {
    id: "usr_006",
    name: "Lisa Wang",
    email: "lisa.w@company.com",
    role: "employee" as UserRole,
    department: "HR",
    riskScore: 20,
    totalRequests: 78,
    blockedRequests: 5,
    lastActive: new Date("2026-01-29"),
    aiToolsAccess: [
      { toolId: "text-gen", allowed: true, maxLevel: "confidential" },
      { toolId: "code-assist", allowed: false, maxLevel: "public" },
      { toolId: "summarizer", allowed: true, maxLevel: "confidential" },
      { toolId: "analytics", allowed: false, maxLevel: "public" },
    ],
  },
];

const toolNames: Record<string, string> = {
  "text-gen": "Text Generation",
  "code-assist": "Code Assistant",
  "summarizer": "Summarizer",
  "analytics": "Analytics",
};

export default function AdminUsersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
    if (!isLoading && user && user.role !== "admin" && user.role !== "compliance_officer") {
      router.push("/workspace");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "compliance_officer")) {
    return null;
  }

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<UserRole, string> = {
      admin: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      manager: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      employee: "bg-gray-500/10 text-gray-400 border-gray-500/30",
      compliance_officer: "bg-green-500/10 text-green-400 border-green-500/30",
    };
    return (
      <Badge variant="outline" className={styles[role]}>
        {role.replace("_", " ")}
      </Badge>
    );
  };

  const getRiskColor = (score: number) => {
    if (score >= 50) return "text-red-400";
    if (score >= 30) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 pl-64">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage employee AI access and permissions
              </p>
            </div>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {mockUsers.length} users
            </Badge>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold text-foreground">
                      {mockUsers.filter((u) => u.role === "admin").length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk Users</p>
                    <p className="text-2xl font-bold text-foreground">
                      {mockUsers.filter((u) => u.riskScore >= 30).length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(
                        mockUsers.reduce((sum, u) => sum + u.riskScore, 0) / mockUsers.length
                      )}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} of {mockUsers.length} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>AI Requests</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(u.role)}</TableCell>
                      <TableCell>{u.department}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{u.totalRequests}</p>
                          {u.blockedRequests > 0 && (
                            <p className="text-xs text-red-400">{u.blockedRequests} blocked</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getRiskColor(u.riskScore)}`}>
                          {u.riskScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {u.lastActive.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(u)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>User Access Settings</DialogTitle>
                              <DialogDescription>
                                Manage AI tool access for {selectedUser?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* User Info */}
                                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {selectedUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {selectedUser.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedUser.email}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                      {getRoleBadge(selectedUser.role)}
                                      <Badge variant="outline">{selectedUser.department}</Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* AI Tool Access */}
                                <div>
                                  <h4 className="font-medium text-foreground mb-4">
                                    AI Tool Access
                                  </h4>
                                  <div className="space-y-4">
                                    {selectedUser.aiToolsAccess.map((access) => (
                                      <div
                                        key={access.toolId}
                                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                                      >
                                        <div className="flex items-center gap-3">
                                          {access.allowed ? (
                                            <Unlock className="h-4 w-4 text-green-400" />
                                          ) : (
                                            <Lock className="h-4 w-4 text-red-400" />
                                          )}
                                          <div>
                                            <p className="font-medium text-foreground">
                                              {toolNames[access.toolId]}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Max level: {access.maxLevel}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <Select defaultValue={access.maxLevel}>
                                            <SelectTrigger className="w-32">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="public">Public</SelectItem>
                                              <SelectItem value="internal">Internal</SelectItem>
                                              <SelectItem value="confidential">
                                                Confidential
                                              </SelectItem>
                                              <SelectItem value="restricted">Restricted</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Switch defaultChecked={access.allowed} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button>Save Changes</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
