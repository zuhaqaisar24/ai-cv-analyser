"use client";

import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { CvProfileView } from "@/components/cv-profile-view";
import { PlannedSections } from "@/components/planned-sections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { loadAnalysis } from "@/lib/storage";
import { cn } from "@/lib/utils";

function subscribe(): () => void {
  return () => {};
}

export function ResultsView() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const result = ready ? loadAnalysis() : null;

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted-foreground">Opening the last analysis…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-heading text-4xl">Nothing in this tab yet</h1>
        <p className="mt-3 text-muted-foreground">
          Analyse a CV first. The result is kept in this browser tab, not on a server.
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-6 h-10 px-4")}>
          Back to the form
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "h-9 w-fit gap-1.5 px-3")}
        >
          <ArrowLeft />
          Analyse another CV
        </Link>
        {result.mode === "live" ? (
          <p className="text-sm text-muted-foreground">Live · {result.model ?? "model"}</p>
        ) : null}
      </div>

      {result.mode === "mock" ? (
        <Alert className="items-center border-border bg-secondary/70 py-2 text-foreground shadow-none">
          <Info />
          <AlertDescription className="text-foreground/85">
            Test mode: showing a sample profile. Add GEMINI_API_KEY to .env.local to analyse your own CV.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="items-center border-border bg-card py-2 shadow-none">
          <Info />
          <AlertDescription>
            Profile extracted with {result.model}. Check anything important against the text read from your CV.
          </AlertDescription>
        </Alert>
      )}

      {result.cvTruncated || result.jobTruncated ? (
        <Alert>
          <AlertTitle>Text was clipped</AlertTitle>
          <AlertDescription>
            {result.cvTruncated ? "The CV was longer than 24,000 characters. Only the first part was kept. " : ""}
            {result.jobTruncated ? "The job advert was longer than 16,000 characters. Only the first part was kept." : ""}
          </AlertDescription>
        </Alert>
      ) : null}

      {result.warnings.length > 0 ? (
        <Alert variant="destructive">
          <AlertTitle>A later step failed</AlertTitle>
          <AlertDescription>
            The CV profile still loaded. The lesson that threw is listed below.
            <ul className="mt-2 list-disc pl-5">
              {result.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      {result.guard.notes.length > 0 ? (
        <Alert>
          <AlertTitle>Input guard notes</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {result.guard.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="rise-in">
      <section className="card-lift rounded-2xl bg-card px-5 py-5 shadow-sm ring-1 ring-primary/10">
        <h2 className="font-heading text-2xl">Text read from your CV</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This is the text taken from the file or paste you just submitted. If you recognise it, the upload worked. In test mode the profile further down is still the sample, not this text.
        </p>
        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-accent/70 p-4 font-sans text-sm leading-relaxed">
          {result.cvText}
        </pre>
      </section>
      </div>

      <CvProfileView profile={result.cvProfile} />
      <PlannedSections result={result} />
    </div>
  );
}
