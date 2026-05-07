import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Upload, FileText, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const ATSCheckerPage = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
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
      toast.success("ATS check complete!");
    } catch (e: any) {
      toast.error(e.message || "ATS check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Shield className="h-3 w-3 mr-1 inline" />ATS Checker</Badge>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">ATS Compatibility Checker</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">Simulate how ATS software parses your resume and identify issues before applying.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-sm font-display font-semibold text-foreground mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Your Resume</h3>
              <Textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here..." className="bg-muted/30 border-border/50 rounded-xl h-48 text-sm resize-none" />
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-sm font-display font-semibold text-foreground mb-2 flex items-center gap-2"><Upload className="h-4 w-4 text-primary" />Job Description</h3>
              <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." className="bg-muted/30 border-border/50 rounded-xl h-48 text-sm resize-none" />
            </div>
            <Button onClick={handleCheck} disabled={loading} className="w-full glow-primary rounded-xl gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</> : <><Shield className="h-4 w-4" />Run ATS Check</>}
            </Button>
          </div>

          <div>
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 border-2 border-primary mb-3">
                    <span className="text-3xl font-display font-bold text-primary">{result.atsScore || 0}%</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">ATS Compatibility Score</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Keywords", value: `${result.keywordMatchRate || 0}%` },
                    { label: "Skills", value: `${result.skillsCoverage || 0}%` },
                    { label: "Readability", value: `${result.readabilityScore || 0}%` },
                  ].map(m => (
                    <div key={m.label} className="p-3 rounded-xl bg-muted/20 border border-border/30">
                      <p className="text-lg font-bold text-primary font-mono">{m.value}</p>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                {result.matchedKeywords?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-400" />Matched Keywords</h4>
                    <div className="flex flex-wrap gap-1">{result.matchedKeywords.map((k: string) => <Badge key={k} variant="secondary" className="text-[10px] bg-green-500/10 text-green-400">{k}</Badge>)}</div>
                  </div>
                )}

                {result.missingKeywords?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" />Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1">{result.missingKeywords.map((k: string) => <Badge key={k} variant="secondary" className="text-[10px] bg-red-500/10 text-red-400">{k}</Badge>)}</div>
                  </div>
                )}

                {result.suggestions?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-yellow-400" />Suggestions</h4>
                    <ul className="space-y-2">{result.suggestions.map((s: any, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2"><AlertTriangle className="h-3 w-3 text-yellow-400 mt-0.5 shrink-0" />{typeof s === "string" ? s : s.text || s.suggestion}</li>
                    ))}</ul>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">Paste your resume and job description, then click "Run ATS Check" to see your compatibility score.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSCheckerPage;
