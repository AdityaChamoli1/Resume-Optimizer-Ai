import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Zap, Upload, FileText, Loader2, ArrowRight, LogOut, LayoutDashboard,
  X, CheckCircle2, FileType, Sparkles, Brain, Search, BarChart3, FileCheck,
  Copy, Download, FileDown, Trash2,
} from "lucide-react";
import ATSScoreDashboard from "@/components/ATSScoreDashboard";
import OptimizedResumeView from "@/components/OptimizedResumeView";
import CoverLetterSection from "@/components/CoverLetterSection";

const loadingStages = [
  { icon: FileText, label: "Reading Resume", sublabel: "Parsing content..." },
  { icon: Brain, label: "Extracting Skills", sublabel: "Identifying competencies..." },
  { icon: Search, label: "Matching Keywords", sublabel: "Analyzing job description..." },
  { icon: BarChart3, label: "Calculating ATS Score", sublabel: "Running ATS simulation..." },
  { icon: FileCheck, label: "Generating Optimized Resume", sublabel: "Applying improvements..." },
];

const OptimizerPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [optimizationId, setOptimizationId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; size: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const state = location.state as any;
    if (state?.result) setResult(state.result);
  }, [location.state]);

  // Loading stage animation
  useEffect(() => {
    if (!loading) { setLoadingStage(0); return; }
    const interval = setInterval(() => {
      setLoadingStage((p) => (p < loadingStages.length - 1 ? p + 1 : p));
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  const processFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const supportedText = ["txt"];
    const supportedBinary = ["pdf", "docx", "doc"];
    const supportedImage = ["jpg", "jpeg", "png", "webp"];

    if (supportedText.includes(ext || "")) {
      const text = await file.text();
      setResumeText(text);
      setUploadedFile({ name: file.name, type: ext || "", size: file.size });
      toast.success("Resume text extracted!");
    } else if (supportedBinary.includes(ext || "") || supportedImage.includes(ext || "")) {
      // For PDF/DOCX/images, read as base64 and send to edge function for extraction
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const { data, error } = await supabase.functions.invoke("optimize-resume", {
            body: { action: "extract-text", fileBase64: base64, fileName: file.name, fileType: ext },
          });
          if (error) throw error;
          if (data?.text) {
            setResumeText(data.text);
            setUploadedFile({ name: file.name, type: ext || "", size: file.size });
            toast.success("Resume text extracted from file!");
          } else {
            toast.error("Could not extract text. Please paste your resume directly.");
          }
        } catch {
          // Fallback to text
          const text = await file.text();
          setResumeText(text);
          setUploadedFile({ name: file.name, type: ext || "", size: file.size });
          toast.info("Basic text extracted. For best results, paste your resume text.");
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Unsupported file format. Please use PDF, DOCX, TXT, JPG, or PNG.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

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

      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { jobDescription, resumeText, action: "optimize" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

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

      await supabase
        .from("profiles")
        .update({ optimizations_used: (await supabase.from("profiles").select("optimizations_used").eq("id", user!.id).single()).data?.optimizations_used! + 1 })
        .eq("id", user!.id);

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

  const handleGenerateCoverLetter = async (tone: string) => {
    if (!jobDescription || !resumeText) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: { jobDescription, resumeText, action: "cover-letter", tone },
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <Zap className="h-5 w-5 text-primary" />
            OptimizeForm AI
          </a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2 text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            /* AI Loading Animation */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto py-20"
            >
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6"
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-10 w-10 text-primary-foreground" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">AI is Analyzing Your Resume</h2>
                <p className="text-muted-foreground text-sm">This usually takes 15-30 seconds</p>
              </div>

              <div className="space-y-3">
                {loadingStages.map((stage, i) => {
                  const isActive = i === loadingStage;
                  const isDone = i < loadingStage;
                  return (
                    <motion.div
                      key={stage.label}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                        isDone ? "border-success/30 bg-success/5" :
                        isActive ? "border-primary/30 bg-primary/5" :
                        "border-border/30 bg-muted/20"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isDone ? "bg-success/20" : isActive ? "bg-primary/20" : "bg-muted/50"
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : isActive ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                            <stage.icon className="h-5 w-5 text-primary" />
                          </motion.div>
                        ) : (
                          <stage.icon className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDone ? "text-success" : isActive ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {stage.label}
                        </p>
                        <p className={`text-xs ${isDone ? "text-success/60" : isActive ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                          {isDone ? "Complete" : stage.sublabel}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : !result ? (
            /* Input Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                  Optimize Your Resume with <span className="gradient-text">AI</span>
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Paste your job description and resume to get an AI-powered ATS analysis with actionable improvements.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Job Description Panel */}
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <label className="text-sm font-semibold text-foreground">Job Description</label>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary" onClick={() => setJobDescription(sampleJD)}>
                      Paste Sample
                    </Button>
                  </div>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="h-72 bg-muted/30 border-white/[0.06] text-foreground resize-none rounded-xl focus:border-primary/30 transition-colors"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground font-mono">{jobDescription.length} chars</p>
                    {jobDescription.length >= 50 && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                  </div>
                </div>

                {/* Resume Panel */}
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-secondary" />
                      </div>
                      <label className="text-sm font-semibold text-foreground">Your Resume</label>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary" onClick={() => setResumeText(sampleResume)}>
                      Use Sample
                    </Button>
                  </div>

                  {/* Drag and drop zone */}
                  {!resumeText && !uploadedFile ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-72 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? "border-primary bg-primary/5 scale-[1.02]"
                          : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <motion.div
                        animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                        className="mb-4"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 mx-auto">
                          <Upload className="h-7 w-7 text-primary" />
                        </div>
                      </motion.div>
                      <p className="text-sm font-medium text-foreground mb-1">Drag & Drop Resume Here</p>
                      <p className="text-xs text-muted-foreground mb-3">or click to browse files</p>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {["PDF", "DOCX", "TXT", "JPG", "PNG"].map((fmt) => (
                          <span key={fmt} className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/50 text-muted-foreground border border-border/30">
                            .{fmt.toLowerCase()}
                          </span>
                        ))}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <>
                      {uploadedFile && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20 mb-3">
                          <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                            <FileType className="h-4 w-4 text-success" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)} • .{uploadedFile.type}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => { setUploadedFile(null); setResumeText(""); }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text..."
                        className={`${uploadedFile ? "h-56" : "h-72"} bg-muted/30 border-white/[0.06] text-foreground resize-none rounded-xl focus:border-secondary/30 transition-colors`}
                      />
                    </>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground font-mono">{resumeText.length} chars</p>
                    <div className="flex gap-2">
                      {!uploadedFile && resumeText && (
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-3 w-3" /> Upload instead
                        </Button>
                      )}
                      {resumeText.length >= 50 && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full glow-primary gap-3 text-base h-14 rounded-xl font-semibold relative overflow-hidden group"
                onClick={handleOptimize}
                disabled={loading || !jobDescription.trim() || !resumeText.trim()}
              >
                <Zap className="h-5 w-5" />
                Optimize My Resume
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold text-foreground">Optimization Results</h1>
                  <p className="text-muted-foreground text-sm mt-1">AI-powered analysis complete</p>
                </div>
                <Button variant="outline" onClick={() => { setResult(null); setOptimizationId(null); }} className="gap-2 rounded-xl">
                  <Sparkles className="h-4 w-4" /> New Optimization
                </Button>
              </div>

              <ATSScoreDashboard result={result} />

              <div className="grid lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 space-y-6">
                  <OptimizedResumeView result={result} />
                  {/* Cover Letter Section */}
                  <CoverLetterSection
                    coverLetter={result.coverLetter}
                    onGenerate={handleGenerateCoverLetter}
                    loading={loading}
                  />
                </div>
                <div className="space-y-4">
                  {/* AI Actions */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> AI Actions
                    </h3>
                    <div className="space-y-3">
                      <Button
                        className="w-full gap-2 rounded-xl"
                        variant="outline"
                        onClick={handleGenerateInterviewQuestions}
                        disabled={loading}
                      >
                        <FileText className="h-4 w-4" />
                        Interview Questions
                      </Button>
                    </div>
                  </div>

                  {/* Interview Questions */}
                  {result.interviewQuestions && (
                    <div className="glass-card p-6 rounded-2xl">
                      <h3 className="font-display font-semibold text-foreground mb-3">Interview Questions</h3>
                      {["behavioral", "technical", "scenario"].map((type) => {
                        const questions = result.interviewQuestions[type];
                        if (!questions?.length) return null;
                        return (
                          <div key={type} className="mb-4">
                            <h4 className="text-xs uppercase text-muted-foreground mb-2 font-semibold tracking-wider">{type}</h4>
                            {questions.map((q: any, i: number) => (
                              <div key={i} className="mb-3 p-3 rounded-lg bg-muted/30">
                                <p className="text-sm text-foreground font-medium">{q.question}</p>
                                <p className="text-xs text-muted-foreground mt-1">{q.hint}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Skill Gaps */}
                  {result.skillGaps?.length > 0 && (
                    <div className="glass-card p-6 rounded-2xl">
                      <h3 className="font-display font-semibold text-foreground mb-3">Skill Gaps</h3>
                      {result.skillGaps.map((gap: any, i: number) => (
                        <div key={i} className="mb-3 p-3 rounded-lg bg-muted/20">
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OptimizerPage;
