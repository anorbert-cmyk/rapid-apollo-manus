import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  History as HistoryIcon, 
  CheckCircle2, 
  Clock, 
  Loader2,
  ArrowRight,
  Star,
  Plus,
  FileText,
  Zap
} from "lucide-react";
import { NewAnalysisModal } from "@/components/NewAnalysisModal";

const TIER_INFO: Record<string, { name: string; color: string; bgColor: string; borderColor: string; icon: string }> = {
  standard: { name: "Observer", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30", icon: "👁️" },
  medium: { name: "Insider", color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30", icon: "🔮" },
  full: { name: "Syndicate", color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/30", icon: "⚡" },
};

const STATUS_INFO: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Completed", color: "text-emerald-400", icon: CheckCircle2 },
  processing: { label: "Processing", color: "text-cyan-400", icon: Loader2 },
  pending_payment: { label: "Pending Payment", color: "text-yellow-400", icon: Clock },
  failed: { label: "Failed", color: "text-red-400", icon: Clock },
};

export default function History() {
  const [, navigate] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const { data: analyses, isLoading, refetch } = trpc.session.getMyAnalyses.useQuery();
  
  // Get active analysis from localStorage or use latest
  useState(() => {
    const stored = localStorage.getItem("activeAnalysisId");
    if (stored) {
      setActiveSessionId(stored);
    } else if (analyses && analyses.length > 0) {
      const latest = analyses[0];
      setActiveSessionId(latest.sessionId);
      localStorage.setItem("activeAnalysisId", latest.sessionId);
    }
  });

  const handleMakeActive = (sessionId: string) => {
    setActiveSessionId(sessionId);
    localStorage.setItem("activeAnalysisId", sessionId);
    toast.success("Analysis set as active", {
      description: "This analysis is now loaded in the Output view."
    });
  };

  const handleViewAnalysis = (sessionId: string) => {
    // Make it active and navigate
    handleMakeActive(sessionId);
    navigate(`/analysis/${sessionId}`);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HistoryIcon className="h-6 w-6 text-primary" />
              Analysis History
            </h1>
            <h2 className="text-sm text-muted-foreground mt-1">
              View and manage your past analyses
            </h2>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Analyses List */}
        {!analyses || analyses.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No analyses yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start your first strategic analysis to see it here.
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Analysis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => {
              const tierInfo = TIER_INFO[analysis.tier] || TIER_INFO.standard;
              const statusInfo = STATUS_INFO[analysis.status] || STATUS_INFO.pending_payment;
              const StatusIcon = statusInfo.icon;
              const isActive = activeSessionId === analysis.sessionId;
              
              return (
                <Card 
                  key={analysis.sessionId}
                  className={`glass-panel transition-all hover:border-primary/30 ${
                    isActive ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Left: Tier & Status */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl ${tierInfo.bgColor} ${tierInfo.borderColor} border flex items-center justify-center text-2xl flex-shrink-0`}>
                          {tierInfo.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierInfo.bgColor} ${tierInfo.borderColor} border ${tierInfo.color}`}>
                              {tierInfo.name}
                            </span>
                            <span className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
                              <StatusIcon className={`h-3 w-3 ${analysis.status === "processing" ? "animate-spin" : ""}`} />
                              {statusInfo.label}
                            </span>
                            {isActive && (
                              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                                <Star className="h-3 w-3 mr-1 fill-primary" />
                                Active
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm line-clamp-2 mb-2">
                            {analysis.problemStatement}
                          </p>
                          
                          <p className="text-xs text-muted-foreground">
                            Created: {formatDate(analysis.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {analysis.status === "completed" && !isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMakeActive(analysis.sessionId)}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Make Active
                          </Button>
                        )}
                        
                        {analysis.status === "completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleViewAnalysis(analysis.sessionId)}
                            className={isActive ? "bg-primary" : ""}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            View Analysis
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                        
                        {analysis.status === "processing" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/analysis/${analysis.sessionId}`)}
                          >
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            View Progress
                          </Button>
                        )}
                        
                        {analysis.status === "pending_payment" && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/checkout/${analysis.sessionId}`)}
                          >
                            Complete Payment
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* New Analysis Modal */}
      <NewAnalysisModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={(sessionId: string) => {
          refetch();
          navigate(`/checkout/${sessionId}`);
        }}
      />
    </DashboardLayout>
  );
}
