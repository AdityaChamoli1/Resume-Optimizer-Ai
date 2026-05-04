import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const keywords = ["React", "Python", "TypeScript", "AWS", "SQL", "Leadership", "Docker", "GraphQL", "Kubernetes", "Agile", "ML", "CI/CD"];

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeKeyword, setActiveKeyword] = useState(0);
  const [scoreValue, setScoreValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveKeyword((p) => (p + 1) % keywords.length), 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let frame: number;
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 2000, 1);
      setScoreValue(Math.round(progress * 94));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
                <Sparkles className="h-3 w-3" />
                AI-Powered Career Tools
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-foreground mb-5 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Beat ATS Systems.{" "}
              <span className="gradient-text">Land Interviews.</span>
            </motion.h1>

            <motion.p
              className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Optimize your resume, generate cover letters, prepare for interviews, and build LinkedIn posts — all powered by AI.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="glow-primary text-sm px-6 gap-2 h-11 rounded-xl font-semibold group"
                onClick={() => navigate("/optimizer")}
              >
                Optimize Resume <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm px-6 gap-2 h-11 rounded-xl border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                onClick={() => navigate("/resume-builder")}
              >
                Build Resume
              </Button>
            </motion.div>

            <motion.div className="flex items-center gap-5 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {[
                { icon: Shield, text: "No signup required" },
                { icon: Zap, text: "3 free optimizations" },
                { icon: TrendingUp, text: "92% success rate" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <t.icon className="h-3 w-3 text-primary/60" />
                  <span>{t.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: ATS Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15 blur-[60px] rounded-3xl" />
            <div className="relative glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">ATS Analysis</p>
                    <p className="text-[10px] text-muted-foreground">Real-time scoring</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Live
                </span>
              </div>

              {/* Score Ring */}
              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="3" className="stroke-muted/50" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" strokeWidth="3" strokeLinecap="round"
                      className="stroke-primary"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.94) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-foreground">{scoreValue}</span>
                    <span className="text-[10px] text-muted-foreground">ATS Score</span>
                  </div>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Keywords", value: "87%", color: "text-secondary" },
                  { label: "Skills", value: "91%", color: "text-primary" },
                  { label: "Readability", value: "96", color: "text-success" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="text-center p-2.5 rounded-xl bg-muted/30 border border-white/[0.04]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <p className={`text-lg font-mono font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Keywords */}
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Detected Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {["React", "TypeScript", "Node.js", "AWS"].map((kw, i) => (
                    <motion.span key={kw} className="chip-matched text-[10px] px-2 py-0.5"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 + i * 0.08 }}>
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5 inline" />{kw}
                    </motion.span>
                  ))}
                  <AnimatePresence mode="wait">
                    <motion.span key={activeKeyword} className="chip-matched text-[10px] px-2 py-0.5"
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                      {keywords[activeKeyword]}
                    </motion.span>
                  </AnimatePresence>
                  {["Kubernetes", "GraphQL"].map((kw) => (
                    <span key={kw} className="chip-missing text-[10px] px-2 py-0.5">{kw}</span>
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
