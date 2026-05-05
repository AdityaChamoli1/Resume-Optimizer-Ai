import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const templates = [
  { id: 1, name: "Modern Professional", category: "Professional", rating: 4.9, downloads: "12.4K", color: "from-primary/30 to-secondary/20", desc: "Clean, modern layout perfect for corporate roles and tech positions." },
  { id: 2, name: "Creative Designer", category: "Creative", rating: 4.8, downloads: "8.7K", color: "from-pink-500/20 to-purple-500/20", desc: "Eye-catching design for creative professionals and designers." },
  { id: 3, name: "Executive Suite", category: "Executive", rating: 4.9, downloads: "6.2K", color: "from-amber-500/20 to-orange-500/20", desc: "Premium template for senior executives and C-level positions." },
  { id: 4, name: "Tech Developer", category: "Technical", rating: 4.7, downloads: "15.1K", color: "from-green-500/20 to-teal-500/20", desc: "Optimized for software engineers with skills and project sections." },
  { id: 5, name: "Minimalist", category: "Simple", rating: 4.8, downloads: "10.3K", color: "from-slate-500/20 to-gray-500/20", desc: "Simple, elegant design that lets your content shine." },
  { id: 6, name: "Academic", category: "Academic", rating: 4.6, downloads: "5.8K", color: "from-blue-500/20 to-indigo-500/20", desc: "Perfect for researchers, professors, and academic professionals." },
  { id: 7, name: "Entry Level", category: "Student", rating: 4.7, downloads: "18.5K", color: "from-cyan-500/20 to-blue-500/20", desc: "Ideal for recent graduates and early career professionals." },
  { id: 8, name: "Federal Resume", category: "Government", rating: 4.5, downloads: "3.2K", color: "from-red-500/20 to-rose-500/20", desc: "Compliant with federal resume requirements and formatting." },
];

const TemplatesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Templates</Badge>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Resume Templates</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">ATS-optimized templates designed by HR experts. Pick one and start building.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
              <div className={`h-40 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                <FileText className="h-12 w-12 text-foreground/20 group-hover:text-foreground/40 transition-colors" />
              </div>
              <div className="p-4">
                <Badge variant="secondary" className="text-[10px] mb-2">{t.category}</Badge>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">{t.name}</h3>
                <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{t.desc}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />{t.rating}</span>
                  <span className="flex items-center gap-1"><Download className="h-3 w-3" />{t.downloads}</span>
                </div>
                <Button size="sm" className="w-full rounded-xl text-xs gap-1" onClick={() => navigate("/resume-builder")}>
                  <Eye className="h-3 w-3" />Use Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TemplatesPage;
