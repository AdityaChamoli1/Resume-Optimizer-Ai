import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 font-display font-bold text-foreground mb-3">
            <Zap className="h-4 w-4 text-primary" />OptimizeForm AI
          </div>
          <p className="text-sm text-muted-foreground">AI-powered resume optimization that helps you land more interviews.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground text-sm mb-3">Tools</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[{ l: "Resume Optimizer", h: "/optimizer" }, { l: "Resume Builder", h: "/resume-builder" }, { l: "ATS Checker", h: "/ats-checker" }, { l: "Cover Letter", h: "/cover-letter" }, { l: "AI Job Match", h: "/job-match" }, { l: "Interview Prep", h: "/interview-prep" }, { l: "Portfolio Builder", h: "/portfolio-builder" }].map(i => (
              <li key={i.h}><Link to={i.h} className="hover:text-foreground transition-colors">{i.l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground text-sm mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[{ l: "Templates", h: "/templates" }, { l: "Resume Examples", h: "/resume-examples" }, { l: "Career Tools", h: "/career-tools" }, { l: "ATS Guide", h: "/ats-guide" }, { l: "Blog", h: "/blog" }, { l: "Documentation", h: "/docs" }, { l: "Changelog", h: "/changelog" }].map(i => (
              <li key={i.h}><Link to={i.h} className="hover:text-foreground transition-colors">{i.l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[{ l: "Contact", h: "/contact" }, { l: "Privacy Policy", h: "/privacy" }, { l: "Terms of Service", h: "/terms" }].map(i => (
              <li key={i.h}><Link to={i.h} className="hover:text-foreground transition-colors">{i.l}</Link></li>
            ))}
            <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OptimizeForm AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
