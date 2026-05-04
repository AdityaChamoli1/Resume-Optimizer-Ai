import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, FileText, Target, Linkedin, Mail, Brain, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Optimizer", href: "/optimizer", icon: Target },
  { label: "Resume Builder", href: "/resume-builder", icon: FileText },
  { label: "LinkedIn Post", href: "/linkedin-generator", icon: Linkedin },
  { label: "Cover Letter", href: "/cover-letter", icon: Mail },
  { label: "Interview Prep", href: "/interview-prep", icon: Brain },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          OptimizeForm AI
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {isLanding ? (
            <>
              {["Features", "How It Works", "Pricing", "FAQ"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30">
                  {l}
                </a>
              ))}
            </>
          ) : (
            navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => navigate(l.href)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === l.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </button>
            ))
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button size="sm" variant="outline" className="gap-2 rounded-xl" onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/auth")}>
                Log in
              </Button>
              <Button size="sm" className="glow-primary rounded-xl" onClick={() => navigate("/optimizer")}>
                Get Started Free
              </Button>
            </>
          )}
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => { navigate(l.href); setOpen(false); }}
                  className={`flex items-center gap-2 text-sm py-2.5 px-3 rounded-lg transition-colors ${
                    location.pathname === l.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                  }`}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </button>
              ))}
              <div className="border-t border-border/50 mt-2 pt-2">
                {user ? (
                  <Button size="sm" className="w-full gap-2" onClick={() => { navigate("/dashboard"); setOpen(false); }}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => { navigate("/optimizer"); setOpen(false); }}>Get Started Free</Button>
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
