'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Bell,
  BellOff,
  AlertTriangle,
  ShieldX,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { alerts, users } from '@/lib/mock-data';
import type { Alert, AlertSeverity } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !alert.resolved) ||
      (filterStatus === 'resolved' && alert.resolved);
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <ShieldX className="h-5 w-5 text-destructive" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-chart-3" />;
      default:
        return <Info className="h-5 w-5 text-chart-1" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    const variants: Record<AlertSeverity, string> = {
      critical: 'bg-destructive text-destructive-foreground border-destructive',
      error: 'bg-destructive/20 text-destructive border-destructive/30',
      warning: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
      info: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    };
    return variants[severity];
  };

  const getSeverityBg = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-destructive bg-destructive/5';
      case 'error':
        return 'border-l-destructive';
      case 'warning':
        return 'border-l-chart-3';
      default:
        return 'border-l-chart-1';
    }
  };

  const toggleSelectAlert = (id: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map((a) => a.id));
    }
  };

  const getUserById = (userId?: string) => {
    if (!userId) return null;
    return users.find((u) => u.id === userId);
  };

  const alertCounts = {
    critical: alerts.filter((a) => a.severity === 'critical' && !a.resolved).length,
    error: alerts.filter((a) => a.severity === 'error' && !a.resolved).length,
    warning: alerts.filter((a) => a.severity === 'warning' && !a.resolved).length,
    info: alerts.filter((a) => a.severity === 'info' && !a.resolved).length,
    total: alerts.filter((a) => !a.resolved).length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Alerts" subtitle="Monitor and respond to security alerts" />
        <div className="space-y-6 p-6">
          {/* Alert Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-foreground/10 p-2">
                    <Bell className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{alertCounts.total}</p>
                    <p className="text-xs text-muted-foreground">Active Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <ShieldX className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{alertCounts.critical}</p>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{alertCounts.error}</p>
                    <p className="text-xs text-muted-foreground">Errors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-3/10 p-2">
                    <AlertTriangle className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{alertCounts.warning}</p>
                    <p className="text-xs text-muted-foreground">Warnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-1/10 p-2">
                    <Info className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{alertCounts.info}</p>
                    <p className="text-xs text-muted-foreground">Info</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-36">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {selectedAlerts.length > 0 && (
                <>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <CheckCircle className="h-4 w-4" />
                    Resolve ({selectedAlerts.length})
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <BellOff className="h-4 w-4" />
                    Dismiss
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Alerts List */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={
                    selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  {filteredAlerts.length} alert{filteredAlerts.length !== 1 && 's'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredAlerts.map((alert) => {
                  const user = getUserById(alert.userId);
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        'flex items-start gap-4 border-l-4 p-4 transition-colors hover:bg-muted/50',
                        getSeverityBg(alert.severity),
                        alert.resolved && 'opacity-60'
                      )}
                    >
                      <Checkbox
                        checked={selectedAlerts.includes(alert.id)}
                        onCheckedChange={() => toggleSelectAlert(alert.id)}
                      />
                      <div className="rounded-lg bg-secondary p-2">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{alert.type}</span>
                          <Badge
                            variant="outline"
                            className={cn('text-xs capitalize', getSeverityBadge(alert.severity))}
                          >
                            {alert.severity}
                          </Badge>
                          {alert.resolved && (
                            <Badge
                              variant="outline"
                              className="border-accent/30 bg-accent/20 text-xs text-accent"
                            >
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          {user && <span>User: {user.name}</span>}
                          <span>
                            {new Date(alert.timestamp).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {alert.resolved ? 'Reopen' : 'Resolve'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Info className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BellOff className="mr-2 h-4 w-4" />
                            Dismiss
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
