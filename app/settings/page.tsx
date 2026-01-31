'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Bell,
  Shield,
  Key,
  Webhook,
  Mail,
  Save,
  RefreshCw,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64">
        <Header title="Settings" subtitle="Configure your AI Shield platform" />
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="general" className="gap-2">
                <Building2 className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2">
                <Webhook className="h-4 w-4" />
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>
                    Configure your organization's basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" defaultValue="Acme Corporation" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Input id="domain" defaultValue="acme.com" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input id="adminEmail" type="email" defaultValue="admin@acme.com" />
                  </div>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Data Retention</CardTitle>
                  <CardDescription>
                    Configure how long data is retained in the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Audit Log Retention</Label>
                      <Select defaultValue="90">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Alert History Retention</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure when and how you receive email alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive immediate notifications for critical security events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Policy Violations</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when data protection policies are violated
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a daily digest of AI usage and security events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New AI Tool Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when new AI tools are detected in network traffic
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compliance Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly compliance status reports
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Notification Recipients</CardTitle>
                  <CardDescription>
                    Add email addresses to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Email Recipients</Label>
                    <Textarea
                      placeholder="Enter email addresses, one per line"
                      defaultValue="security@acme.com&#10;compliance@acme.com"
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button className="gap-2">
                    <Mail className="h-4 w-4" />
                    Update Recipients
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Default Policy Settings</CardTitle>
                  <CardDescription>
                    Configure default enforcement behavior for new policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Default Enforcement Level</Label>
                      <Select defaultValue="block">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="audit">Audit Only</SelectItem>
                          <SelectItem value="warn">Warn User</SelectItem>
                          <SelectItem value="block">Block Request</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Default Data Classification</Label>
                      <Select defaultValue="confidential">
                        <SelectTrigger>
                          <SelectValue />
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
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-block Unapproved Tools</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically block access to AI tools not on the approved list
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Justification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require users to provide justification when accessing restricted data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Production API Key</p>
                      <p className="text-sm text-muted-foreground">sk-****************************1234</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RefreshCw className="h-4 w-4" />
                      Rotate
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <div className="rounded-lg bg-chart-3/10 p-2">
                      <Key className="h-5 w-5 text-chart-3" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Development API Key</p>
                      <p className="text-sm text-muted-foreground">sk-dev-************************5678</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RefreshCw className="h-4 w-4" />
                      Rotate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Connected Integrations</CardTitle>
                  <CardDescription>
                    Manage third-party integrations and webhooks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-accent/10 p-2">
                        <Webhook className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Slack</p>
                        <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-accent">Connected</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-chart-1/10 p-2">
                        <Webhook className="h-5 w-5 text-chart-1" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Microsoft Teams</p>
                        <p className="text-sm text-muted-foreground">Integration with MS Teams</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-accent">Connected</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-muted p-2">
                        <Webhook className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">SIEM Integration</p>
                        <p className="text-sm text-muted-foreground">Send logs to your SIEM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Not connected</span>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-muted p-2">
                        <Webhook className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Okta SSO</p>
                        <p className="text-sm text-muted-foreground">Single sign-on with Okta</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Not connected</span>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Webhook Endpoints</CardTitle>
                  <CardDescription>
                    Configure webhook endpoints for real-time event notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-app.com/webhook" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Event Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch id="policyViolation" defaultChecked />
                        <Label htmlFor="policyViolation" className="font-normal">
                          Policy Violations
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="newTool" defaultChecked />
                        <Label htmlFor="newTool" className="font-normal">
                          New Tool Detection
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="highRisk" defaultChecked />
                        <Label htmlFor="highRisk" className="font-normal">
                          High Risk Events
                        </Label>
                      </div>
                    </div>
                  </div>
                  <Button className="gap-2">
                    <Webhook className="h-4 w-4" />
                    Add Webhook
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
