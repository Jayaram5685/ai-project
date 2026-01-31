'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Filter,
  Activity,
  ShieldCheck,
  ShieldX,
  Bot,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { aiUsageEvents, aiTools } from '@/lib/mock-data';
import type { AIUsageEvent, RiskLevel, AITool } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterBlocked, setFilterBlocked] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<AIUsageEvent | null>(null);
  const [activeTab, setActiveTab] = useState('activity');

  const filteredEvents = aiUsageEvents.filter((event) => {
    const matchesSearch =
      event.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tool.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || event.riskLevel === filterRisk;
    const matchesBlocked =
      filterBlocked === 'all' ||
      (filterBlocked === 'blocked' && event.blocked) ||
      (filterBlocked === 'allowed' && !event.blocked);
    return matchesSearch && matchesRisk && matchesBlocked;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    const variants: Record<RiskLevel, string> = {
      low: 'bg-accent/20 text-accent border-accent/30',
      medium: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
      high: 'bg-destructive/20 text-destructive border-destructive/30',
      critical: 'bg-destructive text-destructive-foreground border-destructive',
    };
    return variants[risk];
  };

  const getToolRiskBadge = (tool: AITool) => {
    const variants: Record<RiskLevel, string> = {
      low: 'bg-accent/20 text-accent border-accent/30',
      medium: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
      high: 'bg-destructive/20 text-destructive border-destructive/30',
      critical: 'bg-destructive text-destructive-foreground border-destructive',
    };
    return variants[tool.riskLevel];
  };

  const stats = {
    total: aiUsageEvents.length,
    blocked: aiUsageEvents.filter((e) => e.blocked).length,
    allowed: aiUsageEvents.filter((e) => !e.blocked).length,
    highRisk: aiUsageEvents.filter((e) => e.riskLevel === 'high' || e.riskLevel === 'critical')
      .length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header
          title="AI Monitoring"
          subtitle="Real-time visibility into AI tool usage across your organization"
        />
        <div className="space-y-6 p-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-chart-1/10 p-2">
                    <Activity className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.allowed}</p>
                    <p className="text-xs text-muted-foreground">Allowed</p>
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
                    <p className="text-2xl font-bold text-foreground">{stats.blocked}</p>
                    <p className="text-xs text-muted-foreground">Blocked</p>
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
                    <p className="text-2xl font-bold text-foreground">{stats.highRisk}</p>
                    <p className="text-xs text-muted-foreground">High Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="tools">AI Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-4 space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by user or tool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-36">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBlocked} onValueChange={setFilterBlocked}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="allowed">Allowed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Table */}
              <Card className="border-border bg-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">User</TableHead>
                        <TableHead className="text-muted-foreground">Tool</TableHead>
                        <TableHead className="text-muted-foreground">Action</TableHead>
                        <TableHead className="text-muted-foreground">Data Classification</TableHead>
                        <TableHead className="text-muted-foreground">Risk Level</TableHead>
                        <TableHead className="text-muted-foreground">Timestamp</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id} className="border-border">
                          <TableCell>
                            {event.blocked ? (
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-destructive/20 p-1">
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </div>
                                <span className="text-sm text-destructive">Blocked</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-accent/20 p-1">
                                  <CheckCircle className="h-4 w-4 text-accent" />
                                </div>
                                <span className="text-sm text-accent">Allowed</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                                <span className="text-xs font-medium text-primary">
                                  {event.userName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </span>
                              </div>
                              <span className="font-medium text-foreground">{event.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{event.tool}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{event.action}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'capitalize',
                                event.dataClassification === 'restricted'
                                  ? 'border-destructive/30 text-destructive'
                                  : event.dataClassification === 'confidential'
                                  ? 'border-chart-3/30 text-chart-3'
                                  : 'border-border text-muted-foreground'
                              )}
                            >
                              {event.dataClassification}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn('capitalize', getRiskBadge(event.riskLevel))}
                            >
                              {event.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Activity className="mr-2 h-4 w-4" />
                                  View User Activity
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {aiTools.map((tool) => (
                  <Card
                    key={tool.id}
                    className={cn(
                      'border-border bg-card transition-colors',
                      !tool.approved && 'border-destructive/30'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'rounded-lg p-2',
                              tool.approved ? 'bg-primary/10' : 'bg-destructive/10'
                            )}
                          >
                            <Bot
                              className={cn(
                                'h-5 w-5',
                                tool.approved ? 'text-primary' : 'text-destructive'
                              )}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base font-medium">{tool.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{tool.vendor}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            tool.approved
                              ? 'border-accent/30 bg-accent/20 text-accent'
                              : 'border-destructive/30 bg-destructive/20 text-destructive'
                          )}
                        >
                          {tool.approved ? 'Approved' : 'Unapproved'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="text-foreground">{tool.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge variant="outline" className={cn('capitalize', getToolRiskBadge(tool))}>
                          {tool.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Usage</span>
                        <div className="flex items-center gap-1 text-foreground">
                          <Zap className="h-3 w-3 text-chart-3" />
                          {tool.usageCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Used</span>
                        <span className="text-foreground">
                          {new Date(tool.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pt-2">
                        <Button
                          variant={tool.approved ? 'outline' : 'default'}
                          size="sm"
                          className="w-full"
                        >
                          {tool.approved ? 'Manage Policies' : 'Review & Approve'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Event Detail Dialog */}
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Event Details</DialogTitle>
                <DialogDescription>
                  Detailed information about this AI usage event
                </DialogDescription>
              </DialogHeader>
              {selectedEvent && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">User</p>
                      <p className="font-medium text-foreground">{selectedEvent.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tool</p>
                      <p className="font-medium text-foreground">{selectedEvent.tool}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Action</p>
                      <p className="font-medium text-foreground">{selectedEvent.action}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          selectedEvent.blocked
                            ? 'border-destructive/30 text-destructive'
                            : 'border-accent/30 text-accent'
                        )}
                      >
                        {selectedEvent.blocked ? 'Blocked' : 'Allowed'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data Classification</p>
                      <Badge variant="outline" className="capitalize">
                        {selectedEvent.dataClassification}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <Badge
                        variant="outline"
                        className={cn('capitalize', getRiskBadge(selectedEvent.riskLevel))}
                      >
                        {selectedEvent.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  {selectedEvent.prompt && (
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Prompt Preview</p>
                      <div className="rounded-lg bg-secondary p-3">
                        <p className="text-sm text-foreground font-mono">
                          {selectedEvent.prompt}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedEvent.policyViolations.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Policy Violations</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.policyViolations.map((violation) => (
                          <Badge
                            key={violation}
                            variant="outline"
                            className="border-destructive/30 text-destructive"
                          >
                            {violation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button>View Full Audit Trail</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
