import { pipeline } from "@/lib/pipeline";

import { Badge } from "@/components/ui/badge";

export function PipelineList() {
  return (
    <section className="rounded-2xl bg-card px-5 py-5 shadow-sm ring-1 ring-primary/10">
      <h2 className="font-heading text-lg">In this build</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Two steps run today. The rest are lessons, and the results page is already waiting for them.
      </p>
      <ol className="mt-4 space-y-3">
        {pipeline.map((step) => (
          <li key={step.id} className="flex items-start gap-3">
            <Badge variant={step.state === "works" ? "default" : "outline"}>
              {step.state === "works" ? "Works" : `Lesson ${step.lesson}`}
            </Badge>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-5">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
