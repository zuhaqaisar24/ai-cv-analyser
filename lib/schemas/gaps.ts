import { z } from "zod";

/** Contract for lesson 3. */
export const gapSchema = z.object({
  kind: z.enum(["missing_skill", "weak_bullet", "missing_metric"]),
  title: z.string(),
  detail: z.string(),
  relatedSkill: z.string().describe("Empty string if this gap is not about one skill."),
  sourceBullet: z.string().describe("The original bullet, or empty for a missing skill."),
});

export const gapAnalysisSchema = z.object({
  gaps: z.array(gapSchema),
});

export type Gap = z.infer<typeof gapSchema>;
export type GapAnalysis = z.infer<typeof gapAnalysisSchema>;
