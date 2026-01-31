'use client';

import React from "react"

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { complianceFrameworks } from '@/lib/mock-data';
import type { ComplianceRequirement } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState(complianceFrameworks[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-accent" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-chart-3" />;
      default:
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'partial':
        return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      default:
        return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent';
    if (score >= 70) return 'text-chart-3';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-accent';
    if (score >= 70) return 'bg-chart-3';
    return 'bg-destructive';
  };

  const totalCompliant = complianceFrameworks.reduce(
    (acc, f) => acc + f.requirements.filter((r) => r.status === 'compliant').length,
    0
  );
  const totalPartial = complianceFrameworks.reduce(
    (acc, f) => acc + f.requirements.filter((r) => r.status === 'partial').length,
    0
  );
  const totalNonCompliant = complianceFrameworks.reduce(
    (acc, f) => acc + f.requirements.filter((r) => r.status === 'non-compliant').length,
    0
  );
  const averageScore =
    complianceFrameworks.reduce((acc, f) => acc + f.overallScore, 0) / complianceFrameworks.length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header
          title="Compliance"
          subtitle="Monitor regulatory compliance across frameworks"
        />
        <div className="space-y-6 p-6">
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {averageScore.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalCompliant}</p>
                    <p className="text-xs text-muted-foreground">Compliant</p>
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
                    <p className="text-2xl font-bold text-foreground">{totalPartial}</p>
                    <p className="text-xs text-muted-foreground">Partial</p>
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
                    <p className="text-2xl font-bold text-foreground">{totalNonCompliant}</p>
                    <p className="text-xs text-muted-foreground">Non-Compliant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Frameworks List */}
            <Card className="border-border bg-card lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Frameworks</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                {complianceFrameworks.map((framework) => (
                  <button
                    key={framework.id}
                    onClick={() => setSelectedFramework(framework)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors',
                      selectedFramework.id === framework.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold',
                          framework.overallScore >= 90
                            ? 'bg-accent/20 text-accent'
                            : framework.overallScore >= 70
                            ? 'bg-chart-3/20 text-chart-3'
                            : 'bg-destructive/20 text-destructive'
                        )}
                      >
                        {framework.overallScore}%
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{framework.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {framework.requirements.length} requirements
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Framework Details */}
            <Card className="border-border bg-card lg:col-span-2">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedFramework.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedFramework.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <FileText className="h-4 w-4" />
                      Report
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Compliance</span>
                      <span className={cn('font-bold', getScoreColor(selectedFramework.overallScore))}>
                        {selectedFramework.overallScore}%
                      </span>
                    </div>
                    <Progress
                      value={selectedFramework.overallScore}
                      className="h-2"
                      style={
                        {
                          '--progress-foreground': getProgressColor(selectedFramework.overallScore),
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {selectedFramework.requirements.map((requirement, index) => (
                    <AccordionItem
                      key={requirement.id}
                      value={requirement.id}
                      className="border-b border-border px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(requirement.status)}
                          <div className="text-left">
                            <p className="font-medium text-foreground">{requirement.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {requirement.description}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="ml-8 space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge
                              variant="outline"
                              className={cn('capitalize', getStatusBadge(requirement.status))}
                            >
                              {requirement.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div>
                            <p className="mb-2 text-sm text-muted-foreground">Evidence:</p>
                            <div className="flex flex-wrap gap-2">
                              {requirement.evidence.map((item, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="border-border text-muted-foreground"
                                >
                                  <FileText className="mr-1 h-3 w-3" />
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last assessed:{' '}
                            {new Date(requirement.lastAssessed).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <ExternalLink className="h-4 w-4" />
                            View Full Details
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
