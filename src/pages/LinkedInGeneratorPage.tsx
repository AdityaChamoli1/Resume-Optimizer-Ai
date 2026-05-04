import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Linkedin, Copy, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const tones = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "😊" },
  { id: "inspirational", label: "Inspirational", emoji: "🚀" },
  { id: "storytelling", label: "Storytelling", emoji: "📖" },
];

const LinkedInGeneratorPage = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [additionalContext, setAdditionalContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: {
          action: "linkedin-post",
          topic,
          tone,
          additionalContext,
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setGeneratedPost(data.post || data.content || "");
      toast.success("LinkedIn post generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate post");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0077B5]/20 to-primary/20 flex items-center justify-center">
              <Linkedin className="h-5 w-5 text-primary" />
            </div>
            LinkedIn Post Generator
          </h1>
          <p className="text-muted-foreground text-sm">Generate SEO-friendly, engaging LinkedIn posts with AI.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-5">
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Topic / Subject</Label>
                <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. My journey from junior to senior developer..." className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl h-9 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Tone</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        tone === t.id
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-white/[0.06] bg-muted/20 text-muted-foreground hover:border-primary/15"
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Additional Context (optional)</Label>
                <Textarea value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} placeholder="Key points, statistics, personal experience..." className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl text-sm h-24 resize-none" />
              </div>

              <Button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full glow-primary gap-2 rounded-xl h-10">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Post
              </Button>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="glass-card p-5 rounded-2xl h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-foreground text-sm">Generated Post</h3>
                {generatedPost && (
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs gap-1.5 text-primary">
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                )}
              </div>
              {generatedPost ? (
                <div className="bg-muted/20 rounded-xl p-4 border border-white/[0.04] text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-auto">
                  {generatedPost}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-60 text-center">
                  <Linkedin className="h-10 w-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">Your generated post will appear here</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Enter a topic and click generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInGeneratorPage;
