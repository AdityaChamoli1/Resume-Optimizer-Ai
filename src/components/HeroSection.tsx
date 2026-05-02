import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const floatingChips = [
  "React", "Python", "SQL", "Agile", "AWS", "Leadership", "TypeScript", "Product Management",
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden mesh-gradient">
      {/* Floating keyword chips */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingChips.map((chip, i) => (
          <motion.span
            key={chip}
            className="absolute chip-matched text-xs opacity-20 font-mono"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 17) % 65}%`,
            }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {chip}
          </motion.span>
        ))}
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              AI-Powered Resume Optimization
            </span>
          </motion.div>

          <motion.h1
            className="text-hero font-display font-extrabold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Get Past ATS Filters.{" "}
            <span className="gradient-text">Land More Interviews.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Paste your resume + job description. AI optimizes in 60 seconds.
            Get an ATS score, keyword analysis, and a polished, recruiter-ready resume.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" className="glow-primary text-base px-8 gap-2" onClick={() => navigate("/optimizer")}>
              Optimize My Resume Free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 gap-2 border-border text-muted-foreground hover:text-foreground">
              <Play className="h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>

          <motion.p
            className="text-xs text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            No sign-up required • 3 free optimizations • Cancel anytime
          </motion.p>
        </div>

        {/* ATS Score preview */}
        <motion.div
          className="mt-16 max-w-2xl mx-auto glass-card p-6"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground font-medium">ATS Score Preview</span>
            <span className="text-xs font-mono text-muted-foreground">optimizeformai.com</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "ATS Score", value: "87", suffix: "/100", color: "text-success" },
              { label: "Keyword Match", value: "72", suffix: "%", color: "text-secondary" },
              { label: "Skills Coverage", value: "68", suffix: "%", color: "text-warning" },
              { label: "Readability", value: "91", suffix: "/100", color: "text-success" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                className="text-center p-3 rounded-xl bg-muted/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <p className={`text-2xl font-mono font-bold ${m.color}`}>
                  {m.value}<span className="text-sm text-muted-foreground">{m.suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {["React", "TypeScript", "Node.js", "AWS"].map(k => (
              <span key={k} className="chip-matched text-xs">{k}</span>
            ))}
            {["Kubernetes", "GraphQL"].map(k => (
              <span key={k} className="chip-missing text-xs">{k}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
