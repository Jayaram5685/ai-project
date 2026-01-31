'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Users,
  Database,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import type { DashboardMetrics } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Requests',
      value: metrics.totalRequests.toLocaleString(),
      subtitle: 'AI interactions today',
      icon: Activity,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Blocked Requests',
      value: metrics.blockedRequests.toLocaleString(),
      subtitle: 'Violations prevented',
      icon: ShieldAlert,
      trend: '-8.3%',
      trendUp: false,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      subtitle: 'Using AI tools',
      icon: Users,
      trend: '+5.2%',
      trendUp: true,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Compliance Score',
      value: `${metrics.complianceScore}%`,
      subtitle: 'Across all frameworks',
      icon: ShieldCheck,
      trend: '+2.1%',
      trendUp: true,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Risk Score',
      value: metrics.riskScore.toString(),
      subtitle: 'Out of 100 (lower is better)',
      icon: AlertTriangle,
      trend: '-4.7%',
      trendUp: false,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Protected Assets',
      value: metrics.dataAssetsProtected.toLocaleString(),
      subtitle: 'Data sources monitored',
      icon: Database,
      trend: '+18',
      trendUp: true,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={cn('rounded-lg p-2', card.bgColor)}>
                <card.icon className={cn('h-5 w-5', card.color)} />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  card.trendUp ? 'text-accent' : 'text-destructive'
                )}
              >
                {card.trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {card.trend}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
