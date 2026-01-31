"use client";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  AlertTriangle,
  XCircle,
  Shield,
  Eye,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";

export default function AdminAlertsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<AuditLogEntry[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
    if (!isLoading && user && user.role !== "admin" && user.role !== "compliance_officer") {
      router.push("/workspace");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    // Get blocked and masked requests as alerts
    const allLogs = getAuditLogs();
    const alertLogs = allLogs.filter((log) => log.decision === "blocked" || log.riskScore >= 40);
    setAlerts(alertLogs);
    setFilteredAlerts(alertLogs);
  }, []);

  useEffect(() => {
    let filtered = [...alerts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(query) ||
          log.toolName.toLowerCase().includes(query) ||
          log.inputPreview.toLowerCase().includes(query)
      );
    }

    if (severityFilter === "critical") {
      filtered = filtered.filter((log) => log.decision === "blocked" && log.riskScore >= 60);
    } else if (severityFilter === "high") {
      filtered = filtered.filter((log) => log.decision === "blocked");
    } else if (severityFilter === "medium") {
      filtered = filtered.filter((log) => log.riskScore >= 40 && log.decision !== "blocked");
    }

    setFilteredAlerts(filtered);
  }, [searchQuery, severityFilter, alerts]);

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

  const criticalAlerts = alerts.filter((a) => a.decision === "blocked" && a.riskScore >= 60).length;
  const highAlerts = alerts.filter((a) => a.decision === "blocked").length;
  const mediumAlerts = alerts.filter((a) => a.riskScore >= 40 && a.decision !== "blocked").length;

  const getSeverityBadge = (log: AuditLogEntry) => {
    if (log.decision === "blocked" && log.riskScore >= 60) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
          <XCircle className="h-3 w-3 mr-1" />
          Critical
        </Badge>
      );
    }
    if (log.decision === "blocked") {
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          High
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
        <Shield className="h-3 w-3 mr-1" />
        Medium
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 pl-64">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Security Alerts</h1>
              <p className="text-sm text-muted-foreground">
                Monitor and respond to policy violations and security incidents
              </p>
            </div>
            <Badge variant="outline" className="border-red-500/30 text-red-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {criticalAlerts} critical
            </Badge>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Alert Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Alerts</p>
                    <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-red-400">{criticalAlerts}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <XCircle className="h-5 w-5 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High</p>
                    <p className="text-2xl font-bold text-orange-400">{highAlerts}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Medium</p>
                    <p className="text-2xl font-bold text-yellow-400">{mediumAlerts}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Shield className="h-5 w-5 text-yellow-400" />
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
                    placeholder="Search alerts by user, tool, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400 opacity-50" />
                  <p>No alerts found</p>
                  <p className="text-sm">All systems operating within normal parameters</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Tool</TableHead>
                      <TableHead>Detected Patterns</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.slice(0, 20).map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{getSeverityBadge(alert)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{alert.userName}</p>
                            <p className="text-xs text-muted-foreground">{alert.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>{alert.toolName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {alert.detectedPatterns.length > 0 ? (
                              alert.detectedPatterns.slice(0, 2).map((pattern, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {pattern}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">High risk content</span>
                            )}
                            {alert.detectedPatterns.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{alert.detectedPatterns.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${
                              alert.riskScore >= 60
                                ? "text-red-400"
                                : alert.riskScore >= 40
                                ? "text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {alert.riskScore}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedAlert(alert)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Alert Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the security incident
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAlert && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    {getSeverityBadge(selectedAlert)}
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(selectedAlert.timestamp).toLocaleString()}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">User</p>
                                      <p className="font-medium">{selectedAlert.userName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedAlert.department}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Tool</p>
                                      <p className="font-medium">{selectedAlert.toolName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Decision</p>
                                      <Badge
                                        variant="outline"
                                        className={
                                          selectedAlert.decision === "blocked"
                                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                        }
                                      >
                                        {selectedAlert.decision}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Risk Score</p>
                                      <p className="font-medium">{selectedAlert.riskScore}/100</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Input Content
                                    </p>
                                    <div className="p-3 rounded-lg bg-muted text-sm font-mono">
                                      {selectedAlert.inputPreview}
                                    </div>
                                  </div>

                                  {selectedAlert.detectedPatterns.length > 0 && (
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Detected Sensitive Data
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedAlert.detectedPatterns.map((pattern, i) => (
                                          <Badge key={i} variant="destructive">
                                            {pattern}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Mark as Reviewed</Button>
                                    <Button variant="destructive">Escalate</Button>
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
