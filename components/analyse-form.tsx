"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PDF_BYTES, MIN_CV_CHARS, MIN_JOB_CHARS } from "@/lib/limits";
import { saveAnalysis } from "@/lib/storage";
import type { AnalyseErrorBody, AnalyseResponse } from "@/lib/types";

type CvMode = "paste" | "pdf";

export function AnalyseForm() {
  const router = useRouter();
  const [mode, setMode] = useState<CvMode>("paste");
  const [cvText, setCvText] = useState("");
  const [jobAdvert, setJobAdvert] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function loadSample() {
    setError(null);
    const [cv, job] = await Promise.all([
      fetch("/samples/cv.txt").then((response) => response.text()),
      fetch("/samples/job-advert.txt").then((response) => response.text()),
    ]);
    setCvText(cv.trim());
    setJobAdvert(job.trim());
    setMode("paste");
    setFile(null);
  }

  async function useSamplePdf() {
    setError(null);
    const [pdf, job] = await Promise.all([
      fetch("/samples/sample-cv.pdf").then((response) => response.blob()),
      fetch("/samples/job-advert.txt").then((response) => response.text()),
    ]);
    setFile(new File([pdf], "sample-cv.pdf", { type: "application/pdf" }));
    setJobAdvert(job.trim());
    setMode("pdf");
  }

  function takeFile(next: File | null) {
    setError(null);
    if (!next) {
      setFile(null);
      return;
    }
    const looksPdf = next.type === "application/pdf" || next.name.toLowerCase().endsWith(".pdf");
    if (!looksPdf) {
      setFile(null);
      setError("Upload a PDF, or switch to Paste text.");
      return;
    }
    if (next.size > MAX_PDF_BYTES) {
      setFile(null);
      setError("That PDF is over 5 MB. Paste the text, or export a smaller file.");
      return;
    }
    setFile(next);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "paste" && cvText.trim().length < MIN_CV_CHARS) {
      setError("Paste more of the CV. A few words is not enough to build a profile.");
      return;
    }
    if (mode === "pdf" && !file) {
      setError("Choose a PDF, or switch to Paste text.");
      return;
    }
    if (jobAdvert.trim().length < MIN_JOB_CHARS) {
      setError("Paste the job advert as well. The later lessons need the original wording.");
      return;
    }

    const body = new FormData();
    if (mode === "pdf" && file) {
      body.set("cvFile", file);
    } else {
      body.set("cvText", cvText);
    }
    body.set("jobAdvert", jobAdvert);

    setPending(true);
    try {
      const response = await fetch("/api/analyse", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as
        | AnalyseResponse
        | AnalyseErrorBody
        | null;
      if (!response.ok) {
        const message =
          payload && "error" in payload
            ? payload.error
            : "The analysis failed.";
        setError(message);
        return;
      }
      if (!payload || !("cvProfile" in payload)) {
        setError("The server returned something this page could not read.");
        return;
      }
      saveAnalysis(payload);
      router.push("/results");
    } catch {
      setError("Could not reach the server. Is npm run dev still running?");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-lift rounded-2xl bg-card px-4 py-6 shadow-sm ring-1 ring-primary/10 sm:px-6" aria-busy={pending}>
      <Alert className="mb-5 items-center border-border bg-secondary/70 py-2 text-foreground shadow-none">
        <Info />
        <AlertDescription className="text-foreground/85">
          Test mode: showing a sample profile. Add GEMINI_API_KEY to .env.local to analyse your own CV.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl">Your CV</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Paste the text, or upload a PDF that contains real text rather than a scan.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={loadSample} disabled={pending}>
          Load sample
        </Button>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => {
          if (value === "paste" || value === "pdf") {
            setMode(value);
            setError(null);
          }
        }}
        className="mt-5"
      >
        <TabsList className="h-10">
          <TabsTrigger value="paste">Paste text</TabsTrigger>
          <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-4">
          <Label htmlFor="cv-text">CV text</Label>
          <Textarea
            id="cv-text"
            value={cvText}
            onChange={(event) => setCvText(event.target.value)}
            disabled={pending}
            placeholder="Paste the CV here."
            className="mt-2 min-h-56 md:text-base"
            aria-invalid={mode === "paste" && error !== null && cvText.trim().length < MIN_CV_CHARS}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {cvText.trim().length} characters. At least {MIN_CV_CHARS}.
          </p>
        </TabsContent>

        <TabsContent value="pdf" className="mt-4">
          <Label htmlFor="cv-file">CV file</Label>
          <div
            className={`mt-2 rounded-lg border border-dashed px-4 py-8 text-center ${dragging ? "border-primary bg-accent" : "border-input bg-background"}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              takeFile(event.dataTransfer.files?.[0] ?? null);
            }}
          >
            <input
              id="cv-file"
              type="file"
              accept="application/pdf,.pdf"
              disabled={pending}
              className="sr-only"
              onChange={(event) => takeFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-sm">
              {file ? file.name : "Drop a PDF here, or choose a file."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Text PDFs only. A scan will not extract. Max 5 MB.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => document.getElementById("cv-file")?.click()}
              >
                Choose PDF
              </Button>
              <Button type="button" variant="ghost" disabled={pending} onClick={useSamplePdf}>
                Use sample PDF
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Label htmlFor="job-advert">Job advert</Label>
        <Textarea
          id="job-advert"
          value={jobAdvert}
          onChange={(event) => setJobAdvert(event.target.value)}
          disabled={pending}
          placeholder="Paste the advert here."
          className="mt-2 min-h-40 md:text-base"
        />
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This is the job you want the CV compared with. CVAnalyser keeps the wording you paste. Matching that advert against the CV starts in Lesson 1, and it is not built yet.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {jobAdvert.trim().length} characters. At least {MIN_JOB_CHARS}.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Could not analyse that</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={pending} className="h-10 px-4">
          {pending ? "Reading the CV…" : "Analyse CV"}
        </Button>
        <p className="text-sm text-muted-foreground">
          The next page shows what was read from your CV. Without an API key, the profile itself is the sample.
        </p>
      </div>
    </form>
  );
}
