"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { AIChat } from "@/components/workspace/ai-chat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Code, FileText, BarChart3, Shield, Lock, ArrowRight } from "lucide-react";

const aiTools = [
  {
    id: "text-gen",
    name: "Text Generation",
    description: "Generate emails, documents, marketing copy, and creative content",
    icon: MessageSquare,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    features: ["Email drafting", "Content creation", "Copywriting", "Translations"],
  },
  {
    id: "code-assist",
    name: "Code Assistant",
    description: "Write, debug, and explain code in multiple programming languages",
    icon: Code,
    color: "bg-green-500/10 text-green-400 border-green-500/30",
    features: ["Code generation", "Debugging help", "Code review", "Documentation"],
  },
  {
    id: "summarizer",
    name: "Document Summarizer",
    description: "Quickly summarize long documents, reports, and articles",
    icon: FileText,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    features: ["Report summaries", "Meeting notes", "Article digests", "Key points extraction"],
  },
  {
    id: "analytics",
    name: "Data Analytics",
    description: "Analyze data, identify trends, and generate insights",
    icon: BarChart3,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    features: ["Trend analysis", "Data insights", "Metric tracking", "Forecasting"],
  },
];

function WorkspaceContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool) {
      setSelectedTool(tool);
    }
  }, [searchParams]);

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

  const toolAccess = (toolId: string) => user.aiToolsAccess.find(a => a.toolId === toolId);
  const selectedToolData = aiTools.find(t => t.id === selectedTool);
  const isToolAllowed = selectedTool ? toolAccess(selectedTool)?.allowed : false;

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 pl-64">
        {selectedTool && selectedToolData ? (
          // AI Tool Interface
          <div className="h-screen flex flex-col">
            {/* Tool Header */}
            <header className="border-b border-border bg-card/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${selectedToolData.color}`}>
                    <selectedToolData.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">{selectedToolData.name}</h1>
                    <p className="text-sm text-muted-foreground">{selectedToolData.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Max Level: {toolAccess(selectedTool)?.maxSensitivityLevel || "public"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTool(null);
                      router.push("/workspace");
                    }}
                  >
                    Back to Tools
                  </Button>
                </div>
              </div>
            </header>

            {/* Chat Interface */}
            {isToolAllowed ? (
              <AIChat toolId={selectedTool} toolName={selectedToolData.name} />
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <Card className="max-w-md border-destructive/30">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 rounded-full bg-destructive/10 w-fit mb-2">
                      <Lock className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle>Access Restricted</CardTitle>
                    <CardDescription>
                      You don&apos;t have permission to use {selectedToolData.name}. Contact your administrator to request access.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}
          </div>
        ) : (
          // Tool Selection Dashboard
          <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}</h1>
              <p className="text-muted-foreground">
                Select an AI tool to get started. Your access level determines which tools and data sensitivity levels you can use.
              </p>
            </div>

            {/* Access Level Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Your Security Profile</p>
                      <p className="text-sm text-muted-foreground">
                        Role: {user.role} | Department: {user.department} | Risk Score: {user.riskScore}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {user.aiToolsAccess.filter(a => a.allowed).length} of {aiTools.length} tools available
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Tools Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {aiTools.map((tool) => {
                const access = toolAccess(tool.id);
                const isAllowed = access?.allowed ?? false;
                const maxLevel = access?.maxSensitivityLevel || "public";

                return (
                  <Card
                    key={tool.id}
                    className={`relative overflow-hidden transition-all ${
                      isAllowed
                        ? "hover:border-primary/50 cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (isAllowed) {
                        setSelectedTool(tool.id);
                        router.push(`/workspace?tool=${tool.id}`);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${tool.color}`}>
                          <tool.icon className="h-6 w-6" />
                        </div>
                        {!isAllowed && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                        {isAllowed && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                            Max: {maxLevel}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      {isAllowed && (
                        <Button className="w-full group">
                          Open {tool.name}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Usage Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Usage Guidelines</CardTitle>
                <CardDescription>
                  Important policies to follow when using AI tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Never input restricted or confidential data beyond your access level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <span>All AI interactions are logged and monitored for compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Sensitive data will be automatically detected and masked or blocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Review AI outputs before sharing externally</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
