import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const examples = [
  { role: "Software Engineer", level: "Mid-Level", industry: "Tech", score: 92, highlights: ["Action verbs", "Quantified achievements", "Keywords optimized"] },
  { role: "Product Manager", level: "Senior", industry: "SaaS", score: 88, highlights: ["Leadership metrics", "Revenue impact", "Cross-functional projects"] },
  { role: "Data Scientist", level: "Entry-Level", industry: "AI/ML", score: 85, highlights: ["Technical skills section", "Research publications", "Relevant projects"] },
  { role: "UX Designer", level: "Mid-Level", industry: "Design", score: 90, highlights: ["Portfolio links", "Design tools listed", "User research metrics"] },
  { role: "Marketing Manager", level: "Senior", industry: "Marketing", score: 87, highlights: ["Campaign ROI metrics", "Team leadership", "Budget management"] },
  { role: "DevOps Engineer", level: "Mid-Level", industry: "Cloud", score: 91, highlights: ["Certifications listed", "Infrastructure metrics", "Tool proficiency"] },
  { role: "Sales Representative", level: "Entry-Level", industry: "B2B", score: 83, highlights: ["Revenue targets met", "Client acquisition", "CRM proficiency"] },
  { role: "Project Manager", level: "Senior", industry: "Enterprise", score: 89, highlights: ["PMP certified", "Budget optimization", "Agile methodology"] },
];

const ResumeExamplesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Examples</Badge>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Resume Examples</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">See what high-scoring, ATS-optimized resumes look like across different industries.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {examples.map((ex, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="text-[10px]">{ex.industry}</Badge>
                <div className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 text-primary" /><span className="text-primary font-mono font-bold">{ex.score}</span></div>
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm mb-0.5">{ex.role}</h3>
              <p className="text-[11px] text-muted-foreground mb-3">{ex.level}</p>
              <div className="space-y-1 mb-4">
                {ex.highlights.map((h, j) => (
                  <p key={j} className="text-[10px] text-muted-foreground flex items-center gap-1"><ArrowRight className="h-2.5 w-2.5 text-primary" />{h}</p>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs gap-1" onClick={() => navigate("/resume-builder")}>
                <FileText className="h-3 w-3" />Use as Template
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResumeExamplesPage;
