"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "employee" | "manager" | "admin" | "compliance_officer";

export type Department = 
  | "Engineering" 
  | "Marketing" 
  | "Sales" 
  | "Finance" 
  | "HR" 
  | "Legal & Compliance" 
  | "IT Security" 
  | "Operations" 
  | "Product" 
  | "Customer Support";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: Department;
  avatar?: string;
  permissions: string[];
  aiToolsAccess: AIToolAccess[];
  riskScore: number;
  joinedAt: Date;
  totalRequests: number;
  blockedRequests: number;
  maskedRequests: number;
}

export interface AIToolAccess {
  toolId: string;
  toolName: string;
  allowed: boolean;
  maxSensitivityLevel: "public" | "internal" | "confidential" | "restricted";
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  department: Department;
}

interface AuthContextType {
  user: AuthUser | null;
  allUsers: AuthUser[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserStats: (stats: { blocked?: boolean; masked?: boolean }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based tool access configuration
const ROLE_TOOL_ACCESS: Record<UserRole, AIToolAccess[]> = {
  employee: [
    { toolId: "text-gen", toolName: "Text Generation", allowed: true, maxSensitivityLevel: "internal" },
    { toolId: "code-assist", toolName: "Code Assistant", allowed: false, maxSensitivityLevel: "public" },
    { toolId: "summarizer", toolName: "Document Summarizer", allowed: true, maxSensitivityLevel: "internal" },
    { toolId: "analytics", toolName: "Data Analytics", allowed: false, maxSensitivityLevel: "public" },
    { toolId: "image-gen", toolName: "Image Generation", allowed: true, maxSensitivityLevel: "public" },
    { toolId: "translator", toolName: "Language Translator", allowed: true, maxSensitivityLevel: "internal" },
  ],
  manager: [
    { toolId: "text-gen", toolName: "Text Generation", allowed: true, maxSensitivityLevel: "confidential" },
    { toolId: "code-assist", toolName: "Code Assistant", allowed: true, maxSensitivityLevel: "confidential" },
    { toolId: "summarizer", toolName: "Document Summarizer", allowed: true, maxSensitivityLevel: "confidential" },
    { toolId: "analytics", toolName: "Data Analytics", allowed: true, maxSensitivityLevel: "internal" },
    { toolId: "image-gen", toolName: "Image Generation", allowed: true, maxSensitivityLevel: "internal" },
    { toolId: "translator", toolName: "Language Translator", allowed: true, maxSensitivityLevel: "confidential" },
  ],
  admin: [
    { toolId: "text-gen", toolName: "Text Generation", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "code-assist", toolName: "Code Assistant", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "summarizer", toolName: "Document Summarizer", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "analytics", toolName: "Data Analytics", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "image-gen", toolName: "Image Generation", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "translator", toolName: "Language Translator", allowed: true, maxSensitivityLevel: "restricted" },
  ],
  compliance_officer: [
    { toolId: "text-gen", toolName: "Text Generation", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "code-assist", toolName: "Code Assistant", allowed: false, maxSensitivityLevel: "public" },
    { toolId: "summarizer", toolName: "Document Summarizer", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "analytics", toolName: "Data Analytics", allowed: true, maxSensitivityLevel: "restricted" },
    { toolId: "image-gen", toolName: "Image Generation", allowed: false, maxSensitivityLevel: "public" },
    { toolId: "translator", toolName: "Language Translator", allowed: true, maxSensitivityLevel: "restricted" },
  ],
};

// Role-based permissions
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  employee: ["use_ai_tools", "view_own_logs"],
  manager: ["use_ai_tools", "view_own_logs", "view_team_logs", "approve_requests"],
  admin: ["all"],
  compliance_officer: ["use_ai_tools", "view_all_logs", "manage_policies", "audit_access", "export_reports"],
};

// Storage keys
const USERS_STORAGE_KEY = "ai_shield_users_db";
const CURRENT_USER_KEY = "ai_shield_user";

// Initialize with some default users
const DEFAULT_USERS: Record<string, { password: string; user: AuthUser }> = {};

const MOCK_USERS = {
  "employee@example.com": {
    password: "employee123",
    user: {
      id: "1",
      email: "employee@example.com",
      name: "Employee User",
      role: "employee",
      department: "Engineering",
      permissions: ROLE_PERMISSIONS["employee"],
      aiToolsAccess: ROLE_TOOL_ACCESS["employee"],
      riskScore: 20,
      joinedAt: new Date(),
      totalRequests: 10,
      blockedRequests: 0,
      maskedRequests: 0,
    },
  },
  "manager@example.com": {
    password: "manager123",
    user: {
      id: "2",
      email: "manager@example.com",
      name: "Manager User",
      role: "manager",
      department: "Marketing",
      permissions: ROLE_PERMISSIONS["manager"],
      aiToolsAccess: ROLE_TOOL_ACCESS["manager"],
      riskScore: 30,
      joinedAt: new Date(),
      totalRequests: 15,
      blockedRequests: 0,
      maskedRequests: 0,
    },
  },
  "admin@example.com": {
    password: "admin123",
    user: {
      id: "3",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      department: "IT Security",
      permissions: ROLE_PERMISSIONS["admin"],
      aiToolsAccess: ROLE_TOOL_ACCESS["admin"],
      riskScore: 10,
      joinedAt: new Date(),
      totalRequests: 20,
      blockedRequests: 0,
      maskedRequests: 0,
    },
  },
  "compliance@example.com": {
    password: "compliance123",
    user: {
      id: "4",
      email: "compliance@example.com",
      name: "Compliance Officer",
      role: "compliance_officer",
      department: "Legal & Compliance",
      permissions: ROLE_PERMISSIONS["compliance_officer"],
      aiToolsAccess: ROLE_TOOL_ACCESS["compliance_officer"],
      riskScore: 40,
      joinedAt: new Date(),
      totalRequests: 5,
      blockedRequests: 0,
      maskedRequests: 0,
    },
  },
};

// Helper to get users from storage
function getUsersFromStorage(): Record<string, { password: string; user: AuthUser }> {
  if (typeof window === "undefined") return { ...MOCK_USERS };
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...MOCK_USERS, ...parsed };
    } catch {
      return { ...MOCK_USERS };
    }
  }
  return { ...MOCK_USERS };
}

