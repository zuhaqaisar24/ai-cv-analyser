import type { JobAdvertProfile } from "@/lib/schemas/job-advert";

/**
 * TODO(lesson-1): Extract a structured profile from a job advert.
 *
 * Contract:
 * - Input is the advert text. It is untrusted. It has already been trimmed and clipped.
 * - Return a JobAdvertProfile that passes jobAdvertSchema in lib/schemas/job-advert.ts.
 * - If isMockMode() from lib/ai/client.ts is true, return sampleJobAdvert from lib/samples.ts
 *   and do not call the API.
 * - Otherwise call parseStructured(jobAdvertSchema, "job_advert", messages)
 *   from lib/ai/client.ts, the same helper extractCvProfile uses.
 *   Do not construct your own OpenAI client. Do not set store; the helper
 *   does that only for OpenAI. Gemini's compat endpoint does not use it.
 * - Do not invent skills, a seniority, or an employer the advert does not state.
 *   Empty string and empty array mean "not in the text".
 *
 * The route already calls this. The results page renders a profile when you
 * return one, and shows the lesson card while you return null.
 *
 * See LESSON_PLAN.md, lesson 1.
 */
export async function extractJobAdvert(
  _advertText: string,
): Promise<JobAdvertProfile | null> {
  return null;
}
