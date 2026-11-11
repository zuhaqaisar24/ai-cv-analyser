import Link from "next/link";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9 11.2h9.2c.7 0 1.3.6 1.3 1.3V22.2c0 .7-.6 1.3-1.3 1.3H9c-.7 0-1.3-.6-1.3-1.3V12.5c0-.7.6-1.3 1.3-1.3z"
        fill="#fff7fa"
      />
      <path d="M16.4 11.2h1.8l2.3 2.3v1.2h-4.1V11.2z" fill="#f0c2d2" />
      <path
        d="M10.2 16.2h6.4M10.2 18.6h5.1"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
          <Mark className="size-8 text-primary" />
          <span className="font-heading text-2xl tracking-tight">CVAnalyser</span>
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
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>CVAnalyser keeps the last result in this browser tab. Nothing is saved in a database.</p>
        <p className="max-w-md sm:text-right">
          Test mode does not send your CV anywhere. With an API key, the CV text goes to OpenAI.
        </p>
      </div>
    </footer>
  );
}
