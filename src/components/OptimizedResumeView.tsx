import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Copy } from "lucide-react";

interface OptimizedResumeViewProps {
  result: any;
}

const OptimizedResumeView = ({ result }: OptimizedResumeViewProps) => {
  const resume = result.optimizedResume;
  if (!resume) return null;

  const generatePlainText = () => {
    let text = "";
    if (resume.summary) {
      text += "PROFESSIONAL SUMMARY\n" + resume.summary + "\n\n";
    }
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
      resume.education.forEach((e: any) => {
        text += `${e.degree} - ${e.institution} (${e.year})\n`;
      });
      text += "\n";
    }
    if (resume.projects?.length) {
      text += "PROJECTS\n";
      resume.projects.forEach((p: any) => {
        text += `${p.name}: ${p.description}\n`;
      });
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
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-foreground text-xl">Optimized Resume</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleCopy} className="gap-1 text-muted-foreground">
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadTxt} className="gap-1">
            <Download className="h-4 w-4" /> Download TXT
          </Button>
        </div>
      </div>

      <div className="space-y-6 text-sm">
        {/* Summary */}
        {resume.summary && (
          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wider">Professional Summary</h3>
            <p className="text-foreground leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-3 tracking-wider">Experience</h3>
            {resume.experience.map((exp: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-foreground">{exp.title}</p>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{exp.duration}</span>
                </div>
                <ul className="space-y-1 mt-2">
                  {exp.bullets?.map((b: string, j: number) => (
                    <li key={j} className="text-foreground flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resume.skills && (
          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wider">Skills</h3>
            <div className="space-y-2">
              {resume.skills.technical?.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Technical: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {resume.skills.technical.map((s: string) => (
                      <span key={s} className="chip-matched text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {resume.skills.soft?.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Soft Skills: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {resume.skills.soft.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {resume.skills.tools?.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Tools: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {resume.skills.tools.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education?.length > 0 && (
          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wider">Education</h3>
            {resume.education.map((e: any, i: number) => (
              <div key={i} className="flex justify-between mb-1">
                <div>
                  <p className="font-medium text-foreground">{e.degree}</p>
                  <p className="text-muted-foreground">{e.institution}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{e.year}</span>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wider">Projects</h3>
            {resume.projects.map((p: any, i: number) => (
              <div key={i} className="mb-2">
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedResumeView;
