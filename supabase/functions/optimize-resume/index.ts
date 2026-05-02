import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { jobDescription, resumeText, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "optimize") {
      systemPrompt = `You are an expert ATS resume optimizer and career consultant with 15+ years experience.

Your task is to analyze a job description and resume, then provide a COMPLETE optimization.

CRITICAL RULES:
- Never fabricate information. Only enhance what exists in the original resume.
- Use strong action verbs (Led, Architected, Delivered, Optimized, Spearheaded)
- Quantify achievements wherever implied
- Match keywords naturally from the JD
- Keep formatting ATS-safe

Return a JSON object with this EXACT structure:
{
  "atsScore": <number 0-100>,
  "keywordMatchRate": <number 0-100>,
  "skillsCoverage": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "matchedKeywords": [<string array of keywords found in both>],
  "missingKeywords": [<string array of critical JD keywords missing from resume>],
  "jobTitle": "<detected job title>",
  "company": "<detected company if any>",
  "suggestions": [
    {"severity": "high|medium|low", "text": "<suggestion>"}
  ],
  "optimizedResume": {
    "summary": "<3-5 line professional summary, keyword-rich>",
    "experience": [
      {
        "company": "<company name>",
        "title": "<job title>",
        "duration": "<dates>",
        "bullets": ["<STAR-format bullet with action verb + metric>"]
      }
    ],
    "skills": {
      "technical": ["<skills>"],
      "soft": ["<skills>"],
      "tools": ["<tools>"]
    },
    "education": [
      {
        "institution": "<name>",
        "degree": "<degree>",
        "year": "<year>"
      }
    ],
    "projects": [
      {
        "name": "<project>",
        "description": "<brief description with impact>"
      }
    ]
  },
  "skillGaps": [
    {"skill": "<missing skill>", "importance": "critical|important|nice-to-have", "suggestion": "<how to acquire>"}
  ]
}`;

      userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}\n\nAnalyze and optimize this resume for the job description. Return ONLY valid JSON.`;
    } else if (action === "cover-letter") {
      systemPrompt = `You are a professional cover letter writer. Generate a tailored cover letter based on the job description and resume. The letter should be professional, specific to the role, highlight relevant experience, and show enthusiasm. Keep it to 3-4 paragraphs. Return a JSON object: {"coverLetter": "<the full cover letter text>"}`;
      userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}\n\nWrite a tailored cover letter. Return ONLY valid JSON.`;
    } else if (action === "interview-questions") {
      systemPrompt = `You are an interview preparation expert. Based on the job description, generate likely interview questions. Return JSON:
{
  "behavioral": [{"question": "<q>", "hint": "<answer framework>"}],
  "technical": [{"question": "<q>", "hint": "<answer framework>"}],
  "scenario": [{"question": "<q>", "hint": "<answer framework>"}]
}`;
      userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}\n\nGenerate interview questions. Return ONLY valid JSON.`;
    } else {
      throw new Error("Invalid action");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response (strip markdown fences if present)
    let parsed;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("optimize-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
