import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun K.",
    role: "Software Developer",
    company: "Hired at Flipkart",
    text: "I went from zero callbacks to 5 interview calls in a week. The ATS score analysis was a game-changer.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Product Manager",
    company: "Switched from Marketing",
    text: "OptimizeForm AI helped me reposition my entire resume for PM roles. Got hired within a month!",
    rating: 5,
  },
  {
    name: "Sneha R.",
    role: "Career Coach",
    company: "15+ clients/month",
    text: "The Agency plan saves me 3-4 hours per client. My clients love the polished output.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Loved by Job Seekers
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Real results from real users.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} • {t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
