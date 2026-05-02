import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join thousands of job seekers who've boosted their ATS scores and landed more interviews.
            </p>
            <Button size="lg" className="glow-primary text-base px-8 gap-2">
              Optimize My Resume Free <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
