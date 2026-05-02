import { motion } from "framer-motion";
import { Target, BarChart3, PenTool, FileDown, MessageSquare, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Score Calculator",
    description: "Get a 0–100 ATS compatibility score with section-by-section breakdown.",
  },
  {
    icon: BarChart3,
    title: "Keyword Gap Analysis",
    description: "See which critical JD keywords are missing from your resume instantly.",
  },
  {
    icon: PenTool,
    title: "AI Resume Rewriter",
    description: "Full AI-powered rewrite with action verbs, metrics, and keyword integration.",
  },
  {
    icon: FileDown,
    title: "PDF & DOCX Export",
    description: "Download polished, ATS-safe resumes in multiple formats with one click.",
  },
  {
    icon: MessageSquare,
    title: "Cover Letter Generator",
    description: "Auto-generate tailored cover letters matched to each job description.",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Heatmap",
    description: "Visual heatmap showing your skills vs. job requirements with learning paths.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 mesh-gradient">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Beat ATS</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            AI-powered tools that do what a professional resume consultant does — in seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card p-6 group hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
