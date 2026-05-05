import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const blogPosts = [
  { id: 1, title: "How to Beat ATS Systems in 2026", excerpt: "Learn the latest strategies to optimize your resume for Applicant Tracking Systems and land more interviews.", category: "ATS Tips", author: "OptimizeForm Team", date: "May 3, 2026", readTime: "8 min", image: "🎯", featured: true },
  { id: 2, title: "Top 10 Resume Mistakes That Cost You Interviews", excerpt: "Avoid these common resume mistakes that recruiters spot instantly and learn how to fix them.", category: "Resume Tips", author: "Career Expert", date: "May 1, 2026", readTime: "6 min", image: "📝", featured: true },
  { id: 3, title: "AI-Powered Resume Writing: The Future of Job Applications", excerpt: "Discover how AI is transforming the way professionals create and optimize their resumes.", category: "AI & Technology", author: "Tech Writer", date: "Apr 28, 2026", readTime: "10 min", image: "🤖", featured: false },
  { id: 4, title: "The Complete Guide to Writing Cover Letters That Get Results", excerpt: "Step-by-step guide to crafting compelling cover letters that make hiring managers take notice.", category: "Cover Letters", author: "HR Professional", date: "Apr 25, 2026", readTime: "7 min", image: "✉️", featured: false },
  { id: 5, title: "Remote Job Interview Tips for 2026", excerpt: "Master virtual interviews with these proven tips from hiring managers and career coaches.", category: "Interviews", author: "Interview Coach", date: "Apr 22, 2026", readTime: "5 min", image: "💻", featured: false },
  { id: 6, title: "Building a Developer Portfolio That Stands Out", excerpt: "Essential tips for creating an impressive developer portfolio that attracts top employers.", category: "Portfolio", author: "Senior Dev", date: "Apr 19, 2026", readTime: "9 min", image: "🚀", featured: false },
];

const categories = ["All", "ATS Tips", "Resume Tips", "AI & Technology", "Cover Letters", "Interviews", "Portfolio", "Career Advice"];

const BlogPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = blogPosts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Blog</Badge>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Career Insights & Tips</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Expert advice on resumes, interviews, career growth, and leveraging AI for your job search.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="pl-10 bg-muted/30 border-border/50 rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <Button key={c} variant={activeCategory === c ? "default" : "outline"} size="sm" className="rounded-full text-xs" onClick={() => setActiveCategory(c)}>{c}</Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">{post.image}</div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                  {post.featured && <Badge className="text-[10px] bg-primary/20 text-primary">Featured</Badge>}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
