import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bug, Zap, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const entries = [
  { version: "2.5.0", date: "May 5, 2026", items: [
    { type: "feature", icon: Sparkles, text: "Portfolio Builder — create and share public developer portfolios" },
    { type: "feature", icon: Sparkles, text: "ATS Checker — advanced ATS simulation with recruiter preview" },
    { type: "feature", icon: Sparkles, text: "AI Job Match Analyzer — compare resume against any job description" },
    { type: "improvement", icon: Zap, text: "Resume Builder upgraded with education date pickers and drag-and-drop" },
  ]},
  { version: "2.0.0", date: "May 2, 2026", items: [
    { type: "feature", icon: Sparkles, text: "Premium UI redesign with glassmorphism and Framer Motion" },
    { type: "feature", icon: Sparkles, text: "AI-powered cover letter generator with tone customization" },
    { type: "feature", icon: Sparkles, text: "Interview preparation module with AI-generated questions" },
    { type: "security", icon: Shield, text: "Enhanced authentication with password reset flow" },
  ]},
  { version: "1.0.0", date: "May 1, 2026", items: [
    { type: "feature", icon: Sparkles, text: "Initial launch with AI resume optimization" },
    { type: "feature", icon: Sparkles, text: "ATS scoring system with keyword analysis" },
    { type: "feature", icon: Sparkles, text: "PDF export for optimized resumes" },
    { type: "fix", icon: Bug, text: "Various stability improvements" },
  ]},
];

const typeColors: Record<string, string> = { feature: "bg-primary/10 text-primary", improvement: "bg-secondary/10 text-secondary", fix: "bg-orange-500/10 text-orange-400", security: "bg-green-500/10 text-green-400" };

const ChangelogPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-24 pb-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Changelog</Badge>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">What's New</h1>
        <p className="text-muted-foreground">All the latest updates and improvements to OptimizeForm AI.</p>
      </motion.div>

      <div className="space-y-8">
        {entries.map((entry, i) => (
          <motion.div key={entry.version} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground">v{entry.version}</Badge>
              <span className="text-sm text-muted-foreground">{entry.date}</span>
            </div>
            <div className="space-y-3">
              {entry.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${typeColors[item.type]}`}>
                    <item.icon className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default ChangelogPage;
