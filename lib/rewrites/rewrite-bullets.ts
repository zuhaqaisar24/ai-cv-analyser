import type { CvProfile } from "@/lib/schemas/cv-profile";
import type { GapAnalysis } from "@/lib/schemas/gaps";
import type { BulletRewrites } from "@/lib/schemas/rewrites";

/**
 * TODO(lesson-4): Rewrite weak bullets and bullets that lack a metric.
 *
 * Call parseStructured from lib/ai/client.ts with bulletRewritesSchema,
 * the same helper lib/cv/extract-cv-profile.ts uses. Do not build a second client.
 *
 * Rules that belong in the prompt:
 * - Do not add a tool, a number, or an outcome that is not in the CV.
 * - If a metric is missing, leave a visible blank such as "[number]".
 * - reason says which rule fired.
 * - Skip bullets that are already specific.
 * - At most four rewrites.
 *
 * If you have no gaps yet, return null until lesson 3 is done,
 * or select bullets with the same rules.
 * In mock mode, return sampleRewrites from lib/samples.ts.
 *
 * See LESSON_PLAN.md, lesson 4.
 */
export async function rewriteBullets(
  _cv: CvProfile,
  _gaps: GapAnalysis | null,
): Promise<BulletRewrites | null> {
  return null;
}
