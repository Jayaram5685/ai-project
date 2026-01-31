"use client";

import React from "react"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getAuditLogs, type AuditLogEntry } from "@/lib/audit-logger";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  MessageSquare,
  Code,
  FileText,
  BarChart3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const toolIcons: Record<string, React.ElementType> = {
  "text-gen": MessageSquare,
  "code-assist": Code,
  "summarizer": FileText,
  "analytics": BarChart3,
};

export default function HistoryPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      const userLogs = getAuditLogs({ userId: user.id });
      setLogs(userLogs);
      setFilteredLogs(userLogs);
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.toolName.toLowerCase().includes(query) ||
          log.inputPreview.toLowerCase().includes(query)
      );
    }

    if (decisionFilter !== "all") {
      filtered = filtered.filter((log) => log.decision === decisionFilter);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, decisionFilter, logs]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "allowed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Allowed
          </Badge>
        );
      case "masked":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
            <Shield className="h-3 w-3 mr-1" />
            Masked
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSensitivityBadge = (level: string) => {
    const colors: Record<string, string> = {
      public: "bg-green-500/10 text-green-400 border-green-500/30",
      internal: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      confidential: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      restricted: "bg-red-500/10 text-red-400 border-red-500/30",
    };
    return (
      <Badge variant="outline" className={colors[level] || colors.public}>
        {level}
      </Badge>
    );
  };

  // Stats calculation
  const totalRequests = logs.length;
  const allowedRequests = logs.filter((l) => l.decision === "allowed").length;
  const maskedRequests = logs.filter((l) => l.decision === "masked").length;
  const blockedRequests = logs.filter((l) => l.decision === "blocked").length;

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 pl-64">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My AI Usage History</h1>
              <p className="text-sm text-muted-foreground">
                View all your AI interactions and their security decisions
              </p>
            </div>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Last 7 days
            </Badge>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Allowed</p>
                    <p className="text-2xl font-bold text-green-400">{allowedRequests}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Masked</p>
                    <p className="text-2xl font-bold text-yellow-400">{maskedRequests}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked</p>
                    <p className="text-2xl font-bold text-red-400">{blockedRequests}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <XCircle className="h-5 w-5 text-red-400" />
                  </div>
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
                    placeholder="Search by tool or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Decisions</SelectItem>
                    <SelectItem value="allowed">Allowed</SelectItem>
                    <SelectItem value="masked">Masked</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {logs.length} entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity found</p>
                  <p className="text-sm">Start using AI tools to see your history here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Tool</TableHead>
                      <TableHead>Input Preview</TableHead>
                      <TableHead>Sensitivity</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.slice(0, 20).map((log) => {
                      const ToolIcon = toolIcons[log.toolId] || MessageSquare;
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ToolIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{log.toolName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm">
                            {log.inputPreview}
                          </TableCell>
                          <TableCell>{getSensitivityBadge(log.sensitivityLevel)}</TableCell>
                          <TableCell>{getDecisionBadge(log.decision)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  log.riskScore >= 60
                                    ? "bg-red-400"
                                    : log.riskScore >= 30
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                                }`}
                              />
                              <span className="text-sm">{log.riskScore}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedLog(log)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Activity Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed view of this AI interaction
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedLog && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Tool</p>
                                        <p className="font-medium">{selectedLog.toolName}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Timestamp</p>
                                        <p className="font-medium">
                                          {new Date(selectedLog.timestamp).toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Decision</p>
                                        {getDecisionBadge(selectedLog.decision)}
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">
                                          Sensitivity Level
                                        </p>
                                        {getSensitivityBadge(selectedLog.sensitivityLevel)}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Input Content
                                      </p>
                                      <div className="p-3 rounded-lg bg-muted text-sm">
                                        {selectedLog.inputPreview}
                                      </div>
                                    </div>
                                    {selectedLog.detectedPatterns.length > 0 && (
                                      <div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          Detected Patterns
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedLog.detectedPatterns.map((pattern, i) => (
                                            <Badge key={i} variant="outline">
                                              {pattern}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
