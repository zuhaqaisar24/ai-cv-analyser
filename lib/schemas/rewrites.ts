import { z } from "zod";

/** Contract for lesson 4. */
export const bulletRewriteSchema = z.object({
  original: z.string(),
  rewritten: z.string(),
  reason: z.string(),
});

export const bulletRewritesSchema = z.object({
  bullets: z.array(bulletRewriteSchema),
});

export type BulletRewrite = z.infer<typeof bulletRewriteSchema>;
export type BulletRewrites = z.infer<typeof bulletRewritesSchema>;
