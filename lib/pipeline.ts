export type PipelineStep = {
  id: string;
  title: string;
  detail: string;
  state: "works" | "lesson";
  lesson?: number;
  lessonName?: string;
  file?: string;
};

export const pipeline: PipelineStep[] = [
  {
    id: "read",
    title: "Read the CV",
    detail: "PDF text extraction, or the text you paste.",
    state: "works",
  },
  {
    id: "profile",
    title: "CV profile",
    detail: "Skills, roles, and education as JSON. Sample data when there is no API key.",
    state: "works",
  },
  {
    id: "job",
    title: "Job advert profile",
    detail: "Title, skills, and responsibilities from the advert.",
    state: "lesson",
    lesson: 1,
    lessonName: "One call, one shape",
    file: "lib/job/extract-job-advert.ts",
  },
  {
    id: "match",
    title: "Match score",
    detail: "Exact overlap first, then embeddings for the near misses.",
    state: "lesson",
    lesson: 2,
    lessonName: "Same skill, different words",
    file: "lib/match/score-match.ts",
  },
  {
    id: "gaps",
    title: "Gap analysis",
    detail: "Missing skills, weak bullets, and bullets with no number.",
    state: "lesson",
    lesson: 3,
    lessonName: "What is missing",
    file: "lib/gaps/analyse-gaps.ts",
  },
  {
    id: "rewrites",
    title: "Bullet rewrites",
    detail: "New wording that does not invent facts.",
    state: "lesson",
    lesson: 4,
    lessonName: "Say what good looks like",
    file: "lib/rewrites/rewrite-bullets.ts",
  },
  {
    id: "resources",
    title: "Learning resources",
    detail: "A real link from the catalogue for each gap.",
    state: "lesson",
    lesson: 5,
    lessonName: "When the call fails, or costs money",
    file: "lib/resources/suggest-resources.ts",
  },
  {
    id: "guard",
    title: "Input guard",
    detail: "Treat the CV as data, not as instructions.",
    state: "lesson",
    lesson: 6,
    lessonName: "The CV is not instructions",
    file: "lib/safety/guard-input.ts",
  },
];

export function lessonStep(id: string): PipelineStep {
  const step = pipeline.find((item) => item.id === id);
  if (!step) {
    throw new Error(`Unknown pipeline step: ${id}`);
  }
  return step;
}
