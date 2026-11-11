import { cvProfileSchema, type CvProfile } from "@/lib/schemas/cv-profile";
import { gapAnalysisSchema, type GapAnalysis } from "@/lib/schemas/gaps";
import { jobAdvertSchema, type JobAdvertProfile } from "@/lib/schemas/job-advert";
import { matchScoreSchema, type MatchScore } from "@/lib/schemas/match";
import { learningResourcesSchema, type LearningResources } from "@/lib/schemas/resources";
import { bulletRewritesSchema, type BulletRewrites } from "@/lib/schemas/rewrites";

/**
 * Fixed payloads for mock mode. Jordan Hale is fictional.
 * Lesson stubs return null until you return these (or a live result)
 * from the TODO functions. See LESSON_PLAN.md.
 */

export const sampleCvProfile: CvProfile = cvProfileSchema.parse({
  name: "Jordan Hale",
  headline: "MSc Computing graduate",
  summary:
    "MSc Computing graduate with a dissertation on unusual queries in a university database, and a placement year on a campus security operations team. Hands-on with SQL, PostgreSQL, Python, and SIEM alert notes.",
  skills: [
    {
      name: "SQL",
      category: "database",
      evidence: "Wrote SQL to pull weekly account-lockout counts.",
    },
    {
      name: "PostgreSQL",
      category: "database",
      evidence: "Loaded 40,000 query logs into PostgreSQL.",
    },
    {
      name: "Python",
      category: "language",
      evidence: "Built a Python script to flag queries outside office hours.",
    },
    {
      name: "Linux",
      category: "tool",
      evidence: "Listed under skills.",
    },
    {
      name: "Threat modelling",
      category: "security",
      evidence: "Listed under skills.",
    },
    {
      name: "SIEM log review",
      category: "security",
      evidence: "Reviewed SIEM alerts during on-call shadowing.",
    },
    {
      name: "Git",
      category: "tool",
      evidence: "Listed under skills.",
    },
  ],
  roles: [
    {
      title: "Security Operations Intern",
      organisation: "Northwind Campus IT",
      location: "Leeds",
      start: "June 2024",
      end: "June 2025",
      bullets: [
        "Reviewed SIEM alerts during on-call shadowing and wrote a one-line note for each alert I closed.",
        "Wrote SQL to pull weekly account-lockout counts for the identity team.",
        "Documented three phishing incidents for the service desk, including which mailbox rule was abused.",
        "Helped improve security.",
      ],
    },
    {
      title: "Research Assistant",
      organisation: "School of Computing, University of Example",
      location: "",
      start: "October 2023",
      end: "May 2024",
      bullets: [
        "Cleaned a CSV of 40,000 query logs and loaded them into PostgreSQL.",
        "Built a Python script to flag queries outside office hours.",
        "Worked on a project with the team.",
      ],
    },
  ],
  education: [
    {
      qualification: "MSc Computing",
      field: "Computing",
      institution: "University of Example",
      year: "2025",
      notes: "Dissertation: anomaly detection on database audit logs.",
    },
    {
      qualification: "BSc Computer Science",
      field: "Computer Science",
      institution: "University of Example",
      year: "2023",
      notes: "",
    },
  ],
});

export const sampleJobAdvert: JobAdvertProfile = jobAdvertSchema.parse({
  title: "Graduate Cyber Security Analyst",
  organisation: "Harbour & Co",
  location: "Leeds, hybrid",
  seniority: "Graduate",
  mustHaveSkills: ["SQL", "Python", "Linux", "Incident documentation"],
  niceToHaveSkills: ["Splunk", "Kubernetes", "AWS", "CISSP"],
  responsibilities: [
    "Triage security alerts and write a short note for each one you close.",
    "Tune noisy detections with a senior analyst.",
    "Help the team keep incident tickets factual and complete.",
  ],
});

export const sampleMatch: MatchScore = matchScoreSchema.parse({
  overall: 58,
  summary:
    "SQL, Python, and Linux match by name. Incident documentation is covered by the phishing write-ups. Splunk, Kubernetes, AWS, and CISSP are on the advert and not on the CV. This is fixed sample data for mock mode.",
  overlaps: [
    { advertSkill: "SQL", cvSkill: "SQL", method: "exact", similarity: 1 },
    { advertSkill: "Python", cvSkill: "Python", method: "exact", similarity: 1 },
    { advertSkill: "Linux", cvSkill: "Linux", method: "exact", similarity: 1 },
    {
      advertSkill: "Incident documentation",
      cvSkill: "Documented three phishing incidents",
      method: "alias",
      similarity: 1,
    },
  ],
  missingFromCv: ["Splunk", "Kubernetes", "AWS", "CISSP"],
});

export const sampleGaps: GapAnalysis = gapAnalysisSchema.parse({
  gaps: [
    {
      kind: "missing_skill",
      title: "Splunk",
      detail: "The advert lists Splunk under nice to have, and the CV does not.",
      relatedSkill: "Splunk",
      sourceBullet: "",
    },
    {
      kind: "missing_skill",
      title: "Kubernetes",
      detail: "The advert lists Kubernetes under nice to have, and the CV does not.",
      relatedSkill: "Kubernetes",
      sourceBullet: "",
    },
    {
      kind: "weak_bullet",
      title: "Vague security bullet",
      detail: "The bullet names no system, change, or result.",
      relatedSkill: "",
      sourceBullet: "Helped improve security.",
    },
    {
      kind: "missing_metric",
      title: "Lockout query has no scale",
      detail: "The work is specific, but there is no count of accounts, weeks, or rows.",
      relatedSkill: "SQL",
      sourceBullet: "Wrote SQL to pull weekly account-lockout counts for the identity team.",
    },
  ],
});

export const sampleRewrites: BulletRewrites = bulletRewritesSchema.parse({
  bullets: [
    {
      original: "Helped improve security.",
      rewritten:
        "[Name the control or process you changed, and what was different afterwards.]",
      reason:
        "The original has no system and no outcome. The rewrite leaves a blank instead of inventing one.",
    },
    {
      original: "Wrote SQL to pull weekly account-lockout counts for the identity team.",
      rewritten:
        "Wrote SQL to pull weekly account-lockout counts for the identity team ([count] accounts across [span]).",
      reason: "The action and the audience are already in the bullet. Only the scale is missing.",
    },
  ],
});

export const sampleResources: LearningResources = learningResourcesSchema.parse({
  resources: [
    {
      gapTitle: "Splunk",
      title: "MITRE ATT&CK",
      url: "https://attack.mitre.org/",
      why: "A map of attacker techniques. Useful context before learning any one SIEM product.",
      kind: "docs",
    },
    {
      gapTitle: "Splunk",
      title: "Splunk documentation",
      url: "https://docs.splunk.com/Documentation",
      why: "Official product docs for the tool named on the advert.",
      kind: "docs",
    },
    {
      gapTitle: "Kubernetes",
      title: "Kubernetes documentation",
      url: "https://kubernetes.io/docs/home/",
      why: "The official introduction and task docs.",
      kind: "docs",
    },
  ],
});
