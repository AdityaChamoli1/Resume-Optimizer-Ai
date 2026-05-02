import { motion } from "framer-motion";

interface ATSScoreDashboardProps {
  result: any;
}

const ScoreRing = ({ score, label, color }: { score: number; label: string; color: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "text-success";
    if (s >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="6" className="stroke-muted" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none" strokeWidth="6" strokeLinecap="round"
            className={`${color || getColor(score)}`}
            style={{ stroke: "currentColor" }}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-xl font-mono font-bold ${getColor(score)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">{label}</p>
    </div>
  );
};

const ATSScoreDashboard = ({ result }: ATSScoreDashboardProps) => {
  return (
    <div className="glass-card p-6">
      <h2 className="font-display font-bold text-foreground text-xl mb-6">ATS Score Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <ScoreRing score={result.atsScore || 0} label="Overall ATS Score" color="" />
        <ScoreRing score={result.keywordMatchRate || 0} label="Keyword Match" color="" />
        <ScoreRing score={result.skillsCoverage || 0} label="Skills Coverage" color="" />
        <ScoreRing score={result.readabilityScore || 0} label="Readability" color="" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Matched Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords?.map((kw: string) => (
              <span key={kw} className="chip-matched text-xs">{kw}</span>
            ))}
            {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
              <span className="text-xs text-muted-foreground">None detected</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords?.map((kw: string) => (
              <span key={kw} className="chip-missing text-xs">{kw}</span>
            ))}
            {(!result.missingKeywords || result.missingKeywords.length === 0) && (
              <span className="text-xs text-muted-foreground">None — great coverage!</span>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Improvement Suggestions</h3>
          <div className="space-y-2">
            {result.suggestions.map((s: any, i: number) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                  s.severity === "high" ? "chip-missing" :
                  s.severity === "medium" ? "bg-warning/15 text-warning border border-warning/30" :
                  "bg-muted text-muted-foreground border border-border"
                }`}>
                  {s.severity}
                </span>
                <p className="text-sm text-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScoreDashboard;
