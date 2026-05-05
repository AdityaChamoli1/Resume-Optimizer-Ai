import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ATSGuidePage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-24 pb-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><BookOpen className="h-3 w-3 mr-1 inline" />ATS Guide</Badge>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">The Complete ATS Guide</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to know about Applicant Tracking Systems and how to beat them.</p>
      </motion.div>

      <div className="space-y-8">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-3">What is an ATS?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">An Applicant Tracking System (ATS) is software used by employers to filter and rank resumes before a human ever sees them. Over 98% of Fortune 500 companies use ATS software. If your resume isn't optimized for ATS, it may never reach a recruiter.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-400" />ATS-Friendly Best Practices</h2>
          <ul className="space-y-3">
            {["Use standard section headers (Experience, Education, Skills)", "Include keywords from the job description naturally", "Use a clean, single-column layout", "Save as PDF unless told otherwise", "Use standard fonts (Arial, Calibri, Times New Roman)", "Include both spelled-out and abbreviated terms (e.g., SEO / Search Engine Optimization)", "Use bullet points for achievements", "Include measurable results and numbers"].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-400" />Common ATS Mistakes</h2>
          <ul className="space-y-3">
            {["Using tables, text boxes, or columns", "Adding images, logos, or graphics", "Using creative fonts or colors", "Headers/footers with important info", "Submitting in unsupported formats", "Keyword stuffing (hidden white text)", "Using abbreviations without full terms"].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-400" />ATS Scoring Factors</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Keyword Match", pct: "40%", desc: "How well your keywords match the JD" },
              { label: "Skills Coverage", pct: "25%", desc: "Technical and soft skills alignment" },
              { label: "Formatting", pct: "20%", desc: "Clean structure and readability" },
              { label: "Experience Relevance", pct: "15%", desc: "How relevant your experience is" },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">{f.label}</span>
                  <span className="text-sm font-mono text-primary">{f.pct}</span>
                </div>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default ATSGuidePage;
