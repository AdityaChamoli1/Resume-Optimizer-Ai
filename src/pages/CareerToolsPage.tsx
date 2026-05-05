import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap, FileSearch, PenTool, BarChart3, Users, Globe, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tools = [
  { icon: FileSearch, title: "Resume Optimizer", desc: "AI-powered resume optimization with ATS scoring and keyword matching.", href: "/optimizer", color: "text-primary" },
  { icon: PenTool, title: "Resume Builder", desc: "Build a professional resume from scratch with live preview.", href: "/resume-builder", color: "text-secondary" },
  { icon: BarChart3, title: "ATS Checker", desc: "Check your resume's ATS compatibility and get detailed analysis.", href: "/ats-checker", color: "text-blue-400" },
  { icon: Briefcase, title: "Cover Letter Generator", desc: "Generate tailored cover letters for any position.", href: "/cover-letter", color: "text-pink-400" },
  { icon: Users, title: "AI Job Match", desc: "See how well your resume matches any job description.", href: "/job-match", color: "text-amber-400" },
  { icon: GraduationCap, title: "Interview Prep", desc: "AI-generated interview questions and practice mode.", href: "/interview-prep", color: "text-green-400" },
  { icon: Globe, title: "Portfolio Builder", desc: "Create a professional developer portfolio website.", href: "/portfolio-builder", color: "text-cyan-400" },
  { icon: BookOpen, title: "LinkedIn Post Generator", desc: "Create engaging LinkedIn posts to boost your presence.", href: "/linkedin-generator", color: "text-indigo-400" },
];

const CareerToolsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Career Tools</Badge>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">AI Career Toolkit</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to land your dream job — powered by AI.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 rounded-2xl hover:border-primary/30 transition-all text-center group">
              <div className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm mb-2">{tool.title}</h3>
              <p className="text-[11px] text-muted-foreground mb-4">{tool.desc}</p>
              <Button variant="outline" size="sm" className="rounded-xl text-xs w-full" onClick={() => navigate(tool.href)}>Try Now</Button>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareerToolsPage;
