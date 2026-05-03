import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Zap, Upload, FileText, Loader2, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import ATSScoreDashboard from "@/components/ATSScoreDashboard";
import OptimizedResumeView from "@/components/OptimizedResumeView";

const OptimizerPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [optimizationId, setOptimizationId] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as any;
    if (state?.result) {
      setResult(state.result);
    }
  }, [location.state]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    // Read as text for .txt files, otherwise notify
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      setResumeText(text);
      toast.success("Resume text extracted!");
    } else {
      // For PDF/DOCX, read as text (basic extraction)
      const text = await file.text();
      setResumeText(text);
      toast.success("File loaded! For best results, paste your resume text directly.");
    }
  };

  const handleOptimize = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.error("Please provide both a job description and resume");
      return;
    }
    if (jobDescription.trim().length < 50) {
      toast.error("Job description seems too short. Please provide more detail.");
      return;
    }
    if (resumeText.trim().length < 50) {
      toast.error("Resume seems too short. Please provide more detail.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Create optimization record
      const { data: opt, error: insertErr } = await supabase
        .from("optimizations")
        .insert({
          user_id: user!.id,
          job_description: jobDescription,
          original_resume: resumeText,
          status: "processing",
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      setOptimizationId(opt.id);

      // Call AI
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { jobDescription, resumeText, action: "optimize" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Update optimization with results
      await supabase
        .from("optimizations")
        .update({
          status: "completed",
          ats_score: data.atsScore,
          keyword_match_rate: data.keywordMatchRate,
          skills_coverage: data.skillsCoverage,
          readability_score: data.readabilityScore,
          matched_keywords: data.matchedKeywords,
          missing_keywords: data.missingKeywords,
          optimized_resume: data.optimizedResume,
          suggestions: data.suggestions,
          skill_gaps: data.skillGaps,
          job_title: data.jobTitle,
          company: data.company,
        })
        .eq("id", opt.id);

      // Increment usage
      await supabase
        .from("profiles")
        .update({ optimizations_used: (await supabase.from("profiles").select("optimizations_used").eq("id", user!.id).single()).data?.optimizations_used! + 1 })
        .eq("id", user!.id)
        .then(() => {});

      setResult(data);
      toast.success("Resume optimized successfully!");
    } catch (err: any) {
      toast.error(err.message || "Optimization failed. Please try again.");
      if (optimizationId) {
        await supabase.from("optimizations").update({ status: "failed" }).eq("id", optimizationId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription || !resumeText) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { jobDescription, resumeText, action: "cover-letter" },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (optimizationId) {
        await supabase.from("optimizations").update({ cover_letter: data.coverLetter }).eq("id", optimizationId);
      }
      setResult((prev: any) => ({ ...prev, coverLetter: data.coverLetter }));
      toast.success("Cover letter generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInterviewQuestions = async () => {
    if (!jobDescription || !resumeText) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { jobDescription, resumeText, action: "interview-questions" },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (optimizationId) {
        await supabase.from("optimizations").update({ interview_questions: data }).eq("id", optimizationId);
      }
      setResult((prev: any) => ({ ...prev, interviewQuestions: data }));
      toast.success("Interview questions generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const sampleJD = `We are looking for a Senior Frontend Developer with 3+ years of experience in React, TypeScript, and modern web technologies. You will be responsible for building user-facing features, optimizing performance, and collaborating with cross-functional teams.

Requirements:
- Proficiency in React, TypeScript, HTML, CSS
- Experience with Next.js, Redux/Zustand, REST APIs
- Strong understanding of responsive design and accessibility
- Experience with Git, CI/CD pipelines
- Knowledge of testing frameworks (Jest, Cypress)
- Excellent problem-solving and communication skills

Nice to have:
- Experience with GraphQL, AWS, Docker
- Familiarity with design systems and Figma
- Prior experience in SaaS products`;

  const sampleResume = `John Doe
Full Stack Developer | john@email.com | +91 9876543210

SUMMARY
Passionate software developer with 4 years of experience building web applications.

EXPERIENCE
Frontend Developer - TechCorp (2022-Present)
- Developed user interfaces using React
- Worked on REST API integrations
- Participated in code reviews

Junior Developer - StartupXYZ (2020-2022)
- Built web pages using HTML, CSS, JavaScript
- Helped with bug fixes and testing
- Learned React and Node.js

EDUCATION
B.Tech Computer Science - XYZ University (2020)

SKILLS
JavaScript, React, HTML, CSS, Node.js, Git, MongoDB

PROJECTS
- E-commerce website using MERN stack
- Todo app with React and Firebase`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <Zap className="h-5 w-5 text-primary" />
            OptimizeForm AI
          </a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2 text-muted-foreground">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {!result ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Optimize Your Resume</h1>
            <p className="text-muted-foreground mb-8">Paste your job description and resume to get an AI-powered ATS analysis.</p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Job Description</label>
                  <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setJobDescription(sampleJD)}>
                    Paste Sample
                  </Button>
                </div>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="h-72 bg-muted border-border text-foreground resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{jobDescription.length} characters</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Your Resume</label>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setResumeText(sampleResume)}>
                      Use Sample
                    </Button>
                    <label className="cursor-pointer">
                      <Button variant="ghost" size="sm" className="text-xs text-secondary gap-1 pointer-events-none">
                        <Upload className="h-3 w-3" /> Upload
                      </Button>
                      <input type="file" accept=".txt,.pdf,.docx" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text or upload a file..."
                  className="h-72 bg-muted border-border text-foreground resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{resumeText.length} characters</p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full glow-primary gap-2 text-base"
              onClick={handleOptimize}
              disabled={loading || !jobDescription.trim() || !resumeText.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing with AI... This may take up to 30 seconds
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Optimize My Resume
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground">Optimization Results</h1>
              <Button variant="outline" onClick={() => { setResult(null); setOptimizationId(null); }}>
                New Optimization
              </Button>
            </div>

            <ATSScoreDashboard result={result} />

            <div className="grid lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <OptimizedResumeView result={result} />
              </div>
              <div className="space-y-4">
                {/* Actions */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">AI Actions</h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full gap-2"
                      variant="outline"
                      onClick={handleGenerateCoverLetter}
                      disabled={loading}
                    >
                      <FileText className="h-4 w-4" />
                      Generate Cover Letter
                    </Button>
                    <Button
                      className="w-full gap-2"
                      variant="outline"
                      onClick={handleGenerateInterviewQuestions}
                      disabled={loading}
                    >
                      <FileText className="h-4 w-4" />
                      Interview Questions
                    </Button>
                  </div>
                </div>

                {/* Cover Letter */}
                {result.coverLetter && (
                  <div className="glass-card p-6">
                    <h3 className="font-display font-semibold text-foreground mb-3">Cover Letter</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{result.coverLetter}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-3 text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(result.coverLetter);
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}

                {/* Interview Questions */}
                {result.interviewQuestions && (
                  <div className="glass-card p-6">
                    <h3 className="font-display font-semibold text-foreground mb-3">Interview Questions</h3>
                    {["behavioral", "technical", "scenario"].map((type) => {
                      const questions = result.interviewQuestions[type];
                      if (!questions?.length) return null;
                      return (
                        <div key={type} className="mb-4">
                          <h4 className="text-xs uppercase text-muted-foreground mb-2 font-semibold">{type}</h4>
                          {questions.map((q: any, i: number) => (
                            <div key={i} className="mb-2">
                              <p className="text-sm text-foreground font-medium">{q.question}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{q.hint}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Skill Gaps */}
                {result.skillGaps?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-display font-semibold text-foreground mb-3">Skill Gaps</h3>
                    {result.skillGaps.map((gap: any, i: number) => (
                      <div key={i} className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            gap.importance === "critical" ? "chip-missing" : "bg-warning/15 text-warning border border-warning/30"
                          }`}>
                            {gap.importance}
                          </span>
                          <span className="text-sm font-medium text-foreground">{gap.skill}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{gap.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OptimizerPage;
