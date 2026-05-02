import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying it out",
    features: [
      { text: "3 optimizations/month", included: true },
      { text: "1 saved resume version", included: true },
      { text: "PDF & DOCX download (1/mo)", included: true },
      { text: "Cover Letter Generator", included: false },
      { text: "Interview Q&A Predictor", included: false },
      { text: "Priority AI Processing", included: false },
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For active job seekers",
    features: [
      { text: "Unlimited optimizations", included: true },
      { text: "20 saved resume versions", included: true },
      { text: "Unlimited PDF & DOCX", included: true },
      { text: "Cover Letter Generator", included: true },
      { text: "Interview Q&A Predictor", included: true },
      { text: "Priority AI Processing", included: true },
    ],
    cta: "Get Pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "₹1,999",
    period: "/month",
    description: "For coaches & agencies",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited resume versions", included: true },
      { text: "Client management (10)", included: true },
      { text: "Bulk CSV upload", included: true },
      { text: "White-label reports", included: true },
      { text: "Permanent share links", included: true },
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free. Upgrade when you're ready to land your dream job.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`glass-card p-8 relative ${plan.highlighted ? "border-primary/30 glow-primary" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-display font-bold text-foreground text-xl mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-display font-extrabold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <Button
                className={`w-full mb-6 ${plan.highlighted ? "glow-primary" : ""}`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    {f.included ? (
                      <Check className="h-4 w-4 text-secondary shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
