import type { LearningResource } from "@/lib/schemas/resources";

export type CatalogueEntry = {
  id: string;
  topics: string[];
  title: string;
  url: string;
  why: string;
  kind: LearningResource["kind"];
};

/**
 * Real pages only. Lesson 5 picks from this list.
 * Do not ask a model to invent URLs. Join on `id` if you use a model at all.
 */
export const resourceCatalogue: CatalogueEntry[] = [
  {
    id: "postgres-docs",
    topics: ["postgresql", "postgres", "sql", "database"],
    title: "PostgreSQL documentation",
    url: "https://www.postgresql.org/docs/current/",
    why: "Official reference for SQL, indexes, and roles.",
    kind: "docs",
  },
  {
    id: "sqlite-docs",
    topics: ["sqlite", "sql", "database"],
    title: "SQLite documentation",
    url: "https://www.sqlite.org/docs.html",
    why: "Short, precise docs for a database you can run locally.",
    kind: "docs",
  },
  {
    id: "sqlbolt",
    topics: ["sql", "database", "query"],
    title: "SQLBolt",
    url: "https://sqlbolt.com/",
    why: "Short interactive SQL lessons if the gap is query practice.",
    kind: "practice",
  },
  {
    id: "python-docs",
    topics: ["python"],
    title: "Python documentation",
    url: "https://docs.python.org/3/",
    why: "The language reference and the standard library.",
    kind: "docs",
  },
  {
    id: "owasp-top10",
    topics: ["owasp", "web", "security", "appsec"],
    title: "OWASP Top 10",
    url: "https://owasp.org/www-project-top-ten/",
    why: "The usual starting map for web application risk.",
    kind: "article",
  },
  {
    id: "owasp-cheatsheets",
    topics: ["owasp", "security", "web"],
    title: "OWASP Cheat Sheet Series",
    url: "https://cheatsheetseries.owasp.org/",
    why: "Practical notes on specific controls, one topic per sheet.",
    kind: "docs",
  },
  {
    id: "nist-csf",
    topics: ["nist", "risk", "framework", "security"],
    title: "NIST Cybersecurity Framework",
    url: "https://www.nist.gov/cyberframework",
    why: "A common vocabulary for security programmes.",
    kind: "docs",
  },
  {
    id: "ncsc-10-steps",
    topics: ["incident", "operations", "security", "ncsc"],
    title: "NCSC 10 Steps to Cyber Security",
    url: "https://www.ncsc.gov.uk/collection/10-steps",
    why: "A plain-language operations guide, useful next to incident-ticket gaps.",
    kind: "article",
  },
  {
    id: "mitre-attack",
    topics: ["mitre", "siem", "detection", "splunk", "threat", "security"],
    title: "MITRE ATT&CK",
    url: "https://attack.mitre.org/",
    why: "Technique names you can hang detection practice on.",
    kind: "docs",
  },
  {
    id: "portswigger",
    topics: ["web", "security", "appsec", "burp"],
    title: "PortSwigger Web Security Academy",
    url: "https://portswigger.net/web-security",
    why: "Free labs for web vulnerabilities.",
    kind: "practice",
  },
  {
    id: "splunk-docs",
    topics: ["splunk", "siem", "logging"],
    title: "Splunk documentation",
    url: "https://docs.splunk.com/Documentation",
    why: "Official docs for the product named on many analyst adverts.",
    kind: "docs",
  },
  {
    id: "kubernetes-docs",
    topics: ["kubernetes", "k8s", "cloud", "containers"],
    title: "Kubernetes documentation",
    url: "https://kubernetes.io/docs/home/",
    why: "Official task docs, starting with the overview.",
    kind: "docs",
  },
  {
    id: "aws-docs",
    topics: ["aws", "cloud", "amazon"],
    title: "AWS documentation",
    url: "https://docs.aws.amazon.com/",
    why: "Official service docs. Start with the service the advert actually names.",
    kind: "docs",
  },
  {
    id: "linux-man-pages",
    topics: ["linux", "bash", "shell"],
    title: "Linux man pages",
    url: "https://man7.org/linux/man-pages/",
    why: "The command reference, when the gap is day-to-day Linux rather than a distro.",
    kind: "docs",
  },
];
