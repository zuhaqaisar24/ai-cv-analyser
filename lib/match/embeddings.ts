import type { EmbeddingHit } from "@/lib/schemas/match";

/**
 * TODO(lesson-2): Embedding similarity for skills that did not match exactly.
 *
 * Input is skill names, not the whole CV.
 * One embeddings request can take many strings. Do not call once per skill.
 * Use cosine similarity, and a named threshold (start around 0.75).
 * Model: getEmbeddingModel() from lib/ai/client.ts (gemini-embedding-001
 * on the free tier, text-embedding-3-small if you are on OpenAI).
 * Use getClient().embeddings.create. Do not make your own client.
 *
 * Return [] until you implement it, so the exact-match score can work first.
 * In mock mode, scoreMatch should return sampleMatch and not call this.
 *
 * See LESSON_PLAN.md, lesson 2.
 */
export async function rankSkillsByEmbedding(
  _cvSkills: string[],
  _advertSkills: string[],
): Promise<EmbeddingHit[]> {
  return [];
}
