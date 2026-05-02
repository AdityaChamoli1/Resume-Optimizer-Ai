import { motion } from "framer-motion";
import { FileText, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Paste Your Inputs",
    description: "Paste or upload your resume and the job description you're targeting.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes & Optimizes",
    description: "Our AI scores your resume, finds keyword gaps, and rewrites it for maximum ATS compatibility.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download & Apply",
    description: "Get your polished, recruiter-ready resume in PDF or DOCX — optimized in under 60 seconds.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three simple steps to a resume that gets interviews.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              className="glass-card p-8 text-center relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <span className="absolute top-4 right-4 text-xs font-mono text-muted-foreground/40">
                {s.step}
              </span>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:glow-primary transition-shadow">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
