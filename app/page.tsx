import { AnalyseForm } from "@/components/analyse-form";
import { PipelineList } from "@/components/pipeline-list";

export default function HomePage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:py-14">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">CV lab</p>
        <h1 className="mt-3 max-w-xl font-heading text-4xl leading-tight sm:text-5xl">
          Read the CV before you rewrite it.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Upload a PDF or paste the text, then put a job advert next to it. This build returns skills, roles, and education as structured JSON. The score, the gaps, and the new bullets are lessons, and the page is ready for them.
        </p>
        <div className="mt-8">
          <AnalyseForm />
        </div>
      </div>
      <aside className="lg:sticky lg:top-6">
        <PipelineList />
      </aside>
    </div>
  );
}
