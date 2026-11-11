import type { CvProfile } from "@/lib/schemas/cv-profile";
import type { JobAdvertProfile } from "@/lib/schemas/job-advert";
import type { MatchScore } from "@/lib/schemas/match";

/**
 * TODO(lesson-2): Score how well the CV covers the advert.
 *
 * Contract (lib/schemas/match.ts):
 * - overall is a number from 0 to 100.
 * - overlaps list advert skills you could attach to a CV skill.
 * - method is "exact", "alias", or "embedding".
 * - similarity is 1 for exact or alias, and the cosine value for embedding.
 * - missingFromCv lists advert skills you did not attach.
 * - summary states the rule in plain language.
 *
 * Do the exact join in ordinary TypeScript first (trim, lowercase).
 * A short alias map is fine. Then call rankSkillsByEmbedding in
 * ./embeddings.ts for the advert skills that are still unmatched.
 * It returns [] until you fill it in.
 *
 * If job is null, return null.
 * In mock mode, return sampleMatch from lib/samples.ts and do not call the API.
 *
 * See LESSON_PLAN.md, lesson 2.
 */
export async function scoreMatch(
  _cv: CvProfile,
  _job: JobAdvertProfile | null,
): Promise<MatchScore | null> {
  return null;
}
