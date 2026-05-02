import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Zap, Plus, LogOut, FileText, TrendingUp, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Optimization {
  id: string;
  job_title: string | null;
  company: string | null;
  ats_score: number | null;
  keyword_match_rate: number | null;
  status: string;
  created_at: string;
}

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [{ data: opts }, { data: prof }] = await Promise.all([
      supabase
        .from("optimizations")
        .select("id, job_title, company, ats_score, keyword_match_rate, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),
    ]);

    setOptimizations(opts || []);
    setProfile(prof);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("optimizations").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setOptimizations((prev) => prev.filter((o) => o.id !== id));
      toast.success("Optimization deleted");
    }
  };

  const handleViewResult = async (id: string) => {
    const { data } = await supabase.from("optimizations").select("*").eq("id", id).single();
    if (data) {
      navigate("/optimizer", {
        state: {
          result: {
            atsScore: data.ats_score,
            keywordMatchRate: data.keyword_match_rate,
            skillsCoverage: data.skills_coverage,
            readabilityScore: data.readability_score,
            matchedKeywords: data.matched_keywords,
            missingKeywords: data.missing_keywords,
            optimizedResume: data.optimized_resume,
            suggestions: data.suggestions,
            coverLetter: data.cover_letter,
            interviewQuestions: data.interview_questions,
            skillGaps: data.skill_gaps,
          },
        },
      });
    }
  };

  const avgScore = optimizations.length > 0
    ? Math.round(optimizations.filter(o => o.ats_score).reduce((sum, o) => sum + (o.ats_score || 0), 0) / optimizations.filter(o => o.ats_score).length)
    : 0;

  const completed = optimizations.filter(o => o.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <Zap className="h-5 w-5 text-primary" />
            OptimizeForm AI
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              {profile?.plan === "free" ? "Free Plan" : `${profile?.plan} Plan`} • {profile?.optimizations_used || 0} optimizations used
            </p>
          </div>
          <Button onClick={() => navigate("/optimizer")} className="glow-primary gap-2">
            <Plus className="h-4 w-4" /> New Optimization
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Optimizations</span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">{completed}</p>
          </motion.div>

          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">Average ATS Score</span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">{avgScore}<span className="text-lg text-muted-foreground">/100</span></p>
          </motion.div>

          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Latest Activity</span>
            </div>
            <p className="text-lg font-medium text-foreground">
              {optimizations[0] ? format(new Date(optimizations[0].created_at), "MMM d, yyyy") : "No activity yet"}
            </p>
          </motion.div>
        </div>

        {/* History */}
        <div className="glass-card">
          <div className="p-6 border-b border-border">
            <h2 className="font-display font-bold text-foreground text-lg">Optimization History</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : optimizations.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No optimizations yet</p>
              <Button onClick={() => navigate("/optimizer")} className="gap-2">
                <Plus className="h-4 w-4" /> Start Your First Optimization
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {optimizations.map((opt, i) => (
                <motion.div
                  key={opt.id}
                  className="p-4 md:p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {opt.job_title || "Untitled"} {opt.company ? `at ${opt.company}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(opt.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    {opt.ats_score !== null && (
                      <div className="text-right hidden sm:block">
                        <p className={`text-lg font-mono font-bold ${
                          (opt.ats_score || 0) >= 80 ? "text-success" :
                          (opt.ats_score || 0) >= 50 ? "text-warning" : "text-destructive"
                        }`}>
                          {opt.ats_score}
                        </p>
                        <p className="text-xs text-muted-foreground">ATS Score</p>
                      </div>
                    )}

                    <span className={`text-xs px-2 py-1 rounded-full ${
                      opt.status === "completed" ? "bg-success/15 text-success" :
                      opt.status === "processing" ? "bg-warning/15 text-warning" :
                      opt.status === "failed" ? "chip-missing" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {opt.status}
                    </span>

                    <div className="flex gap-1">
                      {opt.status === "completed" && (
                        <Button size="sm" variant="ghost" onClick={() => handleViewResult(opt.id)} className="text-primary">
                          View
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(opt.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
