import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-24 pb-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: May 5, 2026</p>
        {[
          { t: "1. Acceptance of Terms", c: "By accessing OptimizeForm AI, you agree to these terms. If you do not agree, do not use our services." },
          { t: "2. Service Description", c: "OptimizeForm AI provides AI-powered resume optimization, ATS scoring, cover letter generation, portfolio building, and related career tools." },
          { t: "3. Account Registration", c: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials." },
          { t: "4. Acceptable Use", c: "You may not use our services for illegal purposes, to distribute malware, to infringe intellectual property, or to submit fraudulent content." },
          { t: "5. Intellectual Property", c: "Our platform, design, and AI models are our intellectual property. Your resume content remains yours. We grant you a license to use our platform as described in your subscription plan." },
          { t: "6. Subscription & Billing", c: "Paid plans are billed according to the pricing page. You can cancel at any time. Refunds are handled on a case-by-case basis." },
          { t: "7. Limitation of Liability", c: "We provide our services 'as is' without warranties. We are not responsible for job outcomes resulting from using our optimization suggestions." },
          { t: "8. Termination", c: "We may suspend or terminate accounts that violate these terms. You may delete your account at any time." },
          { t: "9. Changes to Terms", c: "We may update these terms periodically. Continued use constitutes acceptance of updated terms." },
          { t: "10. Contact", c: "Questions? Contact us at legal@optimizeform.ai." },
        ].map((s, i) => (
          <div key={i} className="mb-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">{s.t}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.c}</p>
          </div>
        ))}
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default TermsPage;
