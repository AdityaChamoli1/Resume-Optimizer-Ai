import { motion } from "framer-motion";
import { TrendingUp, Target, BookOpen, Lightbulb } from "lucide-react";

interface ATSScoreDashboardProps {
  result: any;
}

const ScoreRing = ({ score, label, icon: Icon, delay = 0 }: { score: number; label: string; icon: any; delay?: number }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "hsl(145, 63%, 49%)", text: "text-success", bg: "bg-success/10" };
    if (s >= 50) return { stroke: "hsl(38, 100%, 60%)", text: "text-warning", bg: "bg-warning/10" };
    return { stroke: "hsl(348, 100%, 65%)", text: "text-destructive", bg: "bg-destructive/10" };
  };

  const colors = getColor(score);

  return (
    <motion.div
      className="glass-card-hover p-6 rounded-2xl flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="relative w-28 h-28 mb-3">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="5" className="stroke-muted/50" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none" strokeWidth="5" strokeLinecap="round"
            stroke={colors.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-2xl font-mono font-bold ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

const ATSScoreDashboard = ({ result }: ATSScoreDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Score Rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreRing score={result.atsScore || 0} label="ATS Score" icon={Target} delay={0} />
        <ScoreRing score={result.keywordMatchRate || 0} label="Keyword Match" icon={TrendingUp} delay={0.1} />
        <ScoreRing score={result.skillsCoverage || 0} label="Skills Coverage" icon={Lightbulb} delay={0.2} />
        <ScoreRing score={result.readabilityScore || 0} label="Readability" icon={BookOpen} delay={0.3} />
      </div>

      {/* Keywords + Suggestions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Keywords */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Matched Keywords
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {result.matchedKeywords?.map((kw: string, i: number) => (
              <motion.span
                key={kw}
                className="chip-matched text-xs"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {kw}
              </motion.span>
            ))}
            {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
              <span className="text-xs text-muted-foreground">None detected</span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords?.map((kw: string, i: number) => (
              <motion.span
                key={kw}
                className="chip-missing text-xs"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {kw}
              </motion.span>
            ))}
            {(!result.missingKeywords || result.missingKeywords.length === 0) && (
              <span className="text-xs text-muted-foreground">Great coverage!</span>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold text-foreground mb-4">Improvement Suggestions</h3>
          {result.suggestions?.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {result.suggestions.map((s: any, i: number) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-white/[0.04]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 mt-0.5 font-semibold uppercase tracking-wider ${
                    s.severity === "high" ? "bg-destructive/15 text-destructive border border-destructive/20" :
                    s.severity === "medium" ? "bg-warning/15 text-warning border border-warning/20" :
                    "bg-muted text-muted-foreground border border-border/30"
                  }`}>
                    {s.severity}
                  </span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{s.text}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No suggestions — your resume looks great!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSScoreDashboard;
