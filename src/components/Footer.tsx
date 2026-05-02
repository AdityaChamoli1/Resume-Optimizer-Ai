import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-foreground mb-3">
              <Zap className="h-4 w-4 text-primary" />
              OptimizeForm AI
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered resume optimization that helps you land more interviews.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API (Coming Soon)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">ATS Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} OptimizeForm AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
