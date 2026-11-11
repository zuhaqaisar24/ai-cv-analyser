import type { CvProfile } from "@/lib/schemas/cv-profile";
import type { GapAnalysis } from "@/lib/schemas/gaps";
import type { JobAdvertProfile } from "@/lib/schemas/job-advert";
import type { MatchScore } from "@/lib/schemas/match";

/**
 * TODO(lesson-3): List gaps a person can act on.
 *
 * This step does not need a model. You already have JSON.
 *
 * Kinds (lib/schemas/gaps.ts):
 * - missing_skill: on the advert, not attached by the match.
 * - weak_bullet: vague, no system and no outcome. Write your rule in a comment.
 * - missing_metric: real work, but no digit. Do not also mark it weak.
 *
 * If match is null, return null.
 * Cap the list. Prefer must-have misses over nice-to-have misses.
 * In mock mode, return sampleGaps from lib/samples.ts.
 *
 * See LESSON_PLAN.md, lesson 3.
 */
export async function analyseGaps(
  _cv: CvProfile,
  _job: JobAdvertProfile | null,
  _match: MatchScore | null,
): Promise<GapAnalysis | null> {
  return null;
}
