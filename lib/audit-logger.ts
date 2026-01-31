"use client";

import type { AuthUser } from "./auth-context";
import type { DetectionResult } from "./sensitive-data-detector";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  department: string;
  action: AuditAction;
  toolId: string;
  toolName: string;
  inputPreview: string;
  outputPreview?: string;
  sensitivityLevel: string;
  detectedPatterns: string[];
  decision: "allowed" | "masked" | "blocked";
  riskScore: number;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export type AuditAction = 
  | "text_generation"
  | "code_assistance"
  | "document_summarization"
  | "data_analysis"
  | "image_generation"
  | "translation"
  | "login"
  | "logout"
  | "policy_violation"
  | "access_denied";

// In-memory audit log storage (in production, this would be a database)
let auditLogs: AuditLogEntry[] = [];

// Initialize with some mock historical data
function initializeMockData() {
  const mockUsers = [
    { id: "usr_002", name: "John Smith", role: "employee", department: "Marketing" },
    { id: "usr_003", name: "Emily Davis", role: "manager", department: "Engineering" },
    { id: "usr_005", name: "Alex Johnson", role: "employee", department: "Sales" },
    { id: "usr_006", name: "Lisa Wang", role: "employee", department: "HR" },
  ];

  const mockActions: { action: AuditAction; toolId: string; toolName: string }[] = [
    { action: "text_generation", toolId: "text-gen", toolName: "Text Generation" },
    { action: "code_assistance", toolId: "code-assist", toolName: "Code Assistant" },
    { action: "document_summarization", toolId: "summarizer", toolName: "Document Summarizer" },
    { action: "data_analysis", toolId: "analytics", toolName: "Data Analytics" },
  ];

  const mockInputs = [
    "Write a marketing email for our new product launch",
    "Summarize the Q3 financial report",
    "Generate code for user authentication",
    "Analyze customer satisfaction data",
    "Draft a response to client inquiry about pricing",
    "Review this contract for key terms",
    "Create a project timeline for Q4",
    "Help me write a performance review",
  ];

  const decisions: ("allowed" | "masked" | "blocked")[] = ["allowed", "allowed", "allowed", "masked", "blocked"];
  const sensitivityLevels = ["public", "internal", "confidential", "internal", "public"];

  // Generate 50 mock entries over the past 7 days
  for (let i = 0; i < 50; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const actionData = mockActions[Math.floor(Math.random() * mockActions.length)];
    const input = mockInputs[Math.floor(Math.random() * mockInputs.length)];
    const decision = decisions[Math.floor(Math.random() * decisions.length)];
    const sensitivity = sensitivityLevels[Math.floor(Math.random() * sensitivityLevels.length)];

    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    auditLogs.push({
      id: `audit_${Date.now()}_${i}`,
      timestamp,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      department: user.department,
      action: actionData.action,
      toolId: actionData.toolId,
      toolName: actionData.toolName,
      inputPreview: input.substring(0, 100),
      sensitivityLevel: sensitivity,
      detectedPatterns: decision === "blocked" ? ["Email Address", "Phone Number"] : [],
      decision,
      riskScore: decision === "blocked" ? 75 : decision === "masked" ? 45 : 15,
      sessionId: `session_${Math.random().toString(36).substring(7)}`,
    });
  }

  // Sort by timestamp descending
  auditLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Initialize mock data
initializeMockData();

export function logAuditEvent(
  user: AuthUser,
  action: AuditAction,
  toolId: string,
  toolName: string,
  input: string,
  output: string | undefined,
  detection: DetectionResult,
  decision: "allowed" | "masked" | "blocked"
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    timestamp: new Date(),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    department: user.department,
    action,
    toolId,
    toolName,
    inputPreview: input.substring(0, 200) + (input.length > 200 ? "..." : ""),
    outputPreview: output ? output.substring(0, 200) + (output.length > 200 ? "..." : "") : undefined,
    sensitivityLevel: detection.sensitivityLevel,
    detectedPatterns: detection.detectedPatterns.map(p => p.type),
    decision,
    riskScore: detection.riskScore,
    sessionId: `session_${Math.random().toString(36).substring(7)}`,
  };

  auditLogs.unshift(entry);
  return entry;
}

export function getAuditLogs(filters?: {
  userId?: string;
  department?: string;
  action?: AuditAction;
  decision?: "allowed" | "masked" | "blocked";
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): AuditLogEntry[] {
  let filtered = [...auditLogs];

  if (filters) {
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }
    if (filters.department) {
      filtered = filtered.filter(log => log.department === filters.department);
    }
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }
    if (filters.decision) {
      filtered = filtered.filter(log => log.decision === filters.decision);
    }
    if (filters.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
    }
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
  }

  return filtered;
}

export function getAuditStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todayLogs = auditLogs.filter(log => log.timestamp >= today);
  const weekLogs = auditLogs.filter(log => log.timestamp >= weekAgo);

  const totalRequests = weekLogs.length;
  const allowedRequests = weekLogs.filter(log => log.decision === "allowed").length;
  const maskedRequests = weekLogs.filter(log => log.decision === "masked").length;
  const blockedRequests = weekLogs.filter(log => log.decision === "blocked").length;

  // Department usage
  const departmentUsage = weekLogs.reduce((acc, log) => {
    acc[log.department] = (acc[log.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Tool usage
  const toolUsage = weekLogs.reduce((acc, log) => {
    acc[log.toolName] = (acc[log.toolName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Daily breakdown
  const dailyBreakdown: { date: string; allowed: number; masked: number; blocked: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    const dayLogs = weekLogs.filter(log => log.timestamp >= date && log.timestamp < nextDate);
    
    dailyBreakdown.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      allowed: dayLogs.filter(log => log.decision === "allowed").length,
      masked: dayLogs.filter(log => log.decision === "masked").length,
      blocked: dayLogs.filter(log => log.decision === "blocked").length,
    });
  }

  // Top users
  const userUsage = weekLogs.reduce((acc, log) => {
    if (!acc[log.userId]) {
      acc[log.userId] = { name: log.userName, department: log.department, count: 0, blocked: 0 };
    }
    acc[log.userId].count++;
    if (log.decision === "blocked") acc[log.userId].blocked++;
    return acc;
  }, {} as Record<string, { name: string; department: string; count: number; blocked: number }>);

  const topUsers = Object.entries(userUsage)
    .map(([id, data]) => ({ userId: id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalRequests,
    allowedRequests,
    maskedRequests,
    blockedRequests,
    todayRequests: todayLogs.length,
    todayBlocked: todayLogs.filter(log => log.decision === "blocked").length,
    departmentUsage,
    toolUsage,
    dailyBreakdown,
    topUsers,
    averageRiskScore: weekLogs.length > 0 
      ? Math.round(weekLogs.reduce((sum, log) => sum + log.riskScore, 0) / weekLogs.length)
      : 0,
  };
}
