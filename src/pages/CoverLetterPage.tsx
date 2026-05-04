import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Copy, Loader2, Sparkles, CheckCircle2, FileDown, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const tones = [
  { id: "professional", label: "Professional" },
  { id: "formal", label: "Formal" },
  { id: "friendly", label: "Friendly" },
  { id: "corporate", label: "Corporate" },
];

const CoverLetterPage = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.error("Please provide both job description and resume");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { action: "cover-letter", jobDescription, resumeText, tone },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setCoverLetter(data.coverLetter || "");
      toast.success("Cover letter generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTXT = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
              <Mail className="h-5 w-5 text-secondary" />
            </div>
            Cover Letter Generator
          </h1>
          <p className="text-muted-foreground text-sm">Generate a personalized cover letter tailored to the job description.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Job Description</Label>
                <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl text-sm h-40 resize-none" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Your Resume</Label>
                <Textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here..." className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl text-sm h-40 resize-none" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Tone</Label>
                <div className="flex gap-2 flex-wrap">
                  {tones.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        tone === t.id ? "border-primary/30 bg-primary/10 text-primary" : "border-white/[0.06] bg-muted/20 text-muted-foreground hover:border-primary/15"
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full glow-primary gap-2 rounded-xl h-10">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Cover Letter
              </Button>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground text-sm">Generated Cover Letter</h3>
              {coverLetter && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs gap-1 text-primary">
                    {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownloadTXT} className="text-xs gap-1 text-secondary">
                    <Download className="h-3 w-3" /> TXT
                  </Button>
                </div>
              )}
            </div>
            {coverLetter ? (
              <div className="bg-muted/20 rounded-xl p-4 border border-white/[0.04] text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[65vh] overflow-auto">
                {coverLetter}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <Mail className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">Your cover letter will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
