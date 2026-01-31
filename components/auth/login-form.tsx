"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Loader2, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2, Zap, Users, BarChart3 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      router.push("/workspace");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  const demoAccounts = [
    { email: "employee@company.com", password: "employee123", role: "Employee", desc: "Basic AI access" },
    { email: "manager@company.com", password: "manager123", role: "Manager", desc: "Extended access" },
    { email: "admin@company.com", password: "admin123", role: "Admin", desc: "Full access" },
    { email: "compliance@company.com", password: "compliance123", role: "Compliance", desc: "Audit access" },
  ];

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  const features = [
    { icon: Shield, text: "Sensitive Data Protection", color: "text-blue-400" },
    { icon: Zap, text: "AI-Powered Productivity", color: "text-yellow-400" },
    { icon: Users, text: "Role-Based Access Control", color: "text-green-400" },
    { icon: BarChart3, text: "Real-Time Monitoring", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-primary/20 border border-primary/30">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">AI Shield</h1>
              <p className="text-muted-foreground">Enterprise AI Governance</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-balance">
            Secure AI Usage Without Sacrificing Productivity
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            AI Shield enables your employees to leverage AI tools while automatically protecting 
            sensitive data, ensuring compliance, and maintaining complete audit trails.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                <div className={`p-2 rounded-lg bg-background ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-foreground font-medium">{feature.text}</span>
                <CheckCircle2 className="h-4 w-4 ml-auto text-green-400" />
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-4">TRUSTED BY ENTERPRISE TEAMS</p>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span>GDPR Compliant</span>
              <span>|</span>
              <span>HIPAA Ready</span>
              <span>|</span>
              <span>SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="text-center space-y-2 lg:hidden">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Shield</h1>
            <p className="text-muted-foreground">
              Secure AI Workspace for Enterprise
            </p>
          </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-card-foreground">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your company credentials to access the AI workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <Card className="border-border/50 bg-card/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account?"}
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href="/register">Create Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts - Collapsible */}
        <details className="group">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground text-center list-none">
            <span className="underline">View demo accounts for testing</span>
          </summary>
          <Card className="mt-3 border-border/50 bg-card/30">
            <CardContent className="pt-4 grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillDemo(account.email, account.password)}
                  className="p-3 text-left rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {account.role}
                  </div>
                  <div className="text-xs text-muted-foreground">{account.desc}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </details>

        {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Protected by AI Shield Enterprise Security</p>
            <p>All AI interactions are monitored and logged for compliance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
