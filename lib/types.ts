import type { CvProfile } from "@/lib/schemas/cv-profile";
import type { GapAnalysis } from "@/lib/schemas/gaps";
import type { JobAdvertProfile } from "@/lib/schemas/job-advert";
import type { MatchScore } from "@/lib/schemas/match";
import type { LearningResources } from "@/lib/schemas/resources";
import type { BulletRewrites } from "@/lib/schemas/rewrites";

export type AnalyseResponse = {
  mode: "mock" | "live";
  model: string | null;
  cvTruncated: boolean;
  jobTruncated: boolean;
  cvText: string;
  jobAdvertText: string;
  guard: {
    active: boolean;
    notes: string[];
  };
  warnings: string[];
  cvProfile: CvProfile;
  jobProfile: JobAdvertProfile | null;
  match: MatchScore | null;
  gaps: GapAnalysis | null;
  rewrites: BulletRewrites | null;
  resources: LearningResources | null;
};

export type AnalyseErrorBody = {
  error: string;
};
