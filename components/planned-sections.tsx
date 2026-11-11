import { LessonCard } from "@/components/lesson-card";
import { Badge } from "@/components/ui/badge";
import { lessonStep } from "@/lib/pipeline";
import type { AnalyseResponse } from "@/lib/types";

const gapLabel = {
  missing_skill: "Missing skill",
  weak_bullet: "Weak bullet",
  missing_metric: "Missing metric",
} as const;

function httpsUrl(url: string): string | null {
  if (url.startsWith("https://")) {
    return url;
  }
  return null;
}

export function PlannedSections({ result }: { result: AnalyseResponse }) {
  return (
    <div className="space-y-6">
      <section>
        {result.jobProfile ? (
          <div>
            <h2 className="font-heading text-2xl">Job advert profile</h2>
            <p className="mt-2 text-lg font-medium">
              {result.jobProfile.title || "Untitled role"}
              {result.jobProfile.organisation ? (
                <span className="text-muted-foreground">, {result.jobProfile.organisation}</span>
              ) : null}
            </p>
            <p className="text-sm text-muted-foreground">
              {[result.jobProfile.location, result.jobProfile.seniority].filter(Boolean).join(" · ") ||
                "Location and seniority not stated."}
            </p>
            <SkillList label="Must have" skills={result.jobProfile.mustHaveSkills ?? []} />
            <SkillList label="Nice to have" skills={result.jobProfile.niceToHaveSkills ?? []} />
            {(result.jobProfile.responsibilities ?? []).length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {(result.jobProfile.responsibilities ?? []).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <LessonCard step={lessonStep("job")} />
        )}
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-muted-foreground">Job advert text</summary>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/70 p-3 font-sans text-sm">
            {result.jobAdvertText}
          </pre>
        </details>
      </section>

      <section>
        {result.match ? (
          <div>
            <h2 className="font-heading text-2xl">Match score</h2>
            <p className="mt-2 font-heading text-5xl tabular-nums text-primary">
              {Math.round(result.match.overall)}
              <span className="ml-2 text-lg text-muted-foreground">out of 100</span>
            </p>
            <p className="mt-3 max-w-3xl leading-relaxed">{result.match.summary}</p>
            {(result.match.overlaps ?? []).length > 0 ? (
              <ul className="mt-4 space-y-2">
                {(result.match.overlaps ?? []).map((overlap) => (
                  <li
                    key={`${overlap.advertSkill}-${overlap.cvSkill}`}
                    className="flex flex-col gap-1 border-t border-border py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      <span className="font-medium">{overlap.advertSkill}</span>
                      <span className="text-muted-foreground"> lines up with </span>
                      {overlap.cvSkill}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {overlap.method} · {overlap.similarity.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted-foreground">No overlaps yet.</p>
            )}
            {(result.match.missingFromCv ?? []).length > 0 ? (
              <p className="mt-3 text-sm">
                <span className="font-medium">Not found on the CV: </span>
                {result.match.missingFromCv.join(", ")}
              </p>
            ) : null}
          </div>
        ) : (
          <LessonCard step={lessonStep("match")} />
        )}
      </section>

      <section>
        {result.gaps ? (
          <div>
            <h2 className="font-heading text-2xl">Gaps</h2>
            {result.gaps.gaps.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No gaps were listed.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {result.gaps.gaps.map((gap) => (
                  <li key={`${gap.kind}-${gap.title}-${gap.sourceBullet}`} className="border-t border-border pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{gapLabel[gap.kind]}</Badge>
                      <h3 className="font-medium">{gap.title}</h3>
                    </div>
                    <p className="mt-1 text-sm">{gap.detail}</p>
                    {gap.sourceBullet ? (
                      <p className="mt-1 text-sm text-muted-foreground">“{gap.sourceBullet}”</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <LessonCard step={lessonStep("gaps")} />
        )}
      </section>

      <section>
        {result.rewrites ? (
          <div>
            <h2 className="font-heading text-2xl">Rewritten bullets</h2>
            {result.rewrites.bullets.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No bullets were rewritten.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {result.rewrites.bullets.map((bullet) => (
                  <li key={bullet.original} className="grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Original</p>
                      <p className="mt-1">{bullet.original}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rewrite</p>
                      <p className="mt-1">{bullet.rewritten}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{bullet.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <LessonCard step={lessonStep("rewrites")} />
        )}
      </section>

      <section>
        {result.resources ? (
          <div>
            <h2 className="font-heading text-2xl">Learning resources</h2>
            {result.resources.resources.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No resources were suggested.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {result.resources.resources.map((resource) => {
                  const url = httpsUrl(resource.url);
                  return (
                    <li key={`${resource.gapTitle}-${resource.url}`} className="border-t border-border pt-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{resource.gapTitle}</p>
                      {url ? (
                        <a href={url} className="font-medium text-primary underline-offset-4 hover:underline" rel="noreferrer" target="_blank">
                          {resource.title}
                        </a>
                      ) : (
                        <p className="font-medium">{resource.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{resource.why}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <LessonCard step={lessonStep("resources")} />
        )}
      </section>

      {result.guard.active ? null : <LessonCard step={lessonStep("guard")} />}
    </div>
  );
}

function SkillList({ label, skills }: { label: string; skills: string[] }) {
  if (skills.length === 0) {
    return null;
  }
  return (
    <p className="mt-3 text-sm">
      <span className="font-medium">{label}: </span>
      {skills.join(", ")}
    </p>
  );
}
