"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Eye,
  FileText,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function GuidelinesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

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

  const doList = [
    "Use AI tools for legitimate business purposes only",
    "Review AI-generated content before sharing externally",
    "Report any suspicious AI behavior or outputs",
    "Keep your login credentials secure",
    "Ask for help if unsure about data sensitivity",
  ];

  const dontList = [
    "Share passwords, API keys, or security credentials with AI",
    "Input customer PII beyond your authorized level",
    "Copy confidential financial data into AI tools",
    "Bypass security warnings or masking features",
    "Use AI for personal projects on company systems",
  ];

  const sensitivityLevels = [
    {
      level: "Public",
      color: "bg-green-500/10 text-green-400 border-green-500/30",
      description: "Information that can be freely shared",
      examples: ["Marketing materials", "Public announcements", "General knowledge"],
    },
    {
      level: "Internal",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      description: "Company information not for external sharing",
      examples: ["Internal memos", "Project names", "Team discussions"],
    },
    {
      level: "Confidential",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      description: "Sensitive business information",
      examples: ["Financial reports", "Strategic plans", "Employee data"],
    },
    {
      level: "Restricted",
      color: "bg-red-500/10 text-red-400 border-red-500/30",
      description: "Highly sensitive, need-to-know basis",
      examples: ["Trade secrets", "Legal matters", "Executive communications"],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 pl-64">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">AI Usage Guidelines</h1>
              <p className="text-sm text-muted-foreground">
                Best practices for safe and productive AI usage
              </p>
            </div>
            <Badge variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Last updated: Jan 2026
            </Badge>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Quick Reference */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <XCircle className="h-5 w-5" />
                  Don&apos;t
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dontList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Data Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Sensitivity Levels
              </CardTitle>
              <CardDescription>
                Understanding data classification helps you make the right decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensitivityLevels.map((level) => (
                  <div
                    key={level.level}
                    className="p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className={level.color}>
                        {level.level}
                      </Badge>
                      <span className="text-sm text-foreground">{level.description}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {level.examples.map((example) => (
                        <Badge key={example} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How Protection Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                How AI Shield Protects You
              </CardTitle>
              <CardDescription>
                Understanding the automatic protection features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-foreground">Allowed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Request processed normally when data sensitivity is within your access level.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium text-foreground">Masked</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sensitive data automatically replaced with safe placeholders before processing.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="font-medium text-foreground">Blocked</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Request stopped when data sensitivity exceeds your access level.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What happens to my AI conversations?</AccordionTrigger>
                  <AccordionContent>
                    All AI interactions are logged for compliance and security purposes. Logs include
                    timestamps, the tool used, and a preview of your input. Full conversations are
                    retained for 90 days and then archived. You can view your own history in the
                    &quot;My History&quot; section.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Why was my request blocked?</AccordionTrigger>
                  <AccordionContent>
                    Requests are blocked when they contain sensitive data that exceeds your access
                    level. For example, if you&apos;re an employee with &quot;internal&quot; access and try to
                    input &quot;confidential&quot; or &quot;restricted&quot; data, the request will be blocked. Check
                    your access level in the sidebar and contact your manager if you need elevated
                    access.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What data patterns are detected?</AccordionTrigger>
                  <AccordionContent>
                    AI Shield automatically detects: Social Security Numbers, credit card numbers,
                    email addresses, phone numbers, IP addresses, API keys, passwords, dates of
                    birth, medical record numbers, bank account numbers, and physical addresses.
                    Additionally, keywords like &quot;salary&quot;, &quot;confidential&quot;, and &quot;merger&quot; increase
                    sensitivity scores.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I request access to more AI tools?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Contact your manager or IT administrator to request access to additional AI
                    tools or higher sensitivity levels. Requests are reviewed based on your role,
                    department needs, and security training completion.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Is my data used to train AI models?</AccordionTrigger>
                  <AccordionContent>
                    No. AI Shield uses enterprise-grade AI that does not use your data for training.
                    Your inputs are processed securely and not retained by AI providers. This ensures
                    your company data remains confidential.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you have questions about AI usage policies or encounter any issues, contact:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>IT Security: security@company.com</li>
                    <li>Compliance: compliance@company.com</li>
                    <li>Your Manager: For access requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
