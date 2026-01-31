// AI Shield - Type Definitions

export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type PolicyStatus = 'active' | 'draft' | 'archived';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  riskScore: number;
  lastActivity: Date;
  aiToolsAccess: string[];
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  dataClassifications: DataClassification[];
  allowedTools: string[];
  blockedPatterns: string[];
  createdAt: Date;
  updatedAt: Date;
  enforcementLevel: 'warn' | 'block' | 'audit';
}

export interface DataAsset {
  id: string;
  name: string;
  type: string;
  classification: DataClassification;
  owner: string;
  department: string;
  lastAccessed: Date;
  accessCount: number;
  riskScore: number;
}

export interface AIUsageEvent {
  id: string;
  userId: string;
  userName: string;
  tool: string;
  action: string;
  dataClassification: DataClassification;
  timestamp: Date;
  blocked: boolean;
  riskLevel: RiskLevel;
  prompt?: string;
  response?: string;
  policyViolations: string[];
}

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  source: string;
  timestamp: Date;
  resolved: boolean;
  userId?: string;
  policyId?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: ComplianceRequirement[];
  overallScore: number;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  evidence: string[];
  lastAssessed: Date;
}

export interface DashboardMetrics {
  totalRequests: number;
  blockedRequests: number;
  activeUsers: number;
  policiesEnforced: number;
  dataAssetsProtected: number;
  complianceScore: number;
  riskScore: number;
  alertsToday: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface AITool {
  id: string;
  name: string;
  vendor: string;
  category: string;
  riskLevel: RiskLevel;
  approved: boolean;
  usageCount: number;
  lastUsed: Date;
}
