import type { PipelineStep } from "@/lib/pipeline";

export function LessonCard({ step }: { step: PipelineStep }) {
  return (
    <article className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-4">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
        Lesson {step.lesson}
        {step.lessonName ? ` · ${step.lessonName}` : ""}
      </p>
      <h2 className="mt-1 font-heading text-2xl">{step.title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{step.detail}</p>
      {step.file ? (
        <p className="mt-3 font-mono text-xs text-foreground">
          TODO in <span className="rounded bg-muted px-1.5 py-0.5">{step.file}</span>
        </p>
      ) : null}
    </article>
  );
}
