import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Copy, FileDown, Eye } from "lucide-react";
import { generateResumePDF } from "@/lib/generateResumePDF";
import { motion } from "framer-motion";

interface OptimizedResumeViewProps {
  result: any;
}

const OptimizedResumeView = ({ result }: OptimizedResumeViewProps) => {
  const resume = result.optimizedResume;
  if (!resume) return null;

  const generatePlainText = () => {
    let text = "";
    if (resume.summary) text += "PROFESSIONAL SUMMARY\n" + resume.summary + "\n\n";
    if (resume.experience?.length) {
      text += "EXPERIENCE\n";
      resume.experience.forEach((exp: any) => {
        text += `${exp.title} - ${exp.company} (${exp.duration})\n`;
        exp.bullets?.forEach((b: string) => { text += `• ${b}\n`; });
        text += "\n";
      });
    }
    if (resume.skills) {
      text += "SKILLS\n";
      if (resume.skills.technical?.length) text += `Technical: ${resume.skills.technical.join(", ")}\n`;
      if (resume.skills.soft?.length) text += `Soft Skills: ${resume.skills.soft.join(", ")}\n`;
      if (resume.skills.tools?.length) text += `Tools: ${resume.skills.tools.join(", ")}\n`;
      text += "\n";
    }
    if (resume.education?.length) {
      text += "EDUCATION\n";
      resume.education.forEach((e: any) => { text += `${e.degree} - ${e.institution} (${e.year})\n`; });
      text += "\n";
    }
    if (resume.projects?.length) {
      text += "PROJECTS\n";
      resume.projects.forEach((p: any) => { text += `${p.name}: ${p.description}\n`; });
    }
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlainText());
    toast.success("Resume copied to clipboard!");
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatePlainText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optimized-resume-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resume downloaded!");
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-foreground text-xl flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Optimized Resume
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleCopy} className="gap-1.5 text-muted-foreground rounded-lg">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadTxt} className="gap-1.5 rounded-lg">
            <Download className="h-3.5 w-3.5" /> TXT
          </Button>
          <Button size="sm" className="gap-1.5 glow-primary rounded-lg" onClick={() => { generateResumePDF(resume); toast.success("PDF downloaded!"); }}>
            <FileDown className="h-3.5 w-3.5" /> PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6 text-sm">
        {resume.summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="text-xs uppercase text-primary/70 font-semibold mb-2 tracking-widest">Professional Summary</h3>
            <p className="text-foreground/90 leading-relaxed">{resume.summary}</p>
          </motion.div>
        )}

        {resume.experience?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-xs uppercase text-primary/70 font-semibold mb-4 tracking-widest">Experience</h3>
            {resume.experience.map((exp: any, i: number) => (
              <div key={i} className="mb-5 pl-4 border-l-2 border-primary/20">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    <p className="text-muted-foreground text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded">{exp.duration}</span>
                </div>
                <ul className="space-y-1.5 mt-2">
                  {exp.bullets?.map((b: string, j: number) => (
                    <li key={j} className="text-foreground/80 flex gap-2">
                      <span className="text-primary mt-0.5 shrink-0">→</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}

        {resume.skills && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xs uppercase text-primary/70 font-semibold mb-3 tracking-widest">Skills</h3>
            <div className="space-y-3">
              {resume.skills.technical?.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Technical</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {resume.skills.technical.map((s: string) => (
                      <span key={s} className="chip-matched text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {resume.skills.soft?.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Soft Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {resume.skills.soft.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {resume.skills.tools?.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Tools</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {resume.skills.tools.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground border border-border/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {resume.education?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-xs uppercase text-primary/70 font-semibold mb-3 tracking-widest">Education</h3>
            {resume.education.map((e: any, i: number) => (
              <div key={i} className="flex justify-between mb-2 pl-4 border-l-2 border-secondary/20">
                <div>
                  <p className="font-medium text-foreground">{e.degree}</p>
                  <p className="text-muted-foreground text-sm">{e.institution}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{e.year}</span>
              </div>
            ))}
          </motion.div>
        )}

        {resume.projects?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="text-xs uppercase text-primary/70 font-semibold mb-3 tracking-widest">Projects</h3>
            {resume.projects.map((p: any, i: number) => (
              <div key={i} className="mb-3 pl-4 border-l-2 border-primary/10">
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-muted-foreground text-sm">{p.description}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OptimizedResumeView;
