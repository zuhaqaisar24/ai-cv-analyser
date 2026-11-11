import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Link href="/" className="font-heading text-xl tracking-tight text-foreground">
          ai-cv-analyser
        </Link>
        <p className="text-right text-sm text-muted-foreground">
          CV in, structured profile out.
        </p>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>No database. The last result stays in this browser tab.</p>
        <p className="max-w-md sm:text-right">
          Live mode sends the CV text to the OpenAI API. Mock mode does not.
        </p>
      </div>
    </footer>
  );
}
