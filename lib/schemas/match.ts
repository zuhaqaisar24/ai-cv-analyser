import { z } from "zod";

/**
 * Contract for lesson 2.
 * overall is 0 to 100.
 * similarity is 1 for an exact or alias match, and cosine similarity
 * (0 to 1) for an embedding match.
 */
export const skillOverlapSchema = z.object({
  advertSkill: z.string(),
  cvSkill: z.string(),
  method: z.enum(["exact", "alias", "embedding"]),
  similarity: z.number(),
});

export const matchScoreSchema = z.object({
  overall: z.number(),
  summary: z.string(),
  overlaps: z.array(skillOverlapSchema),
  missingFromCv: z.array(z.string()),
});

export const embeddingHitSchema = z.object({
  advertSkill: z.string(),
  cvSkill: z.string(),
  similarity: z.number(),
});

export type SkillOverlap = z.infer<typeof skillOverlapSchema>;
export type MatchScore = z.infer<typeof matchScoreSchema>;
export type EmbeddingHit = z.infer<typeof embeddingHitSchema>;
