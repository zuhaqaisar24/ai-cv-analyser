import type { CvProfile, SkillCategory } from "@/lib/schemas/cv-profile";

const categoryOrder: SkillCategory[] = [
  "language",
  "database",
  "security",
  "cloud",
  "tool",
  "soft",
  "other",
];

const categoryLabel: Record<SkillCategory, string> = {
  language: "Languages",
  database: "Databases",
  security: "Security",
  cloud: "Cloud",
  tool: "Tools",
  soft: "Working with people",
  other: "Other",
};

function range(start: string, end: string): string {
  if (start && end) {
    return `${start} – ${end}`;
  }
  return start || end || "Dates not on the CV";
}

export function CvProfileView({ profile }: { profile: CvProfile }) {
  const skills = profile.skills ?? [];
  const roles = profile.roles ?? [];
  const education = profile.education ?? [];
  const grouped = categoryOrder
    .map((category) => ({
      category,
      skills: skills.filter((skill) => skill.category === category),
    }))
    .filter((group) => group.skills.length > 0);

  return (
    <div className="rise-in" style={{ animationDelay: "70ms" }}>
    <div className="card-lift space-y-10 rounded-2xl bg-card px-5 py-6 shadow-sm ring-1 ring-primary/10 sm:px-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">CV profile</p>
        <h1 className="mt-2 font-heading text-4xl leading-tight sm:text-5xl">
          {profile.name || "Name not on the CV"}
        </h1>
        {profile.headline ? (
          <p className="mt-2 text-lg text-muted-foreground">{profile.headline}</p>
        ) : null}
        {profile.summary ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed">{profile.summary}</p>
        ) : (
          <p className="mt-4 text-muted-foreground">No summary was extracted.</p>
        )}
      </header>

      <section>
        <h2 className="font-heading text-2xl">Skills</h2>
        {grouped.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No skills were listed.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {grouped.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-medium text-primary">{categoryLabel[group.category]}</h3>
                <ul className="mt-2 space-y-1.5">
                  {group.skills.map((skill) => (
                    <li key={`${group.category}-${skill.name}`} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                      <span className="font-medium sm:w-48 sm:shrink-0">{skill.name}</span>
                      {skill.evidence ? (
                        <span className="text-muted-foreground">{skill.evidence}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-heading text-2xl">Roles</h2>
        {roles.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No roles were listed.</p>
        ) : (
          <ol className="mt-4 space-y-6">
            {roles.map((role) => (
              <li key={`${role.title}-${role.organisation}-${role.start}`} className="border-t border-border pt-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-medium">
                    {role.title || "Untitled role"}
                    {role.organisation ? <span className="text-muted-foreground">, {role.organisation}</span> : null}
                  </h3>
                  <p className="text-sm text-muted-foreground">{range(role.start, role.end)}</p>
                </div>
                {role.location ? <p className="text-sm text-muted-foreground">{role.location}</p> : null}
                {(role.bullets ?? []).length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5">
                    {(role.bullets ?? []).map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">No bullets on this role.</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h2 className="font-heading text-2xl">Education</h2>
        {education.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No education was listed.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {education.map((item) => (
              <li key={`${item.qualification}-${item.institution}-${item.year}`} className="border-t border-border pt-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-medium">
                    {item.qualification || "Qualification"}
                    {item.field ? <span className="text-muted-foreground">, {item.field}</span> : null}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.year || "Year not on the CV"}</p>
                </div>
                <p className="text-sm text-muted-foreground">{item.institution || "Institution not on the CV"}</p>
                {item.notes ? <p className="mt-1">{item.notes}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </div>
  );
}
