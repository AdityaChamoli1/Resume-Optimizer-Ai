import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Copy, Download, FileDown, Sparkles } from "lucide-react";
import { generateResumePDF } from "@/lib/generateResumePDF";

interface CoverLetterSectionProps {
  coverLetter?: string;
  onGenerate: (tone: string) => void;
  loading: boolean;
}

const tones = [
  { value: "professional", label: "Professional" },
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "corporate", label: "Corporate" },
];

const CoverLetterSection = ({ coverLetter, onGenerate, loading }: CoverLetterSectionProps) => {
  const [selectedTone, setSelectedTone] = useState("professional");
  const [editedLetter, setEditedLetter] = useState(coverLetter || "");

  // Sync when new cover letter arrives
  if (coverLetter && coverLetter !== editedLetter && !editedLetter) {
    setEditedLetter(coverLetter);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedLetter || coverLetter || "");
    toast.success("Copied to clipboard!");
  };

  const handleDownloadTxt = () => {
    const text = editedLetter || coverLetter || "";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleDownloadPDF = () => {
    const text = editedLetter || coverLetter || "";
    // Use jsPDF for cover letter PDF
    import("jspdf").then(({ default: jsPDF }) => {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 20;
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      
      const lines = doc.splitTextToSize(text, maxWidth);
      let y = 30;
      for (const line of lines) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += 6;
      }
      
      doc.save(`cover-letter-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded!");
    });
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Cover Letter Generator
        </h3>
        {coverLetter && (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleCopy} className="gap-1 text-muted-foreground">
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadTxt} className="gap-1 rounded-lg">
              <Download className="h-3.5 w-3.5" /> TXT
            </Button>
            <Button size="sm" className="gap-1 glow-primary rounded-lg" onClick={handleDownloadPDF}>
              <FileDown className="h-3.5 w-3.5" /> PDF
            </Button>
          </div>
        )}
      </div>

      {!coverLetter ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">Select a tone and generate a tailored cover letter.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => setSelectedTone(tone.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTone === tone.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>
          <Button
            className="w-full gap-2 rounded-xl"
            onClick={() => onGenerate(selectedTone)}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            Generate Cover Letter ({selectedTone})
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => { setSelectedTone(tone.value); setEditedLetter(""); onGenerate(tone.value); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTone === tone.value
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/20"
                }`}
                disabled={loading}
              >
                {tone.label}
              </button>
            ))}
          </div>
          <Textarea
            value={editedLetter || coverLetter}
            onChange={(e) => setEditedLetter(e.target.value)}
            className="min-h-[300px] bg-muted/20 border-white/[0.06] text-foreground resize-none rounded-xl text-sm leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};

export default CoverLetterSection;
