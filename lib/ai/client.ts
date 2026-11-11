import "server-only";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { ZodType } from "zod";

import { AnalyseError } from "@/lib/errors";

/**
 * Gemini's OpenAI-compatible endpoint.
 * Docs: https://ai.google.dev/gemini-api/docs/openai
 * Chat model default is gemini-2.5-flash (still listed for this endpoint).
 * Text embeddings default is gemini-embedding-001. gemini-embedding-2 is the
 * newer multimodal embedder; skill names are plain text, so 001 is the match.
 */
export const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
const DEFAULT_OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";

const PLACEHOLDER_KEYS = new Set([
  "your-key-here",
  "your-gemini-key",
  "sk-your-key-here",
  "sk-...",
]);

export type AiProvider = "gemini" | "openai";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

function usableKey(value: string | undefined): string | null {
  const key = clean(value);
  if (!key || PLACEHOLDER_KEYS.has(key)) {
    return null;
  }
  return key;
}

/**
 * Gemini wins when both keys are set. No usable key, or MOCK_LLM=true,
 * means test mode: sample data, no network call.
 */
export function getProvider(): AiProvider | null {
  if (process.env.MOCK_LLM === "true") {
    return null;
  }
  if (usableKey(process.env.GEMINI_API_KEY)) {
    return "gemini";
  }
  if (usableKey(process.env.OPENAI_API_KEY)) {
    return "openai";
  }
  return null;
}

export function isMockMode(): boolean {
  return getProvider() === null;
}

export function getModel(): string {
  const chosen = clean(process.env.AI_MODEL);
  if (chosen) {
    return chosen;
  }
  if (getProvider() === "openai") {
    return clean(process.env.OPENAI_MODEL) || DEFAULT_OPENAI_MODEL;
  }
  return DEFAULT_GEMINI_MODEL;
}

/** Lesson 2 should call this instead of hard-coding an embedding model. */
export function getEmbeddingModel(): string {
  const chosen = clean(process.env.AI_EMBEDDING_MODEL);
  if (chosen) {
    return chosen;
  }
  return getProvider() === "openai"
    ? DEFAULT_OPENAI_EMBEDDING_MODEL
    : DEFAULT_GEMINI_EMBEDDING_MODEL;
}

export function getClient(): OpenAI {
  const provider = getProvider();
  if (provider === "gemini") {
    return new OpenAI({
      apiKey: usableKey(process.env.GEMINI_API_KEY) ?? "",
      baseURL: GEMINI_BASE_URL,
      maxRetries: 2,
    });
  }
  if (provider === "openai") {
    return new OpenAI({
      apiKey: usableKey(process.env.OPENAI_API_KEY) ?? "",
      maxRetries: 2,
    });
  }
  throw new Error("No API key is set.");
}

export function explainAiError(error: unknown): AnalyseError {
  if (error instanceof AnalyseError) {
    return error;
  }
  if (error instanceof OpenAI.APIError) {
    const provider = getProvider() === "openai" ? "OpenAI" : "Gemini";
    const keyName = getProvider() === "openai" ? "OPENAI_API_KEY" : "GEMINI_API_KEY";
    if (error.status === 401 || error.status === 403) {
      return new AnalyseError(
        `The ${provider} key was rejected. Check ${keyName} in .env.local.`,
        401,
      );
    }
    if (error.status === 429) {
      const wait =
        provider === "Gemini"
          ? " The free tier allows a small number of calls per minute. Wait a minute and try again."
          : " Wait a moment and try again.";
      return new AnalyseError(
        `The ${provider} rate limit was hit (429).${wait}`,
        429,
      );
    }
    return new AnalyseError(
      `The model call failed (${error.status ?? "error"}). ${error.message}`,
      502,
    );
  }
  if (error instanceof Error && error.name === "ZodError") {
    return new AnalyseError("The model reply did not match the schema.", 502);
  }
  const detail = error instanceof Error ? error.message : "Unknown error";
  return new AnalyseError(`The model call failed. ${detail}`, 502);
}

function isUnsupportedFormat(error: unknown): boolean {
  if (!(error instanceof OpenAI.APIError) || error.status !== 400) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes("response_format") ||
    message.includes("json_schema") ||
    message.includes("structured") ||
    message.includes("response mime")
  );
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function readJsonContent<T>(content: string | null | undefined, schema: ZodType<T>): T {
  if (!content) {
    throw new AnalyseError("The model returned no JSON.", 502);
  }
  try {
    return schema.parse(parseJsonContent(content));
  } catch (error) {
    throw explainAiError(error);
  }
}

/**
 * One structured call for every lesson.
 * Tries chat.completions.parse (zodResponseFormat). Gemini's compat docs
 * accept that json_schema body. If the endpoint rejects the format, this
 * retries with json_schema via create(), then json_object, and Zod-checks
 * the text either way.
 */
export async function parseStructured<T>(
  schema: ZodType<T>,
  name: string,
  messages: ChatMessage[],
): Promise<T> {
  const client = getClient();
  const model = getModel();
  const format = zodResponseFormat(schema, name);
  const shared = {
    model,
    temperature: 0,
    max_tokens: 4000,
    messages,
    ...(getProvider() === "openai" ? { store: false as const } : {}),
  };

  try {
    const completion = await client.chat.completions.parse({
      ...shared,
      response_format: format,
    });
    const message = completion.choices[0]?.message;
    if (message?.parsed) {
      return schema.parse(message.parsed);
    }
    if (message?.refusal) {
      throw new AnalyseError("The model refused this document.", 422);
    }
    if (message?.content) {
      return readJsonContent(message.content, schema);
    }
    throw new AnalyseError("The model returned no profile.", 502);
  } catch (error) {
    if (error instanceof AnalyseError) {
      throw error;
    }
    if (!isUnsupportedFormat(error)) {
      throw explainAiError(error);
    }
  }

  try {
    const completion = await client.chat.completions.create({
      ...shared,
      response_format: format,
    });
    return readJsonContent(completion.choices[0]?.message?.content, schema);
  } catch (error) {
    if (!isUnsupportedFormat(error)) {
      throw explainAiError(error);
    }
  }

  try {
    const completion = await client.chat.completions.create({
      ...shared,
      response_format: { type: "json_object" },
    });
    return readJsonContent(completion.choices[0]?.message?.content, schema);
  } catch (error) {
    throw explainAiError(error);
  }
}
