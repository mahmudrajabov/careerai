// localStorage-backed demo data store + simulated AI match analysis.
// No external API keys required — all results are simulated locally.

const APPS_KEY = "careerai.applications";
const ANALYSIS_KEY = "careerai.lastAnalysis";

export const STATUSES = ["Saved", "Applied", "Interview", "Rejected"];

export const STATUS_STYLES = {
  Saved: "bg-primary/15 text-vivid border-primary/40",
  Applied: "bg-warning/15 text-warning border-warning/40",
  Interview: "bg-success/15 text-success border-success/40",
  Rejected: "bg-danger/15 text-danger border-danger/40",
};

// Skill bank used for simulated matching.
const SKILL_BANK = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS",
  "Docker", "Kubernetes", "GraphQL", "REST API", "CSS", "HTML", "Git",
  "Leadership", "Communication", "Project Management", "Agile", "Figma",
  "Data Analysis", "Machine Learning", "Java", "C++", "Go", "Rust",
  "Product Management", "Stakeholder Management", "CI/CD", "Testing",
  "TypeScript", "Next.js", "Tailwind", "PostgreSQL", "MongoDB", "Redis"
];

// Simulated "current CV" skill set — represents what's already on the user's CV.
const DEFAULT_CV_SKILLS = [
  "JavaScript", "React", "CSS", "HTML", "Git", "Node.js", "REST API",
  "Communication", "Agile", "Project Management", "SQL", "Testing"
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function loadApplications() {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    if (!raw) return seedApplications();
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApplications(list) {
  localStorage.setItem(APPS_KEY, JSON.stringify(list));
}

function seedApplications() {
  const seed = [
    {
      id: uid(),
      company: "Vercel",
      role: "Senior Frontend Engineer",
      location: "Remote",
      url: "https://vercel.com",
      status: "Interview",
      appliedDate: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
      notes: "Recruiter call went well. Technical round next week.",
      salary: "$180k"
    },
    {
      id: uid(),
      company: "Stripe",
      role: "Full Stack Engineer",
      location: "San Francisco, CA",
      url: "https://stripe.com",
      status: "Applied",
      appliedDate: new Date(Date.now() - 86400000 * 11).toISOString().slice(0, 10),
      notes: "Submitted via careers page.",
      salary: "$190k"
    },
    {
      id: uid(),
      company: "Linear",
      role: "Product Engineer",
      location: "Remote",
      url: "https://linear.app",
      status: "Saved",
      appliedDate: "",
      notes: "Looks like a great fit — prepare CV.",
      salary: ""
    },
    {
      id: uid(),
      company: "Figma",
      role: "Design Engineer",
      location: "Remote",
      url: "https://figma.com",
      status: "Rejected",
      appliedDate: new Date(Date.now() - 86400000 * 30).toISOString().slice(0, 10),
      notes: "Went with another candidate.",
      salary: "$170k"
    }
  ];
  saveApplications(seed);
  return seed;
}

export function addApplication(data) {
  const list = loadApplications();
  const record = { id: uid, ...data };
  list.unshift(record);
  saveApplications(list);
  return record;
}

export function updateApplication(id, data) {
  const list = loadApplications();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  saveApplications(list);
  return list[idx];
}

export function deleteApplication(id) {
  const list = loadApplications().filter((a) => a.id !== id);
  saveApplications(list);
  return list;
}

// ---- Simulated AI analysis ----

function extractSkills(text) {
  const lower = " " + text.toLowerCase() + " ";
  const found = new Set();
  for (const skill of SKILL_BANK) {
    const key = skill.toLowerCase();
    // word-boundary-ish match
    const re = new RegExp(`[^a-z0-9+#.]${escapeRegExp(key)}[^a-z0-9+#.]`, "i");
    if (re.test(lower) || lower.trim() === key) {
      found.add(skill);
    }
  }
  return [...found];
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function loadLastAnalysis() {
  try {
    return JSON.parse(localStorage.getItem(ANALYSIS_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveLastAnalysis(analysis) {
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
}

/**
 * Simulated AI match analysis.
 * @param {string} jdText - job description
 * @param {{name:string, size:number}} cvFile - uploaded CV file meta
 */
export function analyzeMatch(jdText, cvFile) {
  const jdSkills = extractSkills(jdText || "");
  const cvSkills = DEFAULT_CV_SKILLS.slice();

  let matched = jdSkills.filter((s) => cvSkills.includes(s));
  let missing = jdSkills.filter((s) => !cvSkills.includes(s));

  // Fallback demo content when JD has no recognizable skills.
  if (jdSkills.length === 0) {
    const demo = ["React", "TypeScript", "Node.js", "AWS", "GraphQL"];
    matched = demo.filter((s) => cvSkills.includes(s));
    missing = demo.filter((s) => !cvSkills.includes(s));
  }

  const total = matched.length + missing.length || 1;
  let score = Math.round((matched.length / total) * 100);
  // Add a deterministic-ish nudge so it feels like a real model.
  const seed = (cvFile?.name?.length || 5) + (jdText?.length || 0);
  score = Math.min(98, Math.max(42, score + (seed % 9) - 3));

  const suggestions = buildSuggestions(missing, score, cvFile);

  return {
    score,
    matched,
    missing,
    suggestions,
    jdSkillsCount: jdSkills.length || matched.length + missing.length,
    cvFile: cvFile ? { name: cvFile.name, size: cvFile.size } : null,
    createdAt: new Date().toISOString()
  };
}

function buildSuggestions(missing, score, cvFile) {
  const tips = [];
  if (missing.length > 0) {
    tips.push(
      `Add explicit mentions of ${missing.slice(0, 3).join(", ")} to your CV — these appear in the job description but are missing from your current resume.`
    );
  }
  if (score < 70) {
    tips.push("Rewrite your professional summary to mirror the job's tone and prioritized keywords.");
  } else {
    tips.push("Strong keyword alignment — tighten your top experience bullet to lead with quantified impact.");
  }
  tips.push("Lead each role with a measurable outcome (e.g. 'Improved conversion 24% by…') rather than listing duties.");
  if (cvFile?.size && cvFile.size > 800000) {
    tips.push("Your CV file is large — keep it under 1 page (or 2 for senior roles) and export as optimized PDF.");
  }
  tips.push("Mirror the job title phrasing in your headline so applicant tracking systems index you correctly.");
  return tips;
}

export function computeStats(apps) {
  const total = apps.length;
  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {});
  const interviewRate = total ? Math.round((byStatus.Interview / total) * 100) : 0;
  const responseRate = total
    ? Math.round(((byStatus.Interview) / Math.max(1, byStatus.Applied + byStatus.Interview + byStatus.Rejected)) * 100)
    : 0;
  return { total, byStatus, interviewRate, responseRate };
}