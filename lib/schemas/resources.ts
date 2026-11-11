import { z } from "zod";

/** Contract for lesson 5. URLs must come from lib/resources/catalogue.ts. */
export const learningResourceSchema = z.object({
  gapTitle: z.string(),
  title: z.string(),
  url: z.string(),
  why: z.string(),
  kind: z.enum(["docs", "course", "practice", "article"]),
});

export const learningResourcesSchema = z.object({
  resources: z.array(learningResourceSchema),
});

export type LearningResource = z.infer<typeof learningResourceSchema>;
export type LearningResources = z.infer<typeof learningResourcesSchema>;
