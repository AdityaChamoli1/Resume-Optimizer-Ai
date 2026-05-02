import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is an ATS and why does it matter?",
    a: "An Applicant Tracking System (ATS) is software used by 75%+ of companies to filter resumes before a human ever reads them. If your resume isn't optimized for ATS keywords and formatting, it gets automatically rejected.",
  },
  {
    q: "Does the AI fabricate information on my resume?",
    a: "Never. Our AI only enhances and restructures what's already in your resume. It uses strong action verbs, adds quantification where implied, and integrates keywords naturally — but never invents companies, degrees, or skills.",
  },
  {
    q: "What file formats can I upload?",
    a: "You can upload PDF or DOCX files (max 5MB), or simply paste your resume text directly. We support both approaches for maximum flexibility.",
  },
  {
    q: "How accurate is the ATS score?",
    a: "Our scoring algorithm weighs keyword match (35%), skills coverage (25%), formatting (15%), readability (15%), and completeness (10%) — mirroring how real ATS systems evaluate resumes. Users see an average 30+ point improvement.",
  },
  {
    q: "Can I use OptimizeForm AI for free?",
    a: "Yes! The free plan includes 3 optimizations per month, 1 saved resume version, and PDF/DOCX download. No credit card required.",
  },
  {
    q: "Is my resume data safe?",
    a: "Absolutely. Your data is encrypted at rest, never shared with third parties, and never used to train AI. Uploaded files are auto-deleted after 24 hours for GDPR compliance.",
  },
  {
    q: "How long does optimization take?",
    a: "Most optimizations complete in under 60 seconds. Pro users get priority AI processing for even faster results.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel anytime from your account settings. You'll retain access to Pro features until the end of your billing period.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 mesh-gradient">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything you need to know about OptimizeForm AI.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass-card px-6 border-none">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
