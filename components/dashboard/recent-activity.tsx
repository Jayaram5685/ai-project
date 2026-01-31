'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldX, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import type { AIUsageEvent, Alert } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RecentActivityProps {
  events: AIUsageEvent[];
}

export function RecentActivity({ events }: RecentActivityProps) {
  const getRiskBadge = (risk: string) => {
    const variants: Record<string, string> = {
      low: 'bg-accent/20 text-accent border-accent/30',
      medium: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
      high: 'bg-destructive/20 text-destructive border-destructive/30',
      critical: 'bg-destructive text-destructive-foreground border-destructive',
    };
    return variants[risk] || variants.low;
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Recent AI Activity</CardTitle>
        <Link href="/monitoring">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View all
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                {event.blocked ? (
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <ShieldX className="h-4 w-4 text-destructive" />
                  </div>
                ) : (
                  <div className="rounded-lg bg-accent/10 p-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{event.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.tool} - {event.action}
                  </p>
                  {event.policyViolations.length > 0 && (
                    <p className="mt-1 text-xs text-destructive">
                      Violated: {event.policyViolations.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className={cn('text-xs', getRiskBadge(event.riskLevel))}>
                  {event.riskLevel}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentAlertsProps {
  alerts: Alert[];
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ShieldX className="h-4 w-4 text-destructive" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-chart-3" />;
      default:
        return <Info className="h-4 w-4 text-chart-1" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'bg-destructive/10';
      case 'warning':
        return 'bg-chart-3/10';
      default:
        return 'bg-chart-1/10';
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Active Alerts</CardTitle>
        <Link href="/alerts">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View all
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts
            .filter((a) => !a.resolved)
            .slice(0, 5)
            .map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('rounded-lg p-2', getSeverityBg(alert.severity))}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.type}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
