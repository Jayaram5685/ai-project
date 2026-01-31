"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole, type Department } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Loader2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  AlertCircle, 
  User,
  Building,
  Briefcase,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const DEPARTMENTS: Department[] = [
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Legal & Compliance",
  "IT Security",
  "Operations",
  "Product",
  "Customer Support"
];

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "employee", label: "Employee", description: "Standard AI tools access with internal data level" },
  { value: "manager", label: "Manager", description: "Extended access with team logs and confidential data" },
  { value: "admin", label: "Administrator", description: "Full system access with all AI tools and restricted data" },
  { value: "compliance_officer", label: "Compliance Officer", description: "Audit access with policy management capabilities" },
];

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
    department: "" as Department | "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!formData.role) {
      setError("Please select your role.");
      return;
    }
    if (!formData.department) {
      setError("Please select your department.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role as UserRole,
      department: formData.department as Department,
    });
    
    if (result.success) {
      router.push("/workspace");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const canProceedToStep2 = formData.name && formData.email && formData.role && formData.department;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground">
            Join AI Shield - Secure AI Workspace for Enterprise
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
            </div>
            <span className={`text-sm ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Profile</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <span className={`text-sm ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Security</span>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-card-foreground">
              {step === 1 ? "Your Profile Information" : "Set Your Password"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Enter your details and select your role to determine AI tool access"
                : "Create a secure password to protect your account"
              }
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

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Company Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-foreground">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => updateField("role", value)}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select your role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col">
                              <span>{role.label}</span>
                              <span className="text-xs text-muted-foreground">{role.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-foreground">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => updateField("department", value)}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select your department" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      if (canProceedToStep2) {
                        setStep(2);
                      } else {
                        setError("Please fill in all fields before continuing.");
                      }
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role Access Preview */}
                  {formData.role && (
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-2">
                      <div className="text-sm font-medium text-foreground">Your Access Level Preview</div>
                      <div className="text-xs text-muted-foreground">
                        As a <span className="text-primary font-medium">{ROLES.find(r => r.value === formData.role)?.label}</span>, you will have:
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        {formData.role === "employee" && (
                          <>
                            <li>Text Generation and Document Summarizer access</li>
                            <li>Internal data sensitivity level</li>
                            <li>View your own activity logs</li>
                          </>
                        )}
                        {formData.role === "manager" && (
                          <>
                            <li>All AI tools including Code Assistant</li>
                            <li>Confidential data sensitivity level</li>
                            <li>View team activity logs</li>
                          </>
                        )}
                        {formData.role === "admin" && (
                          <>
                            <li>Full access to all AI tools</li>
                            <li>Restricted data sensitivity level</li>
                            <li>Complete system administration</li>
                          </>
                        )}
                        {formData.role === "compliance_officer" && (
                          <>
                            <li>Text, Summarizer, and Analytics tools</li>
                            <li>Restricted data sensitivity level</li>
                            <li>Full audit and policy management</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Protected by AI Shield Enterprise Security</p>
          <p>All AI interactions are monitored and logged for compliance</p>
        </div>
      </div>
    </div>
  );
}
