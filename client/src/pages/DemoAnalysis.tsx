import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText, Target, Lightbulb, AlertTriangle } from "lucide-react";
import { SoftGateModal } from "@/components/SoftGateModal";

// Demo analysis data - same structure as real analysis
const DEMO_ANALYSIS = {
  part1: {
    title: "Discovery & Problem Analysis",
    icon: Target,
    content: `# Discovery & Problem Analysis

## Problem Context
The challenge of building a SaaS platform for strategic UX analysis represents a complex intersection of AI capabilities, user experience design, and business model validation...

[Full demo content would go here - this is just a preview]`
  },
  part2: {
    title: "Strategic Design & Roadmap",
    icon: FileText,
    content: `# Strategic Design & Roadmap

## Phase 1: Foundation (Weeks 1-4)
- Core AI integration setup
- Basic user authentication
- Payment processing infrastructure

[Full demo content would go here]`
  },
  part3: {
    title: "AI Toolkit & Figma Prompts",
    icon: Lightbulb,
    content: `# AI Toolkit & Figma Prompts

## Figma Design Prompts
\`\`\`
Create a modern SaaS dashboard with dark mode support...
\`\`\`

[Full demo content would go here]`
  },
  part4: {
    title: "Risk, Metrics & Rationale",
    icon: AlertTriangle,
    content: `# Risk, Metrics & Rationale

## Key Risks
1. AI API reliability and cost management
2. User acquisition in competitive market
3. Payment processing complexity

[Full demo content would go here]`
  }
};

export default function DemoAnalysis() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    part1: true,
    part2: false,
    part3: false,
    part4: false
  });
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isContentLocked, setIsContentLocked] = useState(false);

  // Check if email was already submitted
  useEffect(() => {
    const submitted = localStorage.getItem("demo_email_submitted");
    if (submitted) {
      setEmailSubmitted(true);
    }
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setScrollPercentage(scrollPercent);

      // Show email gate at 50% scroll if not already submitted
      if (scrollPercent >= 50 && !emailSubmitted && !showEmailGate) {
        setShowEmailGate(true);
        setIsContentLocked(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [emailSubmitted, showEmailGate]);

  const toggleSection = (section: string) => {
    // Prevent interaction if content is locked
    if (isContentLocked && !emailSubmitted) {
      setShowEmailGate(true);
      return;
    }
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEmailSubmit = () => {
    setEmailSubmitted(true);
    setIsContentLocked(false);
    setShowEmailGate(false);
    localStorage.setItem("demo_email_submitted", "true");
  };

  const handleModalClose = () => {
    // Keep content locked if email not submitted
    if (!emailSubmitted) {
      setIsContentLocked(true);
    }
    setShowEmailGate(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Demo Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Sample APEX Strategic Analysis Output
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content with optional blur overlay */}
      <div className={`container mx-auto px-4 py-8 relative ${isContentLocked && !emailSubmitted ? "pointer-events-none" : ""}`}>
        <div className={isContentLocked && !emailSubmitted ? "blur-sm" : ""}>
          {/* Problem Statement */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Problem Statement</h2>
            <p className="text-muted-foreground">
              "I want to build a SaaS platform that provides AI-powered strategic UX analysis for startups and product teams."
            </p>
          </Card>

          {/* Analysis Parts */}
          <div className="space-y-4">
            {Object.entries(DEMO_ANALYSIS).map(([key, part]) => {
              const Icon = part.icon;
              const isExpanded = expandedSections[key];

              return (
                <Card key={key} className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full p-6 flex items-center justify-between hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold">{part.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Click to {isExpanded ? "collapse" : "expand"}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t">
                      <div className="prose prose-invert max-w-none mt-6">
                        <p className="text-muted-foreground">
                          {part.content}
                        </p>
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground italic">
                            This is a demo preview. Full analysis content would appear here after purchase.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <Card className="p-8 mt-8 text-center bg-gradient-to-br from-primary/10 to-purple-500/10">
            <h2 className="text-2xl font-bold mb-4">
              Get Your Own Strategic Analysis
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This is just a sample. Get a complete APEX analysis tailored to your specific problem statement with actionable insights and strategic recommendations.
            </p>
            <Button size="lg" onClick={() => window.location.href = "/#pricing"}>
              Start Your Analysis
            </Button>
          </Card>
        </div>

        {/* Locked overlay */}
        {isContentLocked && !emailSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="p-8 max-w-md pointer-events-auto">
              <h3 className="text-xl font-bold mb-4 text-center">
                Unlock Full Demo
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Enter your email to continue exploring the demo analysis
              </p>
              <Button 
                className="w-full" 
                onClick={() => setShowEmailGate(true)}
              >
                Continue Reading
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Email Gate Modal */}
      <SoftGateModal 
        isOpen={showEmailGate} 
        onClose={handleModalClose}
        onSubmit={handleEmailSubmit}
        onSkip={() => {
          setShowEmailGate(false);
          setIsContentLocked(true);
        }}
      />
    </div>
  );
}
