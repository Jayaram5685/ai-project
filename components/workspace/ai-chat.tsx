"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { detectSensitiveData, canProceed, type DetectionResult } from "@/lib/sensitive-data-detector";
import { logAuditEvent, type AuditAction } from "@/lib/audit-logger";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Bot,
  User,
  Info,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  detection?: DetectionResult;
  decision?: "allowed" | "masked" | "blocked";
  maskedContent?: string;
}

interface AIChatProps {
  toolId: string;
  toolName: string;
}

const toolActions: Record<string, AuditAction> = {
  "text-gen": "text_generation",
  "code-assist": "code_assistance",
  "summarizer": "document_summarization",
  "analytics": "data_analysis",
  "image-gen": "text_generation",
  "translator": "text_generation",
};

const toolPrompts: Record<string, string> = {
  "text-gen": "I'm your AI text generation assistant. I can help you write emails, documents, marketing copy, and more. How can I help you today?",
  "code-assist": "I'm your code assistant. I can help you write, debug, and explain code in various programming languages. What would you like to work on?",
  "summarizer": "I'm your document summarizer. Paste any text and I'll create a concise summary for you. What would you like me to summarize?",
  "analytics": "I'm your data analytics assistant. I can help you analyze data, create insights, and understand trends. What data would you like to explore?",
  "image-gen": "I'm your image generation assistant. Describe what you'd like to create and I'll help generate an image prompt or concept. What would you like to visualize?",
  "translator": "I'm your language translation assistant. I can translate text between multiple languages and help with localization. What would you like to translate?",
};

// Simulated AI responses based on tool type
function generateAIResponse(toolId: string, userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (toolId === "text-gen") {
    if (lowerMessage.includes("email")) {
      return `Here's a professional email draft based on your request:\n\n---\n\nSubject: [Your Subject Here]\n\nDear [Recipient],\n\nI hope this message finds you well. I wanted to reach out regarding [topic].\n\n[Main content would go here based on your specific requirements]\n\nPlease let me know if you have any questions or need further information.\n\nBest regards,\n[Your Name]\n\n---\n\nWould you like me to modify any part of this email?`;
    }
    return `I've analyzed your request and here's my response:\n\nBased on your input, I've generated content that addresses your needs while maintaining a professional tone. The key points covered include:\n\n1. Clear and concise messaging\n2. Appropriate structure and formatting\n3. Action-oriented language\n\nWould you like me to refine any specific section or adjust the tone?`;
  }
  
  if (toolId === "code-assist") {
    if (lowerMessage.includes("function") || lowerMessage.includes("code")) {
      return "```typescript\n// Here's a code example based on your request:\n\nfunction processData(input: string): Result {\n  // Validate input\n  if (!input || input.trim().length === 0) {\n    throw new Error('Invalid input');\n  }\n  \n  // Process the data\n  const processed = input\n    .trim()\n    .toLowerCase()\n    .split(' ')\n    .filter(Boolean);\n  \n  return {\n    success: true,\n    data: processed,\n    count: processed.length\n  };\n}\n```\n\nThis function includes input validation and proper error handling. Would you like me to explain any part or make modifications?";
    }
    return "I can help you with that code! Please provide more details about:\n\n1. The programming language you're using\n2. What functionality you need\n3. Any specific requirements or constraints\n\nOnce I have these details, I'll provide a tailored solution.";
  }
  
  if (toolId === "summarizer") {
    return `**Summary**\n\nI've analyzed the content you provided. Here are the key points:\n\n**Main Topics:**\n- Primary theme and central argument\n- Supporting evidence and data points\n- Key conclusions and recommendations\n\n**Key Takeaways:**\n1. The document emphasizes [main point]\n2. Important data suggests [insight]\n3. Recommended actions include [actions]\n\n**Word Count:** Original ~${Math.floor(userMessage.length / 5)} words | Summary ~50 words\n\nWould you like me to expand on any section or provide a different summary format?`;
  }
  
  if (toolId === "analytics") {
    return `**Data Analysis Results**\n\nBased on your query, here's my analysis:\n\n**Insights:**\n- Trend analysis shows positive growth patterns\n- Key metrics are within expected ranges\n- Anomalies detected in [specific area]\n\n**Recommendations:**\n1. Focus on high-performing segments\n2. Investigate the identified anomalies\n3. Consider A/B testing for optimization\n\n**Next Steps:**\nWould you like me to dive deeper into any specific metric or create visualizations for the data?`;
  }

  if (toolId === "image-gen") {
    return `**Image Concept Generated**\n\nBased on your description, here's a detailed image prompt:\n\n**Visual Elements:**\n- Primary subject: ${userMessage.split(' ').slice(0, 3).join(' ')}...\n- Style: Modern, clean, professional\n- Color palette: Complementary colors with high contrast\n- Composition: Rule of thirds, balanced layout\n\n**Suggested Prompt:**\n"${userMessage}, high quality, detailed, professional photography, 8k resolution"\n\n**Variations:**\n1. Minimalist version\n2. Vibrant/colorful version\n3. Dark/moody version\n\nWould you like me to refine any aspect of this concept?`;
  }

  if (toolId === "translator") {
    const languages = ["Spanish", "French", "German", "Japanese", "Chinese"];
    const targetLang = languages[Math.floor(Math.random() * languages.length)];
    return `**Translation Result**\n\n**Original Text:**\n"${userMessage}"\n\n**${targetLang} Translation:**\n"[Translated version would appear here]"\n\n**Notes:**\n- Context: General/Professional\n- Formality: Neutral\n- Confidence: 95%\n\n**Additional Languages Available:**\n${languages.filter(l => l !== targetLang).map(l => `- ${l}`).join('\n')}\n\nWould you like me to translate to another language or adjust the formality level?`;
  }
  
  return "I've processed your request. How else can I assist you?";
}

