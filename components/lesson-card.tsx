import type { PipelineStep } from "@/lib/pipeline";

export function LessonCard({ step, delay = 0 }: { step: PipelineStep; delay?: number }) {
  return (
    <div className="rise-in" style={{ animationDelay: `${delay}ms` }}>
    <article className="card-lift rounded-2xl border border-dashed border-primary/35 bg-accent/40 px-5 py-5">
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
    </div>
  );
}