// Helper to save users to storage
function saveUsersToStorage(users: Record<string, { password: string; user: AuthUser }>) {
  if (typeof window === "undefined") return;
  // Only save non-mock users
  const customUsers: Record<string, { password: string; user: AuthUser }> = {};
  for (const [email, data] of Object.entries(users)) {
    if (!MOCK_USERS[email]) {
      customUsers[email] = data;
    }
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(customUsers));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [usersDb, setUsersDb] = useState<Record<string, { password: string; user: AuthUser }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load users database
    const users = getUsersFromStorage();
    setUsersDb(users);

    // Check for existing session
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Restore Date object
        parsed.joinedAt = new Date(parsed.joinedAt);
        setUser(parsed);
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getUsersFromStorage();
    const userRecord = users[email.toLowerCase()];
    
    if (!userRecord) {
      setIsLoading(false);
      return { success: false, error: "User not found. Please register first or check your email." };
    }

    if (userRecord.password !== password) {
      setIsLoading(false);
      return { success: false, error: "Invalid password. Please try again." };
    }

    const loggedInUser = { ...userRecord.user, joinedAt: new Date(userRecord.user.joinedAt) };
    setUser(loggedInUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
    setIsLoading(false);
    
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = getUsersFromStorage();
    
    // Check if email already exists
    if (users[data.email.toLowerCase()]) {
      setIsLoading(false);
      return { success: false, error: "An account with this email already exists." };
    }

    // Validate password
    if (data.password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Create new user
    const newUser: AuthUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: data.email.toLowerCase(),
      name: data.name,
      role: data.role,
      department: data.department,
      permissions: ROLE_PERMISSIONS[data.role],
      aiToolsAccess: ROLE_TOOL_ACCESS[data.role],
      riskScore: Math.floor(Math.random() * 30) + 10,
      joinedAt: new Date(),
      totalRequests: 0,
      blockedRequests: 0,
      maskedRequests: 0,
    };

    // Save to database
    users[data.email.toLowerCase()] = {
      password: data.password,
      user: newUser,
    };
    
    saveUsersToStorage(users);
    setUsersDb(users);

    // Auto login
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUserStats = useCallback((stats: { blocked?: boolean; masked?: boolean }) => {
    if (!user) return;

    const updatedUser = { ...user };
    updatedUser.totalRequests += 1;
    if (stats.blocked) updatedUser.blockedRequests += 1;
    if (stats.masked) updatedUser.maskedRequests += 1;

    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Also update in users database
    const users = getUsersFromStorage();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      saveUsersToStorage(users);
      setUsersDb(users);
    }
  }, [user]);

  const allUsers = Object.values(usersDb).map(u => ({ ...u.user, joinedAt: new Date(u.user.joinedAt) }));

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