export function AIChat({ toolId, toolName }: AIChatProps) {
  const { user, updateUserStats } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMasked, setShowMasked] = useState(false);
  const [currentDetection, setCurrentDetection] = useState<DetectionResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: toolPrompts[toolId] || "How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, [toolId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get user's access level for this tool
  const toolAccess = user?.aiToolsAccess.find(a => a.toolId === toolId);
  const maxSensitivity = toolAccess?.maxSensitivityLevel || "public";

  // Real-time detection as user types
  useEffect(() => {
    if (input.trim()) {
      const detection = detectSensitiveData(input);
      setCurrentDetection(detection);
    } else {
      setCurrentDetection(null);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !user) return;

    const userMessage = input.trim();
    const detection = detectSensitiveData(userMessage);
    const permission = canProceed(detection, maxSensitivity, true);

    // Create user message
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
      detection,
      decision: permission.action,
      maskedContent: detection.maskedText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setCurrentDetection(null);
    setIsProcessing(true);

    // Log the event
    logAuditEvent(
      user,
      toolActions[toolId] || "text_generation",
      toolId,
      toolName,
      userMessage,
      undefined,
      detection,
      permission.action
    );

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    if (permission.action === "block") {
      // Add blocked message
      const blockedMsg: Message = {
        id: `msg_${Date.now()}_blocked`,
        role: "system",
        content: `Request blocked: ${permission.reason}\n\nDetected sensitive data types: ${detection.detectedPatterns.map(p => p.type).join(", ")}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, blockedMsg]);
      // Update user stats for blocked request
      updateUserStats({ blocked: true });
    } else {
      // Generate AI response
      const responseContent = generateAIResponse(
        toolId,
        permission.action === "mask" ? detection.maskedText : userMessage
      );

      const assistantMsg: Message = {
        id: `msg_${Date.now()}_response`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      // Add masking notice if data was masked
      if (permission.action === "mask") {
        const maskNotice: Message = {
          id: `msg_${Date.now()}_notice`,
          role: "system",
          content: `Note: Sensitive data was automatically masked before processing. ${detection.detectedPatterns.length} pattern(s) detected and protected.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, maskNotice, assistantMsg]);
        // Update user stats for masked request
        updateUserStats({ masked: true });
      } else {
        setMessages(prev => [...prev, assistantMsg]);
        // Update user stats for allowed request
        updateUserStats({});
      }

      // Log response
      logAuditEvent(
        user,
        toolActions[toolId] || "text_generation",
        toolId,
        toolName,
        userMessage,
        responseContent,
        detection,
        permission.action
      );
    }

    setIsProcessing(false);
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case "restricted": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "confidential": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "internal": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default: return "bg-green-500/10 text-green-400 border-green-500/30";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role !== "user" && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={cn(
                  "text-xs",
                  message.role === "assistant" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "max-w-[80%] space-y-2",
              message.role === "user" ? "items-end" : "items-start"
            )}>
              {/* Detection Badge for User Messages */}
              {message.role === "user" && message.detection && message.detection.hasSensitiveData && (
                <div className="flex items-center gap-2 justify-end">
                  <Badge variant="outline" className={getSensitivityColor(message.detection.sensitivityLevel)}>
                    {message.detection.sensitivityLevel} data
                  </Badge>
                  {message.decision === "blocked" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                      <XCircle className="h-3 w-3 mr-1" /> Blocked
                    </Badge>
                  )}
                  {message.decision === "mask" && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                      <Shield className="h-3 w-3 mr-1" /> Masked
                    </Badge>
                  )}
                  {message.decision === "allow" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                      <CheckCircle className="h-3 w-3 mr-1" /> Allowed
                    </Badge>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className={cn(
                "rounded-lg px-4 py-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.role === "system"
                  ? "bg-muted/50 border border-border"
                  : "bg-card border border-border"
              )}>
                {message.role === "user" && message.decision === "mask" && message.maskedContent ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setShowMasked(!showMasked)}
                      >
                        {showMasked ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        {showMasked ? "Show Original" : "Show Masked"}
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {showMasked ? message.maskedContent : message.content}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>

              {/* Timestamp */}
              <p className={cn(
                "text-xs text-muted-foreground",
                message.role === "user" ? "text-right" : "text-left"
              )}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === "user" && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing your request...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Real-time Detection Alert */}
      {currentDetection && currentDetection.hasSensitiveData && (
        <div className="px-4 pb-2">
          <Alert className={cn(
            "border",
            currentDetection.sensitivityLevel === "restricted" || currentDetection.sensitivityLevel === "confidential"
              ? "border-destructive/50 bg-destructive/10"
              : "border-yellow-500/50 bg-yellow-500/10"
          )}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">Sensitive Data Detected</AlertTitle>
            <AlertDescription className="text-xs">
              {currentDetection.detectedPatterns.map(p => p.type).join(", ")} detected.
              {currentDetection.sensitivityLevel === "restricted" && " This content may be blocked."}
              {currentDetection.sensitivityLevel === "confidential" && " This content may be masked."}
              <div className="mt-1 text-muted-foreground">
                Risk Score: {currentDetection.riskScore}/100 | Level: {currentDetection.sensitivityLevel}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Input Form */}
      <div className="border-t border-border p-4 bg-card/50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Type your message for ${toolName}...`}
              className="min-h-[80px] resize-none bg-input border-border pr-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              {currentDetection && (
                <Badge
                  variant="outline"
                  className={cn("text-xs", getSensitivityColor(currentDetection.sensitivityLevel))}
                >
                  {currentDetection.sensitivityLevel}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10"
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-transparent"
              onClick={() => {
                setMessages([
                  {
                    id: "welcome",
                    role: "assistant",
                    content: toolPrompts[toolId] || "How can I help you today?",
                    timestamp: new Date(),
                  },
                ]);
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Your access level: {maxSensitivity} | All interactions are logged for compliance
        </p>
      </div>
    </div>
  );
}
