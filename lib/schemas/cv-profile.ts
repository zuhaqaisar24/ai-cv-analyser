import { z } from "zod";

/**
 * Strict structured outputs reject `.optional()` fields.
 * Missing text is an empty string. Missing lists are empty arrays.
 * Lesson 1 in LESSON_PLAN.md covers why.
 */
export const skillCategorySchema = z.enum([
  "language",
  "database",
  "security",
  "cloud",
  "tool",
  "soft",
  "other",
]);

export const cvSkillSchema = z.object({
  name: z.string(),
  category: skillCategorySchema,
  evidence: z
    .string()
    .describe(
      "A short phrase from the CV that supports this skill. Empty string if the CV only lists the name.",
    ),
});

export const cvRoleSchema = z.object({
  title: z.string(),
  organisation: z.string(),
  location: z.string().describe("Empty string if the CV does not say."),
  start: z.string().describe("As written on the CV, or empty."),
  end: z.string().describe("As written on the CV, 'present', or empty."),
  bullets: z.array(z.string()),
});

export const cvEducationSchema = z.object({
  qualification: z.string(),
  field: z.string().describe("Empty string if the CV does not say."),
  institution: z.string(),
  year: z.string().describe("As written, or empty."),
  notes: z.string().describe("Dissertation or grade, or empty."),
});

export const cvProfileSchema = z.object({
  name: z.string().describe("Empty string if the CV has no name."),
  headline: z.string().describe("One line from the CV, or empty."),
  summary: z
    .string()
    .describe("At most two sentences. Only facts written in the CV."),
  skills: z.array(cvSkillSchema),
  roles: z.array(cvRoleSchema),
  education: z.array(cvEducationSchema),
});

export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type CvSkill = z.infer<typeof cvSkillSchema>;
export type CvRole = z.infer<typeof cvRoleSchema>;
export type CvEducation = z.infer<typeof cvEducationSchema>;
export type CvProfile = z.infer<typeof cvProfileSchema>;
