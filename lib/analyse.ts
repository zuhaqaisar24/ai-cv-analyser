import "server-only";

import { extractCvProfile } from "@/lib/cv/extract-cv-profile";
import { AnalyseError } from "@/lib/errors";
import { analyseGaps } from "@/lib/gaps/analyse-gaps";
import { extractJobAdvert } from "@/lib/job/extract-job-advert";
import { clipText, MAX_CV_CHARS, MAX_JOB_CHARS, MAX_PDF_BYTES, MIN_CV_CHARS, MIN_JOB_CHARS } from "@/lib/limits";
import { scoreMatch } from "@/lib/match/score-match";
import { getModel, isMockMode } from "@/lib/openai";
import { extractPdfText } from "@/lib/pdf";
import { suggestLearningResources } from "@/lib/resources/suggest-resources";
import { rewriteBullets } from "@/lib/rewrites/rewrite-bullets";
import { guardUntrustedText } from "@/lib/safety/guard-input";
import type { AnalyseResponse } from "@/lib/types";

function clean(value: string): string {
  return value.replace(/\u0000/g, "").trim();
}

async function readCv(form: FormData): Promise<string> {
  const file = form.get("cvFile");
  const pasted = form.get("cvText");

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_PDF_BYTES) {
      throw new AnalyseError(
        "That PDF is over 5 MB. Paste the text, or export a smaller file.",
        400,
      );
    }
    const name = file.name.toLowerCase();
    const looksPdf = name.endsWith(".pdf") || file.type === "application/pdf";
    if (!looksPdf) {
      throw new AnalyseError("Upload a PDF, or switch to Paste text.", 400);
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    return extractPdfText(bytes);
  }

  if (typeof pasted === "string") {
    return pasted;
  }

  return "";
}

async function attempt<T>(
  label: string,
  warnings: string[],
  run: () => Promise<T | null>,
): Promise<T | null> {
  try {
    return await run();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    warnings.push(`${label}: ${message}`);
    return null;
  }
}

export async function analyseForm(form: FormData): Promise<AnalyseResponse> {
  const cvRaw = clean(await readCv(form));
  const jobField = form.get("jobAdvert");
  const jobRaw = clean(typeof jobField === "string" ? jobField : "");

  if (cvRaw.length < MIN_CV_CHARS) {
    throw new AnalyseError(
      "The CV has too little text to read. Paste more of it, or use a PDF with real text rather than a scan.",
      400,
    );
  }
  if (jobRaw.length < MIN_JOB_CHARS) {
    throw new AnalyseError(
      "Paste the job advert as well. The later lessons need the original wording.",
      400,
    );
  }

  const cvPrepared = clipText(cvRaw, MAX_CV_CHARS);
  const jobPrepared = clipText(jobRaw, MAX_JOB_CHARS);
  const cvGuard = guardUntrustedText(cvPrepared.text);
  const jobGuard = guardUntrustedText(jobPrepared.text);

  if (!cvGuard.ok || !jobGuard.ok) {
    const notes = [...cvGuard.notes, ...jobGuard.notes];
    throw new AnalyseError(
      notes.join(" ") || "That text was refused by the input guard.",
      400,
    );
  }

  const warnings: string[] = [];
  const cvProfile = await extractCvProfile(cvGuard.text);
  const jobProfile = await attempt("Job advert extraction", warnings, () =>
    extractJobAdvert(jobGuard.text),
  );
  const match = await attempt("Match score", warnings, () =>
    scoreMatch(cvProfile, jobProfile),
  );
  const gaps = await attempt("Gap analysis", warnings, () =>
    analyseGaps(cvProfile, jobProfile, match),
  );
  const rewrites = await attempt("Bullet rewrites", warnings, () =>
    rewriteBullets(cvProfile, gaps),
  );
  const resources = await attempt("Learning resources", warnings, () =>
    suggestLearningResources(gaps),
  );

  const mock = isMockMode();

  return {
    mode: mock ? "mock" : "live",
    model: mock ? null : getModel(),
    cvTruncated: cvPrepared.truncated,
    jobTruncated: jobPrepared.truncated,
    cvText: cvGuard.text,
    jobAdvertText: jobGuard.text,
    guard: {
      active: cvGuard.active && jobGuard.active,
      notes: [
        ...cvGuard.notes.map((note) => `CV: ${note}`),
        ...jobGuard.notes.map((note) => `Job advert: ${note}`),
      ],
    },
    warnings,
    cvProfile,
    jobProfile,
    match,
    gaps,
    rewrites,
    resources,
  };
}
