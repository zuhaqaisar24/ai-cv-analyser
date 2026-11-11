"use client";

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
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
          Analyse another CV
        </Link>
        <p className="text-sm text-muted-foreground">
          {result.mode === "mock" ? "Mock mode" : `Live mode · ${result.model ?? "model"}`}
        </p>
      </div>

      {result.mode === "mock" ? (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertTitle>Mock mode</AlertTitle>
          <AlertDescription>
            There is no API key, so the profile below is sample data for a fictional graduate, Jordan Hale. It is not a reading of the CV you submitted. The text that was extracted is at the bottom of this page, which is how you check the PDF parser.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertTitle>Live mode</AlertTitle>
          <AlertDescription>
            Profile extracted with {result.model}. Check anything important against the CV text at the bottom. Models miss things, and sometimes add them.
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

      <CvProfileView profile={result.cvProfile} />
      <PlannedSections result={result} />

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground">Text sent for extraction</summary>
        <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/70 p-3 font-sans text-sm">
          {result.cvText}
        </pre>
      </details>
    </div>
  );
}
