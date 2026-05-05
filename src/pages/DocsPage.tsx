import { motion } from "framer-motion";
import { Book, Rocket, Shield, Settings, Code, BarChart, FileText, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { icon: Rocket, title: "Getting Started", desc: "Create your account and optimize your first resume in under 5 minutes.", items: ["Sign up with email or Google", "Upload your resume (PDF, DOCX, or paste text)", "Add the target job description", "Click Optimize and get your ATS score"] },
  { icon: FileText, title: "Resume Optimizer", desc: "How our AI optimization engine works.", items: ["AI parses your resume sections automatically", "Keywords are matched against the job description", "Missing skills and keywords are identified", "Optimized resume is generated with improvements"] },
  { icon: BarChart, title: "ATS Scoring", desc: "Understanding your ATS compatibility score.", items: ["Keyword Match Rate — how many JD keywords your resume contains", "Skills Coverage — technical and soft skills alignment", "Readability Score — formatting and structure quality", "Overall ATS Score — weighted combination of all metrics"] },
  { icon: Code, title: "API Documentation", desc: "Coming soon — integrate OptimizeForm AI into your workflow.", items: ["REST API for resume optimization", "Webhook support for real-time results", "Batch processing for enterprise clients", "SDKs for Python, JavaScript, and more"] },
  { icon: Shield, title: "Security", desc: "How we protect your data.", items: ["End-to-end encryption for all uploads", "Data is never used to train AI models", "SOC 2 compliance in progress", "GDPR-compliant data handling"] },
  { icon: Settings, title: "Account Settings", desc: "Manage your profile and preferences.", items: ["Update your profile information", "Manage subscription and billing", "View optimization history", "Download or delete your data"] },
];

const DocsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-24 pb-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Documentation</Badge>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Documentation</h1>
        <p className="text-muted-foreground">Everything you need to know about using OptimizeForm AI.</p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><s.icon className="h-5 w-5 text-primary" /></div>
              <div>
                <h2 className="font-display font-semibold text-foreground">{s.title}</h2>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
            <ul className="space-y-2 ml-13">
              {s.items.map((item, j) => (
                <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Zap className="h-3 w-3 text-primary mt-1 shrink-0" />{item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default DocsPage;
