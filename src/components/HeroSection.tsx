import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, Shield, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const keywords = [
  "React", "Python", "TypeScript", "AWS", "SQL", "Leadership",
  "Product Management", "Docker", "GraphQL", "Kubernetes", "Agile",
  "Machine Learning", "CI/CD", "Node.js", "Figma",
];

const rotatingStats = [
  { label: "ATS Score", value: 94, suffix: "/100", color: "text-success" },
  { label: "Keyword Match", value: 87, suffix: "%", color: "text-secondary" },
  { label: "Readability", value: 96, suffix: "/100", color: "text-primary" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeKeyword, setActiveKeyword] = useState(0);
  const [scoreValue, setScoreValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveKeyword((p) => (p + 1) % keywords.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 2000;
    const target = 94;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setScoreValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Aurora orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[150px]" />

      {/* Floating keyword particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {keywords.slice(0, 10).map((kw, i) => (
          <motion.div
            key={kw}
            className="absolute"
            style={{
              left: `${5 + (i * 11) % 90}%`,
              top: `${10 + (i * 13) % 75}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="px-3 py-1 rounded-full text-xs font-mono border border-primary/10 bg-primary/5 text-primary/30">
              {kw}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Resume Optimization
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              </span>
            </motion.div>

            <motion.h1
              className="text-hero-xl font-display font-extrabold text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Beat ATS Systems.{" "}
              <span className="gradient-text">Land More Interviews.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Optimize your resume with AI-powered ATS analysis, keyword matching,
              recruiter scoring, and instant PDF resume generation.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="glow-primary text-base px-8 gap-2 h-12 rounded-xl font-semibold relative overflow-hidden group"
                onClick={() => navigate("/optimizer")}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Optimize Resume <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 gap-2 h-12 rounded-xl border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              className="flex items-center gap-6 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: Shield, text: "No sign-up required" },
                { icon: Zap, text: "3 free optimizations" },
                { icon: TrendingUp, text: "92% success rate" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <t.icon className="h-3.5 w-3.5 text-primary/60" />
                  <span>{t.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Animated ATS preview card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-[80px] rounded-3xl" />
            
            <div className="relative glass-card p-8 rounded-3xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">ATS Analysis</p>
                    <p className="text-xs text-muted-foreground">Real-time scoring</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Live
                </span>
              </div>

              {/* Main score */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="4" className="stroke-muted" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      fill="none" strokeWidth="4" strokeLinecap="round"
                      className="stroke-primary"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.94) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-mono font-bold text-foreground">{scoreValue}</span>
                    <span className="text-xs text-muted-foreground">ATS Score</span>
                  </div>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {rotatingStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-3 rounded-xl bg-muted/40 border border-white/[0.04]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                  >
                    <p className={`text-xl font-mono font-bold ${stat.color}`}>
                      {stat.value}<span className="text-xs text-muted-foreground">{stat.suffix}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Animated keyword chips */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Detected Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "Node.js", "AWS"].map((kw, i) => (
                    <motion.span
                      key={kw}
                      className="chip-matched text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                    >
                      {kw}
                    </motion.span>
                  ))}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeKeyword}
                      className="chip-matched text-xs"
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {keywords[activeKeyword]}
                    </motion.span>
                  </AnimatePresence>
                  {["Kubernetes", "GraphQL"].map((kw, i) => (
                    <motion.span
                      key={kw}
                      className="chip-missing text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.9 + i * 0.1 }}
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
