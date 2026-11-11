import type { GapAnalysis } from "@/lib/schemas/gaps";
import type { LearningResources } from "@/lib/schemas/resources";

/**
 * TODO(lesson-5): Suggest learning links for the gaps.
 *
 * Only return URLs that exist in ./catalogue.ts.
 * A keyword overlap between the gap and each entry's topics is enough.
 * If you call a model, it may return catalogue ids, never URLs.
 * Log completion.usage if you make a call, and fall back to the keyword
 * match when the call throws. Read maxRetries in lib/openai.ts first.
 *
 * If gaps is null, return null.
 * At most two links per gap. Skip a gap when nothing in the catalogue is close.
 * In mock mode, return sampleResources from lib/samples.ts.
 *
 * See LESSON_PLAN.md, lesson 5.
 */
export async function suggestLearningResources(
  _gaps: GapAnalysis | null,
): Promise<LearningResources | null> {
  return null;
}
