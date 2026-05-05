import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, FileDown, FileText, Eye, EyeOff, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { generateResumePDF } from "@/lib/generateResumePDF";

interface Experience {
  company: string;
  title: string;
  duration: string;
  bullets: string[];
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  grade: string;
  activities: string;
  description: string;
}

interface Project {
  name: string;
  description: string;
}

const ResumeBuilderPage = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([{ company: "", title: "", duration: "", bullets: [""] }]);
  const [educations, setEducations] = useState<Education[]>([{ institution: "", degree: "", year: "" }]);
  const [projects, setProjects] = useState<Project[]>([{ name: "", description: "" }]);

  const addExperience = () => setExperiences([...experiences, { company: "", title: "", duration: "", bullets: [""] }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    (updated[i] as any)[field] = value;
    setExperiences(updated);
  };

  const addEducation = () => setEducations([...educations, { institution: "", degree: "", year: "" }]);
  const removeEducation = (i: number) => setEducations(educations.filter((_, idx) => idx !== i));

  const addProject = () => setProjects([...projects, { name: "", description: "" }]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));

  const buildResumeObject = () => ({
    summary,
    experience: experiences.filter(e => e.company || e.title),
    skills: {
      technical: skills.split(",").map(s => s.trim()).filter(Boolean),
      soft: [],
      tools: [],
    },
    education: educations.filter(e => e.institution || e.degree),
    projects: projects.filter(p => p.name || p.description),
  });

  const handleDownloadPDF = () => {
    const resumeObj = buildResumeObject();
    if (!resumeObj.summary && resumeObj.experience.length === 0) {
      toast.error("Please fill in at least a summary or experience");
      return;
    }
    generateResumePDF(resumeObj, `${fullName || "resume"}.pdf`);
    toast.success("PDF downloaded!");
  };

  const handleDownloadTXT = () => {
    let txt = `${fullName}\n${email} | ${phone}\n\nSUMMARY\n${summary}\n\nEXPERIENCE\n`;
    experiences.forEach(e => {
      txt += `${e.title} at ${e.company} (${e.duration})\n`;
      e.bullets.forEach(b => { if (b) txt += `  • ${b}\n`; });
      txt += "\n";
    });
    txt += `SKILLS\n${skills}\n\nEDUCATION\n`;
    educations.forEach(e => { txt += `${e.degree} - ${e.institution} (${e.year})\n`; });
    txt += "\nPROJECTS\n";
    projects.forEach(p => { txt += `${p.name}: ${p.description}\n`; });

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullName || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("TXT downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Resume Builder</h1>
          <p className="text-muted-foreground text-sm">Build a professional resume with live preview and export options.</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm" className="gap-2 rounded-xl">
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleDownloadPDF} size="sm" className="gap-2 rounded-xl glow-primary">
            <FileDown className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button onClick={handleDownloadTXT} variant="outline" size="sm" className="gap-2 rounded-xl">
            <Download className="h-3.5 w-3.5" /> Download TXT
          </Button>
        </div>

        <div className={`grid ${showPreview ? "lg:grid-cols-2" : ""} gap-6`}>
          {/* Form */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <h3 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@email.com" className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl h-9 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="mt-1 bg-muted/30 border-white/[0.06] rounded-xl h-9 text-sm" />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="font-display font-semibold text-foreground text-sm">Professional Summary</h3>
              <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Briefly describe your professional background..." className="bg-muted/30 border-white/[0.06] rounded-xl text-sm h-24 resize-none" />
            </div>

            {/* Experience */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground text-sm">Experience</h3>
                <Button variant="ghost" size="sm" onClick={addExperience} className="text-primary text-xs gap-1"><Plus className="h-3 w-3" />Add</Button>
              </div>
              {experiences.map((exp, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/20 border border-white/[0.04] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                    {experiences.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeExperience(i)} className="text-destructive h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Input value={exp.title} onChange={e => updateExperience(i, "title", e.target.value)} placeholder="Job Title" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                    <Input value={exp.company} onChange={e => updateExperience(i, "company", e.target.value)} placeholder="Company" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                  </div>
                  <Input value={exp.duration} onChange={e => updateExperience(i, "duration", e.target.value)} placeholder="Duration (e.g. 2022 - Present)" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                  {exp.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-1">
                      <Input
                        value={b}
                        onChange={e => {
                          const newBullets = [...exp.bullets];
                          newBullets[bi] = e.target.value;
                          updateExperience(i, "bullets", newBullets);
                        }}
                        placeholder="Achievement or responsibility..."
                        className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs"
                      />
                      {exp.bullets.length > 1 && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground" onClick={() => {
                          const newBullets = exp.bullets.filter((_, idx) => idx !== bi);
                          updateExperience(i, "bullets", newBullets);
                        }}><Trash2 className="h-3 w-3" /></Button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => updateExperience(i, "bullets", [...exp.bullets, ""])} className="text-xs text-muted-foreground gap-1">
                    <Plus className="h-3 w-3" /> Add Bullet
                  </Button>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="font-display font-semibold text-foreground text-sm">Skills</h3>
              <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js, AWS..." className="bg-muted/30 border-white/[0.06] rounded-xl h-9 text-sm" />
              <p className="text-[10px] text-muted-foreground">Separate skills with commas</p>
            </div>

            {/* Education */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground text-sm">Education</h3>
                <Button variant="ghost" size="sm" onClick={addEducation} className="text-primary text-xs gap-1"><Plus className="h-3 w-3" />Add</Button>
              </div>
              {educations.map((edu, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/20 border border-white/[0.04] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                    {educations.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeEducation(i)} className="text-destructive h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
                    )}
                  </div>
                  <Input value={edu.degree} onChange={e => { const u = [...educations]; u[i].degree = e.target.value; setEducations(u); }} placeholder="Degree" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={edu.institution} onChange={e => { const u = [...educations]; u[i].institution = e.target.value; setEducations(u); }} placeholder="Institution" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                    <Input value={edu.year} onChange={e => { const u = [...educations]; u[i].year = e.target.value; setEducations(u); }} placeholder="Year" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground text-sm">Projects</h3>
                <Button variant="ghost" size="sm" onClick={addProject} className="text-primary text-xs gap-1"><Plus className="h-3 w-3" />Add</Button>
              </div>
              {projects.map((proj, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/20 border border-white/[0.04] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                    {projects.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeProject(i)} className="text-destructive h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
                    )}
                  </div>
                  <Input value={proj.name} onChange={e => { const u = [...projects]; u[i].name = e.target.value; setProjects(u); }} placeholder="Project Name" className="bg-muted/30 border-white/[0.06] rounded-lg h-8 text-xs" />
                  <Textarea value={proj.description} onChange={e => { const u = [...projects]; u[i].description = e.target.value; setProjects(u); }} placeholder="Brief description..." className="bg-muted/30 border-white/[0.06] rounded-lg text-xs h-16 resize-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-card p-6 rounded-2xl max-h-[80vh] overflow-auto">
                <h3 className="font-display font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" /> Live Preview
                </h3>
                <div className="bg-background/50 rounded-xl p-5 border border-white/[0.04] text-sm space-y-4">
                  {/* Header */}
                  <div className="text-center border-b border-border/30 pb-3">
                    <h2 className="text-lg font-display font-bold text-foreground">{fullName || "Your Name"}</h2>
                    <p className="text-xs text-muted-foreground">
                      {[email, phone].filter(Boolean).join(" • ") || "email@example.com • +1 234 567 8900"}
                    </p>
                  </div>

                  {summary && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Summary</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
                    </div>
                  )}

                  {experiences.some(e => e.company || e.title) && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Experience</h4>
                      {experiences.filter(e => e.company || e.title).map((e, i) => (
                        <div key={i} className="mb-3">
                          <p className="text-xs font-semibold text-foreground">{e.title || "Job Title"} — {e.company || "Company"}</p>
                          <p className="text-[10px] text-muted-foreground mb-1">{e.duration}</p>
                          {e.bullets.filter(Boolean).map((b, bi) => (
                            <p key={bi} className="text-[11px] text-muted-foreground ml-2">• {b}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {skills && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {educations.some(e => e.institution || e.degree) && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Education</h4>
                      {educations.filter(e => e.institution || e.degree).map((e, i) => (
                        <p key={i} className="text-xs text-muted-foreground">{e.degree} — {e.institution} ({e.year})</p>
                      ))}
                    </div>
                  )}

                  {projects.some(p => p.name || p.description) && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Projects</h4>
                      {projects.filter(p => p.name || p.description).map((p, i) => (
                        <div key={i} className="mb-1">
                          <p className="text-xs font-medium text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
