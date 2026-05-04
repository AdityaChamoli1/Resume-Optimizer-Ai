import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Brain, Loader2, Sparkles, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const roles = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer",
  "Mobile Developer", "Cloud Architect", "QA Engineer", "Data Analyst",
];

const experienceLevels = [
  { id: "junior", label: "Junior (0-2 yrs)" },
  { id: "mid", label: "Mid (2-5 yrs)" },
  { id: "senior", label: "Senior (5-10 yrs)" },
  { id: "lead", label: "Lead (10+ yrs)" },
];

interface Question {
  question: string;
  hint: string;
}

interface Questions {
  behavioral: Question[];
  technical: Question[];
  scenario: Question[];
}

const InterviewPrepPage = () => {
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [experience, setExperience] = useState("mid");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Questions | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    const selectedRole = customRole || role;
    if (!selectedRole) {
      toast.error("Please select or enter a role");
      return;
    }
    setLoading(true);
    setQuestions(null);
    setRevealedAnswers(new Set());
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: {
          action: "interview-questions",
          jobDescription: `Role: ${selectedRole}, Experience Level: ${experience}`,
          resumeText: `Candidate for ${selectedRole} position with ${experience} level experience.`,
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setQuestions(data);
      toast.success("Interview questions generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (key: string) => {
    const newSet = new Set(revealedAnswers);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setRevealedAnswers(newSet);
  };

  const renderQuestionSection = (title: string, qs: Question[], type: string) => (
    <div className="glass-card p-5 rounded-2xl">
      <h3 className="font-display font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${
          type === "behavioral" ? "bg-primary" : type === "technical" ? "bg-secondary" : "bg-warning"
        }`} />
        {title}
        <span className="text-xs text-muted-foreground font-mono ml-auto">{qs.length} questions</span>
      </h3>
      <div className="space-y-3">
        {qs.map((q, i) => {
          const key = `${type}-${i}`;
          const isRevealed = !practiceMode || revealedAnswers.has(key);
          return (
            <motion.div key={i} className="p-3 rounded-xl bg-muted/20 border border-white/[0.04]"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground font-medium flex-1">
                  <span className="text-xs text-muted-foreground font-mono mr-2">Q{i + 1}.</span>
                  {q.question}
                </p>
                {practiceMode && (
                  <Button variant="ghost" size="sm" onClick={() => toggleAnswer(key)} className="shrink-0 h-7 w-7 p-0 text-muted-foreground">
                    {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                )}
              </div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-white/[0.04] leading-relaxed">
                      💡 {q.hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-warning/20 to-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-warning" />
            </div>
            Interview Preparation
          </h1>
          <p className="text-muted-foreground text-sm">Generate role-specific interview questions with AI-powered answer hints.</p>
        </motion.div>

        {/* Config */}
        <div className="glass-card p-5 rounded-2xl mb-6 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Select Role</Label>
            <div className="flex flex-wrap gap-1.5">
              {roles.map(r => (
                <button key={r} onClick={() => { setRole(r); setCustomRole(""); }}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                    role === r && !customRole ? "border-primary/30 bg-primary/10 text-primary" : "border-white/[0.06] bg-muted/20 text-muted-foreground hover:border-primary/15"
                  }`}>
                  {r}
                </button>
              ))}
            </div>
            <Input value={customRole} onChange={e => setCustomRole(e.target.value)} placeholder="Or type a custom role..." className="mt-2 bg-muted/30 border-white/[0.06] rounded-xl h-9 text-sm" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Experience Level</Label>
            <div className="flex gap-2">
              {experienceLevels.map(l => (
                <button key={l.id} onClick={() => setExperience(l.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    experience === l.id ? "border-secondary/30 bg-secondary/10 text-secondary" : "border-white/[0.06] bg-muted/20 text-muted-foreground hover:border-secondary/15"
                  }`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={loading || (!role && !customRole)} className="glow-primary gap-2 rounded-xl h-10 flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate Questions
            </Button>
            {questions && (
              <Button variant="outline" onClick={() => { setPracticeMode(!practiceMode); setRevealedAnswers(new Set()); }} className="gap-2 rounded-xl h-10">
                {practiceMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {practiceMode ? "Show All" : "Practice Mode"}
              </Button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <p className="text-sm text-muted-foreground">Generating interview questions...</p>
          </div>
        )}

        {/* Results */}
        {questions && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {questions.behavioral?.length > 0 && renderQuestionSection("Behavioral Questions", questions.behavioral, "behavioral")}
            {questions.technical?.length > 0 && renderQuestionSection("Technical Questions", questions.technical, "technical")}
            {questions.scenario?.length > 0 && renderQuestionSection("Scenario Questions", questions.scenario, "scenario")}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepPage;
