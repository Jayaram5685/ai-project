'use client';

import React from "react"

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  Database,
  FileText,
  HardDrive,
  Cloud,
  Plus,
  MoreVertical,
  Eye,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dataAssets } from '@/lib/mock-data';
import type { DataClassification } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function DataAssetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredAssets = dataAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClassification =
      filterClassification === 'all' || asset.classification === filterClassification;
    return matchesSearch && matchesClassification;
  });

  const getClassificationBadge = (classification: DataClassification) => {
    const variants: Record<DataClassification, string> = {
      public: 'bg-accent/20 text-accent border-accent/30',
      internal: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
      confidential: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
      restricted: 'bg-destructive/20 text-destructive border-destructive/30',
    };
    return variants[classification];
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
        return <Database className="h-4 w-4 text-chart-1" />;
      case 'documents':
        return <FileText className="h-4 w-4 text-chart-3" />;
      case 'storage':
        return <HardDrive className="h-4 w-4 text-chart-5" />;
      default:
        return <Cloud className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-chart-3';
    return 'text-accent';
  };

  const getRiskProgressColor = (score: number) => {
    if (score >= 70) return 'bg-destructive';
    if (score >= 40) return 'bg-chart-3';
    return 'bg-accent';
  };

  const classificationCounts = {
    public: dataAssets.filter((a) => a.classification === 'public').length,
    internal: dataAssets.filter((a) => a.classification === 'internal').length,
    confidential: dataAssets.filter((a) => a.classification === 'confidential').length,
    restricted: dataAssets.filter((a) => a.classification === 'restricted').length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header
          title="Data Assets"
          subtitle="Classify and monitor sensitive data across your organization"
        />
        <div className="space-y-6 p-6">
          {/* Classification Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {classificationCounts.public}
                      </p>
                      <p className="text-xs text-muted-foreground">Public</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-chart-1/10 p-2">
                      <Shield className="h-5 w-5 text-chart-1" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {classificationCounts.internal}
                      </p>
                      <p className="text-xs text-muted-foreground">Internal</p>
                    </div>
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
                      <p className="text-2xl font-bold text-foreground">
                        {classificationCounts.confidential}
                      </p>
                      <p className="text-xs text-muted-foreground">Confidential</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {classificationCounts.restricted}
                      </p>
                      <p className="text-xs text-muted-foreground">Restricted</p>
                    </div>
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
                  placeholder="Search data assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterClassification} onValueChange={setFilterClassification}>
                <SelectTrigger className="w-44">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Data Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Data Asset</DialogTitle>
                  <DialogDescription>
                    Register a new data asset for classification and monitoring.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Input id="assetName" placeholder="e.g., Customer Database" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Asset Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="documents">Documents</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Classification</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="confidential">Confidential</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="owner">Owner</Label>
                      <Input id="owner" placeholder="Team or individual" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" placeholder="e.g., Engineering" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Asset</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Data Assets Table */}
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Asset Name</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Classification</TableHead>
                    <TableHead className="text-muted-foreground">Owner</TableHead>
                    <TableHead className="text-muted-foreground">Department</TableHead>
                    <TableHead className="text-muted-foreground">Risk Score</TableHead>
                    <TableHead className="text-muted-foreground">Access Count</TableHead>
                    <TableHead className="text-muted-foreground">Last Accessed</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-secondary p-2">
                            {getTypeIcon(asset.type)}
                          </div>
                          <span className="font-medium text-foreground">{asset.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{asset.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('capitalize', getClassificationBadge(asset.classification))}
                        >
                          {asset.classification}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{asset.owner}</TableCell>
                      <TableCell className="text-muted-foreground">{asset.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24">
                            <Progress
                              value={asset.riskScore}
                              className="h-2"
                              style={
                                {
                                  '--progress-foreground': getRiskProgressColor(asset.riskScore),
                                } as React.CSSProperties
                              }
                            />
                          </div>
                          <span className={cn('text-sm font-medium', getRiskColor(asset.riskScore))}>
                            {asset.riskScore}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {asset.accessCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(asset.lastAccessed).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Update Classification
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              View Risk Report
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
        </div>
      </main>
    </div>
  );
}
