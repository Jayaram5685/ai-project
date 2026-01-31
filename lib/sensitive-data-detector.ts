// Sensitive Data Detection Engine

export type SensitivityLevel = "public" | "internal" | "confidential" | "restricted";

export interface DetectionResult {
  hasSensitiveData: boolean;
  sensitivityLevel: SensitivityLevel;
  detectedPatterns: DetectedPattern[];
  maskedText: string;
  riskScore: number;
  recommendations: string[];
}

export interface DetectedPattern {
  type: string;
  category: string;
  value: string;
  masked: string;
  position: { start: number; end: number };
  severity: "low" | "medium" | "high" | "critical";
}

// Pattern definitions for sensitive data
const PATTERNS = {
  // PII Patterns
  ssn: {
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    type: "Social Security Number",
    category: "PII",
    severity: "critical" as const,
    mask: (match: string) => "XXX-XX-" + match.slice(-4),
  },
  creditCard: {
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    type: "Credit Card Number",
    category: "Financial",
    severity: "critical" as const,
    mask: (match: string) => "**** **** **** " + match.replace(/[-\s]/g, "").slice(-4),
  },
  email: {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    type: "Email Address",
    category: "PII",
    severity: "medium" as const,
    mask: (match: string) => {
      const [local, domain] = match.split("@");
      return local.charAt(0) + "***@" + domain;
    },
  },
  phone: {
    regex: /\b(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    type: "Phone Number",
    category: "PII",
    severity: "medium" as const,
    mask: (match: string) => "(***) ***-" + match.replace(/\D/g, "").slice(-4),
  },
  ipAddress: {
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    type: "IP Address",
    category: "Technical",
    severity: "low" as const,
    mask: () => "[IP REDACTED]",
  },
  apiKey: {
    regex: /\b(?:api[_-]?key|apikey|api_secret|secret_key|access_token|auth_token)[:\s]*['\"]?([a-zA-Z0-9_-]{20,})['\"]?/gi,
    type: "API Key/Token",
    category: "Security",
    severity: "critical" as const,
    mask: () => "[API_KEY_REDACTED]",
  },
  password: {
    regex: /\b(?:password|passwd|pwd)[:\s]*['\"]?([^\s'"]{4,})['\"]?/gi,
    type: "Password",
    category: "Security",
    severity: "critical" as const,
    mask: () => "[PASSWORD_REDACTED]",
  },
  dateOfBirth: {
    regex: /\b(?:dob|date of birth|birth date|birthdate)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/gi,
    type: "Date of Birth",
    category: "PII",
    severity: "high" as const,
    mask: () => "[DOB_REDACTED]",
  },
  medicalRecord: {
    regex: /\b(?:mrn|medical record|patient id|health id)[:\s#]*([a-zA-Z0-9-]{5,})/gi,
    type: "Medical Record Number",
    category: "PHI",
    severity: "critical" as const,
    mask: () => "[MRN_REDACTED]",
  },
  bankAccount: {
    regex: /\b(?:account|acct)[:\s#]*(\d{8,17})\b/gi,
    type: "Bank Account Number",
    category: "Financial",
    severity: "critical" as const,
    mask: () => "[ACCOUNT_REDACTED]",
  },
  address: {
    regex: /\b\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|circle|cir)\.?\s*,?\s*[\w\s]+,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?\b/gi,
    type: "Physical Address",
    category: "PII",
    severity: "high" as const,
    mask: () => "[ADDRESS_REDACTED]",
  },
  companySecret: {
    regex: /\b(?:confidential|proprietary|internal only|trade secret|classified)[:\s]*([\w\s]+)/gi,
    type: "Confidential Information",
    category: "Corporate",
    severity: "high" as const,
    mask: (match: string) => "[CONFIDENTIAL: " + match.slice(0, 10) + "...]",
  },
};

// Keywords that indicate sensitive context
const SENSITIVE_KEYWORDS = {
  high: [
    "salary", "compensation", "revenue", "profit", "loss", "merger", "acquisition",
    "layoff", "termination", "lawsuit", "litigation", "settlement", "diagnosis",
    "treatment", "prescription", "medical history", "health condition"
  ],
  medium: [
    "budget", "forecast", "strategy", "roadmap", "internal", "draft",
    "performance review", "evaluation", "disciplinary", "complaint"
  ],
  low: [
    "meeting", "project", "deadline", "milestone", "objective"
  ]
};

export function detectSensitiveData(text: string): DetectionResult {
  const detectedPatterns: DetectedPattern[] = [];
  let maskedText = text;
  let maxSeverity: "low" | "medium" | "high" | "critical" = "low";

  // Check all patterns
  for (const [, pattern] of Object.entries(PATTERNS)) {
    const matches = text.matchAll(pattern.regex);
    for (const match of matches) {
      const value = match[0];
      const masked = pattern.mask(value);
      
      detectedPatterns.push({
        type: pattern.type,
        category: pattern.category,
        value: value,
        masked: masked,
        position: { start: match.index!, end: match.index! + value.length },
        severity: pattern.severity,
      });

      // Update max severity
      const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
      if (severityOrder[pattern.severity] > severityOrder[maxSeverity]) {
        maxSeverity = pattern.severity;
      }

      // Apply masking
      maskedText = maskedText.replace(value, masked);
    }
  }

  // Check for sensitive keywords
  const lowerText = text.toLowerCase();
  let keywordSeverity: "low" | "medium" | "high" = "low";
  
  for (const keyword of SENSITIVE_KEYWORDS.high) {
    if (lowerText.includes(keyword)) {
      keywordSeverity = "high";
      break;
    }
  }
  if (keywordSeverity !== "high") {
    for (const keyword of SENSITIVE_KEYWORDS.medium) {
      if (lowerText.includes(keyword)) {
        keywordSeverity = "medium";
        break;
      }
    }
  }

  // Calculate risk score (0-100)
  let riskScore = 0;
  for (const pattern of detectedPatterns) {
    switch (pattern.severity) {
      case "critical": riskScore += 30; break;
      case "high": riskScore += 20; break;
      case "medium": riskScore += 10; break;
      case "low": riskScore += 5; break;
    }
  }
  
  // Add keyword risk
  switch (keywordSeverity) {
    case "high": riskScore += 15; break;
    case "medium": riskScore += 8; break;
    case "low": riskScore += 3; break;
  }
  
  riskScore = Math.min(100, riskScore);

  // Determine sensitivity level
  let sensitivityLevel: SensitivityLevel = "public";
  if (riskScore >= 60 || maxSeverity === "critical") {
    sensitivityLevel = "restricted";
  } else if (riskScore >= 40 || maxSeverity === "high") {
    sensitivityLevel = "confidential";
  } else if (riskScore >= 20 || maxSeverity === "medium") {
    sensitivityLevel = "internal";
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (detectedPatterns.length > 0) {
    recommendations.push("Consider removing or masking sensitive data before proceeding.");
    
    const categories = [...new Set(detectedPatterns.map(p => p.category))];
    if (categories.includes("PII")) {
      recommendations.push("Personal Identifiable Information detected. Ensure GDPR/CCPA compliance.");
    }
    if (categories.includes("PHI")) {
      recommendations.push("Protected Health Information detected. Ensure HIPAA compliance.");
    }
    if (categories.includes("Financial")) {
      recommendations.push("Financial data detected. Ensure PCI-DSS compliance.");
    }
    if (categories.includes("Security")) {
      recommendations.push("Security credentials detected. Never share API keys or passwords with AI systems.");
    }
  }

  return {
    hasSensitiveData: detectedPatterns.length > 0 || keywordSeverity !== "low",
    sensitivityLevel,
    detectedPatterns,
    maskedText,
    riskScore,
    recommendations,
  };
}

export function canProceed(
  detectionResult: DetectionResult,
  userMaxLevel: SensitivityLevel,
  autoMask: boolean = false
): { allowed: boolean; action: "allow" | "mask" | "block"; reason: string } {
  const levelOrder: Record<SensitivityLevel, number> = {
    public: 0,
    internal: 1,
    confidential: 2,
    restricted: 3,
  };

  const dataLevel = levelOrder[detectionResult.sensitivityLevel];
  const userLevel = levelOrder[userMaxLevel];

  if (dataLevel <= userLevel) {
    return { allowed: true, action: "allow", reason: "Request within authorized sensitivity level." };
  }

  if (autoMask && detectionResult.detectedPatterns.length > 0) {
    return { 
      allowed: true, 
      action: "mask", 
      reason: "Sensitive data will be automatically masked before processing." 
    };
  }

  return {
    allowed: false,
    action: "block",
    reason: `Request contains ${detectionResult.sensitivityLevel} data. Your access level allows up to ${userMaxLevel} data only.`,
  };
}
