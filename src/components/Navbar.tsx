import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, FileText, Target, Linkedin, Mail, Brain, LayoutDashboard, Shield, Users, Globe, ChevronDown, Briefcase, BookOpen, Star, FileSearch, PenTool, BarChart3, GraduationCap, HelpCircle, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DropdownItem { label: string; href: string; icon: any; desc?: string }
interface NavGroup { label: string; items: DropdownItem[] }

const toolsGroup: NavGroup = {
  label: "Tools",
  items: [
    { label: "Resume Optimizer", href: "/optimizer", icon: Target, desc: "AI-powered optimization" },
    { label: "Resume Builder", href: "/resume-builder", icon: PenTool, desc: "Build from scratch" },
    { label: "ATS Checker", href: "/ats-checker", icon: Shield, desc: "ATS compatibility check" },
    { label: "Cover Letter", href: "/cover-letter", icon: Mail, desc: "Generate cover letters" },
    { label: "AI Job Match", href: "/job-match", icon: Users, desc: "Resume vs JD analysis" },
    { label: "Interview Prep", href: "/interview-prep", icon: Brain, desc: "AI interview questions" },
    { label: "Portfolio Builder", href: "/portfolio-builder", icon: Globe, desc: "Create portfolios" },
    { label: "LinkedIn Post", href: "/linkedin-generator", icon: Linkedin, desc: "Generate posts" },
  ],
};

const resourcesGroup: NavGroup = {
  label: "Resources",
  items: [
    { label: "Templates", href: "/templates", icon: FileText, desc: "ATS-friendly templates" },
    { label: "Resume Examples", href: "/resume-examples", icon: Star, desc: "High-scoring examples" },
    { label: "Career Tools", href: "/career-tools", icon: Briefcase, desc: "All tools overview" },
    { label: "ATS Guide", href: "/ats-guide", icon: BookOpen, desc: "Beat ATS systems" },
    { label: "Blog", href: "/blog", icon: Newspaper, desc: "Career insights" },
    { label: "Documentation", href: "/docs", icon: HelpCircle, desc: "How to use" },
    { label: "Changelog", href: "/changelog", icon: BarChart3, desc: "What's new" },
  ],
};

const MegaDropdown = ({ group, isOpen, onClose }: { group: NavGroup; isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div ref={ref} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] p-3 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl z-50">
          <div className="grid grid-cols-2 gap-1">
            {group.items.map((item) => (
              <button key={item.href} onClick={() => { navigate(item.href); onClose(); }}
                className={`flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors hover:bg-muted/40 ${location.pathname === item.href ? "bg-primary/10" : ""}`}>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${location.pathname === item.href ? "text-primary" : "text-foreground"}`}>{item.label}</p>
                  {item.desc && <p className="text-[10px] text-muted-foreground">{item.desc}</p>}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const isLanding = location.pathname === "/";

  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          OptimizeForm AI
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {isLanding ? (
            <>
              {["Features", "How It Works", "Pricing", "FAQ"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30">{l}</a>
              ))}
              {[toolsGroup, resourcesGroup].map((group) => (
                <div key={group.label} className="relative" onMouseEnter={() => setOpenDropdown(group.label)} onMouseLeave={() => setOpenDropdown(null)}>
                  <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30 flex items-center gap-1">
                    {group.label}<ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === group.label ? "rotate-180" : ""}`} />
                  </button>
                  <MegaDropdown group={group} isOpen={openDropdown === group.label} onClose={() => setOpenDropdown(null)} />
                </div>
              ))}
            </>
          ) : (
            <>
              {[toolsGroup, resourcesGroup].map((group) => (
                <div key={group.label} className="relative" onMouseEnter={() => setOpenDropdown(group.label)} onMouseLeave={() => setOpenDropdown(null)}>
                  <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30 flex items-center gap-1">
                    {group.label}<ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === group.label ? "rotate-180" : ""}`} />
                  </button>
                  <MegaDropdown group={group} isOpen={openDropdown === group.label} onClose={() => setOpenDropdown(null)} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button size="sm" variant="outline" className="gap-2 rounded-xl" onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/auth")}>Log in</Button>
              <Button size="sm" className="glow-primary rounded-xl" onClick={() => navigate("/optimizer")}>Get Started Free</Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="container py-4 space-y-4 max-h-[70vh] overflow-auto">
              {[toolsGroup, resourcesGroup].map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-3">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <button key={item.href} onClick={() => { navigate(item.href); setMobileOpen(false); }}
                        className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors w-full text-left ${location.pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"}`}>
                        <item.icon className="h-4 w-4" />{item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t border-border/50 pt-3">
                {user ? (
                  <Button size="sm" className="w-full gap-2" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => { navigate("/optimizer"); setMobileOpen(false); }}>Get Started Free</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
