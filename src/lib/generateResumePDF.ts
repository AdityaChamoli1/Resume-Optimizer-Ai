import jsPDF from "jspdf";

export const generateResumePDF = (resume: any, filename?: string) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPage = (needed: number) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  const addHeading = (text: string) => {
    checkPage(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(108, 99, 255); // primary violet
    doc.text(text.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(108, 99, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  // Summary
  if (resume.summary) {
    addHeading("Professional Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(resume.summary, maxWidth);
    checkPage(lines.length * 5);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 6;
  }

  // Experience
  if (resume.experience?.length) {
    addHeading("Experience");
    for (const exp of resume.experience) {
      checkPage(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(exp.title || "", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      const rightText = exp.duration || "";
      doc.text(rightText, pageWidth - margin - doc.getTextWidth(rightText), y);
      y += 5;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(exp.company || "", margin, y);
      y += 6;

      if (exp.bullets?.length) {
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        for (const bullet of exp.bullets) {
          const bulletLines = doc.splitTextToSize(`• ${bullet}`, maxWidth - 4);
          checkPage(bulletLines.length * 5);
          doc.text(bulletLines, margin + 2, y);
          y += bulletLines.length * 5 + 1;
        }
      }
      y += 4;
    }
  }

  // Skills
  if (resume.skills) {
    addHeading("Skills");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const sections = [
      { label: "Technical", items: resume.skills.technical },
      { label: "Soft Skills", items: resume.skills.soft },
      { label: "Tools", items: resume.skills.tools },
    ];
    for (const sec of sections) {
      if (sec.items?.length) {
        checkPage(8);
        doc.setFont("helvetica", "bold");
        doc.text(`${sec.label}: `, margin, y);
        doc.setFont("helvetica", "normal");
        const labelW = doc.getTextWidth(`${sec.label}: `);
        const skillText = sec.items.join(", ");
        const skillLines = doc.splitTextToSize(skillText, maxWidth - labelW);
        doc.text(skillLines[0], margin + labelW, y);
        if (skillLines.length > 1) {
          for (let i = 1; i < skillLines.length; i++) {
            y += 5;
            checkPage(5);
            doc.text(skillLines[i], margin, y);
          }
        }
        y += 6;
      }
    }
    y += 2;
  }

  // Education
  if (resume.education?.length) {
    addHeading("Education");
    for (const edu of resume.education) {
      checkPage(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(edu.degree || "", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      const yearText = edu.year || "";
      doc.text(yearText, pageWidth - margin - doc.getTextWidth(yearText), y);
      y += 5;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(edu.institution || "", margin, y);
      y += 7;
    }
  }

  // Projects
  if (resume.projects?.length) {
    addHeading("Projects");
    for (const proj of resume.projects) {
      checkPage(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(proj.name || "", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      const descLines = doc.splitTextToSize(proj.description || "", maxWidth);
      checkPage(descLines.length * 5);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 4;
    }
  }

  const name = filename || `optimized-resume-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(name);
};
