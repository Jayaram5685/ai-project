"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  Shield,
  MessageSquare,
  Code,
  FileText,
  BarChart3,
  History,
  Settings,
  LayoutDashboard,
  Users,
  FileSearch,
  AlertTriangle,
  LogOut,
  ChevronRight,
  ImageIcon,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const employeeNav = [
  { name: "AI Tools", href: "/workspace", icon: MessageSquare },
  { name: "My History", href: "/workspace/history", icon: History },
  { name: "Guidelines", href: "/workspace/guidelines", icon: FileText },
];

const managerNav = [
  { name: "Team Overview", href: "/workspace/team", icon: Users },
];

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Policies", href: "/admin/policies", icon: FileSearch },
  { name: "Alerts", href: "/admin/alerts", icon: AlertTriangle },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const aiTools = [
  { id: "text-gen", name: "Text Generation", icon: MessageSquare, color: "bg-blue-500/10 text-blue-400" },
  { id: "code-assist", name: "Code Assistant", icon: Code, color: "bg-green-500/10 text-green-400" },
  { id: "summarizer", name: "Summarizer", icon: FileText, color: "bg-amber-500/10 text-amber-400" },
  { id: "analytics", name: "Data Analytics", icon: BarChart3, color: "bg-purple-500/10 text-purple-400" },
  { id: "image-gen", name: "Image Generation", icon: ImageIcon, color: "bg-pink-500/10 text-pink-400" },
  { id: "translator", name: "Translator", icon: Languages, color: "bg-cyan-500/10 text-cyan-400" },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "compliance_officer";
  const isManager = user.role === "manager" || isAdmin;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-semibold text-sidebar-foreground">AI Shield</span>
            <Badge variant="outline" className="ml-2 text-[10px] border-primary/30 text-primary">
              {user.role}
            </Badge>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-sidebar-border">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.department}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* AI Tools Section */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Tools
            </h3>
            <div className="space-y-1">
              {aiTools.map((tool) => {
                const access = user.aiToolsAccess.find(a => a.toolId === tool.id);
                const isAllowed = access?.allowed ?? false;
                
                return (
                  <Link
                    key={tool.id}
                    href={isAllowed ? `/workspace?tool=${tool.id}` : "#"}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isAllowed
                        ? "text-sidebar-foreground hover:bg-sidebar-accent"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn("p-1.5 rounded-md", tool.color)}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{tool.name}</span>
                    {!isAllowed && (
                      <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive">
                        Locked
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Employee Navigation */}
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </h3>
            <div className="space-y-1">
              {employeeNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Manager Navigation */}
          {isManager && (
            <div>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Management
              </h3>
              <div className="space-y-1">
                {managerNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <div>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Administration
              </h3>
              <div className="space-y-1">
                {adminNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}
