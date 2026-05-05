import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Target, FileText, Loader2, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const JobMatchPage = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please provide both resume and job description");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { action: "optimize", resumeText: resumeText.trim(), jobDescription: jobDescription.trim() },
      });
      if (error) throw error;
      setResult(data);
      toast.success("Job match analysis complete!");
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Target className="h-3 w-3 mr-1 inline" />AI Job Match</Badge>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">AI Job Match Analyzer</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">See how well your resume matches a specific job and get AI-powered improvement suggestions.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-sm font-display font-semibold text-foreground mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Your Resume</h3>
              <Textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume..." className="bg-muted/30 border-border/50 rounded-xl h-48 text-sm resize-none" />
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-sm font-display font-semibold text-foreground mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-primary" />Target Job Description</h3>
              <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description..." className="bg-muted/30 border-border/50 rounded-xl h-48 text-sm resize-none" />
            </div>
            <Button onClick={handleMatch} disabled={loading} className="w-full glow-primary rounded-xl gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</> : <><TrendingUp className="h-4 w-4" />Analyze Match</>}
            </Button>
          </div>

          <div>
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-28 w-28 rounded-full border-4 border-primary/30 mb-3 relative">
                    <svg className="absolute inset-0" viewBox="0 0 112 112"><circle cx="56" cy="56" r="52" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray={`${(result.ats_score || 0) * 3.27} 327`} strokeLinecap="round" transform="rotate(-90 56 56)" opacity="0.8" /></svg>
                    <span className="text-3xl font-display font-bold text-primary">{result.ats_score || 0}%</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Overall Match Score</p>
                  <p className="text-xs text-muted-foreground mt-1">{(result.ats_score || 0) >= 75 ? "Great match! Your resume aligns well." : (result.ats_score || 0) >= 50 ? "Good match with room for improvement." : "Low match — consider optimizing your resume."}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[{ l: "Keywords", v: result.keyword_match_rate }, { l: "Skills", v: result.skills_coverage }, { l: "Readability", v: result.readability_score }].map(m => (
                    <div key={m.l} className="p-3 rounded-xl bg-muted/20 border border-border/30">
                      <p className="text-lg font-bold text-primary font-mono">{m.v || 0}%</p>
                      <p className="text-[10px] text-muted-foreground">{m.l}</p>
                    </div>
                  ))}
                </div>

                {result.matched_keywords?.length > 0 && (
                  <div><h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-400" />Skills You Have</h4>
                  <div className="flex flex-wrap gap-1">{result.matched_keywords.map((k: string) => <Badge key={k} variant="secondary" className="text-[10px] bg-green-500/10 text-green-400">{k}</Badge>)}</div></div>
                )}

                {result.missing_keywords?.length > 0 && (
                  <div><h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" />Skills to Add</h4>
                  <div className="flex flex-wrap gap-1">{result.missing_keywords.map((k: string) => <Badge key={k} variant="secondary" className="text-[10px] bg-red-500/10 text-red-400">{k}</Badge>)}</div></div>
                )}

                {result.skill_gaps && (
                  <div><h4 className="text-xs font-semibold text-foreground mb-2">Skill Gap Analysis</h4>
                  <p className="text-xs text-muted-foreground">{typeof result.skill_gaps === "string" ? result.skill_gaps : JSON.stringify(result.skill_gaps)}</p></div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                <Target className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">Paste your resume and job description to see how well they match.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchPage;
