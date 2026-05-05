import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-24 pb-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: May 5, 2026</p>
        {[
          { t: "1. Information We Collect", c: "We collect information you provide directly (name, email, resume content) and automatically (usage data, device info, IP address). We use cookies and similar tracking technologies." },
          { t: "2. How We Use Your Information", c: "We use your data to provide and improve our services, process your resume optimizations, send service communications, analyze usage patterns, and ensure platform security." },
          { t: "3. AI Processing", c: "Your resume and job description data are processed by AI models to provide optimization suggestions. This data is not used to train AI models and is deleted after processing." },
          { t: "4. Data Sharing", c: "We do not sell your personal information. We may share data with service providers who help us operate our platform, comply with legal obligations, or protect our rights." },
          { t: "5. Data Security", c: "We implement industry-standard security measures including encryption, secure sessions, and access controls to protect your data." },
          { t: "6. Your Rights", c: "You have the right to access, correct, delete your data, or export it. You may also opt out of marketing communications at any time." },
          { t: "7. Data Retention", c: "We retain your data as long as your account is active. You can request deletion at any time by contacting support." },
          { t: "8. Contact", c: "For privacy questions, contact us at privacy@optimizeform.ai." },
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

export default PrivacyPage;
