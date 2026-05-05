import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Globe, Plus, Trash2, ExternalLink, Download, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";

interface PortfolioProject {
  name: string;
  description: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
}

const PortfolioBuilderPage = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [projects, setProjects] = useState<PortfolioProject[]>([{ name: "", description: "", techStack: "", liveUrl: "", githubUrl: "" }]);
  const [showPreview, setShowPreview] = useState(true);

  const addProject = () => setProjects([...projects, { name: "", description: "", techStack: "", liveUrl: "", githubUrl: "" }]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i: number, field: keyof PortfolioProject, value: string) => {
    const u = [...projects]; u[i][field] = value; setProjects(u);
  };

  const handleExportHTML = () => {
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} - Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;background:#0a0b14;color:#e2e8f0;line-height:1.6}.container{max-width:800px;margin:0 auto;padding:4rem 2rem}h1{font-size:2.5rem;margin-bottom:0.5rem}h2{font-size:1.5rem;margin:2rem 0 1rem;color:#6C63FF}.subtitle{color:#94a3b8;font-size:1.1rem}.section{margin:2rem 0}.skills span{display:inline-block;padding:4px 12px;margin:4px;border-radius:20px;background:rgba(108,99,255,0.15);color:#6C63FF;font-size:0.85rem}.project{border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1.5rem;margin:1rem 0}.project h3{color:#f1f5f9;margin-bottom:0.5rem}.project p{color:#94a3b8;font-size:0.9rem}.links a{color:#6C63FF;text-decoration:none;margin-right:1rem;font-size:0.85rem}</style></head><body><div class="container"><h1>${name}</h1><p class="subtitle">${title}</p><div class="section"><p style="color:#94a3b8">${bio}</p></div><div class="section skills"><h2>Skills</h2>${skills.split(",").map(s => `<span>${s.trim()}</span>`).join("")}</div><div class="section"><h2>Projects</h2>${projects.filter(p => p.name).map(p => `<div class="project"><h3>${p.name}</h3><p>${p.description}</p><p style="margin-top:0.5rem;font-size:0.8rem;color:#6C63FF">${p.techStack}</p><div class="links" style="margin-top:0.5rem">${p.liveUrl ? `<a href="${p.liveUrl}">Live</a>` : ""}${p.githubUrl ? `<a href="${p.githubUrl}">GitHub</a>` : ""}</div></div>`).join("")}</div><div class="section links"><h2>Contact</h2>${email ? `<p><a href="mailto:${email}" style="color:#6C63FF">${email}</a></p>` : ""}${github ? `<p><a href="${github}" style="color:#6C63FF">GitHub</a></p>` : ""}${linkedin ? `<p><a href="${linkedin}" style="color:#6C63FF">LinkedIn</a></p>` : ""}</div></div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${name || "portfolio"}.html`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio HTML exported!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><Globe className="h-3 w-3 mr-1 inline" />Portfolio Builder</Badge>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Portfolio Builder</h1>
          <p className="text-muted-foreground text-sm">Create a professional developer portfolio and export it as a standalone HTML page.</p>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm" className="rounded-xl gap-2">
            <Eye className="h-3.5 w-3.5" />{showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleExportHTML} size="sm" className="rounded-xl gap-2 glow-primary"><Download className="h-3.5 w-3.5" />Export HTML</Button>
        </div>

        <div className={`grid ${showPreview ? "lg:grid-cols-2" : ""} gap-6`}>
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-display font-semibold text-foreground">Personal Info</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
                <div><Label className="text-xs text-muted-foreground">Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Full Stack Developer" className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
              </div>
              <div><Label className="text-xs text-muted-foreground">Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A short bio about yourself..." className="mt-1 bg-muted/30 border-border/50 rounded-xl text-sm h-20 resize-none" /></div>
              <div><Label className="text-xs text-muted-foreground">Skills (comma-separated)</Label><Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js..." className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-display font-semibold text-foreground">Links</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
                <div><Label className="text-xs text-muted-foreground">GitHub</Label><Input value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
                <div><Label className="text-xs text-muted-foreground">LinkedIn</Label><Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
                <div><Label className="text-xs text-muted-foreground">Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.com" className="mt-1 bg-muted/30 border-border/50 rounded-xl h-9 text-sm" /></div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-semibold text-foreground">Projects</h3>
                <Button variant="ghost" size="sm" onClick={addProject} className="text-primary text-xs gap-1"><Plus className="h-3 w-3" />Add</Button>
              </div>
              {projects.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/20 border border-border/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                    {projects.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeProject(i)} className="text-destructive h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>}
                  </div>
                  <Input value={p.name} onChange={e => updateProject(i, "name", e.target.value)} placeholder="Project name" className="bg-muted/30 border-border/50 rounded-lg h-8 text-xs" />
                  <Textarea value={p.description} onChange={e => updateProject(i, "description", e.target.value)} placeholder="Description..." className="bg-muted/30 border-border/50 rounded-lg text-xs h-16 resize-none" />
                  <Input value={p.techStack} onChange={e => updateProject(i, "techStack", e.target.value)} placeholder="Tech stack (React, Node.js...)" className="bg-muted/30 border-border/50 rounded-lg h-8 text-xs" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={p.liveUrl} onChange={e => updateProject(i, "liveUrl", e.target.value)} placeholder="Live URL" className="bg-muted/30 border-border/50 rounded-lg h-8 text-xs" />
                    <Input value={p.githubUrl} onChange={e => updateProject(i, "githubUrl", e.target.value)} placeholder="GitHub URL" className="bg-muted/30 border-border/50 rounded-lg h-8 text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showPreview && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-card p-6 rounded-2xl max-h-[80vh] overflow-auto">
                <h3 className="text-xs font-display font-semibold text-muted-foreground mb-4 flex items-center gap-2"><Eye className="h-3.5 w-3.5 text-primary" />Live Preview</h3>
                <div className="bg-[#0a0b14] rounded-xl p-6 border border-border/30 text-sm space-y-5">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">{name || "Your Name"}</h2>
                    <p className="text-primary text-sm">{title || "Your Title"}</p>
                    {bio && <p className="text-xs text-muted-foreground mt-2">{bio}</p>}
                  </div>
                  {skills && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">{skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20">{s}</span>
                      ))}</div>
                    </div>
                  )}
                  {projects.some(p => p.name) && (
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Projects</h4>
                      {projects.filter(p => p.name).map((p, i) => (
                        <div key={i} className="mb-3 p-3 rounded-lg bg-muted/10 border border-border/20">
                          <p className="text-xs font-semibold text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{p.description}</p>
                          {p.techStack && <p className="text-[10px] text-primary mt-1">{p.techStack}</p>}
                          <div className="flex gap-2 mt-2">
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener" className="text-[10px] text-primary flex items-center gap-1"><ExternalLink className="h-2.5 w-2.5" />Live</a>}
                            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener" className="text-[10px] text-primary flex items-center gap-1"><ExternalLink className="h-2.5 w-2.5" />GitHub</a>}
                          </div>
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

export default PortfolioBuilderPage;
