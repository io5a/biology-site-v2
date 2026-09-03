import { Database } from "../src/supabase.types";

type CompetitionType = Database["public"]["Tables"]["competitions"]["Row"];

export function Competitions({ comp }: { comp: CompetitionType[] }) {
  return (
    <div className="space-y-6">
      {comp.map((com) => {
        return <Competition key={com.slug} comp={com} />;
      })}
    </div>
  );
}

function Competition({ comp }: { comp: CompetitionType }) {
  const compDate = new Date(comp.date ?? "");
  const romanianMonths: { [key: number]: string } = {
    0: "Ianuarie",
    1: "Februarie",
    2: "Martie",
    3: "Aprilie",
    4: "Mai",
    5: "Iunie",
    6: "Iulie",
    7: "August",
    8: "Septembrie",
    9: "Octombrie",
    10: "Noiembrie",
    11: "Decembrie",
  };
  let inFuture: boolean = false;
  if (new Date().getTime() < compDate.getTime()) inFuture = true;
  return (
    <div
      className={`text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm transition-all ${inFuture ? "border-primary/50 " : "hover:border-primary/30"} bg-primary/5`}
    >
      <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {inFuture ? (
            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90">
              Upcoming
            </span>
          ) : (
            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90">
              Past
            </span>
          )}
          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground">
            {compDate.getFullYear()}
          </span>
          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground capitalize">
            {comp.stage}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar h-3 w-3"
              data-darkreader-inline-stroke=""
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            {romanianMonths[compDate.getMonth()]}
            {comp.exact_date ? " " + compDate.getDate() : ""},{" "}
            {compDate.getFullYear()}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-map-pin h-3 w-3"
              data-darkreader-inline-stroke=""
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {comp.location ?? "N/A"}
          </div>
        </div>
        <div className="font-semibold text-2xl">{comp.title}</div>
        <div className="text-muted-foreground text-sm text-pretty">
          <div className="prose prose-invert prose-green max-w-none">
            <p className="mb-4 leading-relaxed text-foreground/90">
              {comp.description}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 pt-0">
        <div className="flex flex-wrap gap-2">
          <a
            href={comp.official_url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            data-slot="button"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3 has-[&gt;svg]:px-2.5 gap-1 bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-earth h-3 w-3"
            >
              <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path>
              <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"></path>
              <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            Site concurs
          </a>
        </div>
      </div>
    </div>
  );
}
