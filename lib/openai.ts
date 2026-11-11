import "server-only";

import OpenAI from "openai";

const PLACEHOLDER_KEYS = new Set([
  "your-key-here",
  "sk-your-key-here",
  "sk-...",
]);

/**
 * Mock mode is the default. A missing key, a placeholder key, or
 * MOCK_LLM=true all skip the network call.
 */
export function isMockMode(): boolean {
  if (process.env.MOCK_LLM === "true") {
    return true;
  }
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return true;
  }
  return PLACEHOLDER_KEYS.has(key);
}

export function getModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error("OPENAI_API_KEY is not set.");
  }
  return new OpenAI({
    apiKey: key,
    // The SDK already retries a couple of times. Lesson 5 is about
    // knowing that before adding another loop.
    maxRetries: 2,
  });
}
