import type { AnalyseResponse } from "@/lib/types";

const STORAGE_KEY = "ai-cv-analyser:last-result";

export function saveAnalysis(result: AnalyseResponse): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadAnalysis(): AnalyseResponse | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AnalyseResponse;
    if (!parsed || typeof parsed !== "object" || !parsed.cvProfile) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
