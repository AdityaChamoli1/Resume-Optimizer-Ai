import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setSending(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Contact</Badge>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Have questions? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-xs text-muted-foreground">Name</Label><Input required placeholder="Your name" className="mt-1 bg-muted/30 border-border/50 rounded-xl" /></div>
              <div><Label className="text-xs text-muted-foreground">Email</Label><Input required type="email" placeholder="you@email.com" className="mt-1 bg-muted/30 border-border/50 rounded-xl" /></div>
            </div>
            <div><Label className="text-xs text-muted-foreground">Subject</Label><Input required placeholder="How can we help?" className="mt-1 bg-muted/30 border-border/50 rounded-xl" /></div>
            <div><Label className="text-xs text-muted-foreground">Message</Label><Textarea required placeholder="Tell us more..." className="mt-1 bg-muted/30 border-border/50 rounded-xl h-32 resize-none" /></div>
            <Button type="submit" className="w-full glow-primary rounded-xl gap-2" disabled={sending}>
              <Send className="h-4 w-4" />{sending ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "support@optimizeform.ai", desc: "We respond within 24 hours" },
              { icon: MessageSquare, label: "Live Chat", value: "Available 9am-6pm EST", desc: "Chat with our support team" },
              { icon: MapPin, label: "Location", value: "San Francisco, CA", desc: "United States" },
            ].map((item, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><item.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-primary">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
