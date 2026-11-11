import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Link href="/" className="font-heading text-2xl tracking-tight text-foreground">
          CVAnalyser
        </Link>
      </div>
    </header>
  );
}
